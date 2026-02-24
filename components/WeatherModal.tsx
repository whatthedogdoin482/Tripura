'use client'

import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import { getConditionLabel } from '@/lib/weather'
import type { WeatherRecommendation } from '@/lib/weather'

interface WeatherModalProps {
  recommendation: WeatherRecommendation
  placeName: string
  onClose: () => void
}

export default function WeatherModal({
  recommendation,
  placeName,
  onClose,
}: WeatherModalProps) {
  const { label, snapshot, explanation } = recommendation

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: '#3282B8',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          border: '2px solid #4698cf',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h3 className="text-lg font-black" style={{ color: '#1B262C' }}>
              Wetter für {placeName}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full transition-colors hover:opacity-80"
              style={{ backgroundColor: '#1B262C', color: '#BBE1FA' }}
              aria-label="Schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: 'rgba(27, 38, 44, 0.4)' }}>
            <p className="text-2xl font-black mb-2" style={{ color: '#BBE1FA' }}>
              {snapshot.tempC}°C
            </p>
            <p className="font-bold" style={{ color: '#1B262C' }}>
              {getConditionLabel(snapshot.condition)}
            </p>
            <p className="text-sm font-bold mt-1" style={{ color: '#BBE1FA' }}>
              Regen {snapshot.rainProbabilityPercent} % · Wind {snapshot.windKmh} km/h
            </p>
          </div>

          <div className="rounded-2xl px-4 py-3 mb-4" style={{ backgroundColor: '#BBE1FA' }}>
            <p className="text-sm font-bold" style={{ color: '#1B262C' }}>
              {label}
            </p>
          </div>

          <p className="text-sm font-bold leading-relaxed" style={{ color: '#1B262C' }}>
            {explanation}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
