import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  analyzePromptSecurity, 
  scanForVulnerabilities,
  analyzeAPIEndpointSecurity,
  analyzeAPIKeySecurity
} from "./ai-security";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Test prompt security
  app.post("/api/security/test-prompt", async (req, res) => {
    try {
      const body = z.object({ prompt: z.string().min(1) }).safeParse(req.body);
      
      if (!body.success) {
        return res.status(400).json({ error: "Valid prompt is required" });
      }

      // Analyze the prompt using AI
      const result = await analyzePromptSecurity(body.data.prompt);

      // Store the scan result
      await storage.createSecurityScan({
        type: "prompt_test",
        input: body.data.prompt,
        status: result.status,
        confidence: result.confidence,
        threats: result.threats,
        analysis: result.analysis
      });

      res.json(result);
    } catch (error: any) {
      console.error("Error testing prompt:", error);
      res.status(500).json({ error: "Failed to analyze prompt" });
    }
  });

  // Get security stats
  app.get("/api/security/stats", async (_req, res) => {
    try {
      const stats = await storage.getSecurityStats();
      res.json(stats);
    } catch (error: any) {
      console.error("Error getting stats:", error);
      res.status(500).json({ error: "Failed to get security stats" });
    }
  });

  // Get vulnerabilities
  app.get("/api/vulnerabilities", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const vulnerabilities = await storage.getVulnerabilities(limit);
      
      // Format timestamps as relative time strings
      const formatted = vulnerabilities.map(v => ({
        ...v,
        timestamp: formatRelativeTime(v.timestamp)
      }));
      
      res.json(formatted);
    } catch (error: any) {
      console.error("Error getting vulnerabilities:", error);
      res.status(500).json({ error: "Failed to get vulnerabilities" });
    }
  });

  // Delete vulnerability (mark as resolved)
  app.delete("/api/vulnerabilities/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteVulnerability(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Vulnerability not found" });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting vulnerability:", error);
      res.status(500).json({ error: "Failed to delete vulnerability" });
    }
  });

  // Scan for vulnerabilities
  app.post("/api/security/scan", async (req, res) => {
    try {
      const body = z.object({ 
        modelName: z.string().min(1),
        testCases: z.array(z.string())
      }).safeParse(req.body);
      
      if (!body.success) {
        return res.status(400).json({ error: "Valid model name and test cases are required" });
      }

      const result = await scanForVulnerabilities(body.data.modelName, body.data.testCases);

      // Store discovered vulnerabilities
      for (const vuln of result.vulnerabilities) {
        await storage.createVulnerability({
          title: vuln.title,
          severity: vuln.severity,
          category: vuln.category,
          model: body.data.modelName,
          description: vuln.description
        });
      }

      res.json(result);
    } catch (error: any) {
      console.error("Error scanning for vulnerabilities:", error);
      res.status(500).json({ error: "Failed to scan for vulnerabilities" });
    }
  });

  // Get recent security scans
  app.get("/api/security/scans", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const scans = await storage.getSecurityScans(limit);
      res.json(scans);
    } catch (error: any) {
      console.error("Error getting scans:", error);
      res.status(500).json({ error: "Failed to get security scans" });
    }
  });

  // Scan API endpoint for security vulnerabilities
  app.post("/api/security/scan-api", async (req, res) => {
    try {
      const body = z.object({
        endpoint: z.string().min(1),
        method: z.string().min(1),
        headers: z.string().optional(),
        body: z.string().optional()
      }).safeParse(req.body);

      if (!body.success) {
        return res.status(400).json({ error: "Valid endpoint and method are required" });
      }

      const result = await analyzeAPIEndpointSecurity(
        body.data.endpoint,
        body.data.method,
        body.data.headers,
        body.data.body
      );

      // Store the scan result
      await storage.createSecurityScan({
        type: "api_scan",
        input: `${body.data.method} ${body.data.endpoint}`,
        status: result.status,
        confidence: result.confidence,
        threats: result.threats,
        analysis: result.analysis
      });

      res.json(result);
    } catch (error: any) {
      console.error("Error scanning API endpoint:", error);
      res.status(500).json({ error: "Failed to analyze API endpoint" });
    }
  });

  // Scan for exposed API keys
  app.post("/api/security/scan-api-key", async (req, res) => {
    try {
      const body = z.object({
        input: z.string().min(1)
      }).safeParse(req.body);

      if (!body.success) {
        return res.status(400).json({ error: "Valid input text is required" });
      }

      const result = await analyzeAPIKeySecurity(body.data.input);

      // Sanitize analysis and threats to prevent accidental key leakage from AI responses
      const sanitizeKeyPatterns = (text: string): string => {
        return text
          .replace(/sk-proj-[A-Za-z0-9_-]{40,}/g, "[REDACTED_OPENAI_KEY]")
          .replace(/AKIA[0-9A-Z]{16}/g, "[REDACTED_AWS_KEY]")
          .replace(/ghp_[A-Za-z0-9]{36,}/g, "[REDACTED_GITHUB_TOKEN]")
          .replace(/sk_live_[A-Za-z0-9]{24,}/g, "[REDACTED_STRIPE_KEY]")
          .replace(/pk_live_[A-Za-z0-9]{24,}/g, "[REDACTED_STRIPE_KEY]")
          .replace(/AIza[0-9A-Za-z_-]{35}/g, "[REDACTED_GOOGLE_KEY]")
          .replace(/ya29\.[A-Za-z0-9_-]{68,}/g, "[REDACTED_GOOGLE_TOKEN]")
          .replace(/Bearer\s+[A-Za-z0-9_-]{20,}/g, "[REDACTED_BEARER_TOKEN]");
      };

      // Store ONLY metadata - NEVER store the actual keys being scanned
      // This prevents sensitive credentials from being persisted in logs
      const safeInput = result.threats.length > 0
        ? `[REDACTED] Scan detected ${result.threats.length} potential key(s)`
        : `Code scan (${body.data.input.length} characters)`;

      const sanitizedAnalysis = sanitizeKeyPatterns(result.analysis);
      const sanitizedThreats = result.threats.map(t => sanitizeKeyPatterns(t));

      await storage.createSecurityScan({
        type: "api_key_scan",
        input: safeInput,
        status: result.status,
        confidence: result.confidence,
        threats: sanitizedThreats,
        analysis: sanitizedAnalysis
      });

      res.json(result);
    } catch (error: any) {
      console.error("Error scanning for API keys:", error);
      res.status(500).json({ error: "Failed to analyze API key security" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to format timestamps as relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return diffMins <= 1 ? "1 minute ago" : `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  } else {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  }
}
