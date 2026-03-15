'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import TripuraLogo from '@/components/TripuraLogo';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Mail } from 'lucide-react';

// ── SVG-Logos ──────────────────────────────────────────────────────────────

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ── Shared layout ──────────────────────────────────────────────────────────

interface AuthPageProps {
  mode: 'login' | 'register';
}

export default function AuthPage({ mode }: AuthPageProps) {
  const router = useRouter();
  const { login } = useAuth();
  const isLogin = mode === 'login';

  const handleSubmit = () => {
    login();
    router.push('/');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* Hintergrund-Orbs, angelehnt an die Hero-Map-Überlagerung */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #3282B8 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }}
      />

      {/* Zurück-Link */}
      <Link
        href="/"
        className="absolute top-6 left-4 sm:left-6 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium z-10 transition-all border"
        style={{
          color: '#BBE1FA',
          borderColor: 'rgba(187, 225, 250, 0.25)',
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[400px]"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <TripuraLogo asLink size="lg" showLabel={false} />
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ color: '#BBE1FA' }}
          >
            Tripura
          </span>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow:
              '0 8px 40px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.15) inset',
          }}
        >
          {/* Card-Header-Gradient */}
          <div
            className="h-1.5 w-full"
            style={{
              background:
                'linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)',
            }}
          />

          <div className="px-8 pt-8 pb-10">
            <h1 className="text-[1.6rem] font-extrabold tracking-tight text-gray-900 text-center mb-1">
              {isLogin ? 'Willkommen zurück' : 'Konto erstellen'}
            </h1>
            <p className="text-[0.875rem] text-gray-500 text-center mb-8 leading-relaxed">
              {isLogin
                ? 'Melde dich an und plane deine nächste Reise.'
                : 'Registriere dich kostenlos und starte dein Abenteuer.'}
            </p>

            <div className="flex flex-col gap-3">
              {/* E-Mail – App-Primärfarbe mit Gradient */}
              <motion.button
                type="button"
                onClick={handleSubmit}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl text-[0.9rem] font-semibold text-white transition-all shadow-md"
                style={{
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.35)',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                <Mail className="w-[18px] h-[18px] flex-shrink-0" />
                <span>
                  Mit E-Mail {isLogin ? 'anmelden' : 'registrieren'}
                </span>
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                  oder
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Apple – offizielles Schwarz, SF Pro */}
              <motion.button
                type="button"
                onClick={handleSubmit}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl text-[0.9rem] font-semibold transition-all"
                style={{
                  background: '#000000',
                  color: '#ffffff',
                  fontFamily:
                    '-apple-system, "SF Pro Display", BlinkMacSystemFont, system-ui, sans-serif',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                }}
              >
                <AppleLogo className="w-[18px] h-[18px] flex-shrink-0" />
                <span>Mit Apple fortfahren</span>
              </motion.button>

              {/* Google – weißer Button, Roboto, offizielles G-Logo */}
              <motion.button
                type="button"
                onClick={handleSubmit}
                whileHover={{ scale: 1.015, backgroundColor: '#f8f9fa' }}
                whileTap={{ scale: 0.985 }}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl text-[0.9rem] font-medium transition-all"
                style={{
                  background: '#ffffff',
                  color: '#1f1f1f',
                  border: '1.5px solid #dadce0',
                  fontFamily:
                    '"Google Sans", Roboto, "Noto Sans", Arial, sans-serif',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}
              >
                <GoogleLogo className="w-[18px] h-[18px] flex-shrink-0" />
                <span>Mit Google fortfahren</span>
              </motion.button>
            </div>

            {/* Footer-Link */}
            <p className="text-center text-[0.8125rem] text-gray-400 mt-7">
              {isLogin ? 'Noch kein Konto?' : 'Bereits ein Konto?'}{' '}
              <Link
                href={isLogin ? '/register' : '/login'}
                className="font-semibold text-gray-800 hover:text-blue-600 transition-colors underline underline-offset-2"
              >
                {isLogin ? 'Jetzt registrieren' : 'Jetzt anmelden'}
              </Link>
            </p>

            <p className="text-center text-[0.72rem] text-gray-300 mt-4 leading-relaxed">
              Mit der Anmeldung stimmst du unseren{' '}
              <span className="text-gray-400 underline cursor-pointer">Nutzungsbedingungen</span>
              {' '}und der{' '}
              <span className="text-gray-400 underline cursor-pointer">Datenschutzerklärung</span>
              {' '}zu.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
