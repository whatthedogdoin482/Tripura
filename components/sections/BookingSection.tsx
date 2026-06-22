import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  CreditCard, 
  Shield, 
  Plane, 
  Car,
  Bus,
  Smartphone,
  Check,
  ExternalLink,
  Wallet,
  HeartPulse,
  Luggage,
  Clock,
  Wifi
} from 'lucide-react';
import { mockCreditCards, mockInsurance, mockFlights, mockReturnFlights, mockCarRentals, mockEsims, mockTransfers, formatFlightDuration, getNearestAirportCode, sortFlightsByNearestAndCheapest } from '@/data/mockData';
import { useGeolocation } from '@/hooks/useGeolocation';
import { redirectToCheckout, type CheckoutItem } from '@/lib/stripe/checkout';

type BookingTab = 'cards' | 'insurance' | 'flights' | 'esims' | 'transfers' | 'cars';

export function BookingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { latitude, longitude } = useGeolocation({ watch: false });
  const nearestAirportCode = getNearestAirportCode(latitude ?? null, longitude ?? null);
  const sortedHinflug = sortFlightsByNearestAndCheapest(mockFlights, nearestAirportCode);
  const [activeTab, setActiveTab] = useState<BookingTab>('cards');
  const [tabSlideDirection, setTabSlideDirection] = useState(0);
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);
  const [selectedReturnFlightId, setSelectedReturnFlightId] = useState<string | null>(null);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [selectedEsimId, setSelectedEsimId] = useState<string | null>(null);
  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Ausgewählte Posten für den Gesamtpreis / Checkout zusammenstellen
  const selectedItems: CheckoutItem[] = [];
  const selFlight = sortedHinflug.find((f) => f.id === selectedFlightId);
  if (selFlight) selectedItems.push({ type: 'flight', id: selFlight.id, label: `Hinflug ${selFlight.departure.city} → ${selFlight.arrival.city}`, price: selFlight.price });
  const selReturn = (mockReturnFlights ?? []).find((f) => f.id === selectedReturnFlightId);
  if (selReturn) selectedItems.push({ type: 'return_flight', id: selReturn.id, label: `Rückflug ${selReturn.departure.city} → ${selReturn.arrival.city}`, price: selReturn.price });
  const selCar = mockCarRentals.find((c) => c.id === selectedCarId);
  if (selCar) selectedItems.push({ type: 'car', id: selCar.id, label: `Mietwagen ${selCar.carModel} (1 Tag)`, price: selCar.pricePerDay });
  const selEsim = (mockEsims ?? []).find((e) => e.id === selectedEsimId);
  if (selEsim) selectedItems.push({ type: 'esim', id: selEsim.id, label: `eSIM ${selEsim.region}`, price: selEsim.price });
  const selTransfer = mockTransfers.find((t) => t.id === selectedTransferId);
  if (selTransfer) selectedItems.push({ type: 'transfer', id: selTransfer.id, label: `Transfer ${selTransfer.route}`, price: selTransfer.price });
  const checkoutTotal = selectedItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (checkoutTotal <= 0 || checkoutLoading) return;
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      await redirectToCheckout({
        amount: Math.round(checkoutTotal * 100),
        name: `Tripura Buchung (${selectedItems.length} Posten)`,
        items: selectedItems,
      });
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Checkout fehlgeschlagen');
      setCheckoutLoading(false);
    }
  };

  const tabs = [
    { id: 'cards' as BookingTab, label: 'Kreditkarten', icon: CreditCard },
    { id: 'insurance' as BookingTab, label: 'Versicherungen', icon: Shield },
    { id: 'flights' as BookingTab, label: 'Flüge', icon: Plane },
    { id: 'esims' as BookingTab, label: 'eSIMs', icon: Smartphone },
    { id: 'transfers' as BookingTab, label: 'Transfers', icon: Bus },
    { id: 'cars' as BookingTab, label: 'Mietwagen', icon: Car },
  ];

  const setTab = (tab: BookingTab) => {
    const nextIdx = tabs.findIndex((t) => t.id === tab);
    const currIdx = tabs.findIndex((t) => t.id === activeTab);
    setTabSlideDirection(nextIdx - currIdx);
    setActiveTab(tab);
  };

  const TAB_SWIPE_OFFSET = 72;
  const TAB_TRANSITION = { duration: 0.3, ease: [0.32, 0.72, 0, 1] as const };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'cards':
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCreditCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-900 p-6 relative">
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-md" />
                  </div>
                  <div className="absolute bottom-4 left-6">
                    <p className="text-white/60 text-sm">{card.issuer}</p>
                    <p className="text-white font-semibold">{card.name}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Wallet className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">
                      {card.foreignTransactionFee === 0 ? 'Keine Auslandsgebühren' : `${card.foreignTransactionFee}% Gebühr`}
                    </span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {card.benefits.slice(0, 3).map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Jahresgebühr</p>
                      <p className="font-semibold text-gray-900">
                        {card.annualFee === 0 ? 'Kostenlos' : `${card.annualFee}€`}
                      </p>
                    </div>
                    <motion.a
                      href={card.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="apple-button text-sm py-2 px-4 flex items-center gap-2"
                    >
                      Beantragen
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'insurance':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            {mockInsurance.map((insurance, index) => (
              <motion.div
                key={insurance.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                    {insurance.type === 'travel' && <Shield className="w-8 h-8 text-white" />}
                    {insurance.type === 'health' && <HeartPulse className="w-8 h-8 text-white" />}
                    {insurance.type === 'cancellation' && <Clock className="w-8 h-8 text-white" />}
                    {insurance.type === 'luggage' && <Luggage className="w-8 h-8 text-white" />}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{insurance.name}</h4>
                    <p className="text-gray-500">{insurance.provider}</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {insurance.coverage.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Ab</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {insurance.pricePerDay}€
                      <span className="text-sm font-normal text-gray-500">/Tag</span>
                    </p>
                  </div>
                  <motion.a
                    href={insurance.bookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="apple-button text-sm py-2 px-4 flex items-center gap-2"
                  >
                    Buchen
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'flights':
        return (
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Hinflug</h4>
            <p className="text-xs text-gray-500 mb-2">Flüge vom nächsten Flughafen zu dir, plus günstigere Alternativen ab anderen Städten.</p>
            <div className="space-y-4">
            {sortedHinflug.map((flight, index) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow relative"
              >
                {flight.label === 'nearest' && (
                  <span className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs font-medium">
                    Nächster Flughafen zu dir
                  </span>
                )}
                {flight.label === 'cheaper_alternative' && (
                  <span className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-green-100 text-green-800 text-xs font-medium">
                    Günstigere Alternative
                  </span>
                )}
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex items-center gap-4 lg:w-48">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Plane className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{flight.airline}</p>
                      <p className="text-sm text-gray-500">{flight.flightNumber}</p>
                    </div>
                  </div>

                  {/* Flight route */}
                  <div className="flex-1 flex items-center justify-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 font-medium">Abflug</p>
                      <p className="text-xl font-bold text-gray-900">
                        {flight.departure.time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-sm font-medium text-gray-800">{flight.departure.city}</p>
                      {flight.departure.terminal && <p className="text-xs text-gray-500">Terminal {flight.departure.terminal}</p>}
                    </div>
                    
                    <div className="flex flex-col items-center px-4">
                      <p className="text-xs font-medium text-gray-600">{formatFlightDuration(flight.duration)}</p>
                      <div className="w-24 h-px bg-gray-300 relative">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-300" />
                      </div>
                      <p className="text-xs text-gray-500">{flight.stops === 0 ? 'Direktflug' : `${flight.stops} Stopp(s)`}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500 font-medium">Ankunft</p>
                      <p className="text-xl font-bold text-gray-900">
                        {flight.arrival.time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-sm font-medium text-gray-800">{flight.arrival.city}</p>
                      {flight.arrival.terminal && <p className="text-xs text-gray-500">Terminal {flight.arrival.terminal}</p>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-6 lg:w-48">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{flight.price} €</p>
                      <p className="text-xs text-gray-500 capitalize">{flight.class === 'premium_economy' ? 'Premium Economy' : flight.class}</p>
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => setSelectedFlightId(selectedFlightId === flight.id ? null : flight.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`text-sm py-2 px-4 rounded-xl font-medium flex items-center gap-2 ${selectedFlightId === flight.id ? 'bg-green-500 text-white' : 'apple-button'}`}
                    >
                      {selectedFlightId === flight.id ? <>Ausgewählt <Check className="w-4 h-4" /></> : 'Auswählen'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
            </div>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Rückflug</h4>
            <div className="space-y-4">
            {(mockReturnFlights ?? []).map((flight, index) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex items-center gap-4 lg:w-48">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Plane className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{flight.airline}</p>
                      <p className="text-sm text-gray-500">{flight.flightNumber}</p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 font-medium">Abflug</p>
                      <p className="text-xl font-bold text-gray-900">{flight.departure.time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="text-sm font-medium text-gray-800">{flight.departure.city}</p>
                      {flight.departure.terminal && <p className="text-xs text-gray-500">Terminal {flight.departure.terminal}</p>}
                    </div>
                    <div className="flex flex-col items-center px-3">
                      <p className="text-xs font-medium text-gray-600">{formatFlightDuration(flight.duration)}</p>
                      <div className="w-20 h-px bg-gray-300 relative">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500">{flight.stops === 0 ? 'Direktflug' : `${flight.stops} Stopp(s)`}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 font-medium">Ankunft</p>
                      <p className="text-xl font-bold text-gray-900">{flight.arrival.time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="text-sm font-medium text-gray-800">{flight.arrival.city}</p>
                      {flight.arrival.terminal && <p className="text-xs text-gray-500">Terminal {flight.arrival.terminal}</p>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between lg:justify-end gap-6 lg:w-48">
                    <div>
                      <p className="text-xl font-bold text-gray-900">{flight.price} €</p>
                      <p className="text-xs text-gray-500 capitalize">{flight.class === 'premium_economy' ? 'Premium Economy' : flight.class}</p>
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => setSelectedReturnFlightId(selectedReturnFlightId === flight.id ? null : flight.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`text-sm py-2 px-4 rounded-xl font-medium flex items-center gap-2 ${selectedReturnFlightId === flight.id ? 'bg-green-500 text-white' : 'apple-button'}`}
                    >
                      {selectedReturnFlightId === flight.id ? <>Ausgewählt <Check className="w-4 h-4" /></> : 'Auswählen'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
            </div>
          </div>
        );

      case 'cars':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            {mockCarRentals.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                  <img
                    src={car.image}
                    alt={car.carModel}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium">
                    {car.company}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{car.carModel}</h4>
                  <p className="text-gray-500 capitalize mb-4">{car.carType}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {car.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-600"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Pro Tag</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {car.pricePerDay}€
                      </p>
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => setSelectedCarId(selectedCarId === car.id ? null : car.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`text-sm py-2 px-4 rounded-xl font-medium flex items-center gap-2 ${
                        selectedCarId === car.id ? 'bg-green-500 text-white' : 'apple-button'
                      }`}
                    >
                      {selectedCarId === car.id ? <>Ausgewählt <Check className="w-4 h-4" /></> : 'Auswählen'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'esims':
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(mockEsims ?? []).map((esim, index) => (
              <motion.div
                key={esim.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-28 bg-gradient-to-br from-indigo-600 to-purple-700 p-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">{esim.provider}</p>
                    <p className="text-white font-semibold text-lg">{esim.region}</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Wifi className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm text-gray-600">
                      {esim.dataGB} GB · {esim.validityDays} Tage
                    </span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {esim.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <p className="text-xl font-bold text-gray-900">{esim.price}€</p>
                    <motion.button
                      type="button"
                      onClick={() => setSelectedEsimId(selectedEsimId === esim.id ? null : esim.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`text-sm py-2 px-4 rounded-xl font-medium flex items-center gap-2 ${
                        selectedEsimId === esim.id ? 'bg-green-500 text-white' : 'apple-button'
                      }`}
                    >
                      {selectedEsimId === esim.id ? <>Ausgewählt <Check className="w-4 h-4" /></> : 'Auswählen'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'transfers':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            {mockTransfers.map((transfer, index) => (
              <motion.div
                key={transfer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-24 bg-gradient-to-br from-slate-600 to-slate-700 p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Bus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{transfer.route}</p>
                    <p className="text-white/80 text-sm">{transfer.type}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-gray-600">{transfer.duration}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Preis</p>
                      <p className="text-2xl font-bold text-gray-900">{transfer.price}€</p>
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => setSelectedTransferId(selectedTransferId === transfer.id ? null : transfer.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`text-sm py-2 px-4 rounded-xl font-medium flex items-center gap-2 ${
                        selectedTransferId === transfer.id ? 'bg-green-500 text-white' : 'apple-button'
                      }`}
                    >
                      {selectedTransferId === transfer.id ? <>Ausgewählt <Check className="w-4 h-4" /></> : 'Auswählen'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );
    }
  };

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-6xl mx-auto rounded-3xl glass-card px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
        <div className="max-w-5xl mx-auto">
        {/* Section header – gleiches Layout wie die Karten darunter (dunkler Kopf, heller unterer Teil) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl shadow-lg overflow-hidden mb-8"
        >
          <div className="h-32 sm:h-36 bg-gradient-to-br from-gray-800 to-gray-900 p-6 relative flex flex-col justify-end">
            <div className="absolute top-4 right-4">
              <div className="w-12 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-md" />
            </div>
            <div className="relative">
              <p className="text-white/60 text-sm font-medium mb-1">Buchungen</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Alles an einem <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Ort buchen</span>
              </h2>
            </div>
          </div>
          <div className="p-6 bg-white">
            <p className="text-gray-600 leading-relaxed">
              Wähle Flüge, Transfers und mehr aus – alles in der App. Am Ende zahlst du einen Gesamtpreis bei uns.
            </p>
          </div>
        </motion.div>

        {/* Tabs mit Sliding-Highlight */}
        <LayoutGroup>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8 relative"
        >
          {tabs.map((tab) => (
            <div key={tab.id} className="relative">
              {activeTab === tab.id && (
                <motion.span
                  layoutId="bookingTabHighlight"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg -z-0"
                  aria-hidden
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTab(tab.id)}
                className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            </div>
          ))}
        </motion.div>
        </LayoutGroup>

        {/* Tab content mit seitlichem Swipe */}
        <div className="overflow-x-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{
              opacity: tabSlideDirection === 0 ? 1 : 0,
              x: tabSlideDirection === 0 ? 0 : tabSlideDirection > 0 ? TAB_SWIPE_OFFSET : -TAB_SWIPE_OFFSET,
            }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
              opacity: 0,
              x: tabSlideDirection >= 0 ? -TAB_SWIPE_OFFSET : TAB_SWIPE_OFFSET,
            }}
            transition={TAB_TRANSITION}
            style={{ willChange: 'transform' }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
        </div>

        {/* Checkout-Leiste: erscheint, sobald etwas ausgewählt ist */}
        <AnimatePresence>
          {checkoutTotal > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="mt-10 rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-[1.5px] shadow-xl"
            >
              <div className="rounded-3xl bg-white/95 backdrop-blur px-6 py-5 sm:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Deine Auswahl ({selectedItems.length} {selectedItems.length === 1 ? 'Posten' : 'Posten'})
                    </p>
                    <ul className="text-sm text-gray-700 space-y-0.5">
                      {selectedItems.map((item) => (
                        <li key={`${item.type}-${item.id}`} className="flex justify-between gap-4">
                          <span className="truncate">{item.label}</span>
                          <span className="font-medium whitespace-nowrap">{item.price} €</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col items-stretch sm:items-end gap-2">
                    <p className="text-2xl font-bold text-gray-900 text-right">{checkoutTotal} €</p>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleCheckout}
                      disabled={checkoutLoading}
                      className="px-8 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      {checkoutLoading ? 'Weiterleitung…' : 'Jetzt bezahlen'}
                    </motion.button>
                    <p className="text-xs text-gray-400 text-right">Stripe Test-Modus – keine echte Zahlung</p>
                  </div>
                </div>
                {checkoutError && (
                  <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-2.5">
                    {checkoutError}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
