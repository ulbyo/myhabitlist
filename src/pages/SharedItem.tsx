import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Play, Tv, Star, Calendar, Clock, CheckCircle, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { MediaItem } from '../types/media'
import LoadingSpinner from '../components/LoadingSpinner'

export default function SharedItem() {
  const { shareToken } = useParams<{ shareToken: string }>()
  const [item, setItem] = useState<MediaItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSharedItem = async () => {
      if (!shareToken) {
        setError('Invalid share link')
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('media_items')
          .select('*')
          .eq('share_token', shareToken)
          .eq('is_public', true)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            setError('This item is no longer shared or does not exist')
          } else {
            throw error
          }
          return
        }

        const transformedItem: MediaItem = {
          id: data.id,
          title: data.title,
          author: data.creator,
          director: data.creator,
          creator: data.creator,
          type: data.type,
          status: data.status,
          coverUrl: data.cover_url,
          progress: data.progress,
          totalPages: data.total_pages,
          runtime: data.runtime,
          currentSeason: data.current_season,
          currentEpisode: data.current_episode,
          totalSeasons: data.total_seasons,
          totalEpisodes: data.total_episodes,
          genre: data.genre,
          releaseYear: data.release_year,
          rating: data.rating,
          notes: data.notes,
          dateAdded: new Date(data.date_added),
          dateStarted: data.date_started ? new Date(data.date_started) : undefined,
          dateCompleted: data.date_completed ? new Date(data.date_completed) : undefined,
          isBookmarked: false,
          isPublic: data.is_public,
          shareToken: data.share_token,
        }

        setItem(transformedItem)
      } catch (err) {
        console.error('Error fetching shared item:', err)
        setError('Failed to load shared item')
      } finally {
        setLoading(false)
      }
    }

    fetchSharedItem()
  }, [shareToken])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-black mb-2">Item Not Found</h2>
          <p className="text-sm text-gray-400 mb-6">
            {error || 'This shared item could not be found or is no longer available.'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={16} />
            Go Back
          </motion.button>
        </div>
      </div>
    )
  }

  const getTypeIcon = () => {
    switch (item.type) {
      case 'book':
        return <BookOpen size={24} className="text-black" />
      case 'movie':
        return <Play size={24} className="text-black" />
      case 'tv-show':
        return <Tv size={24} className="text-black" />
    }
  }

  const getStatusIcon = () => {
    switch (item.status) {
      case 'to-read':
      case 'to-watch':
        return <Clock size={20} className="text-gray-400" />
      case 'reading':
      case 'watching':
        return item.type === 'book' ? <BookOpen size={20} className="text-black" /> : 
               item.type === 'movie' ? <Play size={20} className="text-black" /> :
               <Tv size={20} className="text-black" />
      case 'completed':
        return <CheckCircle size={20} className="text-black" />
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
    <div className="min-h-screen bg-gray-50">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="p-2 rounded-full hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} className="text-black" />
          </motion.button>
          <h1 className="text-lg font-semibold text-black">Shared Item</h1>
        </div>
      </motion.header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex gap-6 mb-6">
            {item.coverUrl ? (
              <img
                src={item.coverUrl}
                alt={item.title}
                className="w-24 h-32 object-cover rounded-xl bg-gray-50 flex-shrink-0"
              />
            ) : (
              <div className="w-24 h-32 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                {getTypeIcon()}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 mb-2">
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-black mb-1 leading-tight">
                    {item.title}
                  </h1>
                  <p className="text-gray-400 text-sm mb-3">
                    by {getCreatorLabel()}
                  </p>
                </div>
                {getTypeIcon()}
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                {getStatusIcon()}
                <span className="text-gray-600 text-sm font-medium">
                  {getStatusText()}
                </span>
              </div>

              {progress && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Progress</span>
                    <span className="text-xs text-gray-600 font-medium">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-black h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}

              {item.rating && (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= item.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">({item.rating}/5)</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            {(item.genre || item.releaseYear) && (
              <div className="flex flex-wrap gap-4">
                {item.genre && (
                  <div>
                    <span className="text-xs text-gray-400 block mb-1">Genre</span>
                    <span className="text-sm text-black font-medium">{item.genre}</span>
                  </div>
                )}
                {item.releaseYear && (
                  <div>
                    <span className="text-xs text-gray-400 block mb-1">Release Year</span>
                    <span className="text-sm text-black font-medium">{item.releaseYear}</span>
                  </div>
                )}
              </div>
            )}

            {/* Type-specific details */}
            {item.type === 'book' && (item as any).totalPages && (
              <div>
                <span className="text-xs text-gray-400 block mb-1">Total Pages</span>
                <span className="text-sm text-black font-medium">{(item as any).totalPages} pages</span>
              </div>
            )}

            {item.type === 'movie' && (item as any).runtime && (
              <div>
                <span className="text-xs text-gray-400 block mb-1">Runtime</span>
                <span className="text-sm text-black font-medium">{(item as any).runtime} minutes</span>
              </div>
            )}

            {item.type === 'tv-show' && ((item as any).totalSeasons || (item as any).totalEpisodes) && (
              <div className="flex gap-4">
                {(item as any).totalSeasons && (
                  <div>
                    <span className="text-xs text-gray-400 block mb-1">Seasons</span>
                    <span className="text-sm text-black font-medium">{(item as any).totalSeasons}</span>
                  </div>
                )}
                {(item as any).totalEpisodes && (
                  <div>
                    <span className="text-xs text-gray-400 block mb-1">Episodes</span>
                    <span className="text-sm text-black font-medium">{(item as any).totalEpisodes}</span>
                  </div>
                )}
              </div>
            )}

            {item.notes && (
              <div>
                <span className="text-xs text-gray-400 block mb-2">Notes</span>
                <p className="text-sm text-black leading-relaxed">{item.notes}</p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar size={12} />
                <span>Added {item.dateAdded.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-400 mb-4">
            This item was shared from someone's personal library
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert('Create your own library feature coming soon!')}
            className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Create Your Own Library
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}