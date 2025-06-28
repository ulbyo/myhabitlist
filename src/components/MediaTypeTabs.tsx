import React from 'react'
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
  { key: 'tv-show', label: 'TV', icon: Tv },
] as const

export default function MediaTypeTabs({ selectedType, onTypeChange }: MediaTypeTabsProps) {
  return (
    <div className="flex justify-center px-4 mb-6">
      <div className="inline-flex items-center gap-1 p-1 bg-gray-50 rounded-full">
        {mediaTypes.map(({ key, label, icon: Icon }) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTypeChange(key)}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              selectedType === key
                ? 'text-white bg-black shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon size={12} strokeWidth={2.5} />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{key === 'tv-show' ? 'TV' : label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}