import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzePromptSecurity, scanForVulnerabilities } from "./ai-security";
import { insertSecurityScanSchema, insertVulnerabilitySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Test prompt security
  app.post("/api/security/test-prompt", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Analyze the prompt using AI
      const result = await analyzePromptSecurity(prompt);

      // Store the scan result
      await storage.createSecurityScan({
        type: "prompt_test",
        input: prompt,
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
      const { modelName, testCases } = req.body;
      
      if (!modelName || !Array.isArray(testCases)) {
        return res.status(400).json({ error: "Model name and test cases are required" });
      }

      const result = await scanForVulnerabilities(modelName, testCases);

      // Store discovered vulnerabilities
      for (const vuln of result.vulnerabilities) {
        await storage.createVulnerability({
          title: vuln.title,
          severity: vuln.severity,
          category: vuln.category,
          model: modelName,
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
