import type {
  Trip,
  Activity,
  Restaurant,
  CreditCard,
  Insurance,
  Flight,
  CarRental,
  ESIM,
  WeatherForecast,
  QuestionnaireQuestion,
  AIRecommendation,
  UserPreferences,
} from '@/types';

// Mock User Preferences
export const mockUserPreferences: UserPreferences = {
  travelStyle: 'cultural',
  budgetLevel: 'moderate',
  activityIntensity: 'medium',
  dietaryRestrictions: ['vegetarian'],
  interests: ['museums', 'architecture', 'local cuisine', 'photography'],
};

// Questionnaire Questions
export const tripQuestionnaire: QuestionnaireQuestion[] = [
  {
    id: 'travel_style',
    type: 'swipe',
    question: 'Wie möchtest du reisen?',
    description: 'Wische nach rechts für ja, nach links für nein',
    category: 'mood',
    options: [
      { id: 'adventure', label: 'Abenteuer & Action', value: 'adventure', icon: 'Mountain' },
      { id: 'relaxation', label: 'Entspannung & Wellness', value: 'relaxation', icon: 'Spa' },
      { id: 'cultural', label: 'Kultur & Geschichte', value: 'cultural', icon: 'Landmark' },
      { id: 'foodie', label: 'Kulinarik & Essen', value: 'foodie', icon: 'Utensils' },
      { id: 'nature', label: 'Natur & Wandern', value: 'nature', icon: 'Trees' },
      { id: 'urban', label: 'Stadt & Nachtleben', value: 'urban', icon: 'Building2' },
    ],
  },
  {
    id: 'luxury',
    type: 'scale',
    question: 'Wie luxuriös soll die Reise sein?',
    description: 'Verschiebe den Regler zwischen Budget und Luxus',
    category: 'budget',
    scaleMin: 1,
    scaleMax: 5,
    scaleStep: 1,
    scaleLabels: ['Budget', 'Luxus'],
  },
  {
    id: 'budget',
    type: 'swipe',
    question: 'Was ist dir bei der Reise wichtig?',
    category: 'budget',
    options: [
      { id: 'budget', label: 'Sparsam unterwegs', value: 'budget', icon: 'Wallet' },
      { id: 'moderate', label: 'Mittelklasse', value: 'moderate', icon: 'CreditCard' },
      { id: 'luxury', label: 'Luxus-Reise', value: 'luxury', icon: 'Crown' },
    ],
  },
  {
    id: 'activity_intensity',
    type: 'swipe',
    question: 'Wie aktiv möchtest du sein?',
    category: 'activity',
    options: [
      { id: 'low', label: 'Entspannt', value: 'low', icon: 'Coffee' },
      { id: 'medium', label: 'Ausgewogen', value: 'medium', icon: 'Footprints' },
      { id: 'high', label: 'Volles Programm', value: 'high', icon: 'Zap' },
    ],
  },
  {
    id: 'food_preference',
    type: 'swipe',
    question: 'Was darf es zum Essen sein?',
    category: 'food',
    options: [
      { id: 'local', label: 'Lokale Küche', value: 'local', icon: 'MapPin' },
      { id: 'fine_dining', label: 'Fine Dining', value: 'fine_dining', icon: 'Star' },
      { id: 'street_food', label: 'Street Food', value: 'street_food', icon: 'Store' },
      { id: 'vegetarian', label: 'Vegetarisch/Vegan', value: 'vegetarian', icon: 'Leaf' },
    ],
  },
  {
    id: 'weather_preference',
    type: 'swipe',
    question: 'Wetter-Präferenz?',
    category: 'weather',
    options: [
      { id: 'sunny', label: 'Sonne & Strand', value: 'sunny', icon: 'Sun' },
      { id: 'mild', label: 'Mildes Klima', value: 'mild', icon: 'CloudSun' },
      { id: 'snow', label: 'Schnee & Winter', value: 'snow', icon: 'Snowflake' },
    ],
  },
];

