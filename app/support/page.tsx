'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function SupportPage() {
  return (
    <div
      className="min-h-screen"
    >
      <header
        className="sticky top-0 z-30 flex items-center gap-4 px-4 py-4"
        style={{ borderBottom: '2px solid #BBE1FA', backdropFilter: 'blur(8px)' }}
      >
        <Link href="/home" className="p-2 rounded-full" style={{ backgroundColor: '#1B262C', color: '#BBE1FA' }} aria-label="Back">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-black" style={{ color: '#BBE1FA' }}>Hilfe & Support</h1>
      </header>
      <main className="max-w-lg mx-auto p-6">
        <p className="font-bold" style={{ color: '#BBE1FA' }}>Hilfe und Support demnächst verfügbar.</p>
      </main>
    </div>
  )
}
