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
import type { AppView } from '@/types';

export default function ReiseApp() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handlePlanningComplete = () => setCurrentView('explore');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <HeroSection onStartPlanning={() => setCurrentView('plan')} />
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
          <div className="pt-24 px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">Dein Profil</h1>
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                    JD
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
                    <p className="text-gray-500">Reise-Enthusiast seit 2020</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-blue-50 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">12</div>
                    <div className="text-sm text-blue-700">Geplante Trips</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-green-50 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">8</div>
                    <div className="text-sm text-green-700">Länder besucht</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-purple-50 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">4.9</div>
                    <div className="text-sm text-purple-700">Durchschn. Bewertung</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center"
        >
          <TripuraLogo asLink={false} showLabel size="lg" className="flex-col gap-4" labelClassName="text-gray-900" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-gray-500 text-sm"
        >
          Lade dein Abenteuer...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation currentView={currentView} onViewChange={(view) => setCurrentView(view as AppView)} />
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
