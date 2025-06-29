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
    <>
      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 z-50 safe-area-pb">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="flex justify-around py-2 sm:py-3">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center py-2 px-3 sm:px-4 rounded-xl transition-all duration-300 min-w-0 ${
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
                          layoutId="activeTabMobile"
                          className="absolute -inset-2 bg-black/5 rounded-lg -z-10"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </motion.div>
                    <span className="text-xs font-medium mt-1 truncate">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-0 left-0 h-full w-64 xl:w-72 bg-white border-r border-gray-200 z-40">
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <Library size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">My Library</h1>
                <p className="text-sm text-gray-500">Track your media</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 p-4">
            <div className="space-y-2">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? 'bg-gray-900 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={20} strokeWidth={2} />
                      <span className="font-medium">{label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTabDesktop"
                          className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-400 text-center">
              <p>© 2024 My Library</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}