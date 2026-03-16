'use client';

import { useState, useRef, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind md-Breakpoint
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

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
                {isActive && (
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
                )}
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
          // Nicht eingeloggt: Navbar-Login öffnet immer direkt das Auth-Modal (Login),
          // sowohl auf Desktop als auch auf Mobile.
          <motion.button
            onClick={() => onOpenAuth?.('login')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${baseNavClass} ${activeNavClass} ${className}`}
          >
            <LogIn className="w-4 h-4" />
            <span>Log in</span>
          </motion.button>
        )}
      </div>
    );
  }

  // Hero: Optik wie bisher, Funktion: öffnet direkt das Auth-Modal (Login),
  // sowohl auf Desktop als auch Mobile (kein Dropdown).
  return (
    <div
      className={`absolute top-6 right-4 sm:right-6 z-30 ${className}`}
    >
      <motion.button
        onClick={() => onOpenAuth?.('login')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="hero-cta-secondary flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-white border border-white/40 backdrop-blur-md"
      >
        <User className="w-4 h-4" />
        <span>Log in</span>
      </motion.button>
    </div>
  );
}
