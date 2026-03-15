import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  Map, 
  Wallet, 
  Calendar, 
  User,
  Menu,
  X
} from 'lucide-react';
import TripuraLogo from '@/components/TripuraLogo';

interface NavigationProps {
  currentView?: string;
  onViewChange?: (view: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Compass },
  { id: 'plan', label: 'Planen', icon: Map },
  { id: 'explore', label: 'Entdecken', icon: Calendar },
  { id: 'budget', label: 'Budget', icon: Wallet },
  { id: 'profile', label: 'Profil', icon: User },
];

export function Navigation({ currentView = 'home', onViewChange }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLandingPage = currentView === 'home';
  const navVisible = isLandingPage ? isScrolled : true;

  return (
    <>
      {/* Desktop Navigation: auf Landing-Page beim Scrollen einblenden, sonst immer sichtbar */}
      <motion.header
        initial={false}
        animate={{ y: navVisible ? 0 : -100 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4"
      >
        <nav className="max-w-6xl mx-auto glass-card rounded-full px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.span whileHover={{ scale: 1.02 }}>
              <TripuraLogo size="sm" showLabel labelClassName="text-gray-900 hidden sm:inline" />
            </motion.span>

            {/* Desktop nav items */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => onViewChange?.(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    currentView === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 z-40 px-4 md:hidden"
          >
            <div className="glass-card rounded-3xl p-4 space-y-2">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    onViewChange?.(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentView === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom mobile nav */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:hidden"
      >
        <div className="glass-card rounded-3xl px-4 py-3">
          <div className="flex items-center justify-around">
            {navItems.slice(0, 5).map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onViewChange?.(item.id)}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  currentView === item.id
                    ? 'text-blue-600'
                    : 'text-gray-500'
                }`}
              >
                <item.icon className={`w-5 h-5 ${currentView === item.id ? 'fill-current' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.nav>
    </>
  );
}
