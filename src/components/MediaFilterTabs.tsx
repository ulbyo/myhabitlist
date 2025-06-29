import { motion } from 'framer-motion'
import { MediaStatus, MediaType } from '../types/media'

interface MediaFilterTabsProps {
  selectedFilter: MediaStatus | 'all' | 'bookmarked'
  onFilterChange: (filter: MediaStatus | 'all' | 'bookmarked') => void
  mediaType: MediaType
}

export default function MediaFilterTabs({ selectedFilter, onFilterChange, mediaType }: MediaFilterTabsProps) {
  const getFilters = () => {
    const baseFilters = [
      { key: 'all', label: 'All' },
      { key: 'bookmarked', label: 'Bookmarked' }
    ] as const
    
    if (mediaType === 'book') {
      return [
        ...baseFilters,
        { key: 'to-read', label: 'To Read' },
        { key: 'reading', label: 'Reading' },
        { key: 'completed', label: 'Completed' },
      ] as const
    } else {
      return [
        ...baseFilters,
        { key: 'to-watch', label: 'To Watch' },
        { key: 'watching', label: 'Watching' },
        { key: 'completed', label: 'Completed' },
      ] as const
    }
  }

  const filters = getFilters()

  return (
    <div className="flex gap-2 px-4 sm:px-6 lg:px-8 py-2 sm:py-4 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 min-w-max">
        {filters.map(({ key, label }) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onFilterChange(key)}
            className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 border min-w-0 ${
              selectedFilter === key
                ? 'text-white bg-gray-900 border-gray-900 shadow-md'
                : 'text-gray-600 bg-white border-gray-200 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <span className="relative z-10">{label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}