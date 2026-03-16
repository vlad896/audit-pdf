'use client';

import type { Locale } from '@/i18n/report';

type Props = {
  locale: Locale;
  onChangeLocale: (locale: Locale) => void;
};

export default function DashboardHeader({ locale, onChangeLocale }: Props) {
  const nextLocale: Locale = locale === 'en' ? 'ru' : 'en';
  const label = locale === 'en' ? 'EN' : 'RU';

  return (
    <div className="dashboard-header">
      <div className="dashboard-header-top">
        <div className="dashboard-logo">
          <span className="dashboard-logo-icon">⚡</span>
          <span className="dashboard-logo-text">AuditPDF</span>
          <span className="dashboard-logo-badge">Generator</span>
        </div>

        <button
          type="button"
          className="dashboard-lang-toggle"
          onClick={() => onChangeLocale(nextLocale)}
          aria-label="Toggle language"
        >
          <span className="dashboard-lang-icon">🌐</span>
          <span className="dashboard-lang-label">{label}</span>
        </button>
      </div>

      <p className="dashboard-tagline">Paste audit JSON → get a pixel-perfect PDF in seconds</p>
    </div>
  );
}
