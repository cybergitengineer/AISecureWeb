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
