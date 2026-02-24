'use client'

import { useState, useRef } from 'react'
import { MapPin, Navigation, Clock, DollarSign, Route, Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import MapComponent from './MapComponent'

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
}

export default function RoutePlanner({ onClose }: RoutePlannerProps) {
  const [stops, setStops] = useState<Stop[]>([])
  const [isAddingStop, setIsAddingStop] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [newStopName, setNewStopName] = useState('')
  const [newStopDuration, setNewStopDuration] = useState(2)
  const [newStopCost, setNewStopCost] = useState(0)
  const [newStopType, setNewStopType] = useState<Stop['type']>('attraction')

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
    setNewStopDuration(2)
    setNewStopCost(0)
    setNewStopType('attraction')
    setIsAddingStop(false)
  }

  const removeStop = (id: string) => {
    setStops(prev => prev.filter(stop => stop.id !== id))
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
        className="rounded-3xl shadow-2xl w-full max-w-6xl h-[700px] flex flex-col"
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
              <h3 className="text-lg font-black uppercase" style={{ color: '#1B262C' }}>Route Planner</h3>
              <p className="text-sm font-bold" style={{ color: '#BBE1FA' }}>Plan your perfect vacation route</p>
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
                Click on the map to add stops to your route
              </p>
            </div>
          </div>

          {/* Stops Panel */}
          <div className="w-96 border-l-2 flex flex-col" style={{ borderColor: '#BBE1FA' }}>
            <div className="p-6 border-b-2" style={{ borderColor: '#BBE1FA' }}>
              <h4 className="font-black uppercase mb-4" style={{ color: '#1B262C' }}>Your Route Stops</h4>
              
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="rounded-full p-3 text-center" style={{ backgroundColor: '#1B262C' }}>
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <Clock className="w-4 h-4" style={{ color: '#BBE1FA' }} />
                    <span className="text-sm font-bold uppercase" style={{ color: '#BBE1FA' }}>Duration</span>
                  </div>
                  <p className="text-lg font-black" style={{ color: '#BBE1FA' }}>{calculateTotalDuration()}h</p>
                </div>
                <div className="rounded-full p-3 text-center" style={{ backgroundColor: '#1B262C' }}>
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <DollarSign className="w-4 h-4" style={{ color: '#BBE1FA' }} />
                    <span className="text-sm font-bold uppercase" style={{ color: '#BBE1FA' }}>Total Cost</span>
                  </div>
                  <p className="text-lg font-black" style={{ color: '#BBE1FA' }}>${calculateTotalCost()}</p>
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
                        <div className="flex items-center space-x-4 text-sm font-bold" style={{ color: '#BBE1FA' }}>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{stop.duration}h</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span>${stop.cost}</span>
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
                  <p className="font-bold" style={{ color: '#BBE1FA' }}>No stops added yet</p>
                  <p className="text-sm font-bold" style={{ color: '#BBE1FA' }}>Click on the map to add your first stop</p>
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
                <span>Generate Route</span>
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
                      Stop Name
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
                      Type
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
                      <option value="attraction">🎯 Attraction</option>
                      <option value="restaurant">🍽️ Restaurant</option>
                      <option value="accommodation">🏨 Accommodation</option>
                      <option value="other">📍 Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black uppercase mb-2" style={{ color: '#1B262C' }}>
                        Duration (hours)
                      </label>
                      <input
                        type="number"
                        value={newStopDuration}
                        onChange={(e) => setNewStopDuration(Number(e.target.value))}
                        min="0.5"
                        step="0.5"
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
                        Cost ($)
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
                    Location: {selectedLocation.address}
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
                    Cancel
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
                    Add Stop
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
