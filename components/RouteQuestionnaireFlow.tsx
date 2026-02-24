'use client'

import { useCallback, useState } from 'react'
import { motion, useMotionValue, useTransform, animate, PanInfo, AnimatePresence } from 'framer-motion'
import type { RouteQuestion, RouteChoice, RouteQuestionnaireAnswers } from '@/lib/routeQuestionnaire'
import { ROUTE_QUESTIONS } from '@/lib/routeQuestionnaire'

const SWIPE_THRESHOLD = 100

interface RouteQuestionnaireFlowProps {
  onComplete: (answers: RouteQuestionnaireAnswers) => void
}

function QuestionCard({
  question,
  onChooseLeft,
  onChooseRight,
  onChooseBoth,
}: {
  question: RouteQuestion
  onChooseLeft: () => void
  onChooseRight: () => void
  onChooseBoth: () => void
}) {
  const x = useMotionValue(0)
  const leftScale = useTransform(x, [-220, 0], [1.04, 1])
  const rightScale = useTransform(x, [0, 220], [1, 1.04])
  const leftOpacity = useTransform(x, [-220, -60, 0], [1, 0.6, 0.88])
  const rightOpacity = useTransform(x, [0, 60, 220], [0.88, 0.6, 1])
  const leftZ = useTransform(x, (v) => (v < -20 ? 10 : 0))
  const rightZ = useTransform(x, (v) => (v > 20 ? 10 : 0))

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const velocity = info.velocity.x
      const offset = info.offset.x
      if (offset < -SWIPE_THRESHOLD || velocity < -350) {
        animate(x, -380, { type: 'spring', stiffness: 320, damping: 28 })
        setTimeout(onChooseLeft, 180)
      } else if (offset > SWIPE_THRESHOLD || velocity > 350) {
        animate(x, 380, { type: 'spring', stiffness: 320, damping: 28 })
        setTimeout(onChooseRight, 180)
      } else {
        animate(x, 0, { type: 'spring', stiffness: 340, damping: 36 })
      }
    },
    [x, onChooseLeft, onChooseRight]
  )

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-bold pt-6 pb-4 px-4 flex-shrink-0"
        style={{ color: 'rgba(187, 225, 250, 0.98)', fontSize: 'clamp(1.125rem, 4vw, 1.5rem)' }}
      >
        {question.question}
      </motion.p>
      <div className="flex-1 flex min-h-0 relative px-4" style={{ minHeight: 0 }}>
        <motion.div
          drag="x"
          dragConstraints={{ left: -280, right: 280 }}
          dragElastic={0.18}
          onDragEnd={handleDragEnd}
          style={{ x }}
          className="absolute inset-0 flex gap-3 min-w-0 items-center"
          whileTap={{ scale: 0.98 }}
        >
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              animate(x, -380, { type: 'spring', stiffness: 380, damping: 32 })
              setTimeout(onChooseLeft, 200)
            }}
            style={{ scale: leftScale, opacity: leftOpacity, zIndex: leftZ }}
            className="flex-1 min-w-0 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#4698cf] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BBE1FA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B262C] self-stretch max-h-[220px] sm:max-h-[260px]"
          >
            <div className="relative w-full h-full min-h-[160px] sm:min-h-[180px] max-h-[220px] sm:max-h-[260px]">
              <img
                src={question.left.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <p className="text-xl sm:text-2xl font-black text-white drop-shadow-lg leading-tight">
                  {question.left.title}
                </p>
                {question.left.subtitle && (
                  <p className="text-base font-bold text-white/90 mt-1">{question.left.subtitle}</p>
                )}
              </div>
            </div>
          </motion.button>
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              animate(x, 380, { type: 'spring', stiffness: 380, damping: 32 })
              setTimeout(onChooseRight, 200)
            }}
            style={{ scale: rightScale, opacity: rightOpacity, zIndex: rightZ }}
            className="flex-1 min-w-0 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#4698cf] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BBE1FA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B262C] self-stretch max-h-[220px] sm:max-h-[260px]"
          >
            <div className="relative w-full h-full min-h-[160px] sm:min-h-[180px] max-h-[220px] sm:max-h-[260px]">
              <img
                src={question.right.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <p className="text-xl sm:text-2xl font-black text-white drop-shadow-lg leading-tight">
                  {question.right.title}
                </p>
                {question.right.subtitle && (
                  <p className="text-base font-bold text-white/90 mt-1">{question.right.subtitle}</p>
                )}
              </div>
            </div>
          </motion.button>
        </motion.div>
      </div>
      <p className="text-center font-bold flex-shrink-0 pt-2 pb-2" style={{ color: 'rgba(187, 225, 250, 0.7)', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
        👆 Wische oder tippe auf eine Option
      </p>
      <div className="flex-shrink-0 flex justify-center pb-6 pt-2">
        <button
          type="button"
          onClick={onChooseBoth}
          className="rounded-full px-6 py-3 text-base font-bold transition-all active:scale-[0.97]"
          style={{
            backgroundColor: 'rgba(27, 38, 44, 0.85)',
            color: '#BBE1FA',
            border: '2px solid rgba(187, 225, 250, 0.5)',
          }}
        >
          💙 Beides mag ich
        </button>
      </div>
    </div>
  )
}

export default function RouteQuestionnaireFlow({ onComplete }: RouteQuestionnaireFlowProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<RouteQuestionnaireAnswers>({})

  const question = ROUTE_QUESTIONS[stepIndex]
  const total = ROUTE_QUESTIONS.length
  const progress = total ? ((stepIndex + 0.5) / total) * 100 : 0

  const handleChoice = useCallback(
    (choice: RouteChoice) => {
      if (!question) return
      setAnswers((prev) => ({ ...prev, [question.id]: choice }))
      if (stepIndex >= total - 1) {
        const final = { ...answers, [question.id]: choice }
        onComplete(final)
      } else {
        setStepIndex((i) => i + 1)
      }
    },
    [question, stepIndex, total, answers, onComplete]
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[60] flex flex-col rounded-3xl overflow-hidden"
      style={{
        backgroundColor: '#1B262C',
        boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
      }}
    >
      <div
        className="h-0.5 w-full overflow-hidden flex-shrink-0"
        style={{ backgroundColor: 'rgba(187, 225, 250, 0.15)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: '#BBE1FA' }}
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        />
      </div>
      <div className="flex items-center justify-center py-2 flex-shrink-0">
        <span className="text-base font-bold tabular-nums" style={{ color: 'rgba(187, 225, 250, 0.9)' }}>
          {stepIndex + 1} / {total}
        </span>
      </div>
      <div className="flex-1 min-h-0 relative flex flex-col">
        <AnimatePresence mode="wait" initial={false}>
          {question && (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0"
            >
              <QuestionCard
                question={question}
                onChooseLeft={() => handleChoice('left')}
                onChooseRight={() => handleChoice('right')}
                onChooseBoth={() => handleChoice('both')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
