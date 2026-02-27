/**
 * Shared constants for the audit PDF generator.
 * Used by dashboard, API, and error handling.
 */

/** Dashboard status values */
export const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];

/** User-facing error messages */
export const ERROR_MESSAGES = {
  /** Request body exceeds PDF_MAX_BODY_SIZE */
  BODY_TOO_LARGE:
    'Слишком большой объём данных. Уменьшите размер JSON или лимит PDF_MAX_BODY_SIZE.',
  /** Generic PDF generation failure */
  GENERATION_FAILED: 'Ошибка генерации PDF',
  /** Network/fetch failure */
  NETWORK_ERROR: 'Проверьте подключение к интернету и повторите попытку.',
  /** Invalid JSON syntax */
  INVALID_JSON: 'Неверный формат JSON',
  /** Validation failed (422) — prefix before details */
  VALIDATION_FAILED: 'Ошибка валидации данных',
} as const;

/** Default max request body size in bytes (2 MB) */
export const DEFAULT_MAX_BODY_BYTES = 2 * 1024 * 1024;
