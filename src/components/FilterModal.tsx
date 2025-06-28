import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { MediaStatus, MediaType } from '../types/media'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  selectedFilter: MediaStatus | 'all'
  onFilterChange: (filter: MediaStatus | 'all') => void
  mediaType: MediaType
  sortBy: 'dateAdded' | 'title' | 'progress'
  onSortChange: (sort: 'dateAdded' | 'title' | 'progress') => void
  sortOrder: 'asc' | 'desc'
  onSortOrderChange: (order: 'asc' | 'desc') => void
}

export default function FilterModal({ 
  isOpen, 
  onClose, 
  selectedFilter, 
  onFilterChange, 
  mediaType,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange
}: FilterModalProps) {
  const getFilters = () => {
    const baseFilters = [{ key: 'all', label: 'All' }] as const
    
    if (mediaType === 'book') {
      return [
        ...baseFilters,
        { key: 'to-read', label: 'To Read' },
        { key: 'reading', label: 'Currently Reading' },
        { key: 'completed', label: 'Completed' },
      ] as const
    } else {
      return [
        ...baseFilters,
        { key: 'to-watch', label: 'To Watch' },
        { key: 'watching', label: 'Currently Watching' },
        { key: 'completed', label: 'Completed' },
      ] as const
    }
  }

  const sortOptions = [
    { key: 'dateAdded', label: 'Date Added' },
    { key: 'title', label: 'Title' },
    { key: 'progress', label: 'Progress' },
  ] as const

  const filters = getFilters()

  const handleApply = () => {
    onClose()
  }

  const handleReset = () => {
    onFilterChange('all')
    onSortChange('dateAdded')
    onSortOrderChange('desc')
  }

  const getSortOrderOptions = () => {
    if (sortBy === 'title') {
      return [
        { key: 'asc', label: 'A to Z' },
        { key: 'desc', label: 'Z to A' },
      ]
    } else if (sortBy === 'progress') {
      return [
        { key: 'asc', label: 'Lowest First' },
        { key: 'desc', label: 'Highest First' },
      ]
    } else {
      return [
        { key: 'desc', label: 'Newest First' },
        { key: 'asc', label: 'Oldest First' },
      ]
    }
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
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-black">Filter & Sort</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </motion.button>
              </div>
            </div>

            <div className="p-4 space-y-6">
              {/* Status Filter */}
              <div>
                <h3 className="text-sm font-semibold text-black mb-3">Status</h3>
                <div className="space-y-2">
                  {filters.map(({ key, label }) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => onFilterChange(key)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
                        selectedFilter === key
                          ? 'bg-black text-white'
                          : 'bg-gray-50 text-black hover:bg-gray-100'
                      }`}
                    >
                      <span>{label}</span>
                      {selectedFilter === key && (
                        <Check size={14} className="text-white" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="text-sm font-semibold text-black mb-3">Sort By</h3>
                <div className="space-y-2">
                  {sortOptions.map(({ key, label }) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => onSortChange(key)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
                        sortBy === key
                          ? 'bg-black text-white'
                          : 'bg-gray-50 text-black hover:bg-gray-100'
                      }`}
                    >
                      <span>{label}</span>
                      {sortBy === key && (
                        <Check size={14} className="text-white" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <h3 className="text-sm font-semibold text-black mb-3">Order</h3>
                <div className="flex gap-2">
                  {getSortOrderOptions().map(({ key, label }) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSortOrderChange(key as 'asc' | 'desc')}
                      className={`flex-1 p-3 rounded-xl text-sm font-medium transition-colors ${
                        sortOrder === key
                          ? 'bg-black text-white'
                          : 'bg-gray-50 text-black hover:bg-gray-100'
                      }`}
                    >
                      {label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="flex-1 py-3 px-4 bg-gray-50 text-black text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Reset
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApply}
                  className="flex-1 py-3 px-4 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Apply
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}