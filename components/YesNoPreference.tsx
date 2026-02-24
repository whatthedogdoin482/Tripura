'use client'

import { motion } from 'framer-motion'

interface YesNoPreferenceProps {
  question: string
  onYes: () => void
  onNo: () => void
  disabled?: boolean
}

export default function YesNoPreference({
  question,
  onYes,
  onNo,
  disabled = false,
}: YesNoPreferenceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md mx-auto"
    >
      <div
        className="rounded-3xl shadow-2xl p-10 border-2"
        style={{
          backgroundColor: '#3282B8',
          borderColor: '#4698cf',
          boxShadow: '0 20px 60px rgba(27, 38, 44, 0.25)',
        }}
      >
        <h2
          className="text-xl md:text-2xl font-black mb-10 text-center"
          style={{ color: '#BBE1FA' }}
        >
          {question}
        </h2>
        <div className="flex justify-center gap-6">
          <button
            type="button"
            onClick={onNo}
            disabled={disabled}
            className="px-8 py-4 rounded-full font-black uppercase transition-all active:scale-[0.98] disabled:opacity-50"
            style={{ backgroundColor: 'rgba(27, 38, 44, 0.8)', color: '#BBE1FA' }}
          >
            No
          </button>
          <button
            type="button"
            onClick={onYes}
            disabled={disabled}
            className="px-8 py-4 rounded-full font-black uppercase transition-all active:scale-[0.98] disabled:opacity-50"
            style={{ backgroundColor: '#BBE1FA', color: '#1B262C' }}
          >
            Yes
          </button>
        </div>
      </div>
    </motion.div>
  )
}
