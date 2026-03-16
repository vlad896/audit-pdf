import type { Status } from '@/constants';
import type { Locale } from '@/i18n/report';
import { getUiMessages } from '@/i18n/ui';

type Props = {
  status: Status;
  jsonError: string;
  onReset: () => void;
  onGenerate: () => void;
  errorMsg: string;
  locale: Locale;
};

export default function GenerateActions({
  status,
  jsonError,
  onReset,
  onGenerate,
  errorMsg,
  locale,
}: Props) {
  const ui = getUiMessages(locale);
  const disabled = status === 'loading' || !!jsonError;

  return (
    <>
      <div className="dashboard-actions">
        <button type="button" className="dashboard-btn-reset" onClick={onReset}>
          {ui.resetToSample}
        </button>
        <button
          type="button"
          className="dashboard-btn-generate"
          onClick={onGenerate}
          disabled={disabled}
        >
          {status === 'loading' && <span className="dashboard-spinner" />}
          {status === 'loading'
            ? ui.generateLoading
            : status === 'success'
              ? ui.generateSuccess
              : ui.generateIdle}
        </button>
      </div>
      {status === 'error' && (
        <div className="dashboard-error-box">
          <strong>{ui.errorPrefix}:</strong> {errorMsg}
        </div>
      )}
    </>
  );
}
