'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Search, ChevronLeft, MapPin } from 'lucide-react'
import WeatherBadge from '@/components/WeatherBadge'
import type { PlaceType } from '@/lib/weather'

type Spot = {
  id: string
  name: string
  description: string
  distance: number
  isInCurrentTrip: boolean
  country: string
  image: string
  rating?: number
  cuisine?: string
  priceRange?: string
  type?: string
  duration?: string
}

const CATEGORY_PLACE_TYPE: Record<string, PlaceType> = {
  restaurants: 'restaurant',
  sehenswuerdigkeiten: 'sightseeing',
  clubs: 'activity',
  sport: 'outdoor',
  cafes: 'restaurant',
  'tiktok-restaurants': 'restaurant',
  'tiktok-aktivitaeten': 'activity',
  'tiktok-sehenswuerdigkeiten': 'sightseeing',
}

const CATEGORY_CONFIG: Record<string, { title: string; filters: { id: string; label: string; options: string[] }[] }> = {
  restaurants: {
    title: 'Restaurants',
    filters: [
      { id: 'distance', label: 'Entfernung', options: ['Alle', 'Bis 1 km', 'Bis 5 km', 'Bis 10 km', 'Bis 25 km', 'Bis 50 km'] },
      { id: 'cuisine', label: 'Küche', options: ['Alle', 'Lokal', 'International', 'Asiatisch', 'Italienisch', 'Vegetarisch'] },
      { id: 'price', label: 'Preis', options: ['Alle', '€', '€€', '€€€'] },
      { id: 'rating', label: 'Bewertung', options: ['Alle', '4+ Sterne', '4.5+ Sterne'] },
    ],
  },
  sehenswuerdigkeiten: {
    title: 'Sehenswürdigkeiten',
    filters: [
      { id: 'distance', label: 'Entfernung', options: ['Alle', 'Bis 1 km', 'Bis 5 km', 'Bis 10 km', 'Bis 25 km', 'Bis 50 km'] },
      { id: 'type', label: 'Art', options: ['Alle', 'Historisch', 'Natur', 'Museum', 'Aussicht'] },
    ],
  },
  clubs: {
    title: 'Clubs & Nachtleben',
    filters: [
      { id: 'distance', label: 'Entfernung', options: ['Alle', 'Bis 1 km', 'Bis 5 km', 'Bis 10 km', 'Bis 25 km'] },
      { id: 'type', label: 'Typ', options: ['Alle', 'Club', 'Bar', 'Live-Musik'] },
    ],
  },
  sport: {
    title: 'Sport & Aktiv',
    filters: [
      { id: 'distance', label: 'Entfernung', options: ['Alle', 'Bis 5 km', 'Bis 10 km', 'Bis 25 km', 'Bis 50 km'] },
      { id: 'type', label: 'Aktivität', options: ['Alle', 'Wandern', 'Wassersport', 'Yoga', 'Radfahren'] },
      { id: 'duration', label: 'Dauer', options: ['Alle', 'Bis 2 h', 'Halbtag', 'Ganztag'] },
    ],
  },
  cafes: {
    title: 'Cafés & Street Food',
    filters: [
      { id: 'distance', label: 'Entfernung', options: ['Alle', 'Bis 1 km', 'Bis 5 km', 'Bis 10 km'] },
      { id: 'type', label: 'Typ', options: ['Alle', 'Café', 'Street Food', 'Brunch'] },
    ],
  },
  'tiktok-restaurants': {
    title: 'Aus TikTok – Restaurants',
    filters: [
      { id: 'distance', label: 'Entfernung', options: ['Alle', 'Bis 1 km', 'Bis 5 km', 'Bis 10 km', 'Bis 25 km'] },
      { id: 'cuisine', label: 'Küche', options: ['Alle', 'Lokal', 'International', 'Street Food'] },
    ],
  },
  'tiktok-aktivitaeten': {
    title: 'Aus TikTok – Aktivitäten',
    filters: [
      { id: 'distance', label: 'Entfernung', options: ['Alle', 'Bis 5 km', 'Bis 10 km', 'Bis 25 km'] },
      { id: 'type', label: 'Typ', options: ['Alle', 'Erlebnis', 'Fotospot', 'Food'] },
    ],
  },
  'tiktok-sehenswuerdigkeiten': {
    title: 'Aus TikTok – Sehenswürdigkeiten',
    filters: [
      { id: 'distance', label: 'Entfernung', options: ['Alle', 'Bis 5 km', 'Bis 10 km', 'Bis 25 km'] },
      { id: 'type', label: 'Art', options: ['Alle', 'Viral Spot', 'Aussicht', 'Historisch'] },
    ],
  },
}

const DISTANCE_MAP: Record<string, number> = {
  'Alle': 9999,
  'Bis 1 km': 1,
  'Bis 5 km': 5,
  'Bis 10 km': 10,
  'Bis 25 km': 25,
  'Bis 50 km': 50,
}

