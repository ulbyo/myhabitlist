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
        return <Clock size={16} className="text-gray-400" />
      case 'reading':
      case 'watching':
        return item.type === 'book' ? <BookOpen size={16} className="text-black" /> : 
               item.type === 'movie' ? <Play size={16} className="text-black" /> :
               <Tv size={16} className="text-black" />
      case 'completed':
        return <CheckCircle size={16} className="text-black" />
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
        return <BookOpen size={16} className="text-gray-400" />
      case 'movie':
        return <Play size={16} className="text-gray-400" />
      case 'tv-show':
        return <Tv size={16} className="text-gray-400" />
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
      className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group relative"
      onClick={onPress}
    >
      {/* Bookmark indicator */}
      {item.isBookmarked && (
        <div className="absolute top-2 right-2 z-10">
          <Bookmark size={16} className="text-yellow-500 fill-current" />
        </div>
      )}

      <div className="flex gap-4">
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.title}
            className="w-16 h-20 object-cover rounded-lg bg-gray-50 flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-20 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
            {getTypeIcon()}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h3 className="font-semibold text-black text-sm line-clamp-2 flex-1 leading-5">
              {item.title}
            </h3>
            <div className="flex-shrink-0 mt-0.5">
              {getTypeIcon()}
            </div>
          </div>
          
          <p className="text-gray-400 text-xs mb-2 truncate">
            {getCreatorLabel()}
          </p>
          
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon()}
            <span className="text-gray-400 text-xs">
              {getStatusText()}
            </span>
          </div>

          {progress && (
            <div className="w-full bg-gray-200 rounded-full h-1">
              <motion.div
                className="bg-black h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onBookmarkPress?.()
            }}
            className={`p-2 rounded-lg hover:bg-gray-50 transition-colors ${
              item.isBookmarked ? 'text-yellow-500' : 'text-gray-400'
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
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MoreHorizontal size={16} className="text-gray-400" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}