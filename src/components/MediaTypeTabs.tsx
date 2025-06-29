import { motion } from 'framer-motion'
import { BookOpen, Play, Tv } from 'lucide-react'
import { MediaType } from '../types/media'

interface MediaTypeTabsProps {
  selectedType: MediaType
  onTypeChange: (type: MediaType) => void
}

const mediaTypes = [
  { key: 'book', label: 'Books', icon: BookOpen },
  { key: 'movie', label: 'Movies', icon: Play },
  { key: 'tv-show', label: 'TV Shows', icon: Tv },
] as const

export default function MediaTypeTabs({ selectedType, onTypeChange }: MediaTypeTabsProps) {
  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
      <div className="inline-flex items-center gap-1 p-1 bg-gray-50 rounded-full w-full max-w-md sm:w-auto">
        {mediaTypes.map(({ key, label, icon: Icon }) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTypeChange(key)}
            className={`relative flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex-1 sm:flex-initial ${
              selectedType === key
                ? 'text-white bg-black shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon size={12} strokeWidth={2.5} className="flex-shrink-0" />
            <span className="hidden xs:inline sm:inline truncate">{label}</span>
            <span className="xs:hidden sm:hidden">
              {key === 'tv-show' ? 'TV' : key === 'book' ? 'Books' : 'Movies'}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}