# Architecture

## PDF generation

The PDF is produced from a **single source**:

- **[src/lib/buildReportHtml.ts](src/lib/buildReportHtml.ts)** — builds the full HTML document as a string (cover, metrics, TOC, blocks, summary table, conclusion). No React components are used at this stage.
- **[src/styles/report.css](src/styles/report.css)** — all report and print styles; inlined into the HTML by `buildReportHtml`.

Flow: `POST /api/generate-pdf` → validate body (Zod) → `buildReportHtml(data)` → Puppeteer `setContent(html)` → `page.pdf()` → response with PDF buffer.

React components previously used for a possible in-browser preview (`ReportLayout`, `TitlePage`, `BlockSection`, `IssueCard`) were removed to avoid duplication and drift with the string-based report. Any future preview should reuse the same HTML (e.g. from `buildReportHtml`) or a shared template.

## Security / Trust model

The application assumes **trusted input**: the JSON sent to `/api/generate-pdf` is not sanitised for HTML. Field values (e.g. `domain`, issue titles, descriptions) are embedded into the report HTML as-is. If the input source becomes untrusted (e.g. public form, third-party API), you must add sanitisation (e.g. DOMPurify or an allowlist) before passing data to `buildReportHtml` to avoid XSS in the generated PDF or in any future in-browser preview.

## Browser (Puppeteer)

- **Local:** `PDF_BROWSER=local` (default) uses the `puppeteer` package and its bundled Chrome.
- **Serverless:** `PDF_BROWSER=serverless` uses `puppeteer-core` and `@sparticuz/chromium` for environments like Vercel.

See [README.md](README.md) for environment variables.
