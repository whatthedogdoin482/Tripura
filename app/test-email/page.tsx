'use client';

import { useState, useEffect } from 'react';

type Status = {
  ok: boolean;
  message?: string;
  profilesTable?: string;
  error?: string;
  errorMessage?: string;
};

export default function TestEmailPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [email, setEmail] = useState('');
  const [sendResult, setSendResult] = useState<{ ok: boolean; message?: string; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/test-auth')
      .then((res) => res.json())
      .then(setStatus)
      .catch(() => setStatus({ ok: false, error: 'API nicht erreichbar' }));
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendResult(null);
    setLoading(true);
    try {
      const res = await fetch('/api/test-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setSendResult(data);
    } catch (err) {
      setSendResult({ ok: false, error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">Test: E-Mail-Login & Datenbank</h1>

        {/* Verbindungsstatus */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Verbindung (GET /api/test-auth)</h2>
          {status === null ? (
            <p className="text-gray-500">Lade …</p>
          ) : (
            <div className="space-y-2 text-sm">
              <p className={status.ok ? 'text-green-600' : 'text-red-600'}>
                {status.ok ? '✓' : '✗'} {status.message ?? status.error}
              </p>
              {status.profilesTable && (
                <p className="text-gray-600">Tabelle profiles: {status.profilesTable}</p>
              )}
              {status.errorMessage && (
                <p className="text-amber-600">Details: {status.errorMessage}</p>
              )}
            </div>
          )}
        </section>

        {/* Magic-Link senden */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Magic-Link senden (POST)</h2>
          <form onSubmit={handleSend} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sende …' : 'Magic-Link an diese E-Mail senden'}
            </button>
          </form>
          {sendResult && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${sendResult.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {sendResult.ok ? '✓ ' : '✗ '}
              {sendResult.message ?? sendResult.error}
            </div>
          )}
        </section>

        <p className="text-sm text-gray-500">
          Nach dem Klick auf „Magic-Link senden“ Postfach (und Spam) prüfen. Link anklicken → du wirst eingeloggt.
        </p>
      </div>
    </div>
  );
}
