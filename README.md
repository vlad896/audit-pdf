# Audit PDF Generator

Next.js app that generates pixel-perfect SEO audit PDFs from structured JSON.  
POST audit data to `/api/generate-pdf` and receive a PDF file.

## Environment variables

Copy [.env.example](.env.example) to `.env.local` and adjust:

| Variable | Description | Default |
|----------|-------------|---------|
| `PDF_BROWSER` | `local` — use bundled Puppeteer + Chrome (dev / Node server). `serverless` — use puppeteer-core + @sparticuz/chromium (Vercel, serverless). | `local` |
| `PDF_MAX_BODY_SIZE` | Optional. Max request body size in bytes. API returns 413 when exceeded. | 2097152 (2 MB) |
| `PDF_TIMEOUT_MS` | Optional. Timeout for PDF generation (ms). | (in-code default) |

**Local development:** use `PDF_BROWSER=local` (or leave unset).  
**Vercel / serverless:** set `PDF_BROWSER=serverless` in project settings and ensure the function timeout is sufficient for PDF generation.

## Limits

- Request body size is limited by `PDF_MAX_BODY_SIZE` (default 2 MB). Larger payloads receive `413 Request body too large`.
- Input JSON is validated with Zod; invalid structure returns `422` with field-level error details.

## Deployment

- **Node / VPS:** run `npm run build && npm run start`. Use `PDF_BROWSER=local`.
- **Vercel:** set `PDF_BROWSER=serverless`. Increase function max duration if needed (e.g. 60s). The app includes `puppeteer-core` and `@sparticuz/chromium` for serverless PDF generation.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — run ESLint
- `npm run test` — run Vitest tests
- `npm run format` — format with Prettier

## PDF source

The PDF is built from a single source: [src/lib/buildReportHtml.ts](src/lib/buildReportHtml.ts) (HTML string builder) and [src/styles/report.css](src/styles/report.css). See [ARCHITECTURE.md](ARCHITECTURE.md) for details.
