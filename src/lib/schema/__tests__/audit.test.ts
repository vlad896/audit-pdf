import { describe, it, expect } from 'vitest';
import {
  AuditReportSchema,
  AuditIssueSchema,
  SeveritySchema,
  BlockNumberSchema,
  formatZodErrors,
} from '../audit';

const validIssue = {
  id: 1,
  title: 'Test issue',
  severity: 'critical' as const,
  tags: ['Tag'],
  symptom: 'Symptom text',
  impact: 'Impact text',
};

const validBlock = {
  number: 'I' as const,
  title: 'Block title',
  description: 'Block description',
  gradient: 'linear-gradient(90deg, #000, #fff)',
  issues: [validIssue],
};

const validReport = {
  clientName: 'Client',
  domain: 'example.com',
  date: '2026-01',
  version: 'v1.0',
  totalIssues: 1,
  criticalCount: 1,
  statusText: 'Status',
  execSummaryParagraphs: ['Summary'],
  metrics: [{ value: '10', label: 'Metric', sub: 'Sub', color: 'blue' as const }],
  blocks: [validBlock],
  conclusionParagraphs: ['Conclusion'],
};

describe('AuditReportSchema', () => {
  it('accepts valid full report', () => {
    const result = AuditReportSchema.safeParse(validReport);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.clientName).toBe('Client');
      expect(result.data.blocks).toHaveLength(1);
    }
  });

  it('rejects missing clientName', () => {
    const { success, error } = AuditReportSchema.safeParse({
      ...validReport,
      clientName: '',
    });
    expect(success).toBe(false);
    if (!success) {
      expect(error.issues.length).toBeGreaterThan(0);
      expect(formatZodErrors(error)[0].path).toBeDefined();
    }
  });

  it('rejects invalid severity', () => {
    const result = AuditIssueSchema.safeParse({
      ...validIssue,
      severity: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid block number', () => {
    const parsed = BlockNumberSchema.safeParse('XI');
    expect(parsed.success).toBe(false);
  });

  it('accepts block numbers I through X', () => {
    expect(BlockNumberSchema.safeParse('I').success).toBe(true);
    expect(BlockNumberSchema.safeParse('V').success).toBe(true);
    expect(BlockNumberSchema.safeParse('X').success).toBe(true);
  });

  it('accepts valid severities', () => {
    expect(SeveritySchema.safeParse('critical').success).toBe(true);
    expect(SeveritySchema.safeParse('high').success).toBe(true);
    expect(SeveritySchema.safeParse('medium').success).toBe(true);
    expect(SeveritySchema.safeParse('low').success).toBe(true);
  });

  it('rejects non-array blocks', () => {
    const result = AuditReportSchema.safeParse({
      ...validReport,
      blocks: 'not-an-array',
    });
    expect(result.success).toBe(false);
  });

  it('rejects issue with id < 1', () => {
    const result = AuditIssueSchema.safeParse({
      ...validIssue,
      id: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe('formatZodErrors', () => {
  it('formats path and message', () => {
    const result = AuditReportSchema.safeParse({ ...validReport, domain: 123 });
    expect(result.success).toBe(false);
    if (!result.success) {
      const formatted = formatZodErrors(result.error);
      expect(formatted).toHaveLength(1);
      expect(formatted[0].path).toBe('domain');
      expect(formatted[0].message).toBeDefined();
    }
  });
});
