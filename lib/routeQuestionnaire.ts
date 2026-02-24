/**
 * Route-Fragebogen: Tinder-Style Karten mit Fotos für die Route-Personalisierung.
 */

export interface RouteQuestionOption {
  id: string
  title: string
  subtitle?: string
  image: string
}

export interface RouteQuestion {
  id: string
  question: string
  left: RouteQuestionOption
  right: RouteQuestionOption
}

export type RouteChoice = 'left' | 'right' | 'both'

export interface RouteQuestionnaireAnswers {
  [questionId: string]: RouteChoice
}

export const ROUTE_QUESTIONS: RouteQuestion[] = [
  {
    id: 'pace',
    question: 'Wie möchtest du unterwegs sein? 🛤️',
    left: {
      id: 'relaxed',
      title: 'Entspannt',
      subtitle: 'Genug Pausen, nichts hetzen',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
    },
    right: {
      id: 'active',
      title: 'Aktiv',
      subtitle: 'Viel erleben, volles Programm',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
    },
  },
  {
    id: 'food',
    question: 'Worauf hast du Lust beim Essen? 🍽️',
    left: {
      id: 'local',
      title: 'Lokal & authentisch',
      subtitle: 'Street Food, Märkte, Tipps',
      image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80',
    },
    right: {
      id: 'fine',
      title: 'Restaurants & Abendessen',
      subtitle: 'Sitzen bleiben, genießen',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    },
  },
  {
    id: 'culture',
    question: 'Was zieht dich mehr an? 🌍',
    left: {
      id: 'nature',
      title: 'Natur & Landschaft',
      subtitle: 'Aussichten, Wandern, Draußen',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    },
    right: {
      id: 'city',
      title: 'Stadt & Kultur',
      subtitle: 'Museen, Architektur, Atmosphäre',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    },
  },
  {
    id: 'evening',
    question: 'Wie soll der Abend aussehen? 🌙',
    left: {
      id: 'chill',
      title: 'Ruhig ausklingen',
      subtitle: 'Bar, Aussicht, Gespräche',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
    },
    right: {
      id: 'nightlife',
      title: 'Nightlife',
      subtitle: 'Clubs, Musik, Feiern',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    },
  },
  {
    id: 'accommodation',
    question: 'Wo schläfst du am liebsten?',
    left: {
      id: 'boutique',
      title: 'Besondere Unterkünfte',
      subtitle: 'Design, lokal, Charakter',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    },
    right: {
      id: 'comfort',
      title: 'Komfort & Standard',
      subtitle: 'Zuverlässig, gut gelegen',
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
    },
  },
  {
    id: 'discovery',
    question: 'Wie entdeckst du ein Ziel? 🧭',
    left: {
      id: 'hidden',
      title: 'Geheimtipps',
      subtitle: 'Off the beaten path',
      image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80',
    },
    right: {
      id: 'highlights',
      title: 'Highlights',
      subtitle: 'Must-sees, Klassiker',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    },
  },
]
