import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Compass, MapPin, Sparkles, ChevronDown } from 'lucide-react';
import { useGeolocation, DEFAULT_LOCATION } from '@/hooks/useGeolocation';
import SplitText from '@/components/SplitText';

const InteractiveBackgroundMap = dynamic(
  () => import('@/components/map/InteractiveBackgroundMap').then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full h-full overflow-hidden h-full min-h-[400px]">
        <div className="absolute inset-0 w-full h-full min-h-[400px]" aria-hidden />
      </div>
    ),
  }
);
import { mockActivities, mockRestaurants } from '@/data/mockData';

interface HeroSectionProps {
  onStartPlanning: () => void;
}

export function HeroSection({ onStartPlanning }: HeroSectionProps) {
  const { latitude, longitude, isLoading } = useGeolocation({ watch: false });
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng]);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const mapScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const mapOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    if (latitude && longitude) {
      setMapCenter([latitude, longitude]);
    }
  }, [latitude, longitude]);

  // Combine markers from activities and restaurants
  const markers = [
    ...mockActivities.map(a => a.location),
    ...mockRestaurants.map(r => r.location),
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Background Map */}
      <motion.div
        style={{ scale: mapScale, opacity: mapOpacity }}
        className="absolute inset-0 z-0"
      >
        <InteractiveBackgroundMap
          center={mapCenter}
          zoom={13}
          className="h-full min-h-[400px]"
          interactive={false}
        />
      </motion.div>

      {/* Leichter Vignetten-Effekt: Mitte klar, Ränder dezent abgedunkelt */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 65% 55% at 50% 45%, transparent 0%, transparent 45%, rgba(27,38,44,0.35) 75%, rgba(27,38,44,0.55) 100%)',
        }}
        aria-hidden
      />
      {/* Leichter Gradient für Text-Lesbarkeit */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40 z-[1] pointer-events-none" />

      {/* Weicher Übergang Map → Weiß: unten ausblenden, kein harter Cut beim Scrollen */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none"
        style={{
          height: '55vh',
          background: 'linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.85) 25%, rgba(255,255,255,0.4) 55%, transparent 100%)',
        }}
        aria-hidden
      />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8"
      >
        {/* Badge – transparentes Weiß, abgestimmt auf Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium hero-cta-secondary backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-white" />
            KI-gestützte Reiseplanung
          </span>
        </motion.div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center mb-6 max-w-4xl">
          <SplitText
            text="Entdecke deine"
            className="block mb-2 text-white w-full"
            delay={50}
            duration={1}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
          <span className="block w-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            <SplitText
              text="perfekte Reise"
              className="block w-full"
              delay={80}
              duration={1.25}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          </span>
        </h1>

        {/* Subtitle – gleicher Farbverlauf wie die große Überschrift */}
        <p className="text-xl text-center max-w-2xl mb-10 font-medium bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          <SplitText
            text="Plane intelligente Routen, entdecke versteckte Schätze und optimiere dein Budget – alles mit der Kraft der KI."
            className="inline"
            delay={40}
            duration={0.8}
            ease="power3.out"
            splitType="words"
            from={{ opacity: 0, y: 24 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-50px"
            textAlign="center"
          />
        </p>

        {/* CTA Buttons – einheitlich abgestimmt */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartPlanning}
            className="hero-cta-primary flex items-center justify-center gap-2 text-lg px-8 py-4"
          >
            <Compass className="w-5 h-5" />
            Reise planen
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hero-cta-secondary flex items-center justify-center gap-2 text-lg px-8 py-4 backdrop-blur-md"
          >
            <MapPin className="w-5 h-5" />
            {isLoading ? 'Standort wird ermittelt...' : 'Meinen Standort erkunden'}
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-16 grid grid-cols-3 gap-8 sm:gap-16"
        >
          {[
            { value: '50K+', label: 'Reisende' },
            { value: '120+', label: 'Länder' },
            { value: '4.9', label: 'Bewertung' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll-Hinweis – transparentes Weiß, kein Grau */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center px-5 py-2.5 rounded-full font-medium text-white border border-white/40 shadow-sm backdrop-blur-md"
          style={{ background: 'rgba(255, 255, 255, 0.25)' }}
        >
          <span className="text-sm mb-1.5">Scrollen für mehr</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
