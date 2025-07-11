import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogOut, Settings, HelpCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
      alert('Failed to sign out. Please try again.')
    }
  }

  const handleSettings = () => {
    alert('Settings feature coming soon!')
    setIsOpen(false)
  }

  const handleHelp = () => {
    alert('Help & Support feature coming soon!')
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
      >
        <User size={18} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
            >
              <div className="p-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500">
                  Signed in
                </p>
              </div>
              
              <div className="p-2">
                <motion.button
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSettings}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 rounded-lg transition-colors"
                >
                  <Settings size={16} className="flex-shrink-0" />
                  <span className="truncate">Settings</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleHelp}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 rounded-lg transition-colors"
                >
                  <HelpCircle size={16} className="flex-shrink-0" />
                  <span className="truncate">Help & Support</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ backgroundColor: '#fef2f2' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:text-red-700 rounded-lg transition-colors"
                >
                  <LogOut size={16} className="flex-shrink-0" />
                  <span className="truncate">Sign Out</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}