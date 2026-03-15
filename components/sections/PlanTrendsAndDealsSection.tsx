'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Tag, Users } from 'lucide-react';
import { mockTrendBookings, mockCheapestTrips } from '@/data/mockData';

export function PlanTrendsAndDealsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-14">
        {/* Trends – was viele buchen */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900">Trends – was viele buchen</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {mockTrendBookings.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group rounded-2xl overflow-hidden glass-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white/90 text-xs font-medium flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {item.bookings}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 truncate">{item.title}</h4>
                  <p className="text-sm text-gray-500 truncate">{item.subtitle}</p>
                  <p className="mt-2 text-lg font-bold text-gray-900">ab {item.price} €</p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>

        {/* Aktuell günstigste Reisen */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Tag className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Aktuell günstigste Reisen</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {mockCheapestTrips.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
                className="group rounded-2xl overflow-hidden glass-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-green-500/90 text-white text-xs font-semibold">
                    Günstig
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 truncate">{item.title}</h4>
                  <p className="text-sm text-gray-500 truncate">{item.subtitle}</p>
                  <p className="mt-2 text-lg font-bold text-green-700">ab {item.price} €</p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
