import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Security scan results
export const securityScans = pgTable("security_scans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'prompt_test' | 'vulnerability_scan' | 'output_check'
  input: text("input").notNull(),
  status: text("status").notNull(), // 'safe' | 'warning' | 'dangerous'
  confidence: integer("confidence").notNull(),
  threats: text("threats").array(),
  analysis: text("analysis").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Vulnerability records
export const vulnerabilities = pgTable("vulnerabilities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  severity: text("severity").notNull(), // 'critical' | 'high' | 'medium' | 'low'
  category: text("category").notNull(),
  model: text("model"),
  description: text("description"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertSecurityScanSchema = createInsertSchema(securityScans).omit({
  id: true,
  timestamp: true,
});

export const insertVulnerabilitySchema = createInsertSchema(vulnerabilities).omit({
  id: true,
  timestamp: true,
});

export type InsertSecurityScan = z.infer<typeof insertSecurityScanSchema>;
export type SecurityScan = typeof securityScans.$inferSelect;
export type InsertVulnerability = z.infer<typeof insertVulnerabilitySchema>;
export type Vulnerability = typeof vulnerabilities.$inferSelect;
