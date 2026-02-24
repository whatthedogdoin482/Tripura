/**
 * Onboarding preference system – algorithm-ready structure for recommendations.
 * Weights and flags are stored in localStorage and used for personalization.
 */

export type PreferenceId =
  | 'party'
  | 'food'
  | 'adventure'
  | 'culture'
  | 'relaxation'
  | 'luxury'
  | 'budget'
  | 'nature'
  | 'shopping'
  | 'hidden_gems'

export type SliderId =
  | 'party_energy'
  | 'food_foodie'
  | 'food_style'
  | 'food_venue'
  | 'adventure_intensity'
  | 'luxury_level'

export interface SliderConfig {
  id: SliderId
  labelLeft: string
  labelRight: string
  defaultValue: number
}

export interface SubQuestionConfig {
  id: string
  question: string
  type: 'yes_no' | 'slider'
  slider?: SliderConfig
  sliders?: SliderConfig[]
}

export interface PreferenceCategory {
  id: PreferenceId
  title: string
  description: string
  icon: string
  followUp?: SubQuestionConfig[]
}

/** Interest flag (swipe right = true, left = false). */
export interface InterestFlag {
  [key: string]: boolean
}

/** Slider value 0–100. */
export interface SliderValues {
  [key: string]: number
}

export interface PreferenceProfile {
  interests: InterestFlag
  sliders: SliderValues
  pairChoices?: PairChoices
  completedAt: number
}

const STORAGE_KEY = 'tripura_preference_profile'

/** Premium onboarding: always two options with images. User swipes or taps to choose. */
export const PREFERENCE_PAIRS: PreferencePair[] = [
  {
    id: 'evening',
    question: 'Wie verbringst du den Abend lieber?',
    left: {
      id: 'chill',
      title: 'Ruhige Abende',
      subtitle: 'Bar, Dinner, Aussicht',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
    },
    right: {
      id: 'nightlife',
      title: 'Nightlife',
      subtitle: 'Clubs, Partys, Musik',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    },
  },
  {
    id: 'dining',
    question: 'Wie isst du unterwegs am liebsten?',
    left: {
      id: 'street_food',
      title: 'Street Food & Casual',
      subtitle: 'Märkte, Imbiss, lokal',
      image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80',
    },
    right: {
      id: 'fine_dining',
      title: 'Restaurants & Fine Dining',
      subtitle: 'Ausgezeichnete Küche',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    },
  },
  {
    id: 'pace',
    question: 'Welches Tempo passt zu dir?',
    left: {
      id: 'adventure',
      title: 'Abenteuer & Action',
      subtitle: 'Wandern, Sport, Adrenalin',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
    },
    right: {
      id: 'culture',
      title: 'Kultur & Entdecken',
      subtitle: 'Museen, Architektur, Geschichte',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    },
  },
  {
    id: 'vibe',
    question: 'Was suchst du auf der Reise?',
    left: {
      id: 'relaxation',
      title: 'Erholung & Wellness',
      subtitle: 'Strand, Spa, Abschalten',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
    },
    right: {
      id: 'luxury',
      title: 'Luxus & Exklusiv',
      subtitle: 'Premium Hotels, besondere Erlebnisse',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    },
  },
  {
    id: 'budget_style',
    question: 'Wie reist du am liebsten?',
    left: {
      id: 'budget',
      title: 'Budget & Clever',
      subtitle: 'Preiswert, authentisch, flexibel',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
    },
    right: {
      id: 'comfort',
      title: 'Komfort & Qualität',
      subtitle: 'Mittelklasse bis Premium',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    },
  },
  {
    id: 'landscape',
    question: 'Wo fühlst du dich wohler?',
    left: {
      id: 'nature',
      title: 'Natur & Landschaft',
      subtitle: 'Berge, Seen, Weite',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    },
    right: {
      id: 'city',
      title: 'Stadt & Urban',
      subtitle: 'Shopping, Cafés, Straßen',
      image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80',
    },
  },
  {
    id: 'discovery',
    question: 'Wie entdeckst du ein Ziel?',
    left: {
      id: 'hidden_gems',
      title: 'Geheimtipps',
      subtitle: 'Off the beaten path, lokal',
      image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80',
    },
    right: {
      id: 'highlights',
      title: 'Highlights & Klassiker',
      subtitle: 'Must-sees, bekannte Spots',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    },
  },
  {
    id: 'food_style',
    question: 'Was steht bei dir im Mittelpunkt?',
    left: {
      id: 'foodie',
      title: 'Kulinarik',
      subtitle: 'Essen & Trinken erleben',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    },
    right: {
      id: 'activities',
      title: 'Aktivitäten',
      subtitle: 'Touren, Sport, Programm',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    },
  },
  {
    id: 'accommodation',
    question: 'Wo schläfst du lieber?',
    left: {
      id: 'unique',
      title: 'Besondere Unterkünfte',
      subtitle: 'Boutique, Design, lokal',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    },
    right: {
      id: 'reliable',
      title: 'Bekannte Ketten',
      subtitle: 'Zuverlässig, Standards',
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
    },
  },
  {
    id: 'group',
    question: 'Wie reist du am liebsten?',
    left: {
      id: 'solo_couple',
      title: 'Zu zweit oder alleine',
      subtitle: 'Ruhig, individuell',
      image: 'https://images.unsplash.com/photo-1529333248091-bdc993908f32?w=800&q=80',
    },
    right: {
      id: 'group',
      title: 'Mit Freunden oder Familie',
      subtitle: 'Gemeinsam unterwegs',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    },
  },
]

