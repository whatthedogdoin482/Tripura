'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  MapPin,
  PlusCircle,
  Wallet,
  CreditCard,
  Shield,
  Settings,
  HelpCircle,
} from 'lucide-react'

const navItems = [
  { href: '/home', label: 'Meine Reisen', icon: MapPin },
  { href: '/home', label: 'Neue Reise planen', icon: PlusCircle },
  { href: '/budget', label: 'Budget-Übersicht', icon: Wallet },
  { href: '/credit-cards', label: 'Reise-Kreditkarten', icon: CreditCard },
  { href: '/insurance', label: 'Versicherungen', icon: Shield },
  { href: '/settings', label: 'Einstellungen', icon: Settings },
  { href: '/support', label: 'Hilfe & Support', icon: HelpCircle },
]

interface SideNavProps {
  open: boolean
  onClose: () => void
}

export default function SideNav({ open, onClose }: SideNavProps) {
  const pathname = usePathname()

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100]"
            style={{ backgroundColor: 'transparent' }}
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-72 z-[101] flex flex-col shadow-2xl"
            style={{
              backgroundColor: '#3282B8',
              borderRight: '2px solid #4698cf',
            }}
          >
            <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: 'rgba(187, 225, 250, 0.3)' }}>
              <span className="text-lg font-black" style={{ color: '#1B262C' }}>
                Menü
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="p-2 rounded-full transition-opacity hover:opacity-80 relative z-10"
                style={{ backgroundColor: '#1B262C', color: '#BBE1FA' }}
                aria-label="Menü schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <li key={item.href + item.label}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-colors"
                        style={{
                          backgroundColor: isActive ? '#BBE1FA' : 'transparent',
                          color: isActive ? '#1B262C' : '#BBE1FA',
                        }}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

export function HamburgerButton({
  onClick,
  className = '',
}: {
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-xl transition-opacity hover:opacity-80 ${className}`}
      style={{ color: '#BBE1FA' }}
      aria-label="Menü öffnen"
    >
      <Menu className="w-6 h-6" />
    </button>
  )
}
