'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface LegalPageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

/** Gemeinsames Layout für Impressum / Datenschutz / AGB im Landing-Page-Stil. */
export function LegalPage({ title, subtitle, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Zurück zur Startseite
          </Link>
          <h1 className="text-4xl font-bold heading-purple-gradient mb-2">{title}</h1>
          {subtitle && <p className="text-gray-500 mb-8">{subtitle}</p>}
          <div className="glass-card rounded-3xl p-8 sm:p-10 prose-sm sm:prose max-w-none text-gray-700 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2:first-child]:mt-0 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:mb-1">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
