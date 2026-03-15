'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogIn, UserPlus, LogOut, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export type AuthButtonVariant = 'hero' | 'nav';

interface AuthButtonProps {
  variant: AuthButtonVariant;
  onOpenAuth?: (mode: 'login' | 'register') => void;
  onNavigateToProfile?: () => void;
  isActive?: boolean;
  className?: string;
}

export function AuthButton({
  variant,
  onOpenAuth,
  onNavigateToProfile,
  isActive = false,
  className = '',
}: AuthButtonProps) {
  const { isLoggedIn, user, logout, setProfileImage } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const baseNavClass =
    'flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium';
  const activeNavClass = isActive
    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
    : 'text-gray-700 hover:bg-gray-100';

  // Nav: eingeloggt → Profilbild (mit Plus) oder Avatar; nicht eingeloggt → "Log in" mit Hover-Dropdown
  if (variant === 'nav') {
    return (
      <div className="relative" onMouseLeave={() => { setIsOpen(false); setProfileMenuOpen(false); }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          aria-hidden
        />
        {isLoggedIn ? (
          <>
            <motion.button
              onClick={() => onNavigateToProfile?.()}
              onMouseEnter={() => setProfileMenuOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${baseNavClass} ${activeNavClass} ${className}`}
            >
              <div className="relative">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profil"
                    className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <span
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm cursor-pointer hover:bg-gray-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddPhoto();
                  }}
                  title="Profilbild hinzufügen"
                  aria-label="Profilbild hinzufügen"
                >
                  <Plus className="w-2.5 h-2.5 text-gray-600" />
                </span>
              </div>
              <span className="hidden sm:inline">Profil</span>
            </motion.button>
            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  onMouseEnter={() => setProfileMenuOpen(true)}
                  className="absolute right-0 top-full pt-2 py-1 min-w-[160px] rounded-xl glass-card shadow-lg z-50"
                >
                  <button
                    type="button"
                    onClick={() => {
                      handleAddPhoto();
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-gray-700 hover:bg-gray-100 rounded-t-xl text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Profilbild hinzufügen
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-gray-700 hover:bg-gray-100 rounded-b-xl text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Abmelden
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <>
            <motion.button
              onMouseEnter={() => setIsOpen(true)}
              onClick={() => setIsOpen((o) => !o)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${baseNavClass} ${activeNavClass} ${className}`}
            >
              <LogIn className="w-4 h-4" />
              <span>Log in</span>
            </motion.button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  onMouseEnter={() => setIsOpen(true)}
                  className="absolute right-0 top-full pt-2 py-1 min-w-[160px] rounded-xl glass-card shadow-lg z-50"
                >
                  <button
                    type="button"
                    onClick={() => { onOpenAuth?.('login'); setIsOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-gray-700 hover:bg-gray-100 rounded-t-xl text-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    Log in
                  </button>
                  <button
                    type="button"
                    onClick={() => { onOpenAuth?.('register'); setIsOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-gray-700 hover:bg-gray-100 rounded-b-xl text-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    Registrieren
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    );
  }

  // Hero: immer "Log in" Button, Hover zeigt Log in / Registrieren (pt-2 statt mt-2 = keine Lücke, Menü bleibt beim Bewegen der Maus offen)
  return (
    <div
      className={`absolute top-6 right-4 sm:right-6 z-30 ${className}`}
      onMouseLeave={() => setIsOpen(false)}
    >
      <motion.button
        onMouseEnter={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="hero-cta-secondary flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-white border border-white/40 backdrop-blur-md"
      >
        <User className="w-4 h-4" />
        <span>Log in</span>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onMouseEnter={() => setIsOpen(true)}
            className="absolute right-0 top-full pt-2 py-1 min-w-[160px] rounded-xl shadow-lg z-50 overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            }}
          >
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-gray-800 hover:bg-gray-100 rounded-t-xl text-sm font-medium"
            >
              <LogIn className="w-4 h-4" />
              Log in
            </Link>
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-gray-800 hover:bg-gray-100 rounded-b-xl text-sm font-medium"
            >
              <UserPlus className="w-4 h-4" />
              Registrieren
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
