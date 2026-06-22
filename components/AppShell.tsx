'use client'

import { CookieBanner } from '@/components/CookieBanner'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-page-gradient min-h-screen">
      {children}
      <CookieBanner />
    </div>
  )
}
