'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, Wallet, TrendingDown } from 'lucide-react'
import BudgetPlanner from '@/components/BudgetPlanner'

export default function BudgetPage() {
  const [showPlanner, setShowPlanner] = useState(false)

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
          Budget-Übersicht
        </h1>
      </header>

      <main className="max-w-lg mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-6 shadow-xl"
          style={{
            backgroundColor: '#3282B8',
            border: '2px solid #4698cf',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-8 h-8" style={{ color: '#BBE1FA' }} />
            <h2 className="text-lg font-black" style={{ color: '#BBE1FA' }}>
              Reisebudget planen
            </h2>
          </div>
          <p className="text-sm font-bold mb-6" style={{ color: '#BBE1FA' }}>
            Lege ein Gesamtbudget und optional Kategorien fest. Das Budget aktualisiert sich, wenn du Aktivitäten oder Buchungen hinzufügst.
          </p>
          <button
            type="button"
            onClick={() => setShowPlanner(true)}
            className="w-full py-4 rounded-full font-black flex items-center justify-center gap-2"
            style={{ backgroundColor: '#BBE1FA', color: '#1B262C' }}
          >
            <TrendingDown className="w-5 h-5" />
            Budgetplaner öffnen
          </button>
        </motion.div>
      </main>

      {showPlanner && (
        <BudgetPlanner
          onClose={() => setShowPlanner(false)}
          onContinue={(total, categories, perDay) => {
            setShowPlanner(false)
            // Could store in context and show summary
          }}
          tripDays={7}
        />
      )}
    </div>
  )
}
