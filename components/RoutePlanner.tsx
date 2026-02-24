'use client'

import { useState, useRef } from 'react'
import { MapPin, Navigation, Clock, DollarSign, Route, Plus, X, Search, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import MapComponent from './MapComponent'

async function geocodeCity(query: string): Promise<{ lat: number; lng: number; displayName: string } | null> {
  if (!query.trim()) return null
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query.trim())}&format=json&limit=1`,
      { headers: { 'User-Agent': 'TripuraTravelApp/1.0' } }
    )
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) return null
    const first = data[0]
    return {
      lat: parseFloat(first.lat),
      lng: parseFloat(first.lon),
      displayName: first.display_name || query,
    }
  } catch {
    return null
  }
}

interface Stop {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  duration: number // in hours
  cost: number
  type: 'attraction' | 'restaurant' | 'accommodation' | 'other'
}

interface RoutePlannerProps {
  onClose?: () => void
  onRouteCreate?: () => void
}

export default function RoutePlanner({ onClose, onRouteCreate }: RoutePlannerProps) {
  const [stops, setStops] = useState<Stop[]>([])
  const [isAddingStop, setIsAddingStop] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [newStopName, setNewStopName] = useState('')
  const [newStopDuration, setNewStopDuration] = useState(24)
  const [newStopCost, setNewStopCost] = useState(0)
  const [newStopType, setNewStopType] = useState<Stop['type']>('attraction')
  const [citySearchQuery, setCitySearchQuery] = useState('')
  const [citySearchDays, setCitySearchDays] = useState(1)
  const [citySearchLoading, setCitySearchLoading] = useState(false)
  const [editingDurationId, setEditingDurationId] = useState<string | null>(null)

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setSelectedLocation(location)
    setIsAddingStop(true)
  }

  const addStop = () => {
    if (!selectedLocation || !newStopName.trim()) return

    const newStop: Stop = {
      id: Date.now().toString(),
      name: newStopName,
      address: selectedLocation.address,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      duration: newStopDuration,
      cost: newStopCost,
      type: newStopType
    }

    setStops(prev => [...prev, newStop])
    setSelectedLocation(null)
    setNewStopName('')
    setNewStopDuration(24)
    setNewStopCost(0)
    setNewStopType('attraction')
    setIsAddingStop(false)
  }

  const removeStop = (id: string) => {
    setStops(prev => prev.filter(stop => stop.id !== id))
    setEditingDurationId((prev) => (prev === id ? null : prev))
  }

  const addCityFromSearch = async () => {
    if (!citySearchQuery.trim()) return
    setCitySearchLoading(true)
    const result = await geocodeCity(citySearchQuery)
    setCitySearchLoading(false)
    if (!result) return
    const hours = Math.max(0.5, citySearchDays * 24)
    const newStop: Stop = {
      id: Date.now().toString(),
      name: citySearchQuery.trim(),
      address: result.displayName,
      lat: result.lat,
      lng: result.lng,
      duration: hours,
      cost: 0,
      type: 'other',
    }
    setStops((prev) => [...prev, newStop])
    setCitySearchQuery('')
    setCitySearchDays(1)
  }

  const updateStopDuration = (id: string, hours: number) => {
    setStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, duration: Math.max(24, hours) } : s))
    )
    setEditingDurationId(null)
  }

  const calculateTotalDuration = () => {
    return stops.reduce((total, stop) => total + stop.duration, 0)
  }

  const calculateTotalCost = () => {
    return stops.reduce((total, stop) => total + stop.cost, 0)
  }

  const getTypeIcon = (type: Stop['type']) => {
    switch (type) {
      case 'attraction': return '🎯'
      case 'restaurant': return '🍽️'
      case 'accommodation': return '🏨'
      default: return '📍'
    }
  }

  const getTypeColor = (type: Stop['type']) => {
    switch (type) {
      case 'attraction': return { backgroundColor: '#BBE1FA', color: '#1B262C' }
      case 'restaurant': return { backgroundColor: '#BBE1FA', color: '#1B262C' }
      case 'accommodation': return { backgroundColor: '#BBE1FA', color: '#1B262C' }
      default: return { backgroundColor: '#BBE1FA', color: '#1B262C' }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative rounded-3xl shadow-2xl w-full max-w-6xl h-[700px] flex flex-col overflow-hidden"
        style={{ 
          backgroundColor: '#3282B8',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2" style={{ borderColor: '#BBE1FA' }}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1B262C' }}>
              <Route className="w-6 h-6" style={{ color: '#BBE1FA' }} />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase" style={{ color: '#1B262C' }}>Routenplaner</h3>
              <p className="text-sm font-bold" style={{ color: '#BBE1FA' }}>Plane deine perfekte Urlaubsroute</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="font-bold transition-colors"
              style={{ color: '#BBE1FA' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1B262C'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#BBE1FA'}
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Map Section */}
          <div className="flex-1 p-6">
            <div className="h-full">
              <MapComponent
                onLocationSelect={handleLocationSelect}
                center={{ lat: 40.7128, lng: -74.0060 }}
                zoom={10}
              />
              <p className="text-sm font-bold mt-2 text-center" style={{ color: '#BBE1FA' }}>
                Klicke auf die Karte, um Stopps zu deiner Route hinzuzufügen
              </p>
            </div>
          </div>

          {/* Stops Panel */}
          <div className="w-96 border-l-2 flex flex-col" style={{ borderColor: '#BBE1FA' }}>
            <div className="p-6 border-b-2" style={{ borderColor: '#BBE1FA' }}>
              <h4 className="font-black uppercase mb-4" style={{ color: '#1B262C' }}>Deine Stopps</h4>

              {/* Stadt suchen */}
              <div className="mb-4 space-y-3">
                <label className="block text-sm font-bold uppercase" style={{ color: '#BBE1FA' }}>
                  Stadt suchen
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#BBE1FA' }} />
                    <input
                      type="text"
                      value={citySearchQuery}
                      onChange={(e) => setCitySearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCityFromSearch()}
                      placeholder="z.B. Berlin, Paris"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: '#1B262C',
                        color: '#BBE1FA',
                        border: '2px solid rgba(187, 225, 250, 0.5)',
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm font-bold" style={{ color: '#BBE1FA' }}>
                    <Calendar className="w-4 h-4" />
                    Aufenthalt
                  </label>
                  <select
                    value={citySearchDays}
                    onChange={(e) => setCitySearchDays(Number(e.target.value))}
                    className="rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#BBE1FA]"
                    style={{
                      backgroundColor: '#1B262C',
                      color: '#BBE1FA',
                      border: '2px solid rgba(187, 225, 250, 0.5)',
                    }}
                  >
                    {[1, 2, 3, 4, 5, 7, 10, 14].map((d) => (
                      <option key={d} value={d}>
                        {d} {d === 1 ? 'Tag' : 'Tage'}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addCityFromSearch}
                    disabled={!citySearchQuery.trim() || citySearchLoading}
                    className="rounded-xl px-4 py-2 text-sm font-black uppercase transition-opacity disabled:opacity-50"
                    style={{ backgroundColor: '#BBE1FA', color: '#1B262C' }}
                  >
                    {citySearchLoading ? '…' : 'Hinzufügen'}
                  </button>
                </div>
              </div>
              
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="rounded-full p-3 text-center" style={{ backgroundColor: '#1B262C' }}>
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <Clock className="w-4 h-4" style={{ color: '#BBE1FA' }} />
                    <span className="text-sm font-bold uppercase" style={{ color: '#BBE1FA' }}>Dauer</span>
                  </div>
                  <p className="text-lg font-black" style={{ color: '#BBE1FA' }}>
                  {Math.round(calculateTotalDuration() / 24)} {Math.round(calculateTotalDuration() / 24) === 1 ? 'Tag' : 'Tage'}
                </p>
                </div>
                <div className="rounded-full p-3 text-center" style={{ backgroundColor: '#1B262C' }}>
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <DollarSign className="w-4 h-4" style={{ color: '#BBE1FA' }} />
                    <span className="text-sm font-bold uppercase" style={{ color: '#BBE1FA' }}>Gesamtkosten</span>
                  </div>
                  <p className="text-lg font-black" style={{ color: '#BBE1FA' }}>{calculateTotalCost()} €</p>
                </div>
              </div>
            </div>

            {/* Stops List */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence>
                {stops.map((stop, index) => (
                  <motion.div
                    key={stop.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="rounded-3xl p-4 mb-3 border-2"
                    style={{ 
                      backgroundColor: '#1B262C',
                      borderColor: '#BBE1FA',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">{getTypeIcon(stop.type)}</span>
                          <h5 className="font-black uppercase" style={{ color: '#BBE1FA' }}>{stop.name}</h5>
                          <span className="px-2 py-1 rounded-full text-xs font-black uppercase" style={getTypeColor(stop.type)}>
                            {stop.type}
                          </span>
                        </div>
                        <p className="text-sm font-bold mb-2" style={{ color: '#BBE1FA' }}>{stop.address}</p>
                        <div className="flex items-center flex-wrap gap-3 text-sm font-bold" style={{ color: '#BBE1FA' }}>
                          {editingDurationId === stop.id ? (
                            <div className="flex items-center gap-2">
                              <span>Aufenthalt (Tage):</span>
                              <select
                                value={Math.round(stop.duration / 24) || 1}
                                onChange={(e) => updateStopDuration(stop.id, Number(e.target.value) * 24)}
                                className="rounded-lg px-2 py-1 text-sm font-bold focus:outline-none"
                                style={{
                                  backgroundColor: '#3282B8',
                                  color: '#BBE1FA',
                                  border: '1px solid #BBE1FA',
                                }}
                              >
                                {[1, 2, 3, 4, 5, 7, 10, 14].map((d) => (
                                  <option key={d} value={d}>
                                    {d} {d === 1 ? 'Tag' : 'Tage'}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => setEditingDurationId(null)}
                                className="text-xs font-black uppercase"
                                style={{ color: '#BBE1FA' }}
                              >
                                OK
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setEditingDurationId(stop.id)}
                              className="flex items-center space-x-1 hover:underline"
                            >
                              <Clock className="w-3 h-3" />
                              <span>
                                {Math.round(stop.duration / 24)} {Math.round(stop.duration / 24) === 1 ? 'Tag' : 'Tage'}
                              </span>
                            </button>
                          )}
                          <span className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span>{stop.cost} €</span>
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeStop(stop.id)}
                        className="transition-colors ml-2"
                        style={{ color: '#BBE1FA' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#1B262C'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#BBE1FA'}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {stops.length === 0 && (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 mx-auto mb-4" style={{ color: '#BBE1FA' }} />
                  <p className="font-bold" style={{ color: '#BBE1FA' }}>Noch keine Stopps</p>
                  <p className="text-sm font-bold" style={{ color: '#BBE1FA' }}>Klicke auf die Karte, um den ersten Stopp hinzuzufügen</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t-2" style={{ borderColor: '#BBE1FA' }}>
              <button 
                className="w-full py-3 px-4 rounded-full font-black uppercase transition-all duration-200 flex items-center justify-center space-x-2"
                style={{ 
                  backgroundColor: '#BBE1FA',
                  color: '#1B262C'
                }}
                onClick={() => {
                  onRouteCreate?.()
                  onClose?.()
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1B262C'
                  e.currentTarget.style.color = '#BBE1FA'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#BBE1FA'
                  e.currentTarget.style.color = '#1B262C'
                }}
              >
                <Navigation className="w-4 h-4" />
                <span>Route erstellen</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add Stop Modal */}
        <AnimatePresence>
          {isAddingStop && selectedLocation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="rounded-3xl p-6 w-full max-w-md border-2"
                style={{ 
                  backgroundColor: '#3282B8',
                  borderColor: '#BBE1FA',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
                }}
              >
                <h4 className="text-lg font-black uppercase mb-4" style={{ color: '#1B262C' }}>Add Stop</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-black uppercase mb-2" style={{ color: '#1B262C' }}>
                      Name des Stopps
                    </label>
                    <input
                      type="text"
                      value={newStopName}
                      onChange={(e) => setNewStopName(e.target.value)}
                      placeholder="Enter stop name"
                      className="w-full rounded-full px-3 py-2 font-bold focus:outline-none"
                      style={{ 
                        backgroundColor: '#1B262C',
                        color: '#BBE1FA',
                        border: '2px solid #BBE1FA'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black uppercase mb-2" style={{ color: '#1B262C' }}>
                      Art
                    </label>
                    <select
                      value={newStopType}
                      onChange={(e) => setNewStopType(e.target.value as Stop['type'])}
                      className="w-full rounded-full px-3 py-2 font-bold focus:outline-none"
                      style={{ 
                        backgroundColor: '#1B262C',
                        color: '#BBE1FA',
                        border: '2px solid #BBE1FA'
                      }}
                    >
                      <option value="attraction">🎯 Sehenswürdigkeit</option>
                      <option value="restaurant">🍽️ Restaurant</option>
                      <option value="accommodation">🏨 Unterkunft</option>
                      <option value="other">📍 Sonstiges</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black uppercase mb-2" style={{ color: '#1B262C' }}>
                        Aufenthaltsdauer
                      </label>
                      <select
                        value={newStopDuration}
                        onChange={(e) => setNewStopDuration(Number(e.target.value))}
                        className="w-full rounded-full px-3 py-2 font-bold focus:outline-none"
                        style={{ 
                          backgroundColor: '#1B262C',
                          color: '#BBE1FA',
                          border: '2px solid #BBE1FA'
                        }}
                      >
                        <option value={24}>1 Tag</option>
                        <option value={48}>2 Tage</option>
                        <option value={72}>3 Tage</option>
                        <option value={96}>4 Tage</option>
                        <option value={120}>5 Tage</option>
                        <option value={168}>7 Tage</option>
                        <option value={240}>10 Tage</option>
                        <option value={336}>14 Tage</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-black uppercase mb-2" style={{ color: '#1B262C' }}>
                        Kosten (€)
                      </label>
                      <input
                        type="number"
                        value={newStopCost}
                        onChange={(e) => setNewStopCost(Number(e.target.value))}
                        min="0"
                        step="0.01"
                        className="w-full rounded-full px-3 py-2 font-bold focus:outline-none"
                        style={{ 
                          backgroundColor: '#1B262C',
                          color: '#BBE1FA',
                          border: '2px solid #BBE1FA'
                        }}
                      />
                    </div>
                  </div>

                  <p className="text-sm font-bold" style={{ color: '#BBE1FA' }}>
                    Adresse: {selectedLocation.address}
                  </p>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setIsAddingStop(false)
                      setSelectedLocation(null)
                    }}
                    className="flex-1 py-2 px-4 rounded-full font-black uppercase transition-all duration-200 border-2"
                    style={{ 
                      borderColor: '#BBE1FA',
                      color: '#BBE1FA',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1B262C'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={addStop}
                    className="flex-1 py-2 px-4 rounded-full font-black uppercase transition-all duration-200"
                    style={{ 
                      backgroundColor: '#BBE1FA',
                      color: '#1B262C'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1B262C'
                      e.currentTarget.style.color = '#BBE1FA'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#BBE1FA'
                      e.currentTarget.style.color = '#1B262C'
                    }}
                  >
                    Stopp hinzufügen
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
