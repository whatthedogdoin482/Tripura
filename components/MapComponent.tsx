'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface MapComponentProps {
  center?: { lat: number; lng: number }
  zoom?: number
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void
}

export default function MapComponent({ 
  center = { lat: 40.7128, lng: -74.0060 }, 
  zoom = 10,
  onLocationSelect 
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places', 'geometry']
        })

        const { Map } = await loader.importLibrary('maps')
        const { Marker } = await loader.importLibrary('marker')
        const { Autocomplete } = await loader.importLibrary('places')

        if (mapRef.current) {
          const mapInstance = new Map(mapRef.current, {
            center,
            zoom,
            mapTypeId: 'roadmap',
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          })

          setMap(mapInstance)
          setIsLoading(false)

          // Add click listener for location selection
          mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
            if (event.latLng && onLocationSelect) {
              const lat = event.latLng.lat()
              const lng = event.latLng.lng()
              
              // Reverse geocoding to get address
              const geocoder = new google.maps.Geocoder()
              geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results?.[0]) {
                  onLocationSelect({
                    lat,
                    lng,
                    address: results[0].formatted_address
                  })
                }
              })
            }
          })
        }
      } catch (err) {
        setError('Failed to load Google Maps. Please check your API key.')
        setIsLoading(false)
      }
    }

    initMap()
  }, [center, zoom, onLocationSelect])

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-sm text-gray-500">Please check your Google Maps API key</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-96 rounded-lg" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
