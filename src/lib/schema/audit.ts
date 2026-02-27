/**
 * Zod schemas for audit report validation.
 * Kept in sync with src/types/audit.ts.
 */

import { z } from 'zod';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const SeveritySchema = z.enum(['critical', 'high', 'medium', 'low']);
export const MetricColorSchema = z.enum(['red', 'orange', 'yellow', 'blue', 'green']);
export const BlockNumberSchema = z.enum(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']);

// ─── Nested structures ────────────────────────────────────────────────────────

export const AuditIssueSchema = z.object({
  id: z.number().int().min(1),
  title: z.string().min(1),
  severity: SeveritySchema,
  tags: z.array(z.string()),
  symptom: z.string(),
  impact: z.string(),
});

export const AuditBlockSchema = z.object({
  number: BlockNumberSchema,
  title: z.string().min(1),
  description: z.string(),
  gradient: z.string(),
  issues: z.array(AuditIssueSchema),
});

export const AuditMetricSchema = z.object({
  value: z.string(),
  label: z.string(),
  sub: z.string(),
  color: MetricColorSchema,
});

export const SummaryRowSchema = z.object({
  id: z.number().int().min(1),
  shortTitle: z.string(),
  block: z.string(),
  severity: SeveritySchema,
});

// ─── Root report ──────────────────────────────────────────────────────────────

export const AuditReportSchema = z.object({
  clientName: z.string().min(1),
  domain: z.string().min(1),
  date: z.string().min(1),
  version: z.string().min(1),
  totalIssues: z.number().int().min(0),
  criticalCount: z.number().int().min(0),
  statusText: z.string(),
  execSummaryParagraphs: z.array(z.string()),
  metrics: z.array(AuditMetricSchema),
  blocks: z.array(AuditBlockSchema),
  summaryRows: z.array(SummaryRowSchema).optional(),
  conclusionParagraphs: z.array(z.string()),
});

export type AuditReportInput = z.infer<typeof AuditReportSchema>;

/** Format Zod errors for API response */
export function formatZodErrors(error: z.ZodError): Array<{ path: string; message: string }> {
  const issues = error.issues;
  return issues.map((e) => ({
    path: e.path.length ? e.path.map(String).join('.') : 'root',
    message: e.message ?? 'Invalid value',
  }));
}
