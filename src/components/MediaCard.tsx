import { motion } from 'framer-motion'
import { Clock, CheckCircle, BookOpen, Play, Tv, MoreHorizontal, Bookmark } from 'lucide-react'
import { MediaItem } from '../types/media'

interface MediaCardProps {
  item: MediaItem
  onPress?: () => void
  onMorePress?: () => void
  onBookmarkPress?: () => void
}

export default function MediaCard({ item, onPress, onMorePress, onBookmarkPress }: MediaCardProps) {
  const getStatusIcon = () => {
    switch (item.status) {
      case 'to-read':
      case 'to-watch':
        return <Clock size={14} className="text-gray-500 flex-shrink-0" />
      case 'reading':
      case 'watching':
        return item.type === 'book' ? <BookOpen size={14} className="text-gray-900 flex-shrink-0" /> : 
               item.type === 'movie' ? <Play size={14} className="text-gray-900 flex-shrink-0" /> :
               <Tv size={14} className="text-gray-900 flex-shrink-0" />
      case 'completed':
        return <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
    }
  }

  const getStatusText = () => {
    switch (item.status) {
      case 'to-read':
        return 'To Read'
      case 'to-watch':
        return 'To Watch'
      case 'reading':
        return (item as any).progress ? `${(item as any).progress}% complete` : 'Reading'
      case 'watching':
        if (item.type === 'tv-show') {
          return `S${(item as any).currentSeason || 1}E${(item as any).currentEpisode || 1}`
        }
        return 'Watching'
      case 'completed':
        return 'Completed'
    }
  }

  const getTypeIcon = () => {
    switch (item.type) {
      case 'book':
        return <BookOpen size={14} className="text-gray-500 flex-shrink-0" />
      case 'movie':
        return <Play size={14} className="text-gray-500 flex-shrink-0" />
      case 'tv-show':
        return <Tv size={14} className="text-gray-500 flex-shrink-0" />
    }
  }

  const getCreatorLabel = () => {
    if (item.type === 'book') {
      return (item as any).author
    } else if (item.type === 'movie') {
      return (item as any).director
    } else {
      return (item as any).creator
    }
  }

  const getProgress = () => {
    if (item.type === 'book' && item.status === 'reading' && (item as any).progress) {
      return (item as any).progress
    }
    if (item.type === 'tv-show' && item.status === 'watching' && (item as any).currentEpisode && (item as any).totalEpisodes) {
      const currentSeason = (item as any).currentSeason || 1
      const totalSeasons = (item as any).totalSeasons || 1
      return Math.round(((currentSeason - 1) * ((item as any).totalEpisodes / totalSeasons) + (item as any).currentEpisode) / (item as any).totalEpisodes * 100)
    }
    return null
  }

  const progress = getProgress()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-pointer group relative"
      onClick={onPress}
    >
      {/* Bookmark indicator */}
      {item.isBookmarked && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-yellow-100 rounded-full p-1">
            <Bookmark size={12} className="text-yellow-600 fill-current" />
          </div>
        </div>
      )}

      <div className="flex gap-3 sm:gap-4">
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.title}
            className="w-12 h-16 sm:w-16 sm:h-20 object-cover rounded-lg bg-gray-100 border border-gray-200 flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-16 sm:w-16 sm:h-20 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            {getTypeIcon()}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 flex-1 leading-5 sm:leading-6">
              {item.title}
            </h3>
            <div className="flex-shrink-0 mt-0.5 hidden sm:block">
              {getTypeIcon()}
            </div>
          </div>
          
          <p className="text-gray-500 text-xs sm:text-sm mb-2 truncate">
            {getCreatorLabel()}
          </p>
          
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon()}
            <span className="text-gray-600 text-xs sm:text-sm">
              {getStatusText()}
            </span>
          </div>

          {progress && (
            <div className="w-full bg-gray-200 rounded-full h-1 sm:h-1.5">
              <motion.div
                className="bg-gray-900 h-1 sm:h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          )}
        </div>

        {/* Desktop action buttons */}
        <div className="hidden sm:flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onBookmarkPress?.()
            }}
            className={`p-2 rounded-lg border transition-all duration-200 ${
              item.isBookmarked 
                ? 'text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100' 
                : 'text-gray-500 bg-white border-gray-200 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <Bookmark size={16} className={item.isBookmarked ? 'fill-current' : ''} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onMorePress?.()
            }}
            className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-500 hover:text-gray-700 transition-all duration-200"
          >
            <MoreHorizontal size={16} />
          </motion.button>
        </div>

        {/* Mobile action button */}
        <div className="sm:hidden flex items-start">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onMorePress?.()
            }}
            className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-all duration-200"
          >
            <MoreHorizontal size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}