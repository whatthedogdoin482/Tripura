'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, Shield, ChevronDown, ChevronUp } from 'lucide-react'

const INSURANCE_TYPES = [
  {
    id: 'travel-health',
    title: 'Travel health insurance',
    short: 'Medical coverage abroad, emergency repatriation.',
    why: 'Covers medical costs and emergencies while traveling. Essential for destinations where your domestic health insurance does not apply.',
    details: 'Typically includes: doctor visits, hospital stays, emergency evacuation, medication. Check territorial limits and deductibles.',
  },
  {
    id: 'rental-car',
    title: 'Rental car insurance',
    short: 'Coverage for rental vehicle damage and liability.',
    why: 'Rental companies often charge high fees for their own coverage. A standalone policy can be cheaper and more comprehensive.',
    details: 'Collision damage waiver (CDW), theft protection, third-party liability. Some policies extend to personal items in the car.',
  },
  {
    id: 'cancellation',
    title: 'Cancellation insurance',
    short: 'Reimbursement if you must cancel your trip.',
    why: 'Unexpected illness, family emergencies, or job issues can force cancellation. This insurance helps recover non-refundable costs.',
    details: 'Covers prepaid flights, hotels, tours up to the sum insured. Conditions and exclusions apply (e.g. known events).',
  },
  {
    id: 'baggage',
    title: 'Baggage insurance',
    short: 'Compensation for lost, delayed, or damaged luggage.',
    why: 'Airlines often limit liability for lost or delayed bags. Extra coverage can reimburse essentials and valuable items.',
    details: 'Per-item and total limits, delay benefits (e.g. after 6–12 hours). Some policies include electronics and cash limits.',
  },
]

export default function InsurancePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

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
          Versicherungen
        </h1>
      </header>

      <main className="max-w-lg mx-auto p-6">
        <p className="font-bold mb-6" style={{ color: '#BBE1FA' }}>
          Vergleiche und wähle Versicherungen für deine Reise. Erreichbar über das Menü, bei der Reiseplanung oder bei der Mietwagenbuchung.
        </p>

        <div className="space-y-4">
          {INSURANCE_TYPES.map((ins, i) => {
            const isExpanded = expandedId === ins.id
            return (
              <motion.div
                key={ins.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-3xl overflow-hidden shadow-lg"
                style={{
                  backgroundColor: '#3282B8',
                  border: '2px solid #4698cf',
                }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : ins.id)}
                  className="w-full p-5 text-left flex items-start gap-3"
                >
                  <Shield className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#BBE1FA' }} />
                  <div className="flex-1">
                    <h3 className="text-lg font-black mb-1" style={{ color: '#BBE1FA' }}>
                      {ins.title}
                    </h3>
                    <p className="text-sm font-bold" style={{ color: '#BBE1FA' }}>
                      {ins.short}
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: '#BBE1FA' }} />
                  ) : (
                    <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: '#BBE1FA' }} />
                  )}
                </button>

                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-5 pt-0"
                    style={{ backgroundColor: 'rgba(27, 38, 44, 0.3)' }}
                  >
                    <p className="text-sm font-bold mb-2" style={{ color: '#BBE1FA' }}>
                      Warum das für deine Reise sinnvoll ist
                    </p>
                    <p className="text-sm font-bold mb-4" style={{ color: '#BBE1FA' }}>
                      {ins.why}
                    </p>
                    <p className="text-sm font-bold" style={{ color: '#BBE1FA' }}>
                      {ins.details}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
