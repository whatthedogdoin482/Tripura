'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, X, CheckCircle } from 'lucide-react';

export type AuthModalMode = 'login' | 'register';

export interface AuthModalProps {
  mode?: AuthModalMode;
  onClose: () => void;
  onSwitchMode?: (mode: AuthModalMode) => void;
  /** E-Mail & Passwort Registrierung */
  onRegisterWithPassword?: (email: string, password: string) => Promise<{ error: Error | null }>;
  /** E-Mail & Passwort Login */
  onLoginWithPassword?: (email: string, password: string) => Promise<{ error: Error | null }>;
  /** Magic-Link per E-Mail senden */
  onEmailRequest?: (email: string) => Promise<{ error: Error | null }>;
  onApple?: () => void;
  onGoogle?: () => void;
}

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
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function AuthModal({
  mode = 'login',
  onClose,
  onSwitchMode,
  onRegisterWithPassword,
  onLoginWithPassword,
  onEmailRequest,
  onApple,
  onGoogle,
}: AuthModalProps) {
  const isRegister = mode === 'register';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [tab, setTab] = useState<'password' | 'magic'>('password');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleEmailClick = () => {
    if (!onEmailRequest) return;
    setShowEmailInput(true);
    setEmailSent(false);
    setEmailError(null);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onEmailRequest || !email.trim()) return;
    setLoading(true);
    setEmailError(null);
    const { error } = await onEmailRequest(email.trim());
    setLoading(false);
    if (error) {
      setEmailError(error.message);
      return;
    }
    setEmailSent(true);
  };

  const handleApple = () => {
    onApple?.();
  };
  const handleGoogle = () => {
    onGoogle?.();
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setAuthLoading(true);
    setAuthError(null);
    const handler = isRegister ? onRegisterWithPassword : onLoginWithPassword;
    if (!handler) {
      setAuthLoading(false);
      return;
    }
    const { error } = await handler(email.trim(), password);
    setAuthLoading(false);
    if (error) {
      setAuthError(error.message);
      return;
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[400px] flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: '#ffffff',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)',
        }}
      >
        {/* Dünner Gradient-Streifen oben */}
        <div
          className="h-1 w-full flex-shrink-0"
          style={{
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
          }}
        />

        {/* Scrollbarer Inhalt – Hintergrund bleibt fix */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain max-h-[85vh]">
          <div className="px-6 pt-6 pb-8">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-gray-900 text-center mb-1">
              {isRegister ? 'Konto erstellen' : 'Anmelden'}
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              {isRegister
                ? 'Registriere dich kostenlos und starte dein Abenteuer.'
                : 'Melde dich an und plane deine nächste Reise.'}
            </p>

            <div className="space-y-3">
              {/* Tabs: Passwort vs Magic Link */}
              <div className="flex rounded-xl bg-gray-100 p-1 text-xs font-medium mb-2">
                <button
                  type="button"
                  onClick={() => setTab('password')}
                  className={`flex-1 py-2 rounded-lg transition-colors ${
                    tab === 'password' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  E-Mail &amp; Passwort
                </button>
                <button
                  type="button"
                  onClick={() => setTab('magic')}
                  className={`flex-1 py-2 rounded-lg transition-colors ${
                    tab === 'magic' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Login-Link per E-Mail
                </button>
              </div>

              {tab === 'password' ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-Mail-Adresse"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                    required
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Passwort"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                    required
                  />
                  {authError && <p className="text-xs text-red-600">{authError}</p>}
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-95 disabled:opacity-70"
                  >
                    {authLoading ? 'Bitte warten…' : isRegister ? 'Registrieren' : 'Anmelden'}
                  </button>
                </form>
              ) : showEmailInput ? (
                <form onSubmit={handleEmailSubmit} className="space-y-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-Mail-Adresse"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                    required
                    autoFocus
                    disabled={emailSent}
                  />
                  {emailError && (
                    <p className="text-xs text-red-600">{emailError}</p>
                  )}
                  {emailSent ? (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Link gesendet – bitte E-Mail prüfen.</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { setShowEmailInput(false); setEmail(''); setEmailError(null); }}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50"
                      >
                        Zurück
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-95 disabled:opacity-70"
                      >
                        {loading ? 'Wird gesendet…' : 'Link senden'}
                      </button>
                    </div>
                  )}
                </form>
              ) : (
                <motion.button
                  type="button"
                  onClick={handleEmailClick}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl text-[0.9rem] font-semibold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                  }}
                >
                  <Mail className="w-[18px] h-[18px]" />
                  Magic-Link per E-Mail
                </motion.button>
              )}

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium uppercase">oder</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <motion.button
                type="button"
                onClick={handleApple}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl text-[0.9rem] font-semibold text-white bg-black"
                style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
              >
                <AppleLogo className="w-[18px] h-[18px]" />
                Mit Apple fortfahren
              </motion.button>

              <motion.button
                type="button"
                onClick={handleGoogle}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl text-[0.9rem] font-medium text-gray-800 bg-white border border-gray-200 hover:bg-gray-50"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              >
                <GoogleLogo className="w-[18px] h-[18px]" />
                Mit Google fortfahren
              </motion.button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-5">
              {isRegister ? 'Bereits ein Konto?' : 'Noch kein Konto?'}{' '}
              <button
                type="button"
                onClick={() => onSwitchMode?.(isRegister ? 'login' : 'register')}
                className="font-semibold text-gray-700 hover:text-gray-900 underline underline-offset-1"
              >
                {isRegister ? 'Jetzt anmelden' : 'Jetzt registrieren'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
