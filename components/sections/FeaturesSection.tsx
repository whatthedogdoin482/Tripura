import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Map, 
  Utensils, 
  Calendar, 
  Wallet, 
  CloudSun, 
  Sparkles,
  CreditCard,
  Shield,
  Plane,
  Car,
  Route,
  TrendingUp,
  X,
  Star
} from 'lucide-react';
import { mockActivities, mockRestaurants } from '@/data/mockData';

const features = [
  {
    icon: Map,
    title: 'KI-Routenplanung',
    description: 'Intelligente Routen basierend auf deinen Vorlieben, dem Wetter und deinem Budget.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Utensils,
    title: 'Restaurant-Empfehlungen',
    description: 'Entdecke die besten Restaurants, passend zu deinem Geschmack und Budget.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Calendar,
    title: 'Tagesplanung',
    description: 'Optimierte Tagespläne mit dem perfekten Mix aus Aktivitäten und Pausen.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Wallet,
    title: 'Budget-Tracking',
    description: 'Behalte deine Ausgaben im Blick und erhalte intelligente Spartipps.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: CloudSun,
    title: 'Wetter-Optimierung',
    description: 'Aktivitäten werden basierend auf der Wettervorlage optimal geplant.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Sparkles,
    title: 'KI-Empfehlungen',
    description: 'Personalisierte Vorschläge, die sich mit jeder Reise verbessern.',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: CreditCard,
    title: 'Kreditkarten-Guide',
    description: 'Finde die beste Kreditkarte für dein Reiseziel ohne Auslandsgebühren.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Shield,
    title: 'Versicherungen',
    description: 'Vergleiche und buche die passende Reiseversicherung für deinen Trip.',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Plane,
    title: 'Flug-Booking',
    description: 'Finde die besten Flugangebote und buche direkt über die App.',
    color: 'from-sky-500 to-blue-500',
  },
  {
    icon: Car,
    title: 'Mietwagen',
    description: 'Vergleiche Mietwagenpreise und buche das passende Fahrzeug.',
    color: 'from-red-500 to-orange-500',
  },
  {
    icon: Route,
    title: 'Live-Navigation',
    description: 'Integrierte Navigation mit Echtzeit-Updates und Alternativrouten.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: TrendingUp,
    title: 'Reise-Analyse',
    description: 'Erhalte Einblicke in deine Reisegewohnheiten und optimiere zukünftige Trips.',
    color: 'from-emerald-500 to-green-500',
  },
];

function FeatureCard({
  feature,
  index,
  onClick,
  isActive,
}: {
  feature: typeof features[0];
  index: number;
  onClick: () => void;
  isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative"
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <div className="relative w-full rounded-3xl glass-card overflow-hidden px-5 py-4">
          {/* Hintergrund-Gradient wie bei der ursprünglichen Karte */}
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10`}
          />

          <div className="relative flex flex-col gap-3">
            {/* Icon + Titel in einer Zeile, Titel dauerhaft sichtbar */}
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
            </div>

            {/* Beschreibung klappt unter dem Icon-/Titelbereich auf, kein separates Pop-up */}
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-gray-600 leading-relaxed"
                >
                  {feature.description}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

const featureToDataKey: Record<string, 'restaurants' | 'activities'> = {
  'Restaurant-Empfehlungen': 'restaurants',
  'KI-Routenplanung': 'activities',
  'Tagesplanung': 'activities',
  'Wetter-Optimierung': 'activities',
  'KI-Empfehlungen': 'activities',
};

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [selectedFeature, setSelectedFeature] = useState<{ title: string; key: 'restaurants' | 'activities' } | null>(null);
  const [activeFeatureTitle, setActiveFeatureTitle] = useState<string | null>(null);

  const handleFeatureClick = (title: string) => {
    setActiveFeatureTitle((current) => (current === title ? null : title));
    const key = featureToDataKey[title];
    if (key) setSelectedFeature({ title, key });
  };

  const list = selectedFeature
    ? selectedFeature.key === 'restaurants'
      ? mockRestaurants.slice(0, 6)
      : mockActivities.slice(0, 6)
    : [];

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4"
          >
            Features
          </motion.span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Alles was du für die
            <span className="gradient-text"> perfekte Reise </span>
            brauchst
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Von der Planung bis zur Buchung – unsere KI-gestützten Tools begleiten dich 
            auf jedem Schritt deiner Reise.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              onClick={() => handleFeatureClick(feature.title)}
              isActive={activeFeatureTitle === feature.title}
            />
          ))}
        </div>

        {/* Aktivitäten / Restaurants Liste beim Klick – gleicher Look */}
        <AnimatePresence>
          {selectedFeature && list.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-12 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedFeature.title} – Empfehlungen
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedFeature(null)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Schließen"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((item) => {
                  const isRestaurant = 'cuisine' in item;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl glass-card"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <span className="flex items-center gap-1 text-sm text-amber-600">
                          <Star className="w-4 h-4 fill-current" />
                          {item.rating}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {isRestaurant ? (item as { cuisine: string }).cuisine : (item as { description: string }).description}
                      </p>
                      {isRestaurant && (
                        <p className="mt-2 text-xs text-gray-500">
                          Preisniveau: {'€'.repeat((item as { priceLevel: number }).priceLevel)}
                        </p>
                      )}
                      {!isRestaurant && 'price' in item && (
                        <p className="mt-2 text-xs text-gray-500">
                          ab {(item as { price: number }).price} €
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
