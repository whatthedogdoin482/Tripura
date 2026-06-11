import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight, 
  Check, 
  Sparkles,
  Plane,
  Car,
  CreditCard,
  Bus,
  Smartphone,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Search
} from 'lucide-react';
import { SwipeDeck } from '@/components/questionnaire/SwipeDeck';
import { SliderQuestion } from '@/components/questionnaire/SliderQuestion';
import { BudgetSection } from '@/components/sections/BudgetSection';
import { tripQuestionnaire, popularCities, mockFlights, mockReturnFlights, mockEsims, mockTransfers, mockCarRentals, mockCreditCards, formatFlightDuration, getNearestAirportCode, sortFlightsByNearestAndCheapest } from '@/data/mockData';
import { useGeolocation } from '@/hooks/useGeolocation';
import { submitSurvey } from '@/lib/survey';
import type { QuestionnaireOption, QuestionnaireQuestion } from '@/types';

type PlanningStep = 'destination' | 'flights' | 'dates' | 'budget' | 'extras' | 'flightChoice' | 'questionnaire' | 'offers' | 'generating';

type ExtraChoice = 'need' | 'later' | 'no';

interface PlanningSectionProps {
  onPlanningComplete?: () => void;
}

export function PlanningSection({ onPlanningComplete }: PlanningSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepCardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  
  const [currentStep, setCurrentStep] = useState<PlanningStep>('destination');
  const [destinations, setDestinations] = useState<string[]>([]);
  const [destinationSearch, setDestinationSearch] = useState('');
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<number, unknown>>({});
  const [scaleValues, setScaleValues] = useState<Record<number, number>>({});
  const [travelExtras, setTravelExtras] = useState<Record<string, ExtraChoice>>({
    car: 'later',
    card: 'later',
    esim: 'later',
    transfer: 'later',
  });
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [selectedCountriesForRegion, setSelectedCountriesForRegion] = useState<string[]>([]);
  const [regionSelections, setRegionSelections] = useState<Record<string, string[]>>({});
  const [regionSearchPerCountry, setRegionSearchPerCountry] = useState<Record<string, string>>({});
  const [selectedOfferFlightId, setSelectedOfferFlightId] = useState<string | null>(null);
  const [selectedOfferReturnFlightId, setSelectedOfferReturnFlightId] = useState<string | null>(null);
  const [laterSkipped, setLaterSkipped] = useState<Record<string, boolean>>({});
  const [showLaterOffers, setShowLaterOffers] = useState<Record<string, boolean>>({});
  const [selectedOfferEsimId, setSelectedOfferEsimId] = useState<string | null>(null);
  const [selectedOfferTransferId, setSelectedOfferTransferId] = useState<string | null>(null);
  const [selectedOfferCarId, setSelectedOfferCarId] = useState<string | null>(null);

  const knownCountries: string[] = Array.from(new Set(popularCities.map((c) => c.country)));
  const { latitude, longitude } = useGeolocation({ watch: false });
  const nearestAirportCode = getNearestAirportCode(latitude ?? null, longitude ?? null);
  const sortedHinflugOffers = sortFlightsByNearestAndCheapest(mockFlights ?? [], nearestAirportCode);

  const handleDestinationSubmit = () => {
    if (destinations.length === 0) return;
    const countriesSelected = destinations.filter((d) => knownCountries.includes(d));
    if (countriesSelected.length > 0) {
      setSelectedCountriesForRegion(countriesSelected);
      setRegionSelections(
        Object.fromEntries(countriesSelected.map((c) => [c, []]))
      );
      setShowRegionModal(true);
    } else {
      setCurrentStep('flights');
    }
  };

  const handleRegionModalDone = () => {
    setShowRegionModal(false);
    setCurrentStep('flights');
  };

  useEffect(() => {
    if (showRegionModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showRegionModal]);

  // Beim Wechsel von Schritt/Frage die Planungs-Karte oben halten,
  // aber die Einstiegsfrage ("destination") unverändert lassen.
  useEffect(() => {
    if (currentStep === 'destination' && currentQuestionIndex === 0) return;
    const el = stepCardRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => {
      el.scrollIntoView({ block: 'start', behavior: 'auto' });
    });
    return () => cancelAnimationFrame(id);
  }, [currentStep, currentQuestionIndex]);

  const toggleRegionCity = (country: string, cityName: string) => {
    setRegionSelections((prev) => {
      const list = prev[country] ?? [];
      const next = list.includes(cityName)
        ? list.filter((c) => c !== cityName)
        : [...list, cityName];
      return { ...prev, [country]: next };
    });
  };

  const handleFlightsContinue = () => setCurrentStep('dates');
  const handleExtrasContinue = () => setCurrentStep('flightChoice');
  const handleFlightChoiceContinue = () => setCurrentStep('questionnaire');

  const setExtraChoice = (key: string, value: ExtraChoice) => {
    setTravelExtras((prev) => ({ ...prev, [key]: value }));
  };

  const addDestination = (cityName: string) => {
    if (!destinations.includes(cityName)) {
      setDestinations((prev) => [...prev, cityName]);
    }
    setDestinationSearch('');
    setShowDestinationSuggestions(false);
  };

  const removeDestination = (cityName: string) => {
    setDestinations((prev) => prev.filter((d) => d !== cityName));
  };

  const destinationSuggestions = destinationSearch.trim().length >= 1
    ? popularCities.filter(
        (c) =>
          c.name.toLowerCase().includes(destinationSearch.trim().toLowerCase()) ||
          c.country.toLowerCase().includes(destinationSearch.trim().toLowerCase())
      )
    : [];
  const searchTermsForMatch = destinationSearch.trim().toLowerCase().split(/[\s,]+/).filter(Boolean);
  const matchedCountries =
    searchTermsForMatch.length >= 1
      ? knownCountries.filter((c) =>
          searchTermsForMatch.some((term) => c.toLowerCase() === term || c.toLowerCase().includes(term))
        )
      : [];

  // Beliebte Ziele nach eingegebenem Land: Suchbegriffe (z.B. "frankreich" oder "frankreich spanien")
  const searchTerms = destinationSearch
    .trim()
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean);
  const citiesByCountry =
    searchTerms.length >= 1
      ? popularCities.filter(
          (c) =>
            searchTerms.some(
              (term) =>
                c.country.toLowerCase().includes(term) || c.name.toLowerCase().includes(term)
            )
        )
      : [];
  type CityItem = (typeof popularCities)[number];
  const groupedByCountry = citiesByCountry.reduce<Record<string, CityItem[]>>(
    (acc, city) => {
      const key = city.country;
      if (!acc[key]) acc[key] = [];
      acc[key].push(city);
      return acc;
    },
    {}
  );
  const hasGroupedCities = Object.keys(groupedByCountry).length > 0;

  const handleDatesSubmit = () => {
    if (startDate && endDate) {
      setCurrentStep('budget');
    }
  };

  const handleBudgetContinue = () => {
    setCurrentStep('extras');
  };

  const handleQuestionnaireAnswer = (results: { option: QuestionnaireOption; liked: boolean }[]) => {
    setQuestionnaireAnswers(prev => ({ ...prev, [currentQuestionIndex]: results }));
  };

  const handleScaleAnswer = (value: number) => {
    setScaleValues(prev => ({ ...prev, [currentQuestionIndex]: value }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < tripQuestionnaire.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setCurrentStep('offers');
    }
  };

  const handleFinishOffers = () => {
    // Alle Antworten in trip_surveys persistieren (best effort, blockiert die UI nicht)
    const questionnaire = tripQuestionnaire.map((q, index) => {
      const swipeResults = questionnaireAnswers[index] as
        | { option: QuestionnaireOption; liked: boolean }[]
        | undefined;
      return {
        questionId: q.id,
        question: q.question,
        type: q.type,
        ...(q.type === 'scale'
          ? { value: scaleValues[index] ?? null }
          : {
              liked: swipeResults?.filter((r) => r.liked).map((r) => r.option.value) ?? [],
              disliked: swipeResults?.filter((r) => !r.liked).map((r) => r.option.value) ?? [],
            }),
      };
    });
    void submitSurvey({
      source: 'planning_section',
      destinations,
      regionSelections,
      startDate: startDate || null,
      endDate: endDate || null,
      travelers,
      travelExtras,
      questionnaire,
      selectedOffers: {
        flightId: selectedOfferFlightId,
        returnFlightId: selectedOfferReturnFlightId,
        esimId: selectedOfferEsimId,
        transferId: selectedOfferTransferId,
        carId: selectedOfferCarId,
      },
    });
    setCurrentStep('generating');
    setTimeout(() => onPlanningComplete?.(), 3000);
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'destination':
        return (
          <motion.div
            key="destination"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Wohin geht die Reise?</h3>
            <p className="text-gray-600 mb-6">Wähle ein oder mehrere Ziele – Land oder Stadt eingeben für Vorschläge</p>

            {/* Ausgewählte Orte als Chips */}
            {destinations.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {destinations.map((city) => (
                  <span
                    key={city}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium"
                  >
                    {city}
                    <button
                      type="button"
                      onClick={() => removeDestination(city)}
                      className="p-0.5 rounded-full hover:bg-blue-200 transition-colors"
                      aria-label={`${city} entfernen`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Suchfeld mit Vorschlägen */}
            <div className="relative mb-6">
              <input
                type="text"
                value={destinationSearch}
                onChange={(e) => {
                  setDestinationSearch(e.target.value);
                  setShowDestinationSuggestions(true);
                }}
                onFocus={() => destinationSearch.trim().length >= 2 && setShowDestinationSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 180)}
                placeholder="Land oder Stadt eingeben, z.B. Spanien, Barcelona..."
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const firstUnselectedCountry = matchedCountries.find((c) => !destinations.includes(c));
                    if (firstUnselectedCountry) {
                      addDestination(firstUnselectedCountry);
                    } else if (destinationSuggestions.length > 0) {
                      addDestination(destinationSuggestions[0].name);
                    } else {
                      handleDestinationSubmit();
                    }
                  }
                }}
              />
              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              {showDestinationSuggestions && (matchedCountries.length > 0 || destinationSuggestions.length > 0) && (
                <ul className="absolute left-0 right-0 top-full mt-1 max-h-56 overflow-auto rounded-2xl border border-gray-200 bg-white shadow-lg z-10 text-left">
                  {matchedCountries
                    .filter((c) => !destinations.includes(c))
                    .map((country) => (
                      <li key={country}>
                        <button
                          type="button"
                          onClick={() => addDestination(country)}
                          className="w-full px-5 py-3 flex items-center justify-between hover:bg-blue-50 border-b border-gray-100 font-medium text-blue-700"
                        >
                          <span>{country}</span>
                          <span className="text-xs text-blue-600">Ganzes Land</span>
                        </button>
                      </li>
                    ))}
                  {destinationSuggestions.map((city) => (
                    <li key={city.id}>
                      <button
                        type="button"
                        onClick={() => addDestination(city.name)}
                        className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{city.name}</span>
                        <span className="text-sm text-gray-500">{city.country}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Beliebte Ziele: zuerst Land wählen, dann Städte */}
            <p className="text-sm text-gray-500 mb-3">Beliebte Ziele zum Hinzufügen</p>
            {hasGroupedCities ? (
              <div className="space-y-5 mb-8 text-left">
                {Object.entries(groupedByCountry).map(([country, cities], groupIndex) => (
                  <div key={country}>
                    {groupIndex > 0 && <div className="h-px bg-gray-200 my-4" />}
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-3 first:mt-0">{country}</p>
                    <button
                      type="button"
                      onClick={() => addDestination(country)}
                      disabled={destinations.includes(country)}
                      className="w-full mb-3 px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 text-gray-700 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium text-left"
                    >
                      Ganzes Land wählen
                    </button>
                    <p className="text-xs text-gray-400 mb-1">Oder Städte:</p>
                    <div className="flex flex-wrap gap-2">
                      {cities.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => addDestination(city.name)}
                          disabled={destinations.includes(city.name)}
                          className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                          {city.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 mb-8">
                {destinationSearch.trim() ? 'Keine Städte für dieses Land gefunden.' : 'Land oder Stadt eingeben (z.B. Frankreich, Spanien) – dann erscheinen hier beliebte Ziele.'}
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDestinationSubmit}
              disabled={destinations.length === 0}
              className="apple-button w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Weiter
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        );

      case 'flights':
        return (
          <motion.div
            key="flights"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mx-auto mb-6">
              <Plane className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Flüge finden & buchen</h3>
            <p className="text-gray-600 mb-6">Deine Ziele und Termine – wir zeigen dir die besten Flugangebote.</p>
            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-5 mb-6 text-left">
              <p className="text-sm text-gray-500 mb-1">Hinflug zu</p>
              <p className="font-semibold text-gray-900 text-lg">
                {destinations.length > 0 ? destinations[0] : '–'}
                {destinations.length > 1 ? ` + ${destinations.length - 1} weitere` : ''}
              </p>
              {startDate && endDate ? (
                <p className="text-sm text-gray-600 mt-2">
                  {new Date(startDate).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {' – '}
                  {new Date(endDate).toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })}
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-2">Wähle im nächsten Schritt deine Reisedaten</p>
              )}
            </div>
            <motion.a
              href="#"
              onClick={(e) => { e.preventDefault(); handleFlightsContinue(); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              <Search className="w-5 h-5" />
              Flüge suchen & vergleichen
            </motion.a>
            <button
              type="button"
              onClick={handleFlightsContinue}
              className="mt-4 text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Erst später – weiter zur Datumsauswahl
            </button>
            <div className="flex gap-3 mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep('destination')}
                className="apple-button-secondary flex-1"
              >
                Zurück
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFlightsContinue}
                className="apple-button flex-1 flex items-center justify-center gap-2"
              >
                Weiter
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        );

      case 'dates':
        return (
          <motion.div
            key="dates"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Wann möchtest du reisen?</h3>
            <p className="text-gray-600 mb-8">Wähle deinen Reisezeitraum</p>
            
            <div className="space-y-4 mb-6">
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-2">Anreise</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-2">Abreise</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setTravelers(Math.max(1, travelers - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                -
              </button>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="text-lg font-medium">{travelers} Reisende</span>
              </div>
              <button
                onClick={() => setTravelers(travelers + 1)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep('flights')}
                className="apple-button-secondary flex-1"
              >
                Zurück
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDatesSubmit}
                disabled={!startDate || !endDate}
                className="apple-button flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Weiter
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        );

      case 'budget':
        return (
          <motion.div
            key="budget"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full"
          >
            <BudgetSection embedded />
            <div className="flex gap-3 mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep('dates')}
                className="apple-button-secondary flex-1"
              >
                Zurück
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBudgetContinue}
                className="apple-button flex-1 flex items-center justify-center gap-2"
              >
                Weiter
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        );

      case 'extras': {
        const extrasConfig = [
          { key: 'car', label: 'Mietwagen', icon: Car, desc: 'Auto vor Ort mieten' },
          { key: 'card', label: 'Kreditkarte', icon: CreditCard, desc: 'Reisekarte ohne Auslandsgebühren' },
          { key: 'esim', label: 'eSIM', icon: Smartphone, desc: 'Daten im Ausland' },
          { key: 'transfer', label: 'Flughafen-Transfer', icon: Bus, desc: 'Transfer buchen' },
        ] as const;
        return (
          <motion.div
            key="extras"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Was brauchst du noch?</h3>
              <p className="text-gray-600">Wähle für jede Option, was du möchtest – oder nichts davon.</p>
            </div>
            <div className="space-y-4">
              {extrasConfig.map(({ key, label, icon: Icon, desc }) => (
                <div
                  key={key}
                  className="rounded-2xl border-2 border-gray-200 bg-gray-50/50 overflow-hidden flex flex-col sm:flex-row"
                >
                  <div className="flex-1 p-4 sm:p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-semibold text-gray-900">{label}</p>
                      <p className="text-sm text-gray-500">{desc}</p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col border-t sm:border-t-0 sm:border-l border-gray-200 bg-white sm:w-40">
                    {(['need', 'later', 'no'] as const).map((choice) => (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => setExtraChoice(key, choice)}
                        className={`flex-1 sm:flex-none w-full px-4 py-3 sm:py-2.5 text-sm font-medium border-b sm:border-b-0 sm:border-b last:sm:border-b-0 border-gray-100 transition-colors ${
                          travelExtras[key] === choice
                            ? choice === 'need'
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : choice === 'later'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {choice === 'need' ? 'Brauche ich' : choice === 'later' ? 'Später prüfen' : 'Nein'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep('budget')}
                className="apple-button-secondary flex-1"
              >
                Zurück
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExtrasContinue}
                className="apple-button flex-1 flex items-center justify-center gap-2"
              >
                Weiter zum Fragebogen
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        );
      }

      case 'flightChoice': {
        return (
          <motion.div
            key="flightChoice"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Flug wählen</h3>
              <p className="text-gray-600 text-sm">Wähle zuerst Hin- und Rückflug. Danach siehst du die Angebote zu den Dingen, die du gebraucht hast.</p>
            </div>
            <div className="space-y-6 mb-8">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Plane className="w-4 h-4" /> Hinflug
                </p>
                <p className="text-xs text-gray-500 mb-2">Vom nächsten Flughafen zu dir + günstigere Alternativen.</p>
                <div className="space-y-2">
                  {sortedHinflugOffers.slice(0, 5).map((f) => (
                    <div key={f.id} className="rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 relative">
                      {f.label === 'nearest' && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-medium">Nächster Flughafen</span>
                      )}
                      {f.label === 'cheaper_alternative' && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-medium">Günstigere Alternative</span>
                      )}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="font-medium text-gray-900">{f.airline}</span>
                          <span className="text-gray-600">{f.departure.city} → {f.arrival.city}</span>
                          <span className="text-gray-500">Abflug {f.departure.time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} · Ankunft {f.arrival.time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="text-gray-500">{formatFlightDuration(f.duration)} · {f.stops === 0 ? 'Direkt' : `${f.stops} Stopp(s)`}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900">{f.price} €</p>
                          <button
                            type="button"
                            onClick={() => setSelectedOfferFlightId(selectedOfferFlightId === f.id ? null : f.id)}
                            className={`text-sm font-medium px-3 py-1.5 rounded-lg ${selectedOfferFlightId === f.id ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                          >
                            {selectedOfferFlightId === f.id ? 'Ausgewählt' : 'Auswählen'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4 flex items-center gap-2">
                  <Plane className="w-4 h-4" /> Rückflug
                </p>
                <div className="space-y-2">
                  {(mockReturnFlights ?? []).slice(0, 3).map((r) => (
                    <div key={r.id} className="rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="font-medium text-gray-900">{r.airline}</span>
                          <span className="text-gray-600">{r.departure.city} → {r.arrival.city}</span>
                          <span className="text-gray-500">Abflug {r.departure.time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} · Ankunft {r.arrival.time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="text-gray-500">{formatFlightDuration(r.duration)} · {r.stops === 0 ? 'Direkt' : `${r.stops} Stopp(s)`}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900">{r.price} €</p>
                          <button
                            type="button"
                            onClick={() => setSelectedOfferReturnFlightId(selectedOfferReturnFlightId === r.id ? null : r.id)}
                            className={`text-sm font-medium px-3 py-1.5 rounded-lg ${selectedOfferReturnFlightId === r.id ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                          >
                            {selectedOfferReturnFlightId === r.id ? 'Ausgewählt' : 'Auswählen'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep('extras')}
                className="apple-button-secondary flex-1"
              >
                Zurück
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFlightChoiceContinue}
                className="apple-button flex-1 flex items-center justify-center gap-2"
              >
                Weiter zum Fragebogen
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        );
      }

      case 'questionnaire': {
        const currentQ = tripQuestionnaire[currentQuestionIndex] as QuestionnaireQuestion;
        const isScale = currentQ.type === 'scale';

        return (
          <motion.div
            key="questionnaire"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                Frage {currentQuestionIndex + 1} von {tripQuestionnaire.length}
              </h3>
              <p className="text-gray-600 text-sm">Die Buttons darunter wechseln nur zur vorherigen bzw. nächsten Frage.</p>
            </div>

            {isScale ? (
              <SliderQuestion
                key={currentQuestionIndex}
                question={currentQ}
                value={scaleValues[currentQuestionIndex] ?? (currentQ.scaleMin ?? 1)}
                onChange={handleScaleAnswer}
              />
            ) : (
              <SwipeDeck
                key={currentQuestionIndex}
                question={currentQ}
                onComplete={handleQuestionnaireAnswer}
              />
            )}

            <div className="flex flex-col items-center gap-4 mt-10">
              {currentQuestionIndex === 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep('flightChoice')}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  ← Zurück zur Flugauswahl
                </button>
              )}
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-5 py-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none transition-colors font-medium"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Eine Frage zurück
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-95 transition-opacity font-medium"
                >
                  {currentQuestionIndex < tripQuestionnaire.length - 1 ? (
                    <>Eine Frage weiter <ChevronRight className="w-5 h-5" /></>
                  ) : (
                    <>Weiter zu den Angeboten <ChevronRight className="w-5 h-5" /></>
                  )}
                </motion.button>
              </div>
              <button
                type="button"
                onClick={() => { setCurrentStep('offers'); }}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium underline underline-offset-2"
              >
                Gesamten Fragebogen überspringen →
              </button>
            </div>
          </motion.div>
        );
      }

      case 'offers': {
        return (
          <motion.div
            key="offers"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Deine weiteren Angebote</h3>
              <p className="text-gray-600 text-sm">Du hast deinen Flug gewählt. Hier siehst du die Angebote zu den Dingen, die du gebraucht hast – und „Später prüfen“-Optionen.</p>
            </div>

            {/* Kurz: Flugwahl-Zusammenfassung (Flug wurde im Schritt davor gewählt) */}
            <div className="mb-6 p-4 rounded-xl border border-gray-200 bg-gray-50/80">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Plane className="w-4 h-4" /> Deine Flugwahl
              </p>
              {selectedOfferFlightId && selectedOfferReturnFlightId ? (
                <>
                  <p className="text-sm text-gray-800">
                    {sortedHinflugOffers.find((f) => f.id === selectedOfferFlightId)?.departure.city} → {sortedHinflugOffers.find((f) => f.id === selectedOfferFlightId)?.arrival.city} (Hin) · Rückflug ausgewählt
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    Flüge gesamt: {(() => {
                      const hin = sortedHinflugOffers.find((f) => f.id === selectedOfferFlightId)?.price ?? 0;
                      const ret = (mockReturnFlights ?? []).find((r) => r.id === selectedOfferReturnFlightId)?.price ?? 0;
                      return `${hin + ret} €`;
                    })()}
                  </p>
                  <button
                    type="button"
                    onClick={() => setCurrentStep('flightChoice')}
                    className="mt-2 text-sm font-medium text-sky-600 hover:text-sky-700"
                  >
                    Flug ändern
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-500">Noch kein Flug gewählt.</p>
                  <button
                    type="button"
                    onClick={() => setCurrentStep('flightChoice')}
                    className="mt-2 text-sm font-medium text-sky-600 hover:text-sky-700"
                  >
                    Flug wählen
                  </button>
                </>
              )}
            </div>

            {/* "Später prüfen" – nochmal anzeigen und fragen */}
            {(['car', 'card', 'esim', 'transfer'] as const).map((key) => {
              const label = { car: 'Mietwagen', card: 'Kreditkarte', esim: 'eSIM', transfer: 'Flughafen-Transfer' }[key];
              if (travelExtras[key] !== 'later' || laterSkipped[key] || showLaterOffers[key]) return null;
              return (
                <div key={key} className="mb-4 p-4 rounded-xl border-2 border-amber-200 bg-amber-50/80">
                  <p className="text-sm font-medium text-gray-800 mb-2">Du hattest „Später prüfen“ gewählt für <strong>{label}</strong>. Möchtest du jetzt Angebote sehen?</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setShowLaterOffers((prev) => ({ ...prev, [key]: true }))}
                      className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600"
                    >
                      Jetzt Angebote anzeigen
                    </button>
                    <button
                      type="button"
                      onClick={() => setLaterSkipped((prev) => ({ ...prev, [key]: true }))}
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300"
                    >
                      Überspringen
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-1">
              {(travelExtras.esim === 'need' || (travelExtras.esim === 'later' && showLaterOffers.esim)) && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" /> eSIMs
                </p>
                <div className="space-y-2">
                  {(mockEsims ?? []).slice(0, 3).map((e) => (
                    <div key={e.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{e.region}</p>
                        <p className="text-sm text-gray-500">{e.dataGB} GB · {e.validityDays} Tage{e.features?.[0] ? ` · ${e.features[0]}` : ''}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-gray-900">{e.price}€</p>
                        <button
                          type="button"
                          onClick={() => setSelectedOfferEsimId(selectedOfferEsimId === e.id ? null : e.id)}
                          className={`text-sm font-medium px-3 py-1.5 rounded-lg ${
                            selectedOfferEsimId === e.id ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                          }`}
                        >
                          {selectedOfferEsimId === e.id ? 'Ausgewählt' : 'Auswählen'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {(travelExtras.transfer === 'need' || (travelExtras.transfer === 'later' && showLaterOffers.transfer)) && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Bus className="w-4 h-4" /> Transfers
                </p>
                <div className="space-y-2">
                  {mockTransfers.slice(0, 2).map((t) => (
                    <div key={t.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{t.route}</p>
                        <p className="text-sm text-gray-500">{t.type} · {t.duration}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-gray-900">{t.price}€</p>
                        <button
                          type="button"
                          onClick={() => setSelectedOfferTransferId(selectedOfferTransferId === t.id ? null : t.id)}
                          className={`text-sm font-medium px-3 py-1.5 rounded-lg ${
                            selectedOfferTransferId === t.id ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                          }`}
                        >
                          {selectedOfferTransferId === t.id ? 'Ausgewählt' : 'Auswählen'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {(travelExtras.car === 'need' || (travelExtras.car === 'later' && showLaterOffers.car)) && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Car className="w-4 h-4" /> Mietwagen
                </p>
                <div className="space-y-2">
                  {(mockCarRentals ?? []).slice(0, 2).map((c) => {
                    const tripDays = startDate && endDate
                      ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)))
                      : 5;
                    const carTotal = c.pricePerDay * tripDays;
                    return (
                      <div key={c.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{c.carModel}</p>
                          <p className="text-sm text-gray-500">{c.company} · {c.pricePerDay}€/Tag ({tripDays} Tage = {carTotal}€)</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-gray-900">{carTotal}€</p>
                          <button
                            type="button"
                            onClick={() => setSelectedOfferCarId(selectedOfferCarId === c.id ? null : c.id)}
                            className={`text-sm font-medium px-3 py-1.5 rounded-lg ${
                              selectedOfferCarId === c.id ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                          >
                            {selectedOfferCarId === c.id ? 'Ausgewählt' : 'Auswählen'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              )}

              {(travelExtras.card === 'need' || (travelExtras.card === 'later' && showLaterOffers.card)) && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Kreditkarten
                </p>
                <div className="space-y-2">
                  {(mockCreditCards ?? []).slice(0, 3).map((c) => (
                    <div key={c.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{c.name}</p>
                        <p className="text-sm text-gray-500">{c.issuer} · {c.annualFee === 0 ? 'Kostenlos' : `${c.annualFee}€/Jahr`}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {}}
                        className="text-sm font-medium px-3 py-1.5 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
                      >
                        Infos
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>

            {/* Gesamtpreis */}
            {(() => {
              const tripDays = startDate && endDate
                ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)))
                : 5;
              const flightPrice = (mockFlights ?? []).find((f) => f.id === selectedOfferFlightId)?.price ?? 0;
              const returnFlightPrice = (mockReturnFlights ?? []).find((r) => r.id === selectedOfferReturnFlightId)?.price ?? 0;
              const esimPrice = (mockEsims ?? []).find((e) => e.id === selectedOfferEsimId)?.price ?? 0;
              const transferPrice = mockTransfers.find((t) => t.id === selectedOfferTransferId)?.price ?? 0;
              const car = (mockCarRentals ?? []).find((c) => c.id === selectedOfferCarId);
              const carPrice = car ? car.pricePerDay * tripDays : 0;
              const total = flightPrice + returnFlightPrice + esimPrice + transferPrice + carPrice;
              return total > 0 ? (
                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Gesamtpreis (alle Auswahl)</span>
                    <span className="text-2xl font-bold">{total} €</span>
                  </div>
                  <p className="text-sm text-white/90">Zahlung erfolgt bei uns – alles in einer Buchung.</p>
                </div>
              ) : null;
            })()}

            <button
              type="button"
              onClick={handleFinishOffers}
              className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Angebote überspringen und Plan abschließen →
            </button>
            <div className="flex gap-3 mt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setCurrentStep('questionnaire'); setCurrentQuestionIndex(tripQuestionnaire.length - 1); }}
                className="apple-button-secondary flex-1"
              >
                Zurück
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFinishOffers}
                className="apple-button flex-1 flex items-center justify-center gap-2"
              >
                Jetzt zahlen – in der App abschließen
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        );
      }

      case 'generating':
        return (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-8"
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Dein perfekter Trip wird erstellt...
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Unsere KI analysiert deine Präferenzen und erstellt eine personalisierte Reiseroute für dich.
            </p>
            
            <div className="mt-12 space-y-3 max-w-sm mx-auto">
              {[
                'Reiseziel analysieren',
                'Wettervorhersage prüfen',
                'Aktivitäten zusammenstellen',
                'Restaurants auswählen',
                'Route optimieren',
              ].map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.3 }}
                  className="flex items-center gap-3 text-left"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.3 + 0.2, type: 'spring' }}
                    className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                  <span className="text-gray-700">{step}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
    }
  };

  const top5ForCountry = (country: string) =>
    popularCities.filter((c) => c.country === country).slice(0, 5);
  const citiesForCountry = (country: string) =>
    popularCities.filter((c) => c.country === country);
  const filteredCitiesForCountry = (country: string) => {
    const q = (regionSearchPerCountry[country] ?? '').trim().toLowerCase();
    const list = citiesForCountry(country);
    if (!q) return list;
    return list.filter((c) => c.name.toLowerCase().includes(q));
  };

  return (
    <>
    <section
      ref={sectionRef}
      data-section="planning"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
            Reise planen
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Plane deinen Trip in
            <span className="gradient-text"> Minuten</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Beantworte ein paar kurze Fragen und lass unsere KI den perfekten Urlaub für dich planen.
          </p>
        </motion.div>

        {/* Planning card */}
        <motion.div
          ref={stepCardRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative bg-white rounded-3xl shadow-xl p-8 sm:p-12"
        >
          {/* Progress indicator */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 rounded-t-3xl overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: '0%' }}
              animate={{ 
                width: currentStep === 'destination' ? '12%' : 
                       currentStep === 'flights' ? '25%' :
                       currentStep === 'dates' ? '38%' : 
                       currentStep === 'budget' ? '50%' :
                       currentStep === 'extras' ? '62%' :
                       currentStep === 'flightChoice' ? '68%' :
                       currentStep === 'questionnaire' ? `${68 + (currentQuestionIndex / tripQuestionnaire.length) * 12}%` :
                       currentStep === 'offers' ? '85%' :
                       '100%' 
              }}
              transition={{ type: 'spring', stiffness: 100 }}
            />
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-center"
        >
          {[
            { icon: Plane, label: 'Flüge inklusive' },
            { icon: Check, label: 'Bestpreis-Garantie' },
            { icon: Sparkles, label: 'KI-optimiert' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-gray-600">
              <Icon className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Modal: Städte/Regionen pro gewähltem Land – Hintergrund scrollt nicht mit */}
    {showRegionModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden"
        >
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 min-h-0">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Städte & Regionen wählen</h3>
            <p className="text-gray-600 text-sm mb-6">
              Für jedes gewählte Land: Welche Städte oder Regionen möchtest du sehen? Oder lass leer für ganzes Land.
            </p>
            <div className="space-y-6 mb-8">
            {selectedCountriesForRegion.map((country) => {
              const top5 = top5ForCountry(country);
              const selected = regionSelections[country] ?? [];
              const searchQuery = regionSearchPerCountry[country] ?? '';
              const filteredCities = filteredCitiesForCountry(country);
              return (
                <div key={country} className="rounded-2xl border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900 mb-2">
                    Welche Städte oder Regionen möchtest du für {country} sehen?
                  </p>
                  <p className="text-xs text-gray-500 mb-2">Top-Empfehlungen:</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {top5.map((city) => (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => toggleRegionCity(country, city.name)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selected.includes(city.name)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                  <label className="block text-xs text-gray-500 mb-1">Stadt suchen</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) =>
                      setRegionSearchPerCountry((prev) => ({ ...prev, [country]: e.target.value }))
                    }
                    placeholder="z.B. Lyon, Marseille..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm mb-2"
                  />
                  {filteredCities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {filteredCities.map((city) => (
                        <button
                          key={city.id}
                          type="button"
                          onClick={() => toggleRegionCity(country, city.name)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            selected.includes(city.name)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {city.name}
                        </button>
                      ))}
                    </div>
                  )}
                  {searchQuery.trim() && filteredCities.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">Keine Stadt gefunden.</p>
                  )}
                  {selected.length === 0 && (
                    <p className="text-xs text-gray-500 mt-2">Keine gewählt = ganzes Land</p>
                  )}
                </div>
              );
            })}
            </div>
          </div>
          <div className="p-6 pt-0 sm:px-8 flex-shrink-0 border-t border-gray-100">
            <motion.button
              type="button"
              onClick={handleRegionModalDone}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold flex items-center justify-center gap-2"
            >
              Weiter
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    )}
    </>
  );
}
