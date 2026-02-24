'use client'

import { useState, useEffect } from 'react'
import { MapPin, Navigation, Star, Flame, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import AIAssistant from '@/components/AIAssistant'
import RoutePlanner from '@/components/RoutePlanner'
import BudgetPlanner from '@/components/BudgetPlanner'
import WeatherBadge from '@/components/WeatherBadge'
import OnboardingEngine from '@/components/OnboardingEngine'
import AuthModal from '@/components/AuthModal'
import RouteQuestionnaireFlow from '@/components/RouteQuestionnaireFlow'
import { hasCompletedOnboarding } from '@/lib/preferences'

export default function Home() {
  const [activeSection, setActiveSection] = useState('locations')
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [showRoutePlanner, setShowRoutePlanner] = useState(false)
  const [showBudgetPlanner, setShowBudgetPlanner] = useState(false)
  const [showRouteQuestionnaire, setShowRouteQuestionnaire] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [afterOnboarding, setAfterOnboarding] = useState<'route' | 'auth' | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const bestLocations = [
    { name: 'Santorini, Greece', rating: 4.9, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop' },
    { name: 'Bali, Indonesia', rating: 4.8, image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop' },
    { name: 'Kyoto, Japan', rating: 4.9, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop' },
    { name: 'Reykjavik, Iceland', rating: 4.7, image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop' },
  ]

  const bestActivities = [
    { name: 'Wandern', icon: '🏔️', description: 'Atemberaubende Wege entdecken' },
    { name: 'Kulturtouren', icon: '🏛️', description: 'Lokales Erbe erleben' },
    { name: 'Kulinarik', icon: '🍽️', description: 'Authentische Küche probieren' },
    { name: 'Abenteuer-Sport', icon: '🏄', description: 'Outdoor-Aktivitäten' },
  ]

  const fireOffers = [
    { title: '50 % Rabatt Europa-Touren', discount: '50%', validUntil: '31.12.2024' },
    { title: 'Kostenloses Hotel-Upgrade', discount: 'GRATIS', validUntil: '15.01.2025' },
    { title: 'Kostenloser Flughafen-Transfer', discount: 'GRATIS', validUntil: '28.02.2025' },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header 
        className="sticky top-0 w-full z-50 transition-all duration-300 bg-transparent"
        style={isScrolled ? { 
          borderBottom: '2px solid #BBE1FA',
          backdropFilter: 'blur(8px)'
        } : {}}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#1B262C' }}>
                <img 
                  src="/logo.png" 
                  alt="Tripura Logo" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/home" className="text-[#BBE1FA] hover:text-white transition-colors font-bold font-family: 'Satoshi', sans-serif">
                Planer
              </Link>
              <Link href="/activities" className="text-[#BBE1FA] hover:text-white transition-colors font-bold font-family: 'Satoshi', sans-serif">
                Activities
              </Link>
              <Link href="/trends" className="text-[#BBE1FA] hover:text-white transition-colors font-bold font-family: 'Satoshi', sans-serif">
                Trends
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (hasCompletedOnboarding()) {
                    setShowAuth(true)
                  } else {
                    setAfterOnboarding('auth')
                    setShowOnboarding(true)
                  }
                }}
                className="bg-[#BBE1FA] text-[#1B262C] hover:text-[#1B262C] px-6 py-2 rounded-full font-extrabold font-family: 'Satoshi', sans-serif transition-colors uppercase transition-all duration-200 hover:shadow-xl"
              >
                ANMELDEN
              </button>
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-black mb-6 uppercase tracking-tight heading-reverse-gradient"
            >
              Plane deinen perfekten Urlaub
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl max-w-3xl mx-auto mb-12 font-bold"
              style={{ color: 'rgba(187, 225, 250, 0.95)' }}
            >
              Discover amazing destinations, plan your route with AI-powered recommendations, 
              and create unforgettable memories with personalized travel advice.
            </motion.p>
          </div>

          {/* Map Section with Buttons */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative rounded-3xl shadow-2xl overflow-hidden mb-16"
            style={{ 
              backgroundColor: '#3282B8',
              boxShadow: '0 10px 25px rgba(97, 163, 207, 0.3)'
            }}
          >
            <div className="relative h-96">
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#3282B8] to-[#0F4C75]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 mx-auto mb-4" style={{ color: '#BBE1FA' }} />
                  <h3 className="text-2xl font-black mb-2" style={{ color: '#BBE1FA' }}>Interactive Map</h3>
                  <p className="font-bold" style={{ color: '#BBE1FA' }}>Klicke auf die Buttons unten, um mit der Planung zu starten</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (hasCompletedOnboarding()) {
                      setShowBudgetPlanner(true)
                    } else {
                      setAfterOnboarding('route')
                      setShowOnboarding(true)
                    }
                  }}
                  className="px-8 py-4 rounded-full font-black shadow-lg flex items-center space-x-2 transition-all duration-200 uppercase"
                  style={{ 
                    backgroundColor: '#BBE1FA',
                    color: '#1B262C'
                  }}
                >
                  <Navigation className="w-5 h-5" />
                  <span>Route planen</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAIAssistant(true)}
                  className="px-8 py-4 rounded-full font-black shadow-lg flex items-center space-x-2 transition-all duration-200 uppercase"
                  style={{ 
                    backgroundColor: '#BBE1FA',
                    color: '#1B262C'
                  }}
                >
                  <Sparkles className="w-5 h-5" />
                  <span>AI Assistant</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="rounded-full p-2 shadow-lg" style={{ backgroundColor: '#3282B8' }}>
              <div className="flex space-x-2">
                {[
                  { id: 'locations', label: 'Top-Ziele', icon: MapPin },
                  { id: 'activities', label: 'Top-Aktivitäten', icon: Star },
                  { id: 'offers', label: 'Angebote', icon: Flame },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-200 font-bold ${
                      activeSection === tab.id
                        ? 'shadow-lg'
                        : ''
                    }`}
                    style={activeSection === tab.id ? {
                      backgroundColor: '#BBE1FA',
                      color: '#1B262C'
                    } : {
                      color: '#BBE1FA',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="max-w-6xl mx-auto">
            {activeSection === 'locations' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {bestLocations.map((location, index) => (
                  <motion.div
                    key={location.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 border-[#4698cf]"
                    style={{ 
                      backgroundColor: '#3282B8',
                      boxShadow: '0 10px 25px rgba(97, 163, 207, 0.3)'
                    }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={location.image}
                        alt={location.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                      <WeatherBadge placeType="sightseeing" placeName={location.name} className="backdrop-blur-sm" />
                      <div className="rounded-full px-3 py-1 flex items-center space-x-1 backdrop-blur-sm" style={{ backgroundColor: 'rgba(27, 38, 44, 0.9)' }}>
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-bold" style={{ color: '#BBE1FA' }}>{location.rating}</span>
                      </div>
                    </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-black mb-2" style={{ color: '#BBE1FA' }}>{location.name}</h3>
                      <button className="w-full py-2 px-4 rounded-full font-bold transition-colors duration-200 uppercase" style={{ 
                        backgroundColor: '#BBE1FA',
                        color: '#1B262C'
                      }}>
                        Entdecken
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeSection === 'activities' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {bestActivities.map((activity, index) => (
                  <motion.div
                    key={activity.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group"
                    style={{ 
                      backgroundColor: '#3282B8',
                      boxShadow: '0 10px 25px rgba(97, 163, 207, 0.3)'
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="text-4xl">{activity.icon}</div>
                    <WeatherBadge placeType="activity" placeName={activity.name} />
                  </div>
                  <h3 className="text-lg font-black mb-2" style={{ color: '#1B262C' }}>{activity.name}</h3>
                    <p className="mb-4 font-bold" style={{ color: '#BBE1FA' }}>{activity.description}</p>
                    <button className="w-full py-2 px-4 rounded-full font-bold transition-colors duration-200 uppercase" style={{ 
                      backgroundColor: '#BBE1FA',
                      color: '#1B262C'
                    }}>
                      Entdecken
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeSection === 'offers' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {fireOffers.map((offer, index) => (
                  <motion.div
                    key={offer.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group"
                    style={{ 
                      backgroundColor: '#3282B8',
                      boxShadow: '0 10px 25px rgba(97, 163, 207, 0.3)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Flame className="w-8 h-8" style={{ color: '#BBE1FA' }} />
                      <span className="rounded-full px-3 py-1 text-sm font-black uppercase backdrop-blur-sm" style={{ 
                        backgroundColor: '#BBE1FA',
                        color: '#1B262C'
                      }}>
                        {offer.discount}
                      </span>
                    </div>
                    <h3 className="text-xl font-black mb-2" style={{ color: '#BBE1FA' }}>{offer.title}</h3>
                    <p className="mb-4 font-bold" style={{ color: '#BBE1FA' }}>Valid until {offer.validUntil}</p>
                    <button className="w-full py-3 px-4 rounded-full font-bold transition-all duration-200 uppercase" style={{ 
                      backgroundColor: '#BBE1FA',
                      color: '#1B262C'
                    }}>
                      Angebot sichern
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12" style={{ backgroundColor: '#1B262C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#3282B8' }}>
                <img 
                  src="/logo.png" 
                  alt="Tripura Logo" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="text-2xl font-black" style={{ color: '#BBE1FA' }}>Tripura</h3>
            </div>
            <p className="mb-6 font-bold" style={{ color: '#BBE1FA' }}>Dein KI-gestützter Urlaubsplaner</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="font-bold transition-colors" style={{ color: '#BBE1FA' }}>Datenschutz</a>
              <a href="#" className="font-bold transition-colors" style={{ color: '#BBE1FA' }}>AGB</a>
              <a href="#" className="font-bold transition-colors" style={{ color: '#BBE1FA' }}>Support</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showAIAssistant && (
        <AIAssistant onClose={() => setShowAIAssistant(false)} />
      )}
      {showBudgetPlanner && (
        <BudgetPlanner
          onClose={() => setShowBudgetPlanner(false)}
          onContinue={() => {
            setShowBudgetPlanner(false)
            setShowRoutePlanner(true)
          }}
          tripDays={7}
        />
      )}
      {showRoutePlanner && (
        <RoutePlanner
          onClose={() => setShowRoutePlanner(false)}
          onRouteCreate={() => {
            setShowRoutePlanner(false)
            setShowRouteQuestionnaire(true)
          }}
        />
      )}

      <AnimatePresence>
        {showRouteQuestionnaire && (
          <div className="fixed inset-0 z-[100]">
            <RouteQuestionnaireFlow
              onComplete={() => setShowRouteQuestionnaire(false)}
            />
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingEngine
            allowSkip
            onComplete={() => {
              setShowOnboarding(false)
              if (afterOnboarding === 'route') setShowBudgetPlanner(true)
              if (afterOnboarding === 'auth') setShowAuth(true)
              setAfterOnboarding(null)
            }}
          />
        )}
      </AnimatePresence>
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onEmail={() => setShowAuth(false)}
          onApple={() => setShowAuth(false)}
          onGoogle={() => setShowAuth(false)}
        />
      )}
    </div>
  )
}

