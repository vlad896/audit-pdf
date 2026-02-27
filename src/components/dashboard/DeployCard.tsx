export default function DeployCard() {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <div className="dashboard-card-title">
          <span className="dashboard-dot" style={{ background: '#fbbf24' }} />
          Deploy to production
        </div>
      </div>
      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
        <p style={{ marginBottom: 8 }}>
          For <strong style={{ color: '#f1f5f9' }}>Vercel / serverless</strong>, set{' '}
          <code className="dashboard-code">PDF_BROWSER=serverless</code> in environment variables.
          Dependencies <code className="dashboard-code">puppeteer-core</code> and{' '}
          <code className="dashboard-code">@sparticuz/chromium</code> are already included.
        </p>
        <p style={{ marginTop: 8 }}>
          See <code className="dashboard-code">.env.example</code> and README for details.
        </p>
      </div>
    </div>
  );
}
