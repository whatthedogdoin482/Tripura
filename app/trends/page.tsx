'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function TrendsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-blue-600">
                <span className="text-xl font-bold text-blue-600">P</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Tripura</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/home" className="text-gray-600 hover:text-blue-600 transition-colors">
                Planer
              </Link>
              <Link href="/activities" className="text-gray-600 hover:text-blue-600 transition-colors">
                Activities
              </Link>
              <Link href="/trends" className="text-blue-600 font-semibold">
                Trends
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Trends
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8"
          >
            Explore the latest travel trends and popular destinations. This page is coming soon!
          </motion.p>
          <Link href="/home">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Go to Home
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}

