import { type SecurityScan, type InsertSecurityScan, type Vulnerability, type InsertVulnerability } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Security scans
  createSecurityScan(scan: InsertSecurityScan): Promise<SecurityScan>;
  getSecurityScans(limit?: number): Promise<SecurityScan[]>;
  getSecurityScanById(id: string): Promise<SecurityScan | undefined>;
  
  // Vulnerabilities
  createVulnerability(vuln: InsertVulnerability): Promise<Vulnerability>;
  getVulnerabilities(limit?: number): Promise<Vulnerability[]>;
  getVulnerabilityById(id: string): Promise<Vulnerability | undefined>;
  deleteVulnerability(id: string): Promise<boolean>;
  
  // Stats
  getSecurityStats(): Promise<{
    totalScans: number;
    vulnerabilitiesFound: number;
    modelsProtected: number;
    issuesResolved: number;
  }>;
}

export class MemStorage implements IStorage {
  private scans: Map<string, SecurityScan>;
  private vulnerabilities: Map<string, Vulnerability>;
  private issuesResolvedCount: number = 0;

  constructor() {
    this.scans = new Map();
    this.vulnerabilities = new Map();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add some sample vulnerabilities for demonstration
    const sampleVulns: InsertVulnerability[] = [
      {
        title: "Prompt injection vulnerability detected",
        severity: "critical",
        category: "Prompt Security",
        model: "gpt-4",
        description: "Detected pattern attempting to override system instructions"
      },
      {
        title: "PII exposure in model responses",
        severity: "high",
        category: "Data Privacy",
        model: "claude-3",
        description: "Model is leaking personally identifiable information in responses"
      },
      {
        title: "Insufficient input validation",
        severity: "medium",
        category: "Input Security",
        model: "gpt-3.5",
        description: "User inputs are not properly sanitized before processing"
      }
    ];

    sampleVulns.forEach(vuln => {
      const id = randomUUID();
      const timestamp = new Date(Date.now() - Math.random() * 86400000 * 3);
      this.vulnerabilities.set(id, { 
        ...vuln, 
        id, 
        timestamp,
        model: vuln.model || null,
        description: vuln.description || null
      });
    });

    this.issuesResolvedCount = 156;
  }

  async createSecurityScan(insertScan: InsertSecurityScan): Promise<SecurityScan> {
    const id = randomUUID();
    const scan: SecurityScan = {
      ...insertScan,
      id,
      timestamp: new Date(),
      threats: insertScan.threats || null
    };
    this.scans.set(id, scan);
    return scan;
  }

  async getSecurityScans(limit: number = 50): Promise<SecurityScan[]> {
    const scans = Array.from(this.scans.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return scans.slice(0, limit);
  }

  async getSecurityScanById(id: string): Promise<SecurityScan | undefined> {
    return this.scans.get(id);
  }

  async createVulnerability(insertVuln: InsertVulnerability): Promise<Vulnerability> {
    const id = randomUUID();
    const vuln: Vulnerability = {
      ...insertVuln,
      id,
      timestamp: new Date(),
      model: insertVuln.model || null,
      description: insertVuln.description || null
    };
    this.vulnerabilities.set(id, vuln);
    return vuln;
  }

  async getVulnerabilities(limit: number = 50): Promise<Vulnerability[]> {
    const vulns = Array.from(this.vulnerabilities.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return vulns.slice(0, limit);
  }

  async getVulnerabilityById(id: string): Promise<Vulnerability | undefined> {
    return this.vulnerabilities.get(id);
  }

  async deleteVulnerability(id: string): Promise<boolean> {
    const deleted = this.vulnerabilities.delete(id);
    if (deleted) {
      this.issuesResolvedCount++;
    }
    return deleted;
  }

  async getSecurityStats() {
    const totalScans = this.scans.size + 1200; // Add base count for demo
    const vulnerabilitiesFound = this.vulnerabilities.size;
    const modelsProtected = 47;
    const issuesResolved = this.issuesResolvedCount;

    return {
      totalScans,
      vulnerabilitiesFound,
      modelsProtected,
      issuesResolved
    };
  }
}

export const storage = new MemStorage();
