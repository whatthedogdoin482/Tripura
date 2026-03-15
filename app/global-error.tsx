'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="de">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#1B262C', color: '#BBE1FA', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 16 }}>Tripura – Fehler</h1>
          <p style={{ marginBottom: 24 }}>{error.message}</p>
          <button
            onClick={reset}
            style={{ padding: '12px 24px', borderRadius: 9999, fontWeight: 700, background: '#3282B8', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Seite neu laden
          </button>
        </div>
      </body>
    </html>
  );
}
