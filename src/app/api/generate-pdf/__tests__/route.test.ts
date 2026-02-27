import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';

const mockPdfBuffer = Buffer.from('fake-pdf-content');

const mockPage = {
  setViewport: vi.fn().mockResolvedValue(undefined),
  setContent: vi.fn().mockResolvedValue(undefined),
  pdf: vi.fn().mockResolvedValue(mockPdfBuffer),
};

const mockBrowser = {
  newPage: vi.fn().mockResolvedValue(mockPage),
  close: vi.fn().mockResolvedValue(undefined),
};

vi.mock('@/lib/browser', () => ({
  getBrowser: vi.fn(() => Promise.resolve(mockBrowser)),
}));

vi.mock('@/lib/buildReportHtml', () => ({
  buildReportHtml: vi.fn(() => '<html><body>Report</body></html>'),
}));

function createRequest(body: unknown) {
  return new Request('http://localhost/api/generate-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const validBody = {
  clientName: 'Test',
  domain: 'test.com',
  date: '2026-01',
  version: 'v1.0',
  totalIssues: 1,
  criticalCount: 0,
  statusText: 'OK',
  execSummaryParagraphs: ['Summary'],
  metrics: [{ value: '1', label: 'M', sub: 'S', color: 'blue' }],
  blocks: [
    {
      number: 'I',
      title: 'Block',
      description: 'Desc',
      gradient: 'linear-gradient(90deg,#000,#fff)',
      issues: [
        {
          id: 1,
          title: 'Issue',
          severity: 'low',
          tags: [],
          symptom: 'S',
          impact: 'I',
        },
      ],
    },
  ],
  conclusionParagraphs: ['End'],
};

describe('POST /api/generate-pdf', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 and PDF for valid body', async () => {
    const res = await POST(createRequest(validBody) as import('next/server').NextRequest);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/pdf');
    expect(res.headers.get('Content-Disposition')).toContain('attachment');
    const buf = Buffer.from(await res.arrayBuffer());
    expect(buf.equals(mockPdfBuffer)).toBe(true);
  });

  it('returns 400 for invalid JSON', async () => {
    const res = await POST(
      new Request('http://localhost/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not valid json {',
      }) as import('next/server').NextRequest
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it('returns 422 for invalid audit shape with details', async () => {
    const res = await POST(
      createRequest({ ...validBody, clientName: '' }) as import('next/server').NextRequest
    );
    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.error).toContain('Invalid audit data');
    expect(Array.isArray(data.details)).toBe(true);
    expect(data.details.length).toBeGreaterThan(0);
    expect(data.details[0]).toHaveProperty('path');
    expect(data.details[0]).toHaveProperty('message');
  });

  it('returns 422 for missing required fields', async () => {
    const res = await POST(createRequest({ domain: 'x.com' }) as import('next/server').NextRequest);
    expect(res.status).toBe(422);
  });
});
