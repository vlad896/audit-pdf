import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_MAX_BODY_BYTES } from '@/constants';
import { getBrowser } from '@/lib/browser';
import { buildReportHtml } from '@/lib/buildReportHtml';
import { AuditReportSchema, formatZodErrors } from '@/lib/schema/audit';

const PDF_MAX_BODY_BYTES = Number(process.env.PDF_MAX_BODY_SIZE) || DEFAULT_MAX_BODY_BYTES;

// ── POST /api/generate-pdf ────────────────────────────────────────────────────
// Read body once: arrayBuffer for size check, then decode+parse. Avoids double-read and enforces limit.

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    const buf = await req.arrayBuffer();
    if (buf.byteLength > PDF_MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: 'Request body too large', maxBytes: PDF_MAX_BODY_BYTES },
        { status: 413 }
      );
    }
    body = JSON.parse(new TextDecoder().decode(buf));
  } catch (e) {
    const isSyntaxError = e instanceof SyntaxError;
    return NextResponse.json(
      { error: isSyntaxError ? 'Invalid JSON body' : 'Request body too large or invalid' },
      { status: isSyntaxError ? 400 : 413 }
    );
  }

  const parsed = AuditReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid audit data.',
        details: formatZodErrors(parsed.error),
      },
      { status: 422 }
    );
  }

  const report = parsed.data;
  const html = buildReportHtml(report); // Single source: string HTML + inlined report.css
  let browser;

  try {
    browser = await getBrowser();
    const page = await browser.newPage();

    // A4 at 96dpi ≈ 794px wide. Scale factor 1 keeps fonts crisp.
    await page.setViewport({ width: 1240, height: 1754, deviceScaleFactor: 1 });

    // waitUntil: 'networkidle0' ensures Google Fonts finish loading
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30_000 });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // renders all gradients & background colours
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      displayHeaderFooter: false,
    });

    const safeDomain = report.domain.replace(/[\s\\/:*?"<>|]/g, '-').replace(/-+/g, '-') || 'audit';
    const filenameUtf8 = `Технический SEO-аудит — ${safeDomain}.pdf`;
    const filenameAscii = `seo-audit-${safeDomain}.pdf`;
    const filenameEncoded = encodeURIComponent(filenameUtf8);
    const buffer = Buffer.from(pdfBuffer);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filenameAscii}"; filename*=UTF-8''${filenameEncoded}`,
        'Content-Length': buffer.byteLength.toString(),
      },
    });
  } catch (err) {
    console.error('[generate-pdf] Puppeteer error:', err);
    return NextResponse.json(
      { error: 'PDF generation failed', detail: String(err) },
      { status: 500 }
    );
  } finally {
    await browser?.close();
  }
}
