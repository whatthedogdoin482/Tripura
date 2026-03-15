'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import TripuraLogo from '@/components/TripuraLogo';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Mail, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleEmail = () => {
    login();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Zurück-Link oben links – gleicher Stil wie Hero/Nav */}
      <Link
        href="/"
        className="absolute top-6 left-4 sm:left-6 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium z-10 transition-all hover:bg-white/10 border border-white/20"
        style={{ color: '#BBE1FA' }}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Zurück zur Startseite</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Logo – wie auf der Landing */}
        <div className="flex justify-center mb-8">
          <TripuraLogo
            asLink
            showLabel
            size="lg"
            className="flex-col gap-4"
            labelClassName="text-white"
          />
        </div>

        {/* Karte im Stil der restlichen Seite: glass-card, weiße Buttons */}
        <div className="glass-card rounded-3xl p-8 shadow-xl border border-white/40">
          {/* Badge wie auf der Hero-Section */}
          <div className="flex justify-center mb-6">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-white/30"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#BBE1FA',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Sparkles className="w-4 h-4" />
              Anmelden
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
            Willkommen zurück
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Speichere Reisen, buche und nutze alle Features.
          </p>

          <div className="space-y-3">
            <motion.button
              type="button"
              onClick={handleEmail}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 apple-button text-base"
            >
              <Mail className="w-5 h-5" />
              Mit E-Mail fortfahren
            </motion.button>
            <motion.button
              type="button"
              onClick={handleEmail}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-base"
            >
              <span aria-hidden className="text-lg">🍎</span>
              Mit Apple fortfahren
            </motion.button>
            <motion.button
              type="button"
              onClick={handleEmail}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-base"
            >
              <span aria-hidden className="font-bold text-blue-600">G</span>
              Mit Google fortfahren
            </motion.button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Noch kein Konto?{' '}
            <Link
              href="/register"
              className="font-semibold text-gray-900 hover:underline"
            >
              Jetzt registrieren
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
