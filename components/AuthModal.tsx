'use client'

import { motion } from 'framer-motion'

export interface AuthModalProps {
  onClose: () => void
  onEmail?: () => void
  onApple?: () => void
  onGoogle?: () => void
}

export default function AuthModal({ onClose, onEmail, onApple, onGoogle }: AuthModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: '#3282B8',
          border: '2px solid #4698cf',
          boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <h2
            className="text-xl font-black text-center mb-2"
            style={{ color: '#BBE1FA' }}
          >
            Anmelden
          </h2>
          <p
            className="text-sm font-bold text-center mb-8"
            style={{ color: 'rgba(187, 225, 250, 0.9)' }}
          >
            Speichere Reisen, buche und nutze alle Features.
          </p>
          <div className="space-y-3">
            <button
              type="button"
              onClick={onEmail}
              className="w-full py-4 rounded-2xl font-bold transition-all active:scale-[0.98]"
              style={{ backgroundColor: '#BBE1FA', color: '#1B262C' }}
            >
              Mit E-Mail fortfahren
            </button>
            <button
              type="button"
              onClick={onApple}
              className="w-full py-4 rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              style={{ backgroundColor: '#1B262C', color: '#BBE1FA' }}
            >
              <span aria-hidden>🍎</span>
              Mit Apple fortfahren
            </button>
            <button
              type="button"
              onClick={onGoogle}
              className="w-full py-4 rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              style={{ backgroundColor: '#1B262C', color: '#BBE1FA' }}
            >
              <span aria-hidden>G</span>
              Mit Google fortfahren
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-6 py-3 text-sm font-bold transition-opacity hover:opacity-80"
            style={{ color: 'rgba(187, 225, 250, 0.9)' }}
          >
            Schließen
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
