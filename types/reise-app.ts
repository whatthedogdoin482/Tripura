// User & Profile Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  travelStyle: 'adventure' | 'relaxation' | 'cultural' | 'foodie' | 'nature' | 'urban';
  budgetLevel: 'budget' | 'moderate' | 'luxury';
  activityIntensity: 'low' | 'medium' | 'high';
  dietaryRestrictions: string[];
  interests: string[];
}

// Trip & Route Types
export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  days: TripDay[];
  budget: Budget;
  status: 'planning' | 'upcoming' | 'active' | 'completed';
}

export interface TripDay {
  id: string;
  date: Date;
  dayNumber: number;
  activities: Activity[];
  restaurants: Restaurant[];
  route: RouteSegment[];
  dailyBudget: number;
  questionnaireAnswers?: QuestionnaireAnswer[];
}

export interface RouteSegment {
  from: Location;
  to: Location;
  distance: number;
  duration: number;
  transportMode: 'walking' | 'driving' | 'public_transport' | 'cycling';
  polyline?: string;
}

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  type: 'restaurant' | 'activity' | 'hotel' | 'landmark' | 'transport';
}

// Activity Types
export interface Activity {
  id: string;
  name: string;
  description: string;
  location: Location;
  duration: number;
  price: number;
  currency: string;
  category: string;
  rating: number;
  reviewCount: number;
  weatherRating: WeatherRating;
  images: string[];
  bookingUrl?: string;
  openingHours: OpeningHours;
}

export interface WeatherRating {
  score: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  temperature: number;
  precipitation: number;
  recommendation: string;
}

export interface OpeningHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: Location;
  rating: number;
  reviewCount: number;
  priceLevel: 1 | 2 | 3 | 4;
  dietaryOptions: string[];
  images: string[];
  reservationUrl?: string;
  openingHours: OpeningHours;
  menuUrl?: string;
}

// Budget Types
export interface Budget {
  total: number;
  spent: number;
  remaining: number;
  currency: string;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  icon: string;
  color: string;
}

// Questionnaire Types
export interface QuestionnaireQuestion {
  id: string;
  type: 'swipe' | 'multiple_choice' | 'scale' | 'text';
  question: string;
  description?: string;
  options?: QuestionnaireOption[];
  category: 'mood' | 'food' | 'activity' | 'budget' | 'weather';
  icon?: string;
  /** Für type: 'scale' – Regler von min bis max */
  scaleMin?: number;
  scaleMax?: number;
  scaleStep?: number;
  /** Optionale Beschriftungen an den Enden (z. B. ["Budget", "Luxus"]) */
  scaleLabels?: [string, string];
}

export interface QuestionnaireOption {
  id: string;
  label: string;
  value: string;
  icon?: string;
  image?: string;
}

export interface QuestionnaireAnswer {
  questionId: string;
  answer: string | string[];
  timestamp: Date;
}

// Credit Card Types
export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  image: string;
  benefits: string[];
  foreignTransactionFee: number;
  rewardsRate: string;
  annualFee: number;
  recommendedFor: string[];
  applyUrl: string;
}

// Insurance Types
export interface Insurance {
  id: string;
  name: string;
  provider: string;
  type: 'travel' | 'health' | 'cancellation' | 'luggage';
  coverage: string[];
  pricePerDay: number;
  currency: string;
  image: string;
  bookUrl: string;
}

// Flight Types
export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: FlightSegment;
  arrival: FlightSegment;
  price: number;
  currency: string;
  class: 'economy' | 'premium_economy' | 'business' | 'first';
  stops: number;
  duration: number;
  bookUrl: string;
}

export interface FlightSegment {
  airport: string;
  city: string;
  time: Date;
  terminal?: string;
}

// Car Rental Types
export interface CarRental {
  id: string;
  company: string;
  carModel: string;
  carType: 'compact' | 'sedan' | 'suv' | 'luxury' | 'van';
  pricePerDay: number;
  currency: string;
  features: string[];
  image: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  bookUrl: string;
}

// eSIM (Daten im Ausland pro Land/Region)
export interface ESIM {
  id: string;
  provider: string;
  region: string;
  dataGB: number;
  validityDays: number;
  price: number;
  currency: string;
  features: string[];
  bookUrl: string;
}

// Weather Types
export interface WeatherForecast {
  date: Date;
  temperature: {
    min: number;
    max: number;
    feelsLike: number;
  };
  condition: string;
  icon: string;
  precipitation: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
}

// Map Types
export interface MapViewport {
  center: [number, number];
  zoom: number;
}

// AI Recommendation Types
export interface AIRecommendation {
  id: string;
  type: 'activity' | 'restaurant' | 'route' | 'budget' | 'timing';
  title: string;
  description: string;
  confidence: number;
  reason: string;
  suggestedChange?: Partial<Trip> | Partial<TripDay> | Partial<Activity>;
}

// Navigation Types
export type AppView = 'home' | 'plan' | 'explore' | 'budget' | 'bookings' | 'profile';

export type PlanningStep = 'questionnaire' | 'destination' | 'dates' | 'preferences' | 'itinerary';
