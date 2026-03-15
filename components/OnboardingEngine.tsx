'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import SwipeChoiceCard from './SwipeChoiceCard'
import {
  PREFERENCE_PAIRS,
  saveProfile,
  type PreferenceProfile,
  type InterestFlag,
  type SliderValues,
} from '@/lib/preferences'

/** User choice per pair: left or right (matches lib/preferences PairChoices). */
type PairChoices = Record<string, 'left' | 'right'>

export interface OnboardingEngineProps {
  onComplete: () => void
  allowSkip?: boolean
}

export default function OnboardingEngine({ onComplete, allowSkip = true }: OnboardingEngineProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [pairChoices, setPairChoices] = useState<PairChoices>({})
  const [isExiting, setIsExiting] = useState(false)

  const pair = PREFERENCE_PAIRS[stepIndex]
  const totalSteps = PREFERENCE_PAIRS.length
  const progressPercent = totalSteps ? Math.round(((stepIndex + 0.5) / totalSteps) * 100) : 0

  const finishOnboarding = useCallback(() => {
    const final: PreferenceProfile = {
      interests: {} as InterestFlag,
      sliders: {} as SliderValues,
      pairChoices,
      completedAt: Date.now(),
    }
    saveProfile(final)
    onComplete()
  }, [pairChoices, onComplete])

  const goNext = useCallback(() => {
    if (stepIndex >= totalSteps - 1) {
      setIsExiting(true)
      setTimeout(finishOnboarding, 300)
    } else {
      setStepIndex((i) => i + 1)
    }
  }, [stepIndex, totalSteps, finishOnboarding])

  const handleChooseLeft = useCallback(() => {
    if (!pair) return
    setPairChoices((prev) => ({ ...prev, [pair.id]: 'left' }))
    goNext()
  }, [pair, goNext])

  const handleChooseRight = useCallback(() => {
    if (!pair) return
    setPairChoices((prev) => ({ ...prev, [pair.id]: 'right' }))
    goNext()
  }, [pair, goNext])

  const handleBack = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1)
      setPairChoices((prev) => {
        const next = { ...prev }
        delete next[PREFERENCE_PAIRS[stepIndex - 1].id]
        return next
      })
    }
  }, [stepIndex])

  if (isExiting) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] flex flex-col"
        style={{ backgroundColor: '#1B262C' }}
      />
    )
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ backgroundColor: '#1B262C' }}
    >
      {/* Progress bar */}
      <div
        className="h-0.5 w-full overflow-hidden flex-shrink-0"
        style={{ backgroundColor: 'rgba(187, 225, 250, 0.15)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: '#BBE1FA' }}
          initial={false}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        />
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        <button
          type="button"
          onClick={handleBack}
          disabled={stepIndex === 0}
          className="p-2 rounded-full transition-opacity hover:opacity-80 disabled:opacity-40"
          style={{ color: '#BBE1FA' }}
          aria-label="Zurück"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-sm font-bold tabular-nums" style={{ color: 'rgba(187, 225, 250, 0.9)' }}>
          {stepIndex + 1} / {totalSteps}
        </span>
        {allowSkip ? (
          <button
            type="button"
            onClick={finishOnboarding}
            className="text-sm font-bold transition-opacity hover:opacity-80"
            style={{ color: 'rgba(187, 225, 250, 0.75)' }}
          >
            Überspringen
          </button>
        ) : (
          <span className="w-16" />
        )}
      </div>

      {/* Content: two options with images + swipe */}
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait" initial={false}>
          {pair && (
            <motion.div
              key={pair.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0"
            >
              <SwipeChoiceCard
                pair={pair}
                onChooseLeft={handleChooseLeft}
                onChooseRight={handleChooseRight}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
