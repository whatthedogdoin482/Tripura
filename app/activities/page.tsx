'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

// Placeholder activity item
type ActivityItem = {
  id: string
  title: string
  description?: string
  image: string
  href?: string
}

// Static placeholder data per category
const CATEGORIES: { id: string; title: string; items: ActivityItem[] }[] = [
  {
    id: 'restaurants',
    title: 'Restaurants',
    items: [
      { id: 'r1', title: 'Lokale Küche', description: 'Typische Gerichte der Region', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop', href: '/activities/restaurants' },
      { id: 'r2', title: 'Fine Dining', description: 'Ausgezeichnete Restaurants', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop', href: '/activities/restaurants' },
      { id: 'r3', title: 'Street Food', description: 'Märkte & Imbisse', image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop', href: '/activities/restaurants' },
    ],
  },
  {
    id: 'sehenswuerdigkeiten',
    title: 'Sehenswürdigkeiten',
    items: [
      { id: 's1', title: 'Historische Altstadt', description: 'Monumente & Architektur', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop', href: '/activities/sehenswuerdigkeiten' },
      { id: 's2', title: 'Aussichtspunkte', description: 'Panorama & Fotos', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop', href: '/activities/sehenswuerdigkeiten' },
      { id: 's3', title: 'Museen & Galerien', description: 'Kultur erleben', image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&h=300&fit=crop', href: '/activities/sehenswuerdigkeiten' },
    ],
  },
  {
    id: 'tiktok',
    title: 'Aus TikTok importiert',
    items: [
      { id: 't1', title: 'Restaurants', description: 'Aus TikTok importierte Restaurants', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop', href: '/activities/tiktok-restaurants' },
      { id: 't2', title: 'Aktivitäten', description: 'Aus TikTok importierte Aktivitäten', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop', href: '/activities/tiktok-aktivitaeten' },
      { id: 't3', title: 'Sehenswürdigkeiten', description: 'Aus TikTok importierte Sehenswürdigkeiten', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop', href: '/activities/tiktok-sehenswuerdigkeiten' },
    ],
  },
  {
    id: 'clubs',
    title: 'Clubs & Nachtleben',
    items: [
      { id: 'c1', title: 'Clubs', description: 'Nightlife & Partys', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop', href: '/activities/clubs' },
      { id: 'c2', title: 'Bars & Lounges', description: 'Drinks & Atmosphäre', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop', href: '/activities/clubs' },
      { id: 'c3', title: 'Live-Musik', description: 'Konzerte & Events', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop', href: '/activities/clubs' },
    ],
  },
  {
    id: 'sport',
    title: 'Sport & Aktiv',
    items: [
      { id: 'sp1', title: 'Wandern', description: 'Touren & Trails', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop', href: '/activities/sport' },
      { id: 'sp2', title: 'Wassersport', description: 'Tauchen, Surfen, Boot', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop', href: '/activities/sport' },
      { id: 'sp3', title: 'Yoga & Wellness', description: 'Entspannung outdoor', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop', href: '/activities/sport' },
    ],
  },
  {
    id: 'cafes',
    title: 'Cafés & Street Food',
    items: [
      { id: 'cf1', title: 'Cafés', description: 'Kaffee & Kuchen', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop', href: '/activities/cafes' },
      { id: 'cf2', title: 'Food Markets', description: 'Lokale Märkte', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop', href: '/activities/cafes' },
      { id: 'cf3', title: 'Brunch', description: 'Frühstück & Brunch', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop', href: '/activities/cafes' },
    ],
  },
]

function ActivityCard({ item, index }: { item: ActivityItem; index: number }) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col rounded-2xl overflow-hidden border-2 border-[#4698cf] shadow-md hover:shadow-xl active:scale-[0.98] transition-all duration-200"
      style={{ backgroundColor: '#3282B8' }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold" style={{ color: '#BBE1FA' }}>{item.title}</h3>
        {item.description && (
          <p className="text-sm font-bold mt-0.5" style={{ color: '#BBE1FA' }}>{item.description}</p>
        )}
      </div>
    </motion.div>
  )
  const href = item.href ?? '#'
  return (
    <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BBE1FA] focus-visible:ring-offset-2 rounded-2xl">
      {content}
    </Link>
  )
}

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen">
      {/* Header – gleicher Style wie Home */}
      <header className="sticky top-0 w-full z-50 transition-all duration-300 bg-transparent" style={{ borderBottom: '2px solid #BBE1FA', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BBE1FA] focus-visible:ring-offset-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#1B262C' }}>
                <span className="text-xl font-bold" style={{ color: '#BBE1FA' }}>P</span>
              </div>
              <h1 className="text-2xl font-bold" style={{ color: '#BBE1FA' }}>Tripura</h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-2">
              <Link href="/home" className="px-4 py-2 rounded-full font-bold transition-colors text-[#1B262C] hover:text-[#BBE1FA]">
                Planer
              </Link>
              <Link href="/activities" className="px-4 py-2 rounded-full font-bold transition-colors text-[#BBE1FA]">
                Activities
              </Link>
              <Link href="/trends" className="px-4 py-2 rounded-full font-bold transition-colors text-[#BBE1FA] hover:text-white">
                Trends
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 heading-reverse-gradient"
          >
            Aktivitäten
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-xl font-bold mb-10"
            style={{ color: 'rgba(187, 225, 250, 0.95)' }}
          >
            Entdecke tolle Aktivitäten für deine nächste Reise.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Link href="/home">
              <button
                type="button"
                className="rounded-full px-6 py-3 font-extrabold uppercase transition-all duration-200 hover:shadow-xl active:scale-[0.98]"
                style={{ backgroundColor: '#BBE1FA', color: '#1B262C' }}
              >
                Zur Startseite
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Category sections */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          {CATEGORIES.map((category, catIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + catIndex * 0.08 }}
            >
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#BBE1FA' }}>{category.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, idx) => (
                  <ActivityCard key={item.id} item={item} index={idx} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
