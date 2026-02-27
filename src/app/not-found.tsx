import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
        background: '#0f172a',
        color: '#f1f5f9',
      }}
    >
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>404</h1>
      <p style={{ color: '#94a3b8', marginBottom: 24 }}>Страница не найдена</p>
      <Link
        href="/"
        style={{
          padding: '10px 20px',
          background: '#3b82f6',
          color: '#fff',
          borderRadius: 8,
          textDecoration: 'none',
          fontSize: 14,
        }}
      >
        На главную
      </Link>
    </div>
  );
}
