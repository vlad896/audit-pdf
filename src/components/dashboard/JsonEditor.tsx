'use client';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onValidate: (value: string) => boolean;
  error: string;
  lineCount: number;
};

export default function JsonEditor({ value, onChange, onValidate, error, lineCount }: Props) {
  return (
    <>
      <div className="dashboard-card-header">
        <div className="dashboard-card-title">
          <span className="dashboard-dot" />
          Audit Data (JSON)
        </div>
        <div className="dashboard-card-meta">{lineCount} lines</div>
      </div>
      <div style={{ position: 'relative' }}>
        <textarea
          className={`dashboard-textarea ${error ? 'error' : ''}`}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            onValidate(e.target.value);
          }}
          spellCheck={false}
          placeholder="Paste your AuditReport JSON here…"
        />
        {error && <div className="dashboard-json-error">⚠ {error}</div>}
      </div>
    </>
  );
}
