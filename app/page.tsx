'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    
    // Check if window is available (SSR safety)
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #3282B8, #1B262C)' }}>
      {/* Header */}
      <header 
        className="sticky top-0 w-full z-50 transition-all duration-300 bg-transparent"
        style={isScrolled ? { 
          borderBottom: '2px solid #BBE1FA',
          backdropFilter: 'blur(8px)'
        } : {}}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#1B262C' }}>
                <img 
                  src="/logo.png" 
                  alt="Tripura Logo" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/home" className="text-[#1B262C] hover:text-[#BBE1FA] transition-colors font-bold font-family: 'Satoshi', sans-serif">
                Planer
              </Link>
              <Link href="/activities" className="text-[#1B262C] hover:text-[#BBE1FA] transition-colors font-bold font-family: 'Satoshi', sans-serif">
                Activities
              </Link>
              <Link href="/trends" className="text-[#1B262C] hover:text-[#BBE1FA] transition-colors font-bold font-family: 'Satoshi', sans-serif">
                Trends
              </Link>
              <button className="bg-[#BBE1FA] text-[#1B262C] hover:text-[#1B262C] px-6 py-2 rounded-full font-extrabold font-family: 'Satoshi', sans-serif transition-colors uppercase transition-all duration-200 hover:shadow-xl">
                LOGIN
              </button>
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-black mb-12 uppercase tracking-tight"
            style={{ color: '#1B262C' }}
          >
            PLAN YOUR FIRST TRIP
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/home">
              <button 
                className="px-12 py-4 rounded-full font-black font-family: 'Satoshi', sans-serif text-lg uppercase shadow-lg transition-all duration-200 hover:shadow-xl"
                style={{ 
                  backgroundColor: '#BBE1FA',
                  color: '#1B262C'
                }}
              >
                GET STARTED
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Content Blocks */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* First Content Block - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="ml-auto w-full max-w-2xl rounded-3xl p-8 shadow-lg"
            style={{ 
              backgroundColor: '#3282B8',
              boxShadow: '0 10px 25px rgba(97, 163, 207, 0.3)'
            }}
          >
            <h2 className="text-3xl font-black font-family: 'Satoshi', sans-serif mb-4 uppercase text-[#1B262C]">What is TRIPURA?</h2>
            <p className="text-lg leading-relaxed font-bold font-family: 'Satoshi', sans-serif text-[#1B262C]">
              Our goal is to make your <span className="font-black uppercase text-[#BBE1FA]">TRAVELING</span> experience as{' '}
              <span className="font-black uppercase text-[#BBE1FA]">EASY</span> as possible. So you can{' '}
              <span className="font-black uppercase text-[#BBE1FA]">SPENT MORE TIME</span> getting the best{' '}
              <span className="font-black uppercase text-[#BBE1FA]">EXPERIENCE</span> from your{' '}
              <span className="font-black uppercase text-[#BBE1FA]">TRIP</span> than planning.
            </p>
          </motion.div>

          {/* Dashed Line with X - First */}
          <div className="flex items-center justify-center my-8">
            <div className="flex items-center w-full max-w-2xl mx-auto">
              <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: '#BBE1FA' }}></div>
              <div className="mx-4 text-[#BBE1FA] text-2xl font-bold">×</div>
              <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: '#BBE1FA' }}></div>
            </div>
          </div>

          {/* Second Content Block - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mr-auto w-full max-w-2xl rounded-3xl p-8 shadow-lg"
            style={{ 
              backgroundColor: '#3282B8',
              boxShadow: '0 10px 25px rgba(97, 163, 207, 0.3)'
            }}
          >
            <h2 className="text-3xl font-black font-family: 'Satoshi', sans-serif mb-4 uppercase text-[#1B262C]">What is TRIPURA?</h2>
            <p className="text-lg leading-relaxed font-bold font-family: 'Satoshi', sans-serif text-[#1B262C]">
              Our goal is to make your <span className="font-black uppercase text-[#BBE1FA]">TRAVELING</span> experience as{' '}
              <span className="font-black uppercase text-[#BBE1FA]">EASY</span> as possible. So you can{' '}
              <span className="font-black uppercase text-[#BBE1FA]">SPENT MORE TIME</span> getting the best{' '}
              <span className="font-black uppercase text-[#BBE1FA]">EXPERIENCE</span> from your{' '}
              <span className="font-black uppercase text-[#BBE1FA]">TRIP</span> than planning.
            </p>
          </motion.div>

          {/* Dashed Line with X - Second */}
          <div className="flex items-center justify-center my-8">
            <div className="flex items-center w-full max-w-2xl mx-auto">
              <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: '#BBE1FA' }}></div>
              <div className="mx-4 text-[#BBE1FA] text-2xl font-bold">×</div>
              <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: '#BBE1FA' }}></div>
            </div>
          </div>

          {/* Third Content Block - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="ml-auto w-full max-w-2xl rounded-3xl p-8 shadow-lg mb-20"
            style={{ 
              backgroundColor: '#3282B8',
              boxShadow: '0 10px 25px rgba(97, 163, 207, 0.3)'
            }}
          >
            <h2 className="text-3xl font-black font-family: 'Satoshi', sans-serif mb-4 uppercase text-[#1B262C]">What is TRIPURA?</h2>
            <p className="text-lg leading-relaxed font-bold font-family: 'Satoshi', sans-serif text-[#1B262C]">
              Our goal is to make your <span className="font-black uppercase text-[#BBE1FA]">TRAVELING</span> experience as{' '}
              <span className="font-black uppercase text-[#BBE1FA]">EASY</span> as possible. So you can{' '}
              <span className="font-black uppercase text-[#BBE1FA]">SPENT MORE TIME</span> getting the best{' '}
              <span className="font-black uppercase text-[#BBE1FA]">EXPERIENCE</span> from your{' '}
              <span className="font-black uppercase text-[#BBE1FA]">TRIP</span> than planning.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
