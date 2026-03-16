const withPWA = require('next-pwa')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dev-Popup unten links abschalten
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'maps.googleapis.com', pathname: '/**' },
    ],
  },
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  },
  // Next.js 16: leere Turbopack-Config, damit Webpack-Erweiterung (next-pwa) keinen Fehler wirft
  turbopack: {},
  // PWA-Optionen für next-pwa (Next warnt über unbekannten Key, wird aber an webpack durchgereicht)
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  },
}

module.exports = withPWA(nextConfig)
