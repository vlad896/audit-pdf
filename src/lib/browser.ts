/**
 * Returns a Puppeteer browser instance.
 * Mode is controlled by env PDF_BROWSER: "local" | "serverless".
 * - local: puppeteer + bundled Chrome (default for dev and Node servers).
 * - serverless: puppeteer-core + @sparticuz/chromium (Vercel, etc.).
 */

import puppeteer from 'puppeteer';

export async function getBrowser() {
  // Serverless: use platform-specific Chromium binary from @sparticuz/chromium.
  if (process.env.PDF_BROWSER === 'serverless') {
    const puppeteerCore = await import('puppeteer-core');
    const chromium = await import('@sparticuz/chromium');
    return puppeteerCore.default.launch({
      args: chromium.default.args,
      defaultViewport: chromium.default.defaultViewport,
      executablePath: await chromium.default.executablePath(),
      headless: chromium.default.headless,
    });
  }

  // Local: bundled Chrome; args reduce sandbox issues in Docker/CI.
  return puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });
}
