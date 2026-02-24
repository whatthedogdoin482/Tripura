'use client'

import { useState, useEffect } from 'react'
import { Cloud } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getWeatherRecommendation,
  type WeatherRecommendation,
  type PlaceType,
} from '@/lib/weather'
import WeatherModal from './WeatherModal'

interface WeatherBadgeProps {
  placeType: PlaceType
  placeName?: string
  coords?: { lat: number; lng: number }
  className?: string
}

const badgeStyles = {
  perfect: { bg: 'rgba(34, 197, 94, 0.9)', color: '#1B262C' },
  good: { bg: 'rgba(59, 130, 246, 0.9)', color: '#fff' },
  not_recommended: { bg: 'rgba(239, 68, 68, 0.9)', color: '#fff' },
  not_ideal: { bg: 'rgba(234, 179, 8, 0.9)', color: '#1B262C' },
} as const

export default function WeatherBadge({
  placeType,
  placeName = 'Dieser Ort',
  coords,
  className = '',
}: WeatherBadgeProps) {
  const [rec, setRec] = useState<WeatherRecommendation | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    let cancelled = false
    getWeatherRecommendation(placeType, coords).then((r) => {
      if (!cancelled) setRec(r)
    })
    return () => { cancelled = true }
  }, [placeType, coords?.lat, coords?.lng])

  if (!rec) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold backdrop-blur-sm ${className}`}
        style={{ backgroundColor: 'rgba(27, 38, 44, 0.8)', color: '#BBE1FA' }}
      >
        <Cloud className="w-3.5 h-3.5" />
        <span>Weather…</span>
      </div>
    )
  }

  const style = badgeStyles[rec.level]

  return (
    <>
      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold shadow-md backdrop-blur-sm transition-shadow hover:shadow-lg ${className}`}
        style={{ backgroundColor: style.bg, color: style.color }}
        aria-label={`Wetter: ${rec.label}. Tippen für Details.`}
      >
        <Cloud className="w-3.5 h-3.5" />
        <span>{rec.label}</span>
      </motion.button>

      <AnimatePresence>
        {showModal && rec && (
          <WeatherModal
            recommendation={rec}
            placeName={placeName}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
