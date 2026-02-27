import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SEO Audit PDF Generator',
  description: 'Generate pixel-perfect SEO audit PDFs from structured JSON data',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
