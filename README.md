# Tripura - AI-Powered Vacation Planner

A modern web application for planning vacations with AI-powered route planning, stop recommendations, and personalized travel advice.

## Features

- 🗺️ **Interactive Map Integration** - Google Maps API for route planning
- 🤖 **AI-Powered Recommendations** - Smart suggestions for stops and activities
- 📱 **Progressive Web App** - Installable on mobile devices and app stores
- 🎨 **Modern UI/UX** - Beautiful, responsive design with smooth animations
- 🔥 **Special Offers** - Exclusive deals and promotions
- ⭐ **Best Locations & Activities** - Curated recommendations

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Maps**: Google Maps JavaScript API
- **PWA**: Next-PWA for app store deployment
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Maps API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tripura
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Google Maps API key to `.env.local`:
```
GOOGLE_MAPS_API_KEY=your_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment Options

### Progressive Web App (PWA)
The app is configured as a PWA and can be installed on:
- Mobile devices (iOS/Android)
- Desktop browsers
- App stores (Google Play Store, Microsoft Store)

### App Store Deployment

#### Google Play Store
1. Build the PWA: `npm run build`
2. Use tools like PWABuilder or Capacitor to create Android APK
3. Submit to Google Play Store

#### Microsoft Store
1. Use PWABuilder to create Windows app package
2. Submit to Microsoft Store

#### Apple App Store
1. Use Capacitor to create iOS app
2. Submit to Apple App Store

## Environment Variables

Create a `.env.local` file with:

```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Structure

```
tripura/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   ├── manifest.json
│   └── icons/
├── components/
├── lib/
├── next.config.js
├── tailwind.config.js
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
