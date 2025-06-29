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
    <div className="flex gap-2 px-4 py-4 overflow-x-auto">
      {filters.map(({ key, label }) => (
        <motion.button
          key={key}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onFilterChange(key)}
          className={`relative px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            selectedFilter === key
              ? 'text-white'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {selectedFilter === key && (
            <motion.div
              layoutId={`activeFilter-${mediaType}`}
              className="absolute inset-0 bg-black rounded-full"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{label}</span>
        </motion.button>
      ))}
    </div>
  )
}