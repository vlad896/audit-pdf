/**
 * Pure TypeScript HTML builder — no React, no react-dom/server.
 * Takes AuditReport data and returns a fully self-contained HTML string
 * ready for Puppeteer to render to PDF.
 */

import { readFileSync } from 'fs';
import path from 'path';
import type { AuditReport, AuditIssue, AuditBlock, Severity } from '@/types/audit';
import { getReportMessages } from '@/i18n/report';

// ── CSS (read once at module load) ────────────────────────────────────────────
// Inlined so the HTML is self-contained for Puppeteer (no external assets).
const reportCss = readFileSync(path.join(process.cwd(), 'src', 'styles', 'report.css'), 'utf-8');

// ── Helpers ───────────────────────────────────────────────────────────────────

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function severityBadge(s: Severity, locale: AuditReport['locale']): { cls: string; label: string } {
  const msg = getReportMessages(locale);
  const map: Record<Severity, { cls: string; label: string }> = {
    critical: { cls: 'sev-critical', label: msg.severityBadge.critical },
    high: { cls: 'sev-high', label: msg.severityBadge.high },
    medium: { cls: 'sev-medium', label: msg.severityBadge.medium },
    low: { cls: 'sev-low', label: msg.severityBadge.low },
  };
  return map[s];
}

function severityTagLabel(s: Severity, locale: AuditReport['locale']): string {
  const msg = getReportMessages(locale);
  return {
    critical: msg.severityTag.critical,
    high: msg.severityTag.high,
    medium: msg.severityTag.medium,
    low: msg.severityTag.low,
  }[s];
}

function tagClass(tag: string): string {
  // Heuristic: map tag text to CSS class for colouring (e.g. "Критическая" → tag-critical).
  const t = tag.toLowerCase();
  if (t.includes('крит')) return 'tag tag-critical';
  if (t.includes('высок')) return 'tag tag-high';
  if (t.includes('средн')) return 'tag tag-medium';
  if (t.includes('низк')) return 'tag tag-low';
  if (t.includes('индекс') || t.includes('конфиг') || t.includes('url')) return 'tag tag-indexing';
  if (t.includes('on-page') || t.includes('on_page')) return 'tag tag-onpage';
  if (t.includes('произв') || t.includes('ux')) return 'tag tag-perf';
  return 'tag tag-innovation';
}

function metricColorClass(color: string): string {
  const map: Record<string, string> = {
    red: 'red',
    orange: 'orange',
    yellow: 'yellow',
    blue: 'blue',
    green: 'green',
  };
  return map[color] ?? 'blue';
}

// ── Section builders ──────────────────────────────────────────────────────────

function buildCover(d: AuditReport): string {
  const locale = d.locale ?? 'ru';
  const msg = getReportMessages(locale);
  const issuesValue =
    locale === 'en' ? `${d.totalIssues} issues` : `${d.totalIssues} точек роста`;
  const criticalValue =
    locale === 'en' ? `${d.criticalCount} critical` : `${d.criticalCount} критических`;
  return `
<div class="cover">
  <div class="cover-issues-count">${d.totalIssues}</div>
  <div class="cover-badge">${msg.sections.coverBadge}</div>
  <h1>${msg.sections.coverTitle}<br/><span>${d.clientName}</span></h1>
  <div class="cover-domain">${d.domain}</div>
  <div class="cover-divider"></div>
  <div class="cover-meta">
    <div class="cover-meta-item">
      <span class="cover-meta-label">${msg.sections.coverDate}</span>
      <span class="cover-meta-value">${d.date}</span>
    </div>
    <div class="cover-meta-item">
      <span class="cover-meta-label">${msg.sections.coverIssues}</span>
      <span class="cover-meta-value">${issuesValue}</span>
    </div>
    <div class="cover-meta-item">
      <span class="cover-meta-label">${msg.sections.coverCritical}</span>
      <span class="cover-meta-value" style="color:#f87171">${criticalValue}</span>
    </div>
    <div class="cover-meta-item">
      <span class="cover-meta-label">${msg.sections.coverVersion}</span>
      <span class="cover-meta-value">${d.version}</span>
    </div>
  </div>
  <div style="margin-top:40px">
    <div class="cover-status">${msg.sections.coverStatusLabel}: ${d.statusText}</div>
  </div>
</div>`;
}

function buildMetrics(d: AuditReport): string {
  const cards = d.metrics
    .map(
      (m) => `
    <div class="metric-card">
      <div class="metric-value ${metricColorClass(m.color)}">${m.value}</div>
      <div class="metric-label">${m.label}</div>
      <div class="metric-sub">${m.sub}</div>
    </div>`
    )
    .join('');
  return `<div class="metrics-row" style="margin-top:40px">${cards}</div>`;
}