function generateMockSpots(category: string): Spot[] {
  const base = [
    { name: 'Spot am Platz', distance: 0.5, isInCurrentTrip: true, country: 'Deutschland', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop', rating: 4.8, cuisine: 'Lokal', priceRange: '€€' },
    { name: 'Beliebter Treff', distance: 1.2, isInCurrentTrip: true, country: 'Deutschland', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop', rating: 4.5, cuisine: 'International', priceRange: '€' },
    { name: 'Ruhige Ecke', distance: 2.8, isInCurrentTrip: true, country: 'Deutschland', image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop', rating: 4.6, cuisine: 'Lokal', priceRange: '€€€' },
    { name: 'Weiter draußen', distance: 8, isInCurrentTrip: false, country: 'Deutschland', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop', rating: 4.4, cuisine: 'Italienisch', priceRange: '€€' },
    { name: 'Außerhalb Zentrum', distance: 15, isInCurrentTrip: false, country: 'Deutschland', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop', rating: 4.7, cuisine: 'Asiatisch', priceRange: '€' },
    { name: 'Empfehlung im Land', distance: 120, isInCurrentTrip: false, country: 'Deutschland', image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&h=300&fit=crop', rating: 4.9, cuisine: 'Lokal', priceRange: '€€€' },
    { name: 'Weitere Empfehlung', distance: 85, isInCurrentTrip: false, country: 'Deutschland', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop', rating: 4.3, cuisine: 'International', priceRange: '€€' },
  ]
  return base.map((b, i) => ({
    id: `${category}-${i}`,
    name: b.name,
    description: `${b.cuisine || 'Spot'} · ${b.distance} km`,
    distance: b.distance,
    isInCurrentTrip: b.isInCurrentTrip,
    country: b.country,
    image: b.image,
    rating: b.rating,
    cuisine: b.cuisine,
    priceRange: b.priceRange,
    type: b.cuisine,
  }))
}

export default function CategorySpotsPage() {
  const params = useParams()
  const router = useRouter()
  const category = (params?.category as string) || ''
  const config = CATEGORY_CONFIG[category]
  const [search, setSearch] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [showLikedOnly, setShowLikedOnly] = useState(false)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())

  const storageKey = `tripura-liked-${category}`

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const arr = JSON.parse(raw) as string[]
        setLikedIds(new Set(arr))
      }
    } catch {
      setLikedIds(new Set())
    }
  }, [category, storageKey])

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      try {
        localStorage.setItem(storageKey, JSON.stringify(Array.from(next)))
      } catch {}
      return next
    })
  }

  const allSpots = useMemo(() => generateMockSpots(category), [category])

  const filteredSpots = useMemo(() => {
    let list = allSpots

    if (showLikedOnly) {
      list = list.filter((s) => likedIds.has(s.id))
    } else {
      const q = search.trim().toLowerCase()
      if (q) list = list.filter((s) => s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q)))

      const maxDist = filterValues['distance'] ? DISTANCE_MAP[filterValues['distance']] ?? 9999 : 9999
      list = list.filter((s) => s.distance <= maxDist)

      if (filterValues['cuisine'] && filterValues['cuisine'] !== 'Alle') {
        list = list.filter((s) => s.cuisine === filterValues['cuisine'])
      }
      if (filterValues['price'] && filterValues['price'] !== 'Alle') {
        list = list.filter((s) => s.priceRange === filterValues['price'])
      }
      if (filterValues['type'] && filterValues['type'] !== 'Alle') {
        list = list.filter((s) => (s.cuisine || s.type) === filterValues['type'])
      }
      if (filterValues['rating'] && filterValues['rating'] !== 'Alle') {
        const minRating = filterValues['rating'] === '4.5+ Sterne' ? 4.5 : 4
        list = list.filter((s) => (s.rating ?? 0) >= minRating)
      }
    }

    return [...list].sort((a, b) => a.distance - b.distance)
  }, [allSpots, search, filterValues, showLikedOnly, likedIds])

  const currentTripSpots = useMemo(() => filteredSpots.filter((s) => s.isInCurrentTrip), [filteredSpots])
  const nearbySpots = useMemo(() => filteredSpots.filter((s) => !s.isInCurrentTrip && s.distance < 50), [filteredSpots])
  const countrySpots = useMemo(() => filteredSpots.filter((s) => !s.isInCurrentTrip && s.distance >= 50), [filteredSpots])

  const countryName = useMemo(() => {
    const c = [...currentTripSpots, ...nearbySpots, ...countrySpots].find((s) => s.country)?.country
    return c || 'dem Land'
  }, [currentTripSpots, nearbySpots, countrySpots])

  const sections = useMemo(() => {
    const out: { title: string; spots: Spot[] }[] = []
    if (currentTripSpots.length) out.push({ title: 'Für deinen aktuellen Trip', spots: currentTripSpots })
    if (nearbySpots.length) out.push({ title: 'Weitere in der Nähe (nach Entfernung)', spots: nearbySpots })
    if (countrySpots.length) out.push({ title: `Empfehlungen aus ${countryName}`, spots: countrySpots })
    return out
  }, [currentTripSpots, nearbySpots, countrySpots, countryName])

  const isEmpty = filteredSpots.length === 0

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center" >
        <div className="text-center">
          <p className="text-xl font-bold mb-4" style={{ color: '#BBE1FA' }}>Kategorie nicht gefunden.</p>
          <Link href="/activities" className="rounded-full px-6 py-3 font-extrabold uppercase" style={{ backgroundColor: '#BBE1FA', color: '#1B262C' }}>Zurück zu Aktivitäten</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" >
      <header className="sticky top-0 z-50 transition-all duration-300" style={{ borderBottom: '2px solid #BBE1FA', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="p-2 rounded-full transition-colors hover:opacity-90"
                style={{ backgroundColor: '#1B262C', color: '#BBE1FA' }}
                aria-label="Zurück"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold truncate" style={{ color: '#BBE1FA' }}>{config.title}</h1>
            </div>
            <button
              type="button"
              onClick={() => setShowLikedOnly((v) => !v)}
              className="flex items-center gap-2 rounded-full px-4 py-2 font-bold transition-all"
              style={{
                backgroundColor: showLikedOnly ? '#BBE1FA' : '#1B262C',
                color: showLikedOnly ? '#1B262C' : '#BBE1FA',
              }}
            >
              <Heart className={`w-5 h-5 ${likedIds.size > 0 ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">Gemerkte</span>
              {likedIds.size > 0 && <span>({likedIds.size})</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#1B262C' }} />
            <input
              type="search"
              placeholder="Spots durchsuchen …"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#4698cf] bg-white/95 font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#BBE1FA]"
              style={{ color: '#1B262C' }}
            />
          </div>
        </div>

        {config.filters.map((f) => (
          <div key={f.id} className="mb-4">
            <label className="block text-sm font-bold mb-2" style={{ color: '#BBE1FA' }}>{f.label}</label>
            <div className="flex flex-wrap gap-2">
              {f.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFilterValues((prev) => ({ ...prev, [f.id]: prev[f.id] === opt ? 'Alle' : opt }))}
                  className="px-4 py-2 rounded-full text-sm font-bold transition-all"
                  style={{
                    backgroundColor: (filterValues[f.id] === opt || (!filterValues[f.id] && opt === 'Alle')) ? '#BBE1FA' : 'rgba(27, 38, 44, 0.6)',
                    color: (filterValues[f.id] === opt || (!filterValues[f.id] && opt === 'Alle')) ? '#1B262C' : '#BBE1FA',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border-2 border-[#4698cf] p-8 text-center"
            style={{ backgroundColor: '#3282B8' }}
          >
            <p className="text-lg font-bold mb-2" style={{ color: '#BBE1FA' }}>
              {showLikedOnly ? 'Keine gemerkten Spots' : 'Leider nichts gefunden'}
            </p>
            <p className="text-sm font-bold" style={{ color: '#BBE1FA' }}>
              {showLikedOnly
                ? 'Save spots to see them here.'
                : 'No saved or recommended spots match your search or filters.'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-bold mb-4" style={{ color: '#BBE1FA' }}>{section.title}</h2>
                <ul className="space-y-4">
                  {section.spots.map((spot) => (
                    <li key={spot.id}>
                      <motion.article
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative flex flex-col sm:flex-row rounded-2xl overflow-hidden border-2 border-[#4698cf] shadow-lg"
                        style={{ backgroundColor: '#3282B8' }}
                      >
                        <button
                          type="button"
                          onClick={() => toggleLike(spot.id)}
                          className="absolute top-3 left-3 z-10 p-2 rounded-full shadow-md transition-transform hover:scale-110 active:scale-95"
                          style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: likedIds.has(spot.id) ? '#e11' : '#1B262C' }}
                          aria-label={likedIds.has(spot.id) ? 'Nicht mehr merken' : 'Spot merken'}
                        >
                          <Heart className={`w-5 h-5 ${likedIds.has(spot.id) ? 'fill-current' : ''}`} />
                        </button>
                        <div className="absolute top-3 right-3 z-10">
                          <WeatherBadge
                            placeType={CATEGORY_PLACE_TYPE[category] ?? 'activity'}
                            placeName={spot.name}
                            className="backdrop-blur-sm"
                          />
                        </div>
                        <div className="relative w-full sm:w-48 aspect-[4/3] sm:aspect-square flex-shrink-0">
                          <Image src={spot.image} alt={spot.name} fill className="object-cover" sizes="200px" />
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-center">
                          <h3 className="text-lg font-bold" style={{ color: '#1B262C' }}>{spot.name}</h3>
                          <p className="text-sm font-bold mt-1" style={{ color: '#BBE1FA' }}>{spot.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-sm font-bold" style={{ color: '#1B262C' }}>
                            <MapPin className="w-4 h-4" style={{ color: '#BBE1FA' }} />
                            {spot.distance} km
                            {spot.rating != null && (
                              <span className="ml-2">· {spot.rating} ★</span>
                            )}
                          </div>
                        </div>
                      </motion.article>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
