const STEPS = [
  'Edit the JSON in the editor (or paste your own)',
  'Click "Generate PDF" — a POST request is sent to /api/generate-pdf',
  'The server builds HTML and Puppeteer creates a PDF',
  'The file downloads automatically to your machine',
];

export default function HowItWorks() {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <div className="dashboard-card-title">
          <span className="dashboard-dot" style={{ background: '#818cf8' }} />
          How it works
        </div>
      </div>
      <ol className="dashboard-how-list">
        {STEPS.map((step, i) => (
          <li key={i} className="dashboard-how-item">
            <span className="dashboard-how-num">{i + 1}</span>
            <span style={{ color: '#94a3b8', fontSize: 13 }}>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
