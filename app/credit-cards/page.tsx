'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, CreditCard, Check, ArrowRight } from 'lucide-react'

type Step = 'questionnaire' | 'results'

const QUESTIONS = [
  { id: 'country', label: 'Land des Wohnsitzes', options: ['Deutschland', 'Österreich', 'Schweiz', 'Sonstiges EU'] },
  { id: 'frequency', label: 'Reisehäufigkeit', options: ['1–2x pro Jahr', '3–5x pro Jahr', '6+ mal pro Jahr'] },
  { id: 'spending', label: 'Monatliche Ausgaben (ca.)', options: ['Unter 1.000 €', '1.000–3.000 €', 'Über 3.000 €'] },
  { id: 'insurance', label: 'Reiseversicherung inklusive?', options: ['Ja, wichtig', 'Wäre schön', 'Nicht nötig'] },
  { id: 'lounge', label: 'Lounge-Zugang?', options: ['Ja', 'Nein'] },
  { id: 'forex', label: 'Auslandseinsatzgebühren?', options: ['Am liebsten 0 %', 'Niedrig ok', 'Egal'] },
]

const MOCK_CARDS = [
  {
    name: 'Travel Premium',
    benefits: ['Keine Auslandseinsatzgebühren', 'Reiseversicherung inklusive', 'Lounge-Zugang', '2x Punkte auf Reisen'],
    annualFee: '99 €',
    forexFee: '0 %',
    rewards: '2 % Reise',
    insurance: 'Inklusive',
  },
  {
    name: 'Explorer Card',
    benefits: ['Niedrige Auslandsgebühr', 'Stornoversicherung', '1,5 % Cashback'],
    annualFee: '49 €',
    forexFee: '1,5 %',
    rewards: '1,5 % Cashback',
    insurance: 'Optional dazu buchbar',
  },
  {
    name: 'Global One',
    benefits: ['Keine Auslandsgebühr', 'Lounge-Zugang', 'Premium-Versicherung', '3x Punkte im Ausland'],
    annualFee: '149 €',
    forexFee: '0 %',
    rewards: '3x Punkte',
    insurance: 'Rundum-Schutz',
  },
]

export default function CreditCardsPage() {
  const [step, setStep] = useState<Step>('questionnaire')
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const setAnswer = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const canSubmit = QUESTIONS.every((q) => answers[q.id])

  return (
    <div
      className="min-h-screen"
    >
      <header
        className="sticky top-0 z-30 flex items-center gap-4 px-4 py-4"
        style={{ borderBottom: '2px solid #BBE1FA', backdropFilter: 'blur(8px)' }}
      >
        <Link
          href="/home"
          className="p-2 rounded-full"
          style={{ backgroundColor: '#1B262C', color: '#BBE1FA' }}
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-black" style={{ color: '#BBE1FA' }}>
          Reise-Kreditkarten
        </h1>
      </header>

      <main className="max-w-lg mx-auto p-6">
        <AnimatePresence mode="wait">
          {step === 'questionnaire' && (
            <motion.div
              key="q"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <p className="font-bold" style={{ color: '#BBE1FA' }}>
                Beantworte ein paar Fragen für Reisekarten-Empfehlungen.
              </p>
              {QUESTIONS.map((q) => (
                <div key={q.id} className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(27, 38, 44, 0.4)' }}>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#BBE1FA' }}>
                    {q.label}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAnswer(q.id, opt)}
                        className="px-4 py-2 rounded-full text-sm font-bold transition-all"
                        style={{
                          backgroundColor: answers[q.id] === opt ? '#BBE1FA' : 'rgba(27, 38, 44, 0.5)',
                          color: answers[q.id] === opt ? '#1B262C' : '#BBE1FA',
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setStep('results')}
                disabled={!canSubmit}
                className="w-full py-4 rounded-full font-black flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: '#BBE1FA', color: '#1B262C' }}
              >
                Empfehlungen anzeigen
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 'results' && (
            <motion.div
              key="r"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <p className="font-bold" style={{ color: '#BBE1FA' }}>
                Basierend auf deinen Antworten empfehlen wir:
              </p>
              {MOCK_CARDS.map((card, i) => (
                <motion.div
                  key={card.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-3xl p-5 shadow-lg"
                  style={{
                    backgroundColor: '#3282B8',
                    border: '2px solid #4698cf',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="w-8 h-8" style={{ color: '#BBE1FA' }} />
                    <h3 className="text-lg font-black" style={{ color: '#BBE1FA' }}>
                      {card.name}
                    </h3>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {card.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm font-bold" style={{ color: '#BBE1FA' }}>
                        <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#BBE1FA' }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span style={{ color: '#BBE1FA' }}>Jahresgebühr</span>
                    <span className="font-bold" style={{ color: '#BBE1FA' }}>{card.annualFee}</span>
                    <span style={{ color: '#BBE1FA' }}>Auslandsgebühr</span>
                    <span className="font-bold" style={{ color: '#BBE1FA' }}>{card.forexFee}</span>
                    <span style={{ color: '#BBE1FA' }}>Prämien</span>
                    <span className="font-bold" style={{ color: '#BBE1FA' }}>{card.rewards}</span>
                    <span style={{ color: '#BBE1FA' }}>Versicherung</span>
                    <span className="font-bold" style={{ color: '#BBE1FA' }}>{card.insurance}</span>
                  </div>
                </motion.div>
              ))}
              <button
                type="button"
                onClick={() => setStep('questionnaire')}
                className="w-full py-3 rounded-full font-bold"
                style={{ backgroundColor: 'rgba(27, 38, 44, 0.6)', color: '#BBE1FA' }}
              >
                Fragebogen wiederholen
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
