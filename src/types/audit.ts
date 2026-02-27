// ─── Severity & Color enums ───────────────────────────────────────────────────

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type MetricColor = 'red' | 'orange' | 'yellow' | 'blue' | 'green';
export type BlockNumber = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII' | 'VIII' | 'IX' | 'X';

// ─── Individual audit issue ────────────────────────────────────────────────────

export interface AuditIssue {
  /** Sequential number, e.g. 1..20 */
  id: number;
  /** Card headline */
  title: string;
  /** Overall severity used for badge colour */
  severity: Severity;
  /** Small tag chips displayed under the title (e.g. ["Критическая", "Индексация"]) */
  tags: string[];
  /** "Что зафиксировано" block — plain text or inline HTML */
  symptom: string;
  /** "Влияние на SEO и бизнес" block — plain text or inline HTML */
  impact: string;
}

// ─── Thematic block (I–X) ─────────────────────────────────────────────────────

export interface AuditBlock {
  number: BlockNumber;
  title: string;
  description: string;
  /** Tailwind-style gradient string injected as `style` attribute */
  gradient: string;
  issues: AuditIssue[];
}

// ─── Metric card on the key-numbers row ───────────────────────────────────────

export interface AuditMetric {
  value: string; // e.g. "55", "12.7с"
  label: string; // e.g. "Performance Mobile"
  sub: string; // e.g. "PageSpeed Insights"
  color: MetricColor;
}

// ─── Summary table row ────────────────────────────────────────────────────────

export interface SummaryRow {
  id: number;
  shortTitle: string;
  block: string;
  severity: Severity;
}

// ─── Root report object ───────────────────────────────────────────────────────

export interface AuditReport {
  clientName: string;
  domain: string;
  date: string;
  version: string;
  totalIssues: number;
  criticalCount: number;
  statusText: string;
  /** Each string renders as a separate <p> in the Executive Summary */
  execSummaryParagraphs: string[];
  metrics: AuditMetric[];
  blocks: AuditBlock[];
  /** Full summary table — if omitted, auto-derived from blocks */
  summaryRows?: SummaryRow[];
  /** Each string renders as a separate <p> in the Conclusion */
  conclusionParagraphs: string[];
}
