'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/sections/Navigation';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { PlanningSection } from '@/components/sections/PlanningSection';
import { PlanTrendsAndDealsSection } from '@/components/sections/PlanTrendsAndDealsSection';
import { BudgetSection } from '@/components/sections/BudgetSection';
import { WeatherSection } from '@/components/sections/WeatherSection';
import { BookingSection } from '@/components/sections/BookingSection';
import { Footer } from '@/components/sections/Footer';
import TripuraLogo from '@/components/TripuraLogo';
import AuthModal from '@/components/AuthModal';
import { ProfileSection } from '@/components/ProfileSection';
import { useAuth } from '@/contexts/AuthContext';
import type { AppView } from '@/types';
import type { AuthModalMode } from '@/components/AuthModal';

const VIEW_ORDER: AppView[] = ['home', 'plan', 'explore', 'budget', 'bookings', 'profile'];
const SWIPE_OFFSET = 72;
const TRANSITION = { duration: 0.3, ease: [0.32, 0.72, 0, 1] };

function ReiseAppContent() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [slideDirection, setSlideDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [authModal, setAuthModal] = useState<AuthModalMode | null>(null);
  const {
    login,
    loginWithEmail,
    loginWithGoogle,
    loginWithApple,
    registerWithPassword,
    loginWithPassword,
  } = useAuth();

  const handlePlanningComplete = () => goToView('explore');

  const handleOpenAuth = (mode: AuthModalMode) => setAuthModal(mode);
  const handleCloseAuth = () => setAuthModal(null);
  const handleEmailRequest = (email: string) => loginWithEmail(email);
  const handleRegisterWithPassword = (email: string, password: string) =>
    registerWithPassword(email, password);
  const handleLoginWithPassword = (email: string, password: string) =>
    loginWithPassword(email, password);
  const handleApple = async () => {
    await loginWithApple();
    setAuthModal(null);
  };
  const handleGoogle = async () => {
    await loginWithGoogle();
    setAuthModal(null);
  };

  const goToView = (view: AppView) => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    const nextIdx = VIEW_ORDER.indexOf(view);
    const currIdx = VIEW_ORDER.indexOf(currentView);
    setSlideDirection(nextIdx - currIdx);
    setCurrentView(view);
  };

  // Beim ersten Laden der App immer ganz nach oben springen
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <HeroSection
              onStartPlanning={() => goToView('plan')}
              onOpenAuth={handleOpenAuth}
            />
            <div className="below-hero-content">
              <FeaturesSection />
              <BookingSection />
            </div>
          </>
        );
      case 'plan':
        return (
          <div className="pt-24">
            <PlanningSection onPlanningComplete={handlePlanningComplete} />
            <PlanTrendsAndDealsSection />
          </div>
        );
      case 'explore':
        return (
          <div className="pt-24">
            <FeaturesSection />
            <WeatherSection />
          </div>
        );
      case 'budget':
        return (
          <div className="pt-24">
            <BudgetSection />
          </div>
        );
      case 'bookings':
        return (
          <div className="pt-24">
            <BookingSection />
          </div>
        );
      case 'profile':
        return (
          <div className="pt-24 px-4 pb-16">
            <ProfileSection onOpenAuth={() => handleOpenAuth('login')} />
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        {/* Logo ohne Ring */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          <TripuraLogo
            asLink={false}
            showLabel={false}
            size="lg"
          />
        </motion.div>

        {/* Headline im Tripura-Gradient-Stil */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-8 text-2xl sm:text-3xl font-bold heading-purple-gradient text-center"
        >
          Dein perfekter Trip wird vorbereitet
        </motion.h1>

        {/* Subtext im Apple-Look */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-3 text-sm sm:text-base text-gray-500 text-center max-w-md"
        >
          Wir analysieren Wetter, Routen und deine Vorlieben, damit deine Reise sich so einfach anfühlt wie ein Tap.
        </motion.p>

        {/* Ästhetische Lade-Animation mit zwei Pfeilen im Farbverlauf */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="mt-8 flex items-center justify-center"
        >
          <motion.div
            className="relative w-16 h-16 sm:w-20 sm:h-20"
            animate={{ rotate: 360, scale: [1, 1.08, 1] }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 2.0,
              ease: 'linear',
            }}
          >
            {/* Erster Pfeil */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 40 40"
                className="w-full h-full"
              >
                <defs>
                  <linearGradient id="arrowGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <path
                  d="M8 20c0-6.6 5.4-12 12-12h6"
                  fill="none"
                  stroke="url(#arrowGradient1)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <path
                  d="M20 4l6 4-6 4"
                  fill="none"
                  stroke="url(#arrowGradient1)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Zweiter Pfeil, versetzt und im dunkleren Teil des Verlaufs */}
            <div className="absolute inset-0 flex items-center justify-center rotate-180">
              <svg
                viewBox="0 0 40 40"
                className="w-full h-full"
              >
                <defs>
                  <linearGradient id="arrowGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <path
                  d="M8 20c0-6.6 5.4-12 12-12h6"
                  fill="none"
                  stroke="url(#arrowGradient2)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <path
                  d="M20 4l6 4-6 4"
                  fill="none"
                  stroke="url(#arrowGradient2)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navigation
        currentView={currentView}
        onViewChange={(view) => goToView(view as AppView)}
        onOpenAuth={handleOpenAuth}
      />
      <AnimatePresence>
        {authModal && (
          <AuthModal
            mode={authModal}
            onClose={handleCloseAuth}
            onSwitchMode={setAuthModal}
            onRegisterWithPassword={handleRegisterWithPassword}
            onLoginWithPassword={handleLoginWithPassword}
            onEmailRequest={handleEmailRequest}
            onApple={handleApple}
            onGoogle={handleGoogle}
          />
        )}
      </AnimatePresence>
      <main className="relative overflow-x-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentView}
            initial={{
              opacity: slideDirection === 0 ? 1 : 0,
              x: slideDirection === 0 ? 0 : slideDirection > 0 ? SWIPE_OFFSET : -SWIPE_OFFSET,
            }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
              opacity: 0,
              x: slideDirection >= 0 ? -SWIPE_OFFSET : SWIPE_OFFSET,
            }}
            transition={TRANSITION}
            style={{ willChange: 'transform' }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default function ReiseApp() {
  return <ReiseAppContent />;
}
