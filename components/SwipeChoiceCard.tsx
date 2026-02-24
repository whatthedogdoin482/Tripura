'use client'

import { useCallback, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion'
import type { PreferencePair } from '@/lib/preferences'

const SWIPE_THRESHOLD = 120
const DRAG_STRENGTH = 0.4

export interface SwipeChoiceCardProps {
  pair: PreferencePair
  onChooseLeft: () => void
  onChooseRight: () => void
}

export default function SwipeChoiceCard({
  pair,
  onChooseLeft,
  onChooseRight,
}: SwipeChoiceCardProps) {
  const x = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const leftScale = useTransform(x, [-200, 0], [1.03, 1])
  const rightScale = useTransform(x, [0, 200], [1, 1.03])
  const leftOpacity = useTransform(x, [-200, -80, 0], [1, 0.7, 0.85])
  const rightOpacity = useTransform(x, [0, 80, 200], [0.85, 0.7, 1])
  const leftZ = useTransform(x, (v) => (v < -30 ? 10 : 0))
  const rightZ = useTransform(x, (v) => (v > 30 ? 10 : 0))

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const velocity = info.velocity.x
      const offset = info.offset.x
      if (offset < -SWIPE_THRESHOLD || velocity < -400) {
        animate(x, -400, { type: 'spring', stiffness: 300, damping: 30 })
        setTimeout(onChooseLeft, 150)
      } else if (offset > SWIPE_THRESHOLD || velocity > 400) {
        animate(x, 400, { type: 'spring', stiffness: 300, damping: 30 })
        setTimeout(onChooseRight, 150)
      } else {
        animate(x, 0, { type: 'spring', stiffness: 320, damping: 35 })
      }
    },
    [x, onChooseLeft, onChooseRight]
  )

  return (
    <div ref={containerRef} className="absolute inset-0 flex flex-col overflow-hidden">
      {pair.question && (
        <p
          className="text-center text-lg font-bold pt-6 pb-4 px-4 z-10"
          style={{ color: 'rgba(187, 225, 250, 0.95)' }}
        >
          {pair.question}
        </p>
      )}
      <div className="flex-1 flex min-h-0 relative px-3 pb-4">
        <motion.div
          drag="x"
          dragConstraints={{ left: -350, right: 350 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          style={{ x }}
          className="absolute inset-3 flex gap-3 min-w-0"
          whileTap={{ scale: 0.98 }}
        >
          {/* Left option */}
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              animate(x, -400, { type: 'spring', stiffness: 400, damping: 35 })
              setTimeout(onChooseLeft, 180)
            }}
            style={{
              scale: leftScale,
              opacity: leftOpacity,
              zIndex: leftZ,
            }}
            className="flex-1 min-w-0 rounded-3xl overflow-hidden shadow-2xl border-2 border-[#4698cf] active:scale-[0.98] transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BBE1FA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B262C]"
          >
            <div className="relative w-full h-full min-h-[280px] sm:min-h-[320px]">
              <img
                src={pair.left.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
                aria-hidden
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                <p className="text-xl sm:text-2xl font-black text-white drop-shadow-lg">
                  {pair.left.title}
                </p>
                {pair.left.subtitle && (
                  <p className="text-sm font-bold text-white/90 mt-0.5">
                    {pair.left.subtitle}
                  </p>
                )}
              </div>
            </div>
          </motion.button>

          {/* Right option */}
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              animate(x, 400, { type: 'spring', stiffness: 400, damping: 35 })
              setTimeout(onChooseRight, 180)
            }}
            style={{
              scale: rightScale,
              opacity: rightOpacity,
              zIndex: rightZ,
            }}
            className="flex-1 min-w-0 rounded-3xl overflow-hidden shadow-2xl border-2 border-[#4698cf] active:scale-[0.98] transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BBE1FA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B262C]"
          >
            <div className="relative w-full h-full min-h-[280px] sm:min-h-[320px]">
              <img
                src={pair.right.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
                aria-hidden
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                <p className="text-xl sm:text-2xl font-black text-white drop-shadow-lg">
                  {pair.right.title}
                </p>
                {pair.right.subtitle && (
                  <p className="text-sm font-bold text-white/90 mt-0.5">
                    {pair.right.subtitle}
                  </p>
                )}
              </div>
            </div>
          </motion.button>
        </motion.div>
      </div>
      <p
        className="text-center text-xs font-bold pb-2"
        style={{ color: 'rgba(187, 225, 250, 0.6)' }}
      >
        Wische in eine Richtung oder tippe auf eine Option
      </p>
    </div>
  )
}
