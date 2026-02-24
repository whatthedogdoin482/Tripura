'use client'

import { motion } from 'framer-motion'
import { useState, useCallback } from 'react'
import type { SliderConfig } from '@/lib/preferences'

interface SliderPreferenceProps {
  question: string
  slider: SliderConfig
  onSubmit: (value: number) => void
  disabled?: boolean
}

export default function SliderPreference({
  question,
  slider,
  onSubmit,
  disabled = false,
}: SliderPreferenceProps) {
  const [value, setValue] = useState(slider.defaultValue)

  const handleSubmit = useCallback(() => {
    onSubmit(value)
  }, [value, onSubmit])

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
          className="text-xl md:text-2xl font-black mb-8 text-center"
          style={{ color: '#BBE1FA' }}
        >
          {question}
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between text-sm font-bold" style={{ color: 'rgba(187, 225, 250, 0.9)' }}>
            <span>{slider.labelLeft}</span>
            <span>{slider.labelRight}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            disabled={disabled}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-[#BBE1FA]"
            style={{
              background: `linear-gradient(to right, #BBE1FA 0%, #BBE1FA ${value}%, rgba(27, 38, 44, 0.4) ${value}%, rgba(27, 38, 44, 0.4) 100%)`,
            }}
          />
        </div>
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={disabled}
            className="px-8 py-4 rounded-full font-black uppercase transition-all active:scale-[0.98] disabled:opacity-50"
            style={{ backgroundColor: '#BBE1FA', color: '#1B262C' }}
          >
            Weiter
          </button>
        </div>
      </div>
    </motion.div>
  )
}
