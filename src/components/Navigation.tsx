import React from 'react'
import { NavLink } from 'react-router-dom'
import { Library, Plus, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { to: '/', icon: Library, label: 'Library' },
  { to: '/add-media', icon: Plus, label: 'Add' },
  { to: '/statistics', icon: BarChart3, label: 'Stats' },
]

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around py-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-black'
                    : 'text-gray-400 hover:text-gray-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <Icon size={20} strokeWidth={2} />
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -inset-2 bg-black/5 rounded-lg -z-10"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.div>
                  <span className="text-xs font-medium mt-1">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}