// Orte für Zielsuche (Land + Stadt). Für echte Abdeckung aller Länder und jeder Stadt/Dorf: Places-API (z. B. Nominatim, Google Places) einbinden.
export const popularCities = [
  // Frankreich
  { id: 'paris', name: 'Paris', country: 'Frankreich' },
  { id: 'lyon', name: 'Lyon', country: 'Frankreich' },
  { id: 'marseille', name: 'Marseille', country: 'Frankreich' },
  { id: 'nizza', name: 'Nizza', country: 'Frankreich' },
  { id: 'bordeaux', name: 'Bordeaux', country: 'Frankreich' },
  { id: 'strasbourg', name: 'Straßburg', country: 'Frankreich' },
  { id: 'cannes', name: 'Cannes', country: 'Frankreich' },
  { id: 'toulouse', name: 'Toulouse', country: 'Frankreich' },
  // Spanien
  { id: 'barcelona', name: 'Barcelona', country: 'Spanien' },
  { id: 'madrid', name: 'Madrid', country: 'Spanien' },
  { id: 'sevilla', name: 'Sevilla', country: 'Spanien' },
  { id: 'valencia', name: 'Valencia', country: 'Spanien' },
  { id: 'bilbao', name: 'Bilbao', country: 'Spanien' },
  { id: 'malaga', name: 'Málaga', country: 'Spanien' },
  { id: 'granada', name: 'Granada', country: 'Spanien' },
  { id: 'palma', name: 'Palma de Mallorca', country: 'Spanien' },
  // Italien
  { id: 'rome', name: 'Rom', country: 'Italien' },
  { id: 'milan', name: 'Mailand', country: 'Italien' },
  { id: 'venice', name: 'Venedig', country: 'Italien' },
  { id: 'florence', name: 'Florenz', country: 'Italien' },
  { id: 'naples', name: 'Neapel', country: 'Italien' },
  { id: 'verona', name: 'Verona', country: 'Italien' },
  { id: 'bologna', name: 'Bologna', country: 'Italien' },
  { id: 'turin', name: 'Turin', country: 'Italien' },
  { id: 'palermo', name: 'Palermo', country: 'Italien' },
  // Portugal
  { id: 'lisbon', name: 'Lissabon', country: 'Portugal' },
  { id: 'porto', name: 'Porto', country: 'Portugal' },
  { id: 'faro', name: 'Faro', country: 'Portugal' },
  { id: 'funchal', name: 'Funchal', country: 'Portugal' },
  // Großbritannien
  { id: 'london', name: 'London', country: 'Großbritannien' },
  { id: 'edinburgh', name: 'Edinburgh', country: 'Großbritannien' },
  { id: 'manchester', name: 'Manchester', country: 'Großbritannien' },
  { id: 'birmingham', name: 'Birmingham', country: 'Großbritannien' },
  { id: 'liverpool', name: 'Liverpool', country: 'Großbritannien' },
  { id: 'bristol', name: 'Bristol', country: 'Großbritannien' },
  // Deutschland
  { id: 'berlin', name: 'Berlin', country: 'Deutschland' },
  { id: 'munich', name: 'München', country: 'Deutschland' },
  { id: 'hamburg', name: 'Hamburg', country: 'Deutschland' },
  { id: 'cologne', name: 'Köln', country: 'Deutschland' },
  { id: 'frankfurt', name: 'Frankfurt', country: 'Deutschland' },
  { id: 'leipzig', name: 'Leipzig', country: 'Deutschland' },
  { id: 'dresden', name: 'Dresden', country: 'Deutschland' },
  { id: 'nuremberg', name: 'Nürnberg', country: 'Deutschland' },
  { id: 'stuttgart', name: 'Stuttgart', country: 'Deutschland' },
  { id: 'heidelberg', name: 'Heidelberg', country: 'Deutschland' },
  // Niederlande
  { id: 'amsterdam', name: 'Amsterdam', country: 'Niederlande' },
  { id: 'rotterdam', name: 'Rotterdam', country: 'Niederlande' },
  { id: 'utrecht', name: 'Utrecht', country: 'Niederlande' },
  { id: 'haarlem', name: 'Haarlem', country: 'Niederlande' },
  // Belgien
  { id: 'brussels', name: 'Brüssel', country: 'Belgien' },
  { id: 'bruges', name: 'Brügge', country: 'Belgien' },
  { id: 'antwerp', name: 'Antwerpen', country: 'Belgien' },
  { id: 'ghent', name: 'Gent', country: 'Belgien' },
  // Österreich
  { id: 'vienna', name: 'Wien', country: 'Österreich' },
  { id: 'salzburg', name: 'Salzburg', country: 'Österreich' },
  { id: 'innsbruck', name: 'Innsbruck', country: 'Österreich' },
  { id: 'graz', name: 'Graz', country: 'Österreich' },
  // Schweiz
  { id: 'zurich', name: 'Zürich', country: 'Schweiz' },
  { id: 'interlaken', name: 'Interlaken', country: 'Schweiz' },
  { id: 'geneva', name: 'Genf', country: 'Schweiz' },
  { id: 'lucerne', name: 'Luzern', country: 'Schweiz' },
  { id: 'bern', name: 'Bern', country: 'Schweiz' },
  { id: 'zermatt', name: 'Zermatt', country: 'Schweiz' },
  // Tschechien, Polen, Ungarn
  { id: 'prague', name: 'Prag', country: 'Tschechien' },
  { id: 'cesky', name: 'Český Krumlov', country: 'Tschechien' },
  { id: 'brno', name: 'Brno', country: 'Tschechien' },
  { id: 'warsaw', name: 'Warschau', country: 'Polen' },
  { id: 'krakow', name: 'Krakau', country: 'Polen' },
  { id: 'gdansk', name: 'Danzig', country: 'Polen' },
  { id: 'wroclaw', name: 'Breslau', country: 'Polen' },
  { id: 'budapest', name: 'Budapest', country: 'Ungarn' },
  { id: 'eger', name: 'Eger', country: 'Ungarn' },
  { id: 'pecs', name: 'Pécs', country: 'Ungarn' },
  // Kroatien, Griechenland
  { id: 'dubrovnik', name: 'Dubrovnik', country: 'Kroatien' },
  { id: 'split', name: 'Split', country: 'Kroatien' },
  { id: 'zagreb', name: 'Zagreb', country: 'Kroatien' },
  { id: 'zadar', name: 'Zadar', country: 'Kroatien' },
  { id: 'athens', name: 'Athen', country: 'Griechenland' },
  { id: 'santorini', name: 'Santorini', country: 'Griechenland' },
  { id: 'mykonos', name: 'Mykonos', country: 'Griechenland' },
  { id: 'thessaloniki', name: 'Thessaloniki', country: 'Griechenland' },
  { id: 'crete', name: 'Kreta', country: 'Griechenland' },
  // Skandinavien
  { id: 'copenhagen', name: 'Kopenhagen', country: 'Dänemark' },
  { id: 'aarhus', name: 'Aarhus', country: 'Dänemark' },
  { id: 'stockholm', name: 'Stockholm', country: 'Schweden' },
  { id: 'gothenburg', name: 'Göteborg', country: 'Schweden' },
  { id: 'malmo', name: 'Malmö', country: 'Schweden' },
  { id: 'oslo', name: 'Oslo', country: 'Norwegen' },
  { id: 'bergen', name: 'Bergen', country: 'Norwegen' },
  { id: 'helsinki', name: 'Helsinki', country: 'Finnland' },
  { id: 'turku', name: 'Turku', country: 'Finnland' },
  { id: 'reykjavik', name: 'Reykjavík', country: 'Island' },
  // Irland, Luxemburg
  { id: 'dublin', name: 'Dublin', country: 'Irland' },
  { id: 'galway', name: 'Galway', country: 'Irland' },
  { id: 'cork', name: 'Cork', country: 'Irland' },
  { id: 'luxembourg', name: 'Luxemburg', country: 'Luxemburg' },
  // Türkei, Zypern
  { id: 'istanbul', name: 'Istanbul', country: 'Türkei' },
  { id: 'antalya', name: 'Antalya', country: 'Türkei' },
  { id: 'izmir', name: 'Izmir', country: 'Türkei' },
  { id: 'bodrum', name: 'Bodrum', country: 'Türkei' },
  { id: 'nicosia', name: 'Nikosia', country: 'Zypern' },
  { id: 'limassol', name: 'Limassol', country: 'Zypern' },
  // USA, Kanada
  { id: 'newyork', name: 'New York', country: 'USA' },
  { id: 'losangeles', name: 'Los Angeles', country: 'USA' },
  { id: 'miami', name: 'Miami', country: 'USA' },
  { id: 'sanfrancisco', name: 'San Francisco', country: 'USA' },
  { id: 'lasvegas', name: 'Las Vegas', country: 'USA' },
  { id: 'chicago', name: 'Chicago', country: 'USA' },
  { id: 'boston', name: 'Boston', country: 'USA' },
  { id: 'toronto', name: 'Toronto', country: 'Kanada' },
  { id: 'vancouver', name: 'Vancouver', country: 'Kanada' },
  { id: 'montreal', name: 'Montreal', country: 'Kanada' },
  { id: 'quebec', name: 'Québec', country: 'Kanada' },
  // Japan, China, Thailand, Vietnam
  { id: 'tokyo', name: 'Tokio', country: 'Japan' },
  { id: 'osaka', name: 'Osaka', country: 'Japan' },
  { id: 'kyoto', name: 'Kyoto', country: 'Japan' },
  { id: 'hiroshima', name: 'Hiroshima', country: 'Japan' },
  { id: 'beijing', name: 'Peking', country: 'China' },
  { id: 'shanghai', name: 'Shanghai', country: 'China' },
  { id: 'hongkong', name: 'Hongkong', country: 'China' },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand' },
  { id: 'phuket', name: 'Phuket', country: 'Thailand' },
  { id: 'chiangmai', name: 'Chiang Mai', country: 'Thailand' },
  { id: 'hanoi', name: 'Hanoi', country: 'Vietnam' },
  { id: 'hochiminh', name: 'Ho-Chi-Minh-Stadt', country: 'Vietnam' },
  { id: 'danang', name: 'Da Nang', country: 'Vietnam' },
  // Australien, Neuseeland
  { id: 'sydney', name: 'Sydney', country: 'Australien' },
  { id: 'melbourne', name: 'Melbourne', country: 'Australien' },
  { id: 'cairns', name: 'Cairns', country: 'Australien' },
  { id: 'auckland', name: 'Auckland', country: 'Neuseeland' },
  { id: 'wellington', name: 'Wellington', country: 'Neuseeland' },
  { id: 'queenstown', name: 'Queenstown', country: 'Neuseeland' },
  // Brasilien, Mexiko, Argentinien
  { id: 'riodejaneiro', name: 'Rio de Janeiro', country: 'Brasilien' },
  { id: 'saopaulo', name: 'São Paulo', country: 'Brasilien' },
  { id: 'salvador', name: 'Salvador', country: 'Brasilien' },
  { id: 'mexicocity', name: 'Mexiko-Stadt', country: 'Mexiko' },
  { id: 'cancun', name: 'Cancún', country: 'Mexiko' },
  { id: 'tulum', name: 'Tulum', country: 'Mexiko' },
  { id: 'buenosaires', name: 'Buenos Aires', country: 'Argentinien' },
  { id: 'ushuaia', name: 'Ushuaia', country: 'Argentinien' },
  // Marokko, Ägypten, Südafrika
  { id: 'marrakech', name: 'Marrakesch', country: 'Marokko' },
  { id: 'fes', name: 'Fès', country: 'Marokko' },
  { id: 'casablanca', name: 'Casablanca', country: 'Marokko' },
  { id: 'cairo', name: 'Kairo', country: 'Ägypten' },
  { id: 'hurghada', name: 'Hurghada', country: 'Ägypten' },
  { id: 'luxor', name: 'Luxor', country: 'Ägypten' },
  { id: 'capetown', name: 'Kapstadt', country: 'Südafrika' },
  { id: 'johannesburg', name: 'Johannesburg', country: 'Südafrika' },
  // UAE, Indien
  { id: 'dubai', name: 'Dubai', country: 'Vereinigte Arabische Emirate' },
  { id: 'abudhabi', name: 'Abu Dhabi', country: 'Vereinigte Arabische Emirate' },
  { id: 'mumbai', name: 'Mumbai', country: 'Indien' },
  { id: 'delhi', name: 'Delhi', country: 'Indien' },
  { id: 'goa', name: 'Goa', country: 'Indien' },
  { id: 'jaipur', name: 'Jaipur', country: 'Indien' },
  // Russland, Ukraine (Städte für Suche)
  { id: 'moscow', name: 'Moskau', country: 'Russland' },
  { id: 'saintpetersburg', name: 'Sankt Petersburg', country: 'Russland' },
  { id: 'kyiv', name: 'Kiew', country: 'Ukraine' },
  { id: 'lviv', name: 'Lwiw', country: 'Ukraine' },
  // Rumänien, Bulgarien, Serbien
  { id: 'bucharest', name: 'Bukarest', country: 'Rumänien' },
  { id: 'brasov', name: 'Brașov', country: 'Rumänien' },
  { id: 'sofia', name: 'Sofia', country: 'Bulgarien' },
  { id: 'plovdiv', name: 'Plowdiw', country: 'Bulgarien' },
  { id: 'belgrade', name: 'Belgrad', country: 'Serbien' },
  { id: 'novisad', name: 'Novi Sad', country: 'Serbien' },
  // Malta, Slowenien, Slowakei
  { id: 'valletta', name: 'Valletta', country: 'Malta' },
  { id: 'ljubljana', name: 'Ljubljana', country: 'Slowenien' },
  { id: 'bled', name: 'Bled', country: 'Slowenien' },
  { id: 'bratislava', name: 'Bratislava', country: 'Slowakei' },
  { id: 'kosice', name: 'Košice', country: 'Slowakei' },
] as const;

