'use client';

interface HeroMapProps {
  center: [number, number];
  zoom?: number;
  userLocation?: { lat: number; lng: number } | null;
  markers?: { lat: number; lng: number }[];
  showBlurOverlay?: boolean;
  interactive?: boolean;
  className?: string;
}

/** Dezentes Karten-Hintergrundbild im Hero – Tripura-Farben, kein externer Tile. */
export default function HeroMap({
  showBlurOverlay = true,
  className = '',
}: HeroMapProps) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Weicher Verlauf in Tripura-Farben – wirkt wie Himmel/Reise, ohne pixelige Karte */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 50% 20%, rgba(52, 130, 184, 0.5) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 80% 80%, rgba(27, 38, 44, 0.6) 0%, transparent 45%),
            linear-gradient(180deg, #1B262C 0%, #253943 25%, #3282B8 50%, #2a6b9e 75%, #1B262C 100%)
          `,
        }}
      />
      {showBlurOverlay && (
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40"
          aria-hidden
        />
      )}
    </div>
  );
}
