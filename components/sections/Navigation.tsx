import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Compass, 
  Map, 
  Wallet, 
  Calendar, 
  User,
  LogIn,
  Menu,
  X,
} from 'lucide-react';
import TripuraLogo from '@/components/TripuraLogo';
import { AuthButton } from '@/components/AuthButton';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationProps {
  currentView?: string;
  onViewChange?: (view: string) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Compass },
  { id: 'plan', label: 'Planen', icon: Map },
  { id: 'explore', label: 'Entdecken', icon: Calendar },
  { id: 'budget', label: 'Budget', icon: Wallet },
  { id: 'profile', label: 'Profil', icon: User },
];

export function Navigation({ currentView = 'home', onViewChange, onOpenAuth }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLandingPage = currentView === 'home';
  const navVisible = isLandingPage ? isScrolled : true;

  const navigateTo = (view: string) => {
    onViewChange?.(view);
  };

  return (
    <>
      {/* Desktop Navigation: auf Landing-Page beim Scrollen einblenden, sonst immer sichtbar */}
      <motion.header
        initial={false}
        animate={{ y: navVisible ? 0 : -100 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4 hidden md:block"
      >
        <nav className="max-w-6xl mx-auto rounded-full px-6 py-3 bg-white/85 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between">
            {/* Logo – klick führt immer zum Start-Screen (Home + nach oben scrollen) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2"
              aria-label="Zur Startseite"
            >
              <TripuraLogo
                asLink={false}
                size="sm"
                showLabel
                labelClassName="text-gray-900 hidden sm:inline"
              />
            </motion.button>

            {/* Desktop nav items – ein gemeinsames Highlight, das per layoutId zwischen Tabs gleitet */}
            <LayoutGroup>
            <div className="hidden md:flex items-center gap-1 relative">
              {navItems.map((item) =>
                item.id === 'profile' ? (
                    <AuthButton
                      key={item.id}
                      variant="nav"
                      onOpenAuth={onOpenAuth}
                      onNavigateToProfile={() => navigateTo('profile')}
                      isActive={currentView === 'profile'}
                    />
                ) : (
                  <div key={item.id} className="relative">
                    {currentView === item.id && (
                      <motion.span
                        layoutId="navHighlight"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 -z-0"
                        aria-hidden
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      />
                    )}
                    <motion.button
                      onClick={() => navigateTo(item.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                        currentView === item.id
                          ? 'text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      aria-current={currentView === item.id ? 'page' : undefined}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.button>
                  </div>
                )
              )}
            </div>
            </LayoutGroup>

            {/* Mobile menu button (wie vorher) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
              aria-label={isMobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
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

      {/* Mobile Dropdown Navigation (wie vorher), aber mit Desktop-Design */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 z-40 px-4 md:hidden"
          >
            <div className="rounded-3xl p-4 space-y-2 bg-white/90 backdrop-blur-md shadow-md">
              {navItems.map((item, index) =>
                item.id === 'profile' ? (
                  <div key={item.id} className="pt-2">
                    <AuthButton
                      variant="nav"
                      onOpenAuth={(mode) => {
                        onOpenAuth?.(mode);
                        setIsMobileMenuOpen(false);
                      }}
                      onNavigateToProfile={() => {
                        navigateTo('profile');
                        setIsMobileMenuOpen(false);
                      }}
                      isActive={currentView === 'profile'}
                      className="w-full justify-start px-4 py-3 rounded-xl !gap-3"
                    />
                  </div>
                ) : (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      navigateTo(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                      currentView === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    aria-current={currentView === item.id ? 'page' : undefined}
                  >
                    {item.id === 'home' ? (
                      <img
                        src="/logo.PNG"
                        alt=""
                        aria-hidden
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <item.icon className="w-5 h-5" />
                    )}
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom mobile nav (Position/Größe wie vorher) – aber mit Sliding-Highlight wie Desktop */}
      <LayoutGroup>
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:hidden"
      >
        <div className="rounded-3xl px-3 py-2.5 bg-white/90 backdrop-blur-md shadow-md">
          <div className="flex items-center justify-around relative">
            {navItems.slice(0, 5).map((item) => {
              const isActive = currentView === item.id;
              if (item.id === 'profile') {
                return (
                  <motion.button
                    key={item.id}
                    onClick={() =>
                      isLoggedIn ? navigateTo('profile') : onOpenAuth?.('login')
                    }
                    whileTap={{ scale: 0.9 }}
                    className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-colors"
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="mobileNavHighlight"
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 -z-0"
                        aria-hidden
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                      {isLoggedIn && user?.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt="Profil"
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : isLoggedIn ? (
                        <User className="w-5 h-5" />
                      ) : (
                        <LogIn className="w-5 h-5" />
                      )}
                    </span>
                    <span className={`relative z-10 text-xs font-medium ${isActive ? 'text-white' : 'text-gray-500'}`}>
                      {!isLoggedIn ? 'Log in' : item.label}
                    </span>
                  </motion.button>
                );
              }

              return (
                <motion.button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  whileTap={{ scale: 0.9 }}
                  className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-colors"
                  aria-current={isActive ? 'page' : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId="mobileNavHighlight"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 -z-0"
                      aria-hidden
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                  <span className={`relative z-10 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                    {item.id === 'home' ? (
                      <img
                        src="/logo.PNG"
                        alt=""
                        aria-hidden
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <item.icon className="w-5 h-5" />
                    )}
                  </span>
                  <span className={`relative z-10 text-xs font-medium ${isActive ? 'text-white' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.nav>
      </LayoutGroup>
    </>
  );
}
