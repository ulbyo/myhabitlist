import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function SearchModal({ isOpen, onClose, searchQuery, onSearchChange }: SearchModalProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Focus input after animation completes
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  useEffect(() => {
    setLocalQuery(searchQuery)
  }, [searchQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(localQuery.trim())
    onClose()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalQuery(value)
    // Real-time search as user types
    onSearchChange(value.trim())
  }

  const handleCancel = () => {
    setLocalQuery(searchQuery) // Reset to original query
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={handleCancel}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-200 z-50"
          >
            <div className="max-w-4xl mx-auto px-4 py-4">
              <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={localQuery}
                    onChange={handleInputChange}
                    placeholder="Search titles, authors, directors..."
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                  {localQuery && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      type="button"
                      onClick={() => {
                        setLocalQuery('')
                        onSearchChange('')
                        inputRef.current?.focus()
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <X size={14} className="text-gray-400" />
                    </motion.button>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm text-black font-medium hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}