const FIELDS: Array<[string, string, string]> = [
  ['clientName', 'string', '✓'],
  ['domain', 'string', '✓'],
  ['date', 'string', '✓'],
  ['version', 'string', '✓'],
  ['totalIssues', 'number', '✓'],
  ['criticalCount', 'number', '✓'],
  ['statusText', 'string', '✓'],
  ['execSummaryParagraphs', 'string[]', '✓'],
  ['metrics', 'AuditMetric[]', '✓'],
  ['blocks', 'AuditBlock[]', '✓'],
  ['conclusionParagraphs', 'string[]', '✓'],
];

export default function SchemaTable() {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <div className="dashboard-card-title">
          <span className="dashboard-dot" style={{ background: '#34d399' }} />
          Key AuditReport fields
        </div>
      </div>
      <table className="dashboard-schema-table">
        <thead>
          <tr>
            <th className="dashboard-schema-th">Field</th>
            <th className="dashboard-schema-th">Type</th>
            <th className="dashboard-schema-th">Required</th>
          </tr>
        </thead>
        <tbody>
          {FIELDS.map(([field, type, req]) => (
            <tr key={field}>
              <td className="dashboard-schema-td">
                <code className="dashboard-code">{field}</code>
              </td>
              <td className="dashboard-schema-td">
                <span style={{ color: '#34d399', fontSize: 11 }}>{type}</span>
              </td>
              <td className="dashboard-schema-td" style={{ color: '#34d399' }}>
                {req}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
