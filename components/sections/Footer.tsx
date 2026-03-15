import { motion } from 'framer-motion';
import { Heart, Instagram, Twitter, Facebook, Github } from 'lucide-react';
import TripuraLogo from '@/components/TripuraLogo';

const footerLinks = {
  Product: ['Features', 'Pricing', 'API', 'Integrations'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Resources: ['Documentation', 'Help Center', 'Community', 'Contact'],
  Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
};

export function Footer() {
  return (
    <footer className="relative bg-gray-900 text-white pt-20 pb-32 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <motion.span className="inline-block mb-4" whileHover={{ scale: 1.02 }}>
              <TripuraLogo size="sm" showLabel labelClassName="text-white" />
            </motion.span>
            <p className="text-gray-400 mb-6 max-w-xs">
              KI-gestützte Reiseplanung für unvergessliche Abenteuer. 
              Plane smarter, reise besser.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Github].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © 2024 Wanderlust. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> in Berlin
          </p>
        </div>
      </div>
    </footer>
  );
}
