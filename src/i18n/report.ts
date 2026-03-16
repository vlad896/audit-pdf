export type Locale = 'ru' | 'en';

type SeverityKey = 'critical' | 'high' | 'medium' | 'low';

type ReportMessages = {
  sections: {
    coverTitle: string;
    coverBadge: string;
    coverDate: string;
    coverIssues: string;
    coverCritical: string;
    coverVersion: string;
    coverStatusLabel: string;
    execSummaryLabel: string;
    execSummaryTitle: string;
    tocTitle: string;
    summaryLabel: string;
    summaryTitle: string;
    summarySubtitle: string;
    conclusionLabel: string;
    conclusionTitle: string;
    footerPrefix: string;
    footerPrepared: string;
  };
  labels: {
    whatRecorded: string;
    impactOnSeo: string;
  };
  severityBadge: Record<SeverityKey, string>;
  severityTag: Record<SeverityKey, string>;
};

export const reportMessages: Record<Locale, ReportMessages> = {
  ru: {
    sections: {
      coverTitle: 'Аудит сайта',
      coverBadge: 'Технический SEO-аудит',
      coverDate: 'Дата проведения',
      coverIssues: 'Выявлено проблем',
      coverCritical: 'Критических',
      coverVersion: 'Версия документа',
      coverStatusLabel: '⚠ Статус',
      execSummaryLabel: 'Executive Summary',
      execSummaryTitle: 'Краткое резюме',
      tocTitle: 'Содержание аудита',
      summaryLabel: 'Сводная таблица',
      summaryTitle: 'Все выявленные проблемы',
      summarySubtitle: 'Полный список с приоритетами и категориями для удобного планирования',
      conclusionLabel: 'Заключение',
      conclusionTitle: 'Резюме',
      footerPrefix: 'Технический SEO-аудит ·',
      footerPrepared: 'Документ подготовлен для внутреннего использования.',
    },
    labels: {
      whatRecorded: 'Что зафиксировано',
      impactOnSeo: 'Влияние на SEO и бизнес',
    },
    severityBadge: {
      critical: '● Критично',
      high: '● Высокая',
      medium: '● Средняя',
      low: '● Низкая',
    },
    severityTag: {
      critical: 'Критическая',
      high: 'Высокая',
      medium: 'Средняя',
      low: 'Низкая',
    },
  },
  en: {
    sections: {
      coverTitle: 'Website audit',
      coverBadge: 'Technical SEO Audit',
      coverDate: 'Audit date',
      coverIssues: 'Total issues',
      coverCritical: 'Critical',
      coverVersion: 'Document version',
      coverStatusLabel: '⚠ Status',
      execSummaryLabel: 'Executive Summary',
      execSummaryTitle: 'Executive summary',
      tocTitle: 'Audit contents',
      summaryLabel: 'Summary table',
      summaryTitle: 'All identified issues',
      summarySubtitle: 'Full list with priorities and categories for planning',
      conclusionLabel: 'Conclusion',
      conclusionTitle: 'Summary for management',
      footerPrefix: 'Technical SEO audit ·',
      footerPrepared: 'Prepared for internal use only.',
    },
    labels: {
      whatRecorded: 'Observed findings',
      impactOnSeo: 'Impact on SEO and business',
    },
    severityBadge: {
      critical: '● Critical',
      high: '● High',
      medium: '● Medium',
      low: '● Low',
    },
    severityTag: {
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
    },
  },
};

export function getReportMessages(locale: Locale | undefined): ReportMessages {
  return reportMessages[locale ?? 'ru'];
}

