import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Exclude heavy native packages from client bundle
  serverExternalPackages: ['puppeteer', 'puppeteer-core', '@sparticuz/chromium'],
};

export default nextConfig;
