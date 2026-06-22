'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Loader2 } from 'lucide-react';

const TEMPLATES = [
  { key: 'booking', label: 'Buchungsbestätigung', desc: 'Bestätigung mit Posten und Gesamtpreis' },
  { key: 'tripplan', label: 'Reiseplan', desc: 'Tagesplan mit Aktivitäten' },
  { key: 'reminder', label: 'Erinnerung', desc: 'Check-in- / Abfahrts-Erinnerung' },
] as const;

type TemplateKey = (typeof TEMPLATES)[number]['key'];

export default function TestEmailPage() {
  const [template, setTemplate] = useState<TemplateKey>('booking');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message?: string; error?: string } | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, template }),
      });
      const data = await res.json();
      setResult(res.ok ? data : { ok: false, error: data.error });
    } catch (err) {
      setResult({ ok: false, error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold heading-purple-gradient mb-2">E-Mail-Templates testen</h1>
          <p className="text-gray-500 mb-10">
            Vorschau der HTML-Templates und Testversand über Resend (kostenloser Dev-Tier).
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[320px,1fr] gap-8">
          {/* Steuerung */}
          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-6">
              <p className="text-sm font-semibold text-gray-700 mb-4">Template wählen</p>
              <div className="space-y-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTemplate(t.key)}
                    className={`w-full text-left px-4 py-3 rounded-2xl border transition-all ${
                      template === t.key
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-md'
                        : 'bg-white/80 text-gray-700 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <p className="font-semibold text-sm">{t.label}</p>
                    <p className={`text-xs mt-0.5 ${template === t.key ? 'text-white/85' : 'text-gray-500'}`}>
                      {t.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Testversand
              </p>
              <form onSubmit={handleSend} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="deine@email.de"
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full text-white text-sm font-semibold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {loading ? 'Sende…' : 'Template senden'}
                </motion.button>
              </form>
              {result && (
                <p
                  className={`mt-4 text-sm rounded-2xl px-4 py-3 border ${
                    result.ok
                      ? 'text-green-700 bg-green-50 border-green-100'
                      : 'text-red-600 bg-red-50 border-red-100'
                  }`}
                >
                  {result.ok ? result.message : result.error}
                </p>
              )}
              <p className="mt-4 text-xs text-gray-400">
                Hinweis: Ohne verifizierte Domain sendet Resend nur an die eigene Registrierungs-E-Mail.
              </p>
            </div>
          </div>

          {/* Live-Vorschau */}
          <motion.div
            key={template}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-3xl p-3 overflow-hidden"
          >
            <iframe
              title="Template-Vorschau"
              src={`/api/test-email?template=${template}`}
              className="w-full h-[720px] rounded-2xl border-0 bg-white"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
