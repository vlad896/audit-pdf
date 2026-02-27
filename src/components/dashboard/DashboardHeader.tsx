export default function DashboardHeader() {
  return (
    <div className="dashboard-header">
      <div className="dashboard-logo">
        <span className="dashboard-logo-icon">⚡</span>
        <span className="dashboard-logo-text">AuditPDF</span>
        <span className="dashboard-logo-badge">Generator</span>
      </div>
      <p className="dashboard-tagline">Paste audit JSON → get a pixel-perfect PDF in seconds</p>
    </div>
  );
}
