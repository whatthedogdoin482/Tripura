'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

const CONSENT_KEY = 'tripura-cookie-consent';

export type CookieConsent = 'essential' | 'all';

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(CONSENT_KEY);
  return value === 'essential' || value === 'all' ? value : null;
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookieConsent()) setVisible(true);
  }, []);

  const decide = (consent: CookieConsent) => {
    try {
      localStorage.setItem(CONSENT_KEY, consent);
    } catch (_) {}
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[90]"
          role="dialog"
          aria-label="Cookie-Einwilligung"
        >
          <div className="glass-card rounded-3xl p-6 shadow-2xl border border-white/40">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 mb-1">Cookies bei Tripura</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Wir verwenden nur technisch notwendige Cookies (Login-Session). Details in der{' '}
                  <Link href="/datenschutz" className="text-blue-600 hover:underline font-medium">
                    Datenschutzerklärung
                  </Link>
                  .
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => decide('all')}
                className="flex-1 px-5 py-2.5 rounded-full text-white text-sm font-semibold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-md"
              >
                Alle akzeptieren
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => decide('essential')}
                className="flex-1 px-5 py-2.5 rounded-full text-sm font-semibold bg-white/80 border border-gray-200 text-gray-700"
              >
                Nur notwendige
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
