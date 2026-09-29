'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const TEMPLATES = [
  { key: 'booking', label: 'Buchungsbestätigung', desc: 'Bestätigung mit Posten und Gesamtpreis' },
  { key: 'tripplan', label: 'Reiseplan', desc: 'Tagesplan mit Aktivitäten' },
  { key: 'reminder', label: 'Erinnerung', desc: 'Check-in- / Abfahrts-Erinnerung' },
] as const;

type TemplateKey = (typeof TEMPLATES)[number]['key'];

export default function TestEmailPage() {
  const [template, setTemplate] = useState<TemplateKey>('booking');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold heading-purple-gradient mb-2">E-Mail-Templates</h1>
          <p className="text-gray-500 mb-10">
            HTML-Vorschau der Buchungs-, Reiseplan- und Erinnerungs-Templates. Versand ist derzeit nicht angebunden.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[320px,1fr] gap-8">
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
