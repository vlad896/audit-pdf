import type { Locale } from './report';

type UiMessages = {
  generateIdle: string;
  generateLoading: string;
  generateSuccess: string;
  resetToSample: string;
  errorPrefix: string;
  networkError: string;
  bodyTooLarge: string;
  validationFailed: string;
  generationFailed: string;
  jsonPlaceholderTitle: string;
};

export const uiMessages: Record<Locale, UiMessages> = {
  ru: {
    generateIdle: '⬇ Сгенерировать PDF',
    generateLoading: 'Генерация…',
    generateSuccess: '✓ Файл скачан',
    resetToSample: '↺ Вернуть пример',
    errorPrefix: 'Ошибка',
    networkError: 'Проверьте подключение к интернету и повторите попытку.',
    bodyTooLarge:
      'Слишком большой объём данных. Уменьшите размер JSON или лимит PDF_MAX_BODY_SIZE.',
    validationFailed: 'Ошибка валидации данных',
    generationFailed: 'Ошибка генерации PDF',
    jsonPlaceholderTitle: 'Вставьте JSON с результатами аудита',
  },
  en: {
    generateIdle: '⬇ Generate PDF',
    generateLoading: 'Generating…',
    generateSuccess: '✓ Downloaded',
    resetToSample: '↺ Reset to sample',
    errorPrefix: 'Error',
    networkError: 'Check your internet connection and try again.',
    bodyTooLarge:
      'Request body is too large. Reduce JSON size or decrease PDF_MAX_BODY_SIZE limit.',
    validationFailed: 'Validation error',
    generationFailed: 'PDF generation failed',
    jsonPlaceholderTitle: 'Paste JSON with audit results',
  },
};

export function getUiMessages(locale: Locale | undefined): UiMessages {
  return uiMessages[locale ?? 'ru'];
}

