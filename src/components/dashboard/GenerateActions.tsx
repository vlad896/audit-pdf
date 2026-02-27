'use client';

import type { Status } from '@/constants';

type Props = {
  status: Status;
  jsonError: string;
  onReset: () => void;
  onGenerate: () => void;
  errorMsg: string;
};

export default function GenerateActions({
  status,
  jsonError,
  onReset,
  onGenerate,
  errorMsg,
}: Props) {
  const disabled = status === 'loading' || !!jsonError;

  return (
    <>
      <div className="dashboard-actions">
        <button type="button" className="dashboard-btn-reset" onClick={onReset}>
          ↺ Reset to Sample
        </button>
        <button
          type="button"
          className="dashboard-btn-generate"
          onClick={onGenerate}
          disabled={disabled}
        >
          {status === 'loading' && <span className="dashboard-spinner" />}
          {status === 'loading'
            ? 'Generating…'
            : status === 'success'
              ? '✓ Downloaded!'
              : '⬇ Generate PDF'}
        </button>
      </div>
      {status === 'error' && (
        <div className="dashboard-error-box">
          <strong>Error:</strong> {errorMsg}
        </div>
      )}
    </>
  );
}
