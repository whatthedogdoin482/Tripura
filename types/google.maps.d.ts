/* Minimal Google Maps types for MapComponent (full types: npm i -D @types/google.maps) */
declare namespace google.maps {
  class Map {
    constructor(el: HTMLElement, opts?: object)
    addListener(event: string, handler: (e: MapMouseEvent) => void): void
  }
  interface MapMouseEvent {
    latLng: { lat(): number; lng(): number } | null
  }
  class Geocoder {
    geocode(
      request: { location: { lat: number; lng: number } },
      callback: (results: { formatted_address: string }[] | null, status: string) => void
    ): void
  }
}