// Trends (was viele buchen) – für Plan-Seite (Stadt-Fotos von Unsplash)
export const mockTrendBookings = [
  { id: 't1', title: 'Lissabon 5 Tage', subtitle: 'Stadt & Strand', price: 429, image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400&h=280&fit=crop', bookings: '2.4k gebucht' },
  { id: 't2', title: 'Barcelona Kurztrip', subtitle: 'Kultur & Nachtleben', price: 389, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=280&fit=crop', bookings: '1.9k gebucht' },
  { id: 't3', title: 'Kroatien Küste', subtitle: 'Adria & Inseln', price: 549, image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=400&h=280&fit=crop', bookings: '3.1k gebucht' },
];

// Aktuell günstigste Reisen – für Plan-Seite (immer 3, Stadt-Fotos)
export const mockCheapestTrips = [
  { id: 'c1', title: 'Prag 3 Tage', subtitle: 'Flug + Hotel', price: 199, image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&h=280&fit=crop' },
  { id: 'c2', title: 'Budapest Wochenende', subtitle: 'Kultur & Thermal', price: 249, image: 'https://images.unsplash.com/photo-1555238325-6863e43f9e6f?w=400&h=280&fit=crop' },
  { id: 'c3', title: 'Porto 4 Nächte', subtitle: 'Wein & Altstadt', price: 279, image: 'https://images.unsplash.com/photo-1555881400-74d7eac7d12b?w=400&h=280&fit=crop' },
];

// Daily Questionnaire
export const dailyQuestionnaire: QuestionnaireQuestion[] = [
  {
    id: 'mood_today',
    type: 'swipe',
    question: 'Wie fühlst du dich heute?',
    category: 'mood',
    options: [
      { id: 'energetic', label: 'Voller Energie', value: 'energetic', icon: 'Zap' },
      { id: 'relaxed', label: 'Entspannt', value: 'relaxed', icon: 'Coffee' },
      { id: 'curious', label: 'Neugierig', value: 'curious', icon: 'Search' },
      { id: 'tired', label: 'Müde', value: 'tired', icon: 'Moon' },
    ],
  },
  {
    id: 'food_mood',
    type: 'swipe',
    question: 'Was hast du Lust zu essen?',
    category: 'food',
    options: [
      { id: 'quick', label: 'Schnell & Einfach', value: 'quick', icon: 'Timer' },
      { id: 'fancy', label: 'Ausgefallen', value: 'fancy', icon: 'Sparkles' },
      { id: 'healthy', label: 'Gesund', value: 'healthy', icon: 'Apple' },
      { id: 'indulgent', label: 'Schlemmen', value: 'indulgent', icon: 'Cake' },
    ],
  },
  {
    id: 'activity_type',
    type: 'swipe',
    question: 'Was möchtest du erleben?',
    category: 'activity',
    options: [
      { id: 'indoor', label: 'Drinnen', value: 'indoor', icon: 'Home' },
      { id: 'outdoor', label: 'Draußen', value: 'outdoor', icon: 'Sun' },
      { id: 'active', label: 'Sportlich', value: 'active', icon: 'Dumbbell' },
      { id: 'cultural', label: 'Kulturell', value: 'cultural', icon: 'Palette' },
    ],
  },
];

// Mock Activities
export const mockActivities: Activity[] = [
  {
    id: '1',
    name: 'Eiffelturm Besichtigung',
    description: 'Genieße den atemberaubenden Blick über Paris vom berühmtesten Wahrzeichen der Stadt.',
    location: {
      id: 'loc1',
      name: 'Eiffelturm',
      lat: 48.8584,
      lng: 2.2945,
      address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
      type: 'landmark',
    },
    duration: 120,
    price: 25,
    currency: 'EUR',
    category: 'sightseeing',
    rating: 4.7,
    reviewCount: 125000,
    weatherRating: {
      score: 9,
      condition: 'excellent',
      temperature: 22,
      precipitation: 0,
      recommendation: 'Perfektes Wetter für einen Besuch!',
    },
    images: ['https://picsum.photos/800/600'],
    openingHours: {
      monday: '09:00 - 23:45',
      tuesday: '09:00 - 23:45',
      wednesday: '09:00 - 23:45',
      thursday: '09:00 - 23:45',
      friday: '09:00 - 23:45',
      saturday: '09:00 - 23:45',
      sunday: '09:00 - 23:45',
    },
  },
  {
    id: '2',
    name: 'Louvre Museum',
    description: 'Entdecke die größte Kunstsammlung der Welt, inklusive der Mona Lisa.',
    location: {
      id: 'loc2',
      name: 'Louvre Museum',
      lat: 48.8606,
      lng: 2.3376,
      address: 'Rue de Rivoli, 75001 Paris',
      type: 'activity',
    },
    duration: 180,
    price: 17,
    currency: 'EUR',
    category: 'museum',
    rating: 4.8,
    reviewCount: 89000,
    weatherRating: {
      score: 10,
      condition: 'excellent',
      temperature: 20,
      precipitation: 0,
      recommendation: 'Ideale Indoor-Aktivität für jedes Wetter.',
    },
    images: ['https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800'],
    openingHours: {
      monday: '09:00 - 18:00',
      wednesday: '09:00 - 18:00',
      thursday: '09:00 - 18:00',
      friday: '09:00 - 18:00',
      saturday: '09:00 - 18:00',
      sunday: '09:00 - 18:00',
    },
  },
  {
    id: '3',
    name: 'Seine Bootstour',
    description: 'Erlebe Paris von der Wasserseite aus mit einer romantischen Bootstour.',
    location: {
      id: 'loc3',
      name: 'Pont de la Concorde',
      lat: 48.8656,
      lng: 2.3212,
      address: 'Pont de la Concorde, 75008 Paris',
      type: 'activity',
    },
    duration: 60,
    price: 15,
    currency: 'EUR',
    category: 'cruise',
    rating: 4.5,
    reviewCount: 45000,
    weatherRating: {
      score: 7,
      condition: 'good',
      temperature: 22,
      precipitation: 10,
      recommendation: 'Gutes Wetter, aber bring eine Jacke mit.',
    },
    images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'],
    openingHours: {
      monday: '10:00 - 22:00',
      tuesday: '10:00 - 22:00',
      wednesday: '10:00 - 22:00',
      thursday: '10:00 - 22:00',
      friday: '10:00 - 22:00',
      saturday: '10:00 - 22:00',
      sunday: '10:00 - 22:00',
    },
  },
  {
    id: '4',
    name: 'Montmartre Spaziergang',
    description: 'Erkunde das künstlerische Viertel mit dem Sacré-Cœur Basilika.',
    location: {
      id: 'loc4',
      name: 'Montmartre',
      lat: 48.8867,
      lng: 2.3431,
      address: 'Montmartre, 75018 Paris',
      type: 'landmark',
    },
    duration: 150,
    price: 0,
    currency: 'EUR',
    category: 'walking',
    rating: 4.6,
    reviewCount: 67000,
    weatherRating: {
      score: 8,
      condition: 'good',
      temperature: 21,
      precipitation: 5,
      recommendation: 'Schönes Wetter für einen Spaziergang.',
    },
    images: ['https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800'],
    openingHours: {
      monday: '00:00 - 23:59',
      tuesday: '00:00 - 23:59',
      wednesday: '00:00 - 23:59',
      thursday: '00:00 - 23:59',
      friday: '00:00 - 23:59',
      saturday: '00:00 - 23:59',
      sunday: '00:00 - 23:59',
    },
  },
  {
    id: '5',
    name: 'Kochkurs: Französische Küche',
    description: 'Lerne von einem Profi-Koch, wie man authentische französische Gerichte zubereitet.',
    location: {
      id: 'loc5',
      name: 'Le Cordon Bleu',
      lat: 48.8545,
      lng: 2.3042,
      address: '13-15 Quai André Citroën, 75015 Paris',
      type: 'activity',
    },
    duration: 180,
    price: 89,
    currency: 'EUR',
    category: 'cooking',
    rating: 4.9,
    reviewCount: 2300,
    weatherRating: {
      score: 10,
      condition: 'excellent',
      temperature: 20,
      precipitation: 0,
      recommendation: 'Perfekte Indoor-Aktivität.',
    },
    images: ['https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800'],
    openingHours: {
      monday: '09:00 - 17:00',
      tuesday: '09:00 - 17:00',
      wednesday: '09:00 - 17:00',
      thursday: '09:00 - 17:00',
      friday: '09:00 - 17:00',
    },
  },
];

// Mock Restaurants
export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Le Petit Bistro',
    cuisine: 'Französisch',
    location: {
      id: 'rloc1',
      name: 'Le Petit Bistro',
      lat: 48.8565,
      lng: 2.3522,
      address: '12 Rue de la Paix, 75002 Paris',
      type: 'restaurant',
    },
    rating: 4.6,
    reviewCount: 1200,
    priceLevel: 3,
    dietaryOptions: ['vegetarian', 'gluten-free'],
    images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'],
    openingHours: {
      monday: '12:00 - 14:30, 19:00 - 22:30',
      tuesday: '12:00 - 14:30, 19:00 - 22:30',
      wednesday: '12:00 - 14:30, 19:00 - 22:30',
      thursday: '12:00 - 14:30, 19:00 - 22:30',
      friday: '12:00 - 14:30, 19:00 - 23:00',
      saturday: '12:00 - 14:30, 19:00 - 23:00',
      sunday: '12:00 - 14:30, 19:00 - 22:00',
    },
  },
  {
    id: '2',
    name: 'L\'As du Fallafel',
    cuisine: 'Mittelöstlich',
    location: {
      id: 'rloc2',
      name: 'L\'As du Fallafel',
      lat: 48.8574,
      lng: 2.3587,
      address: '34 Rue des Rosiers, 75004 Paris',
      type: 'restaurant',
    },
    rating: 4.5,
    reviewCount: 5600,
    priceLevel: 1,
    dietaryOptions: ['vegetarian', 'vegan', 'kosher'],
    images: ['https://images.unsplash.com/photo-1561651823-34a0658ebc9d?w=800'],
    openingHours: {
      sunday: '11:00 - 22:00',
      monday: '11:00 - 22:00',
      tuesday: '11:00 - 22:00',
      wednesday: '11:00 - 22:00',
      thursday: '11:00 - 22:00',
      friday: '11:00 - 15:00',
    },
  },
  {
    id: '3',
    name: 'Septime',
    cuisine: 'Modern Französisch',
    location: {
      id: 'rloc3',
      name: 'Septime',
      lat: 48.8534,
      lng: 2.3841,
      address: '80 Rue de Charonne, 75011 Paris',
      type: 'restaurant',
    },
    rating: 4.8,
    reviewCount: 890,
    priceLevel: 4,
    dietaryOptions: ['vegetarian', 'pescatarian'],
    images: ['https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?w=800'],
    openingHours: {
      tuesday: '12:30 - 14:00, 19:30 - 22:00',
      wednesday: '12:30 - 14:00, 19:30 - 22:00',
      thursday: '12:30 - 14:00, 19:30 - 22:00',
      friday: '12:30 - 14:00, 19:30 - 22:00',
    },
  },
  {
    id: '4',
    name: 'Café de Flore',
    cuisine: 'Café & Bistrò',
    location: {
      id: 'rloc4',
      name: 'Café de Flore',
      lat: 48.8541,
      lng: 2.3328,
      address: '172 Boulevard Saint-Germain, 75006 Paris',
      type: 'restaurant',
    },
    rating: 4.3,
    reviewCount: 7800,
    priceLevel: 3,
    dietaryOptions: ['vegetarian', 'vegan'],
    images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800'],
    openingHours: {
      monday: '07:30 - 01:30',
      tuesday: '07:30 - 01:30',
      wednesday: '07:30 - 01:30',
      thursday: '07:30 - 01:30',
      friday: '07:30 - 01:30',
      saturday: '07:30 - 01:30',
      sunday: '07:30 - 01:30',
    },
  },
];

// Mock Credit Cards
export const mockCreditCards: CreditCard[] = [
  {
    id: '1',
    name: 'N26 You',
    issuer: 'N26',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    benefits: [
      'Keine Auslandsgebühren',
      'Kostenlose Bargeldabhebungen weltweit',
      'Reiseversicherung inklusive',
      'Partnerkarten verfügbar',
    ],
    foreignTransactionFee: 0,
    rewardsRate: '0% Cashback',
    annualFee: 0,
    recommendedFor: ['Europa', 'Weltweit'],
    applyUrl: 'https://n26.com',
  },
  {
    id: '2',
    name: 'Amex Platinum',
    issuer: 'American Express',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
    benefits: [
      'Lounge-Zugang weltweit',
      'Hotel-Status-Upgrades',
      'Umfassende Reiseversicherung',
      'Concierge-Service',
    ],
    foreignTransactionFee: 0,
    rewardsRate: '1 Punkt pro €',
    annualFee: 660,
    recommendedFor: ['Luxus-Reisen', 'Business'],
    applyUrl: 'https://americanexpress.com',
  },
  {
    id: '3',
    name: 'Revolut Metal',
    issuer: 'Revolut',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
    benefits: [
      'Unbegrenzte kostenlose Wechselkurse',
      'Cashback bis zu 1%',
      'Lounge-Zugang bei Flugverspätung',
      'Kryptowährungs-Trading',
    ],
    foreignTransactionFee: 0,
    rewardsRate: 'bis 1% Cashback',
    annualFee: 155,
    recommendedFor: ['Digitale Nomaden', 'Fintech-Fans'],
    applyUrl: 'https://revolut.com',
  },
];

// Mock Insurance
export const mockInsurance: Insurance[] = [
  {
    id: '1',
    name: 'World Traveller',
    provider: 'Allianz',
    type: 'travel',
    coverage: [
      'Krankenversicherung bis 1 Mio. €',
      'Reiserücktritt bis 10.000 €',
      'Gepäckversicherung',
      'Flugverspätungsschutz',
    ],
    pricePerDay: 3.5,
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400',
    bookUrl: 'https://allianz.de',
  },
  {
    id: '2',
    name: 'Premium Care',
    provider: 'HanseMerkur',
    type: 'health',
    coverage: [
      'Unbegrenzte Krankenversicherung',
      'Rücktransport inklusive',
      'Sporthazard-Deckung',
      'Vorversicherungsschutz',
    ],
    pricePerDay: 4.9,
    currency: 'EUR',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400',
    bookUrl: 'https://hansemerkur.de',
  },
];

// Flughäfen (Koordinaten) für Abstand zum Standort
export const AIRPORTS = [
  { code: 'FRA', city: 'Frankfurt', lat: 50.0379, lng: 8.5622 },
  { code: 'MUC', city: 'München', lat: 48.3538, lng: 11.7751 },
  { code: 'BER', city: 'Berlin', lat: 52.3667, lng: 13.5033 },
  { code: 'DUS', city: 'Düsseldorf', lat: 51.2895, lng: 6.7668 },
  { code: 'HAM', city: 'Hamburg', lat: 53.6304, lng: 9.9882 },
  { code: 'STR', city: 'Stuttgart', lat: 48.6899, lng: 9.2219 },
  { code: 'CGN', city: 'Köln/Bonn', lat: 50.8659, lng: 7.1427 },
] as const;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Nächsten Flughafen zum Standort (lat/lng) ermitteln. Fallback: FRA wenn keine Position. */
export function getNearestAirportCode(lat: number | null, lng: number | null): string {
  if (lat == null || lng == null) return 'FRA';
  let nearest: (typeof AIRPORTS)[number] = AIRPORTS[0];
  let minDist = haversineKm(lat, lng, nearest.lat, nearest.lng);
  for (let i = 1; i < AIRPORTS.length; i++) {
    const d = haversineKm(lat, lng, AIRPORTS[i].lat, AIRPORTS[i].lng);
    if (d < minDist) {
      minDist = d;
      nearest = AIRPORTS[i];
    }
  }
  return nearest.code;
}

export type FlightWithLabel = Flight & { label?: 'nearest' | 'cheaper_alternative' | 'other' };

/** Flüge sortieren: zuerst günstigere Alternativen (anderer Flughafen), dann vom nächsten Flughafen, dann Rest. */
export function sortFlightsByNearestAndCheapest(
  flights: Flight[],
  nearestAirportCode: string
): FlightWithLabel[] {
  const cheapestFromNearest = Math.min(
    ...flights.filter((f) => f.departure.airport === nearestAirportCode).map((f) => f.price),
    Infinity
  );
  if (cheapestFromNearest === Infinity) {
    return flights.map((f) => ({ ...f, label: 'other' as const }));
  }
  const result: FlightWithLabel[] = [];
  const fromOthers = flights.filter((f) => f.departure.airport !== nearestAirportCode);
  const cheaperAlternatives = fromOthers.filter((f) => f.price < cheapestFromNearest).sort((a, b) => a.price - b.price);
  const fromNearest = flights.filter((f) => f.departure.airport === nearestAirportCode).sort((a, b) => a.price - b.price);
  const otherFlights = fromOthers.filter((f) => f.price >= cheapestFromNearest).sort((a, b) => a.price - b.price);
  cheaperAlternatives.forEach((f) => result.push({ ...f, label: 'cheaper_alternative' }));
  fromNearest.forEach((f) => result.push({ ...f, label: 'nearest' }));
  otherFlights.forEach((f) => result.push({ ...f, label: 'other' }));
  return result;
}

// Mock Flights (verschiedene Abflugorte, damit nächster Flughafen + günstigere Alternativen vorkommen)
export const mockFlights: Flight[] = [
  {
    id: '1',
    airline: 'Lufthansa',
    flightNumber: 'LH1001',
    departure: {
      airport: 'FRA',
      city: 'Frankfurt',
      time: new Date('2024-06-15T08:30:00'),
      terminal: '1',
    },
    arrival: {
      airport: 'CDG',
      city: 'Paris',
      time: new Date('2024-06-15T09:45:00'),
      terminal: '2F',
    },
    price: 189,
    currency: 'EUR',
    class: 'economy',
    stops: 0,
    duration: 75,
    bookUrl: 'https://lufthansa.com',
  },
  {
    id: '2',
    airline: 'Air France',
    flightNumber: 'AF1009',
    departure: {
      airport: 'MUC',
      city: 'München',
      time: new Date('2024-06-15T10:15:00'),
      terminal: '2',
    },
    arrival: {
      airport: 'CDG',
      city: 'Paris',
      time: new Date('2024-06-15T12:00:00'),
      terminal: '2F',
    },
    price: 245,
    currency: 'EUR',
    class: 'business',
    stops: 0,
    duration: 105,
    bookUrl: 'https://airfrance.com',
  },
  {
    id: '3',
    airline: 'Eurowings',
    flightNumber: 'EW1234',
    departure: {
      airport: 'MUC',
      city: 'München',
      time: new Date('2024-06-15T06:50:00'),
      terminal: '2',
    },
    arrival: {
      airport: 'CDG',
      city: 'Paris',
      time: new Date('2024-06-15T08:20:00'),
      terminal: '2F',
    },
    price: 149,
    currency: 'EUR',
    class: 'economy',
    stops: 0,
    duration: 90,
    bookUrl: 'https://eurowings.com',
  },
  {
    id: '4',
    airline: 'Lufthansa',
    flightNumber: 'LH1005',
    departure: {
      airport: 'BER',
      city: 'Berlin',
      time: new Date('2024-06-15T07:00:00'),
      terminal: '1',
    },
    arrival: {
      airport: 'CDG',
      city: 'Paris',
      time: new Date('2024-06-15T09:10:00'),
      terminal: '2F',
    },
    price: 129,
    currency: 'EUR',
    class: 'economy',
    stops: 0,
    duration: 130,
    bookUrl: 'https://lufthansa.com',
  },
];

/** Hilfsfunktion: Flugdauer in Minuten → "1h 15min" */
export function formatFlightDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} Min`;
  if (m === 0) return `${h} h`;
  return `${h}h ${m}min`;
}

/** Rückflüge (z. B. Paris → Deutschland) */
export const mockReturnFlights: Flight[] = [
  {
    id: 'ret1',
    airline: 'Lufthansa',
    flightNumber: 'LH1002',
    departure: {
      airport: 'CDG',
      city: 'Paris',
      time: new Date('2024-06-22T14:00:00'),
      terminal: '2F',
    },
    arrival: {
      airport: 'FRA',
      city: 'Frankfurt',
      time: new Date('2024-06-22T15:30:00'),
      terminal: '1',
    },
    price: 165,
    currency: 'EUR',
    class: 'economy',
    stops: 0,
    duration: 90,
    bookUrl: 'https://lufthansa.com',
  },
  {
    id: 'ret2',
    airline: 'Air France',
    flightNumber: 'AF1010',
    departure: {
      airport: 'CDG',
      city: 'Paris',
      time: new Date('2024-06-22T18:20:00'),
      terminal: '2F',
    },
    arrival: {
      airport: 'MUC',
      city: 'München',
      time: new Date('2024-06-22T19:50:00'),
      terminal: '2',
    },
    price: 199,
    currency: 'EUR',
    class: 'economy',
    stops: 0,
    duration: 90,
    bookUrl: 'https://airfrance.com',
  },
];

// Mock Car Rentals
export const mockCarRentals: CarRental[] = [
  {
    id: '1',
    company: 'Sixt',
    carModel: 'BMW 3 Series',
    carType: 'sedan',
    pricePerDay: 65,
    currency: 'EUR',
    features: ['Automatik', 'GPS', 'Klimaanlage', '5 Sitze'],
    image: 'https://images.unsplash.com/photo-1555215695-3004980adade?w=400',
    pickupLocation: {
      id: 'car1',
      name: 'CDG Airport',
      lat: 49.0097,
      lng: 2.5479,
      address: 'Roissy Charles de Gaulle, 95700 Roissy-en-France',
      type: 'transport',
    },
    dropoffLocation: {
      id: 'car2',
      name: 'CDG Airport',
      lat: 49.0097,
      lng: 2.5479,
      address: 'Roissy Charles de Gaulle, 95700 Roissy-en-France',
      type: 'transport',
    },
    bookUrl: 'https://sixt.com',
  },
  {
    id: '2',
    company: 'Hertz',
    carModel: 'Peugeot 208',
    carType: 'compact',
    pricePerDay: 35,
    currency: 'EUR',
    features: ['Schaltgetriebe', 'Klimaanlage', '5 Sitze', 'Sparsam'],
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
    pickupLocation: {
      id: 'car3',
      name: 'Gare du Nord',
      lat: 48.8809,
      lng: 2.3553,
      address: '18 Rue de Dunkerque, 75010 Paris',
      type: 'transport',
    },
    dropoffLocation: {
      id: 'car4',
      name: 'Gare du Nord',
      lat: 48.8809,
      lng: 2.3553,
      address: '18 Rue de Dunkerque, 75010 Paris',
      type: 'transport',
    },
    bookUrl: 'https://hertz.com',
  },
];

// Mock eSIMs (pro Land/Region mit Vorteilen)
export const mockEsims: ESIM[] = [
  { id: 'e1', provider: 'Airalo', region: 'Frankreich', dataGB: 5, validityDays: 7, price: 4.50, currency: 'EUR', features: ['5G/LTE', 'Lokale Nummer optional', 'Sofort aktivierbar'], bookUrl: 'https://airalo.com' },
  { id: 'e2', provider: 'Holafly', region: 'Spanien & Portugal', dataGB: 6, validityDays: 15, price: 34, currency: 'EUR', features: ['Unbegrenzte Daten', '1 eSIM für gesamten Trip', 'Kein Speed-Limit'], bookUrl: 'https://holafly.com' },
  { id: 'e3', provider: 'Nomad', region: 'Italien', dataGB: 10, validityDays: 14, price: 18, currency: 'EUR', features: ['4G LTE', 'Schnelle Aktivierung', 'Gute Abdeckung'], bookUrl: 'https://nomad.com' },
  { id: 'e4', provider: 'eSIM Go', region: 'Europa (30+ Länder)', dataGB: 5, validityDays: 7, price: 5, currency: 'EUR', features: ['Pay-as-you-go', 'Viele Regionen', 'Günstige Preise'], bookUrl: 'https://esimgo.com' },
  { id: 'e5', provider: 'Airalo', region: 'USA & Kanada', dataGB: 6, validityDays: 15, price: 29, currency: 'EUR', features: ['5G', 'Unbegrenzt in vielen Tarifen', 'Lokale Nummer'], bookUrl: 'https://airalo.com' },
  { id: 'e6', provider: 'Holafly', region: 'Japan', dataGB: 10, validityDays: 14, price: 22, currency: 'EUR', features: ['4G LTE', 'Schnelle Aktivierung', 'Gute Abdeckung'], bookUrl: 'https://holafly.com' },
];

// Mock Flughafen-Transfers
export const mockTransfers = [
  { id: '1', route: 'Flughafen Paris CDG → Stadt', type: 'Taxi', price: 55, duration: 'ca. 45 Min', bookUrl: 'https://example.com' },
  { id: '2', route: 'Flughafen Paris CDG → Stadt', type: 'Shuttle', price: 19, duration: 'ca. 60 Min', bookUrl: 'https://example.com' },
  { id: '3', route: 'Barcelona El Prat → Zentrum', type: 'Taxi', price: 35, duration: 'ca. 25 Min', bookUrl: 'https://example.com' },
  { id: '4', route: 'Barcelona El Prat → Zentrum', type: 'Aerobus', price: 6, duration: 'ca. 35 Min', bookUrl: 'https://example.com' },
];

// Mock Weather Forecast
export const mockWeatherForecast: WeatherForecast[] = [
  {
    date: new Date('2024-06-15'),
    temperature: { min: 16, max: 24, feelsLike: 23 },
    condition: 'Sonnig',
    icon: 'sun',
    precipitation: 0,
    humidity: 45,
    windSpeed: 12,
    uvIndex: 6,
  },
  {
    date: new Date('2024-06-16'),
    temperature: { min: 17, max: 25, feelsLike: 25 },
    condition: 'Leicht bewölkt',
    icon: 'cloud-sun',
    precipitation: 10,
    humidity: 50,
    windSpeed: 15,
    uvIndex: 5,
  },
  {
    date: new Date('2024-06-17'),
    temperature: { min: 15, max: 22, feelsLike: 21 },
    condition: 'Bedeckt',
    icon: 'cloud',
    precipitation: 30,
    humidity: 65,
    windSpeed: 18,
    uvIndex: 3,
  },
  {
    date: new Date('2024-06-18'),
    temperature: { min: 14, max: 20, feelsLike: 19 },
    condition: 'Leichter Regen',
    icon: 'cloud-rain',
    precipitation: 60,
    humidity: 75,
    windSpeed: 20,
    uvIndex: 2,
  },
  {
    date: new Date('2024-06-19'),
    temperature: { min: 16, max: 23, feelsLike: 23 },
    condition: 'Aufheiternd',
    icon: 'cloud-sun',
    precipitation: 20,
    humidity: 55,
    windSpeed: 14,
    uvIndex: 5,
  },
];

// Mock AI Recommendations
export const mockAIRecommendations: AIRecommendation[] = [
  {
    id: '1',
    type: 'activity',
    title: 'Morgens zum Eiffelturm',
    description: 'Basierend auf dem Wetter und weniger Touristen empfehle ich einen Besuch um 9 Uhr.',
    confidence: 0.92,
    reason: 'Weniger Warteschlange, angenehme Temperatur',
  },
  {
    id: '2',
    type: 'restaurant',
    title: 'Reservierung im Septime',
    description: 'Dein Profil zeigt Interesse an gehobener Küche. Septime hat heute noch einen Tisch.',
    confidence: 0.87,
    reason: 'Passt zu deinen kulinarischen Vorlieben',
  },
  {
    id: '3',
    type: 'route',
    title: 'Optimierte Route',
    description: 'Ich habe die Route angepasst, um 30 Minuten Fahrzeit zu sparen.',
    confidence: 0.95,
    reason: 'Effizientere Abfolge der Aktivitäten',
  },
  {
    id: '4',
    type: 'budget',
    title: 'Budget-Tipp',
    description: 'Du hast heute 45 € unter Budget geblieben. Soll ich ein besonderes Erlebnis vorschlagen?',
    confidence: 0.78,
    reason: 'Verfügbares Budget für Extra-Erlebnis',
  },
];

// Mock Trip
export const mockTrip: Trip = {
  id: 'trip1',
  name: 'Paris Entdeckungsreise',
  destination: 'Paris, Frankreich',
  startDate: new Date('2024-06-15'),
  endDate: new Date('2024-06-19'),
  status: 'planning',
  budget: {
    total: 1500,
    spent: 0,
    remaining: 1500,
    currency: 'EUR',
    categories: [
      { id: '1', name: 'Unterkunft', allocated: 500, spent: 0, icon: 'Hotel', color: '#007AFF' },
      { id: '2', name: 'Essen', allocated: 400, spent: 0, icon: 'Utensils', color: '#34C759' },
      { id: '3', name: 'Aktivitäten', allocated: 300, spent: 0, icon: 'Ticket', color: '#FF9500' },
      { id: '4', name: 'Transport', allocated: 200, spent: 0, icon: 'Bus', color: '#AF52DE' },
      { id: '5', name: 'Shopping', allocated: 100, spent: 0, icon: 'ShoppingBag', color: '#FF2D55' },
    ],
  },
  days: [
    {
      id: 'day1',
      date: new Date('2024-06-15'),
      dayNumber: 1,
      activities: [mockActivities[0]],
      restaurants: [mockRestaurants[1]],
      dailyBudget: 300,
      route: [],
    },
    {
      id: 'day2',
      date: new Date('2024-06-16'),
      dayNumber: 2,
      activities: [mockActivities[1], mockActivities[2]],
      restaurants: [mockRestaurants[0]],
      dailyBudget: 350,
      route: [],
    },
  ],
};
