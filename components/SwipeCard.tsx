'use client'

import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion'
import { useRef } from 'react'

export interface SwipeCardProps {
  title: string
  description: string
  icon: string
  onSwipeLeft: () => void
  onSwipeRight: () => void
  disabled?: boolean
}

export default function SwipeCard({
  title,
  description,
  icon,
  onSwipeLeft,
  onSwipeRight,
  disabled = false,
}: SwipeCardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-12, 12])
  const leftOpacity = useTransform(x, [-200, -80, 0], [0.8, 0.2, 0])
  const rightOpacity = useTransform(x, [0, 80, 200], [0, 0.2, 0.8])
  const ref = useRef<HTMLDivElement>(null)

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 80
    if (info.offset.x > threshold) {
      onSwipeRight()
    } else if (info.offset.x < -threshold) {
      onSwipeLeft()
    } else {
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 })
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto flex justify-center items-center" ref={ref}>
      {/* Hint labels behind card */}
      <motion.div
        className="absolute left-8 top-1/2 -translate-y-1/2 text-2xl font-black uppercase tracking-wide opacity-30 pointer-events-none"
        style={{ x: -20, color: '#BBE1FA', opacity: leftOpacity }}
      >
        Not for me
      </motion.div>
      <motion.div
        className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl font-black uppercase tracking-wide opacity-30 pointer-events-none"
        style={{ x: 20, color: '#BBE1FA', opacity: rightOpacity }}
      >
        Interested
      </motion.div>

      <motion.div
        drag={disabled ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragEnd={handleDragEnd}
        style={{ x, rotate }}
        className="w-full touch-none cursor-grab active:cursor-grabbing"
        whileTap={disabled ? undefined : { scale: 0.98 }}
      >
        <div
          className="rounded-3xl shadow-2xl p-10 border-2 min-h-[280px] flex flex-col justify-center text-center"
          style={{
            backgroundColor: '#3282B8',
            borderColor: '#4698cf',
            boxShadow: '0 20px 60px rgba(27, 38, 44, 0.25)',
          }}
        >
          <span className="text-6xl mb-6 block" aria-hidden>
            {icon}
          </span>
          <h2
            className="text-2xl md:text-3xl font-black mb-3 uppercase tracking-tight"
            style={{ color: '#BBE1FA' }}
          >
            {title}
          </h2>
          <p className="text-lg font-bold" style={{ color: 'rgba(187, 225, 250, 0.9)' }}>
            {description}
          </p>
        </div>
      </motion.div>

      {/* Tap buttons */}
      <div className="absolute -bottom-4 left-0 right-0 flex justify-center gap-6 pt-4">
        <button
          type="button"
          onClick={onSwipeLeft}
          disabled={disabled}
          className="w-16 h-16 rounded-full flex items-center justify-center font-black text-xl transition-transform active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: '#1B262C', color: '#BBE1FA' }}
          aria-label="Not interested"
        >
          ✕
        </button>
        <button
          type="button"
          onClick={onSwipeRight}
          disabled={disabled}
          className="w-16 h-16 rounded-full flex items-center justify-center font-black text-xl transition-transform active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: '#BBE1FA', color: '#1B262C' }}
          aria-label="Interested"
        >
          ♥
        </button>
      </div>
    </div>
  )
}
