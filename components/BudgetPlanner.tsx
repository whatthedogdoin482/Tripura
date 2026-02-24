'use client'

import { useState, useMemo } from 'react'
import { DollarSign, TrendingDown, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

export interface BudgetCategory {
  id: string
  label: string
  amount: number
  spent?: number
}

const DEFAULT_CATEGORIES: BudgetCategory[] = [
  { id: 'accommodation', label: 'Unterkunft', amount: 0 },
  { id: 'food', label: 'Verpflegung', amount: 0 },
  { id: 'activities', label: 'Aktivitäten', amount: 0 },
  { id: 'transportation', label: 'Transport', amount: 0 },
  { id: 'shopping', label: 'Shopping', amount: 0 },
  { id: 'emergency', label: 'Notfall-Puffer', amount: 0 },
]

interface BudgetPlannerProps {
  onClose?: () => void
  onContinue?: (total: number, categories: BudgetCategory[], perDay: number) => void
  initialTotal?: number
  initialCategories?: BudgetCategory[]
  tripDays?: number
}

export default function BudgetPlanner({
  onClose,
  onContinue,
  initialTotal = 0,
  initialCategories = DEFAULT_CATEGORIES,
  tripDays = 7,
}: BudgetPlannerProps) {
  const [totalBudget, setTotalBudget] = useState(initialTotal)
  const [categories, setCategories] = useState<BudgetCategory[]>(initialCategories)

  const totalAllocated = useMemo(
    () => categories.reduce((sum, c) => sum + c.amount, 0),
    [categories]
  )
  const remaining = totalBudget - totalAllocated
  const perDayAverage = tripDays > 0 ? Math.round(totalBudget / tripDays) : 0

  const updateCategory = (id: string, amount: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, amount } : c))
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
        style={{
          backgroundColor: '#3282B8',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          border: '2px solid #4698cf',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black" style={{ color: '#1B262C' }}>
              Budget planen
            </h2>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full font-bold"
                style={{ backgroundColor: '#1B262C', color: '#BBE1FA' }}
                aria-label="Close"
              >
                ×
              </button>
            )}
          </div>

          <label className="block text-sm font-bold mb-2" style={{ color: '#BBE1FA' }}>
            Gesamt-Reisebudget (€)
          </label>
          <div className="relative mb-6">
            <DollarSign
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: '#1B262C' }}
            />
            <input
              type="number"
              min={0}
              value={totalBudget || ''}
              onChange={(e) => setTotalBudget(Number(e.target.value) || 0)}
              placeholder="0"
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-[#4698cf] font-bold focus:outline-none focus:ring-2 focus:ring-[#BBE1FA]"
              style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: '#1B262C' }}
            />
          </div>

          <p className="text-sm font-bold mb-4" style={{ color: '#BBE1FA' }}>
            Optional: nach Kategorien aufteilen
          </p>
          <ul className="space-y-3 mb-6">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center gap-3">
                <span className="flex-1 text-sm font-bold" style={{ color: '#1B262C' }}>
                  {cat.label}
                </span>
                <input
                  type="number"
                  min={0}
                  value={cat.amount || ''}
                  onChange={(e) =>
                    updateCategory(cat.id, Number(e.target.value) || 0)
                  }
                  className="w-24 px-3 py-2 rounded-xl border-2 border-[#4698cf] text-right font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#BBE1FA]"
                  style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: '#1B262C' }}
                />
              </li>
            ))}
          </ul>

          {/* Live breakdown */}
          <div
            className="rounded-2xl p-4 mb-4"
            style={{ backgroundColor: 'rgba(27, 38, 44, 0.4)' }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold" style={{ color: '#BBE1FA' }}>
                Eingeplant
              </span>
              <span className="font-black" style={{ color: '#1B262C' }}>
                €{totalAllocated}
              </span>
            </div>
            <div className="h-3 rounded-full overflow-hidden mb-3" style={{ backgroundColor: '#1B262C' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: '#BBE1FA' }}
                initial={{ width: 0 }}
                animate={{
                  width: totalBudget
                    ? `${Math.min(100, (totalAllocated / totalBudget) * 100)}%`
                    : '0%',
                }}
                transition={{ type: 'spring', damping: 20 }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold" style={{ color: '#BBE1FA' }}>
                Verbleibend
              </span>
              <span
                className="font-black"
                style={{
                  color: remaining >= 0 ? '#1B262C' : 'rgb(239, 68, 68)',
                }}
              >
                €{remaining}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl px-4 py-3 mb-6" style={{ backgroundColor: '#BBE1FA' }}>
            <Calendar className="w-5 h-5" style={{ color: '#1B262C' }} />
            <span className="font-bold" style={{ color: '#1B262C' }}>
              Tagesdurchschnitt: €{perDayAverage}
            </span>
            <span className="text-sm font-bold" style={{ color: '#1B262C' }}>
              ({tripDays} Tage)
            </span>
          </div>

          <div className="flex gap-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-full font-bold"
                style={{
                  backgroundColor: 'rgba(27, 38, 44, 0.6)',
                  color: '#BBE1FA',
                }}
              >
                Abbrechen
              </button>
            )}
            {onContinue && (
              <button
                type="button"
                onClick={() =>
                  onContinue(totalBudget, categories, perDayAverage)
                }
                className="flex-1 py-3 rounded-full font-black flex items-center justify-center gap-2"
                style={{ backgroundColor: '#BBE1FA', color: '#1B262C' }}
              >
                <TrendingDown className="w-5 h-5" />
                Weiter zur Planung
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
