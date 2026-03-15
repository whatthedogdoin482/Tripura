import type { Metadata, Viewport } from 'next'
import './globals.css'
import AppShell from '@/components/AppShell'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'Tripura – Dein Urlaubsplaner',
  description: 'Plane deinen perfekten Urlaub mit KI-Routenplanung, Stopp-Empfehlungen und persönlicher Reiseberatung.',
  keywords: 'Urlaubsplaner, Reise, KI, Routenplanung, Tourismus',
  authors: [{ name: 'Tripura Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.PNG',
    apple: '/logo.PNG',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3282B8',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3282B8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Tripura" />
      </head>
      <body className="antialiased" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