export const PREFERENCE_CATEGORIES: PreferenceCategory[] = [
  {
    id: 'party',
    title: 'Party & Nightlife',
    description: 'Clubs, bars, and evening vibes',
    icon: '🌙',
    followUp: [
      {
        id: 'party_energy',
        type: 'slider',
        question: 'How do you like your evenings?',
        slider: {
          id: 'party_energy',
          labelLeft: 'Chill evenings',
          labelRight: 'Full nightlife energy',
          defaultValue: 50,
        },
      },
    ],
  },
  {
    id: 'food',
    title: 'Food & Culinary',
    description: 'Local cuisine and dining experiences',
    icon: '🍽️',
    followUp: [
      {
        id: 'food_foodie',
        type: 'yes_no',
        question: 'Are you a foodie?',
      },
      {
        id: 'food_style',
        type: 'slider',
        question: 'Dining style',
        slider: {
          id: 'food_style',
          labelLeft: 'Fast & casual',
          labelRight: 'Fine dining',
          defaultValue: 50,
        },
      },
      {
        id: 'food_venue',
        type: 'slider',
        question: 'Where do you prefer to eat?',
        slider: {
          id: 'food_venue',
          labelLeft: 'Street food',
          labelRight: 'Michelin-style',
          defaultValue: 50,
        },
      },
    ],
  },
  {
    id: 'adventure',
    title: 'Adventure & Outdoor',
    description: 'Hiking, sports, and adrenaline',
    icon: '🏔️',
    followUp: [
      {
        id: 'adventure_intensity',
        type: 'slider',
        question: 'Activity level',
        slider: {
          id: 'adventure_intensity',
          labelLeft: 'Light activities',
          labelRight: 'Extreme adrenaline',
          defaultValue: 50,
        },
      },
    ],
  },
  {
    id: 'culture',
    title: 'Culture & Museums',
    description: 'Art, history, and local heritage',
    icon: '🏛️',
  },
  {
    id: 'relaxation',
    title: 'Relaxation & Wellness',
    description: 'Spas, beaches, and calm',
    icon: '🧘',
  },
  {
    id: 'luxury',
    title: 'Luxury Experiences',
    description: 'Premium stays and exclusive access',
    icon: '✨',
    followUp: [
      {
        id: 'luxury_level',
        type: 'slider',
        question: 'Comfort level',
        slider: {
          id: 'luxury_level',
          labelLeft: 'Comfort focused',
          labelRight: 'Ultra luxury',
          defaultValue: 50,
        },
      },
    ],
  },
  {
    id: 'budget',
    title: 'Budget Travel',
    description: 'Smart spending and value',
    icon: '💰',
  },
  {
    id: 'nature',
    title: 'Nature & Landscapes',
    description: 'Parks, views, and outdoors',
    icon: '🌲',
  },
  {
    id: 'shopping',
    title: 'Shopping',
    description: 'Local markets and boutiques',
    icon: '🛍️',
  },
  {
    id: 'hidden_gems',
    title: 'Hidden Gems',
    description: 'Local secrets and off-the-beaten-path',
    icon: '🔮',
  },
]

export function getStoredProfile(): PreferenceProfile | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PreferenceProfile
  } catch {
    return null
  }
}

export function saveProfile(profile: PreferenceProfile): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {}
}

export function hasCompletedOnboarding(): boolean {
  return getStoredProfile()?.completedAt != null
}

/**
 * Recommendation scoring – weights for algorithm use.
 * Interest = 1 or 0; sliders normalized 0–1.
 */
export function getRecommendationScores(profile: PreferenceProfile): Record<string, number> {
  const scores: Record<string, number> = {}
  for (const [key, value] of Object.entries(profile.interests)) {
    scores[key] = value ? 1 : 0
  }
  for (const [key, value] of Object.entries(profile.sliders ?? {})) {
    scores[key] = Math.max(0, Math.min(1, value / 100))
  }
  for (const [pairId, choice] of Object.entries(profile.pairChoices ?? {})) {
    const pair = PREFERENCE_PAIRS.find((p) => p.id === pairId)
    if (pair) {
      scores[pair.left.id] = choice === 'left' ? 1 : 0
      scores[pair.right.id] = choice === 'right' ? 1 : 0
    }
  }
  return scores
}
