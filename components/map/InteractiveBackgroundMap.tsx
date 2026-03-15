'use client';

import { useEffect, useRef, useState } from 'react';

interface InteractiveBackgroundMapProps {
  center: [number, number];
  zoom?: number;
  className?: string;
  /** Leichtes Zoomen/Draggen erlauben (false = rein Hintergrund) */
  interactive?: boolean;
}

/**
 * Interaktive Karte nur mit Leaflet (kein react-leaflet).
 * Wird erst im Browser geladen, um SSR-Probleme zu vermeiden.
 * Stil: saubere Kacheln (CartoDB Light), ähnlich TopoExport.
 */
export default function InteractiveBackgroundMap({
  center,
  zoom = 12,
  className = '',
  interactive = false,
}: InteractiveBackgroundMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ map: unknown; L: unknown } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Leaflet-CSS nur im Browser laden, damit die Karte (Kacheln, Container) richtig dargestellt wird
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = 'leaflet-css';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    let cancelled = false;

    import('leaflet').then((L) => {
      if (cancelled || !containerRef.current) return;
      const Leaflet = L.default;
      const map = Leaflet.map(containerRef.current, {
        center,
        zoom,
        zoomControl: false,
        attributionControl: false,
        dragging: interactive,
        touchZoom: interactive,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
      });

      // Saubere, helle Kacheln (TopoExport-ähnlich)
      Leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = { map, L: Leaflet };
      setMounted(true);
    }).catch(() => setMounted(false));

    return () => {
      cancelled = true;
      if (mapRef.current && typeof (mapRef.current.map as { remove: () => void }).remove === 'function') {
        (mapRef.current.map as { remove: () => void }).remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Center/zoom aktualisieren wenn sich props ändern
  useEffect(() => {
    if (!mapRef.current || !mounted) return;
    const m = mapRef.current.map as { setView: (c: [number, number], z: number) => void };
    if (m.setView) m.setView(center, zoom);
  }, [center, zoom, mounted]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <div ref={containerRef} className="absolute inset-0 w-full h-full min-h-[400px]" />
    </div>
  );
}
