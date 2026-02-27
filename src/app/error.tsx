'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
      <h1 style={{ fontSize: 20, marginBottom: 12 }}>Что-то пошло не так</h1>
      <p style={{ color: '#94a3b8', marginBottom: 24, maxWidth: 400 }}>
        {error.message || 'Произошла непредвиденная ошибка.'}
      </p>
      <button
        type="button"
        onClick={reset}
        style={{
          padding: '10px 20px',
          background: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        Попробовать снова
      </button>
      <a
        href="/"
        style={{
          display: 'inline-block',
          marginTop: 16,
          color: '#94a3b8',
          fontSize: 14,
        }}
      >
        На главную
      </a>
    </div>
  );
}
