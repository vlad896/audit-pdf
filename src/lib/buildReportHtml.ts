/**
 * Pure TypeScript HTML builder — no React, no react-dom/server.
 * Takes AuditReport data and returns a fully self-contained HTML string
 * ready for Puppeteer to render to PDF.
 */

import { readFileSync } from 'fs';
import path from 'path';
import type { AuditReport, AuditIssue, AuditBlock, Severity } from '@/types/audit';

// ── CSS (read once at module load) ────────────────────────────────────────────
// Inlined so the HTML is self-contained for Puppeteer (no external assets).
const reportCss = readFileSync(path.join(process.cwd(), 'src', 'styles', 'report.css'), 'utf-8');

// ── Helpers ───────────────────────────────────────────────────────────────────

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function severityBadge(s: Severity): { cls: string; label: string } {
  const map: Record<Severity, { cls: string; label: string }> = {
    critical: { cls: 'sev-critical', label: '● Критично' },
    high: { cls: 'sev-high', label: '● Высокая' },
    medium: { cls: 'sev-medium', label: '● Средняя' },
    low: { cls: 'sev-low', label: '● Низкая' },
  };
  return map[s];
}

function severityTagLabel(s: Severity): string {
  return { critical: 'Критическая', high: 'Высокая', medium: 'Средняя', low: 'Низкая' }[s];
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
  return `
<div class="cover">
  <div class="cover-issues-count">${d.totalIssues}</div>
  <div class="cover-badge">Технический SEO-аудит</div>
  <h1>Аудит сайта<br/><span>${d.clientName}</span></h1>
  <div class="cover-domain">${d.domain}</div>
  <div class="cover-divider"></div>
  <div class="cover-meta">
    <div class="cover-meta-item">
      <span class="cover-meta-label">Дата проведения</span>
      <span class="cover-meta-value">${d.date}</span>
    </div>
    <div class="cover-meta-item">
      <span class="cover-meta-label">Выявлено проблем</span>
      <span class="cover-meta-value">${d.totalIssues} точек роста</span>
    </div>
    <div class="cover-meta-item">
      <span class="cover-meta-label">Критических</span>
      <span class="cover-meta-value" style="color:#f87171">${d.criticalCount} критических</span>
    </div>
    <div class="cover-meta-item">
      <span class="cover-meta-label">Версия документа</span>
      <span class="cover-meta-value">${d.version}</span>
    </div>
  </div>
  <div style="margin-top:40px">
    <div class="cover-status">⚠ Статус: ${d.statusText}</div>
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
  const paragraphs = d.execSummaryParagraphs.map((p) => `<p>${p}</p>`).join('');
  return `
<div class="exec-summary">
  <div class="section-label">Executive Summary</div>
  <h2>Краткое резюме</h2>
  ${paragraphs}
</div>`;
}

function buildToc(blocks: AuditBlock[]): string {
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
  <h2>Содержание аудита</h2>
  <ul class="toc-list">${items}</ul>
</div>`;
}

function buildIssueCard(issue: AuditIssue): string {
  const badge = severityBadge(issue.severity);
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
      <div class="block-title">Что зафиксировано</div>
      <div class="block-text">${issue.symptom}</div>
    </div>
    <div class="impact-block">
      <div class="block-title">Влияние на SEO и бизнес</div>
      <div class="block-text">${issue.impact}</div>
    </div>
  </div>
</article>`;
}

function buildBlock(block: AuditBlock): string {
  const cards = block.issues.map(buildIssueCard).join('');
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

function buildSummaryTable(blocks: AuditBlock[]): string {
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
      <td><span class="tag tag-${issue.severity}">${severityTagLabel(issue.severity)}</span></td>
    </tr>`;
      })
    )
    .join('');

  return `
<div class="summary-table-section">
  <div class="section-label">Сводная таблица</div>
  <h2>Все выявленные проблемы</h2>
  <p class="sub">Полный список с приоритетами и категориями для удобного планирования</p>
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
  const paragraphs = d.conclusionParagraphs.map((p) => `<p>${p}</p>`).join('');
  return `
<div class="conclusion">
  <div class="section-label" style="color:#93c5fd;margin-bottom:8px">Заключение</div>
  <h2>Резюме</h2>
  ${paragraphs}
</div>
<div class="footer">
  <strong>Технический SEO-аудит · ${d.domain}</strong><br/>
  Дата проведения: ${d.date} · Версия документа: ${d.version}<br/>
  Документ подготовлен для внутреннего использования.
</div>`;
}

// ── Main export ───────────────────────────────────────────────────────────────

export function buildReportHtml(data: AuditReport): string {
  const body = [
    buildCover(data),
    '<div class="page-wrap">',
    buildMetrics(data),
    buildExecSummary(data),
    buildToc(data.blocks),
    ...data.blocks.map(buildBlock),
    buildSummaryTable(data.blocks),
    buildConclusion(data),
    '</div>',
  ].join('\n');

  return `<!DOCTYPE html>
<html lang="ru">
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