function buildExecSummary(d: AuditReport): string {
  const msg = getReportMessages(d.locale);
  const paragraphs = d.execSummaryParagraphs.map((p) => `<p>${p}</p>`).join('');
  return `
<div class="exec-summary">
  <div class="section-label">${msg.sections.execSummaryLabel}</div>
  <h2>${msg.sections.execSummaryTitle}</h2>
  ${paragraphs}
</div>`;
}

function buildToc(blocks: AuditBlock[], locale: AuditReport['locale']): string {
  const msg = getReportMessages(locale);
  const items = blocks
    .flatMap((b) => b.issues)
    .map(
      (issue) => `
    <li class="toc-item">
      <span class="toc-item-num">${issue.id}</span>
      <span class="toc-item-title">${issue.title}</span>
    </li>`
    )
    .join('');
  return `
<div class="toc">
  <h2>${msg.sections.tocTitle}</h2>
  <ul class="toc-list">${items}</ul>
</div>`;
}

function buildIssueCard(issue: AuditIssue, locale: AuditReport['locale']): string {
  const msg = getReportMessages(locale);
  const badge = severityBadge(issue.severity, locale);
  const tags = issue.tags.map((t) => `<span class="${tagClass(t)}">${t}</span>`).join('');
  return `
<article class="issue-card audit-item">
  <div class="issue-header">
    <div class="issue-num">${pad(issue.id)}</div>
    <div class="issue-title-wrap">
      <div class="issue-title">${issue.title}</div>
      <div class="issue-tags">${tags}</div>
    </div>
    <span class="severity-badge ${badge.cls}">${badge.label}</span>
  </div>
  <div class="issue-body">
    <div class="symptom-block">
      <div class="block-title">${msg.labels.whatRecorded}</div>
      <div class="block-text">${issue.symptom}</div>
    </div>
    <div class="impact-block">
      <div class="block-title">${msg.labels.impactOnSeo}</div>
      <div class="block-text">${issue.impact}</div>
    </div>
  </div>
</article>`;
}

function buildBlock(block: AuditBlock, locale: AuditReport['locale']): string {
  const cards = block.issues.map((issue) => buildIssueCard(issue, locale)).join('');
  return `
<div class="block-section">
  <div class="block-header" style="background:${block.gradient}">
    <div class="block-number">${block.number}</div>
    <div class="block-header-content">
      <h3>${block.title}</h3>
      <p>${block.description}</p>
    </div>
  </div>
  <div class="block-body">${cards}</div>
</div>`;
}

function buildSummaryTable(blocks: AuditBlock[], locale: AuditReport['locale']): string {
  const msg = getReportMessages(locale);
  const rows = blocks
    .flatMap((b) =>
      b.issues.map((issue) => {
        const words = b.title.split(' ');
        const blockShort = words.slice(0, 2).join(' ');
        return `
    <tr>
      <td>${pad(issue.id)}</td>
      <td>${issue.title}</td>
      <td>${blockShort}</td>
      <td><span class="tag tag-${issue.severity}">${severityTagLabel(issue.severity, locale)}</span></td>
    </tr>`;
      })
    )
    .join('');

  return `
<div class="summary-table-section">
  <div class="section-label">${msg.sections.summaryLabel}</div>
  <h2>${msg.sections.summaryTitle}</h2>
  <p class="sub">${msg.sections.summarySubtitle}</p>
  <table class="data-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Проблема</th>
        <th>Блок</th>
        <th>Критичность</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</div>`;
}

function buildConclusion(d: AuditReport): string {
  const msg = getReportMessages(d.locale);
  const paragraphs = d.conclusionParagraphs.map((p) => `<p>${p}</p>`).join('');
  return `
<div class="conclusion">
  <div class="section-label" style="color:#93c5fd;margin-bottom:8px">${msg.sections.conclusionLabel}</div>
  <h2>${msg.sections.conclusionTitle}</h2>
  ${paragraphs}
</div>
<div class="footer">
  <strong>${msg.sections.footerPrefix} ${d.domain}</strong><br/>
  ${msg.sections.coverDate}: ${d.date} · ${msg.sections.coverVersion}: ${d.version}<br/>
  ${msg.sections.footerPrepared}
</div>`;
}

// ── Main export ───────────────────────────────────────────────────────────────

export function buildReportHtml(data: AuditReport): string {
  const locale = data.locale ?? 'ru';
  const body = [
    buildCover(data),
    '<div class="page-wrap">',
    buildMetrics(data),
    buildExecSummary(data),
    buildToc(data.blocks, locale),
    ...data.blocks.map((block) => buildBlock(block, locale)),
    buildSummaryTable(data.blocks, locale),
    buildConclusion(data),
    '</div>',
  ].join('\n');

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>SEO Audit — ${data.domain}</title>
  <style>${reportCss}</style>
</head>
<body>
${body}
</body>
</html>`;
}
