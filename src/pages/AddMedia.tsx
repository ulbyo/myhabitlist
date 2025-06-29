import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { X, BookOpen, Play, Tv, Camera, Star } from 'lucide-react'
import { MediaType } from '../types/media'
import { useMediaItems } from '../hooks/useMediaItems'

export default function AddMedia() {
  const navigate = useNavigate()
  const { addMediaItem } = useMediaItems()
  const [mediaType, setMediaType] = useState<MediaType>('book')
  const [title, setTitle] = useState('')
  const [creator, setCreator] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [genre, setGenre] = useState('')
  const [releaseYear, setReleaseYear] = useState('')
  const [rating, setRating] = useState(0)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !creator.trim()) {
      alert('Please enter both title and creator.')
      return
    }

    setLoading(true)

    try {
      const baseItem = {
        title: title.trim(),
        type: mediaType,
        status: mediaType === 'book' ? 'to-read' as const : 'to-watch' as const,
        genre: genre.trim() || undefined,
        releaseYear: releaseYear ? parseInt(releaseYear) : undefined,
        rating: rating || undefined,
        notes: notes.trim() || undefined,
      }

      let mediaItem
      if (mediaType === 'book') {
        mediaItem = {
          ...baseItem,
          author: creator.trim(),
          totalPages: additionalInfo ? parseInt(additionalInfo) : undefined,
        }
      } else if (mediaType === 'movie') {
        mediaItem = {
          ...baseItem,
          director: creator.trim(),
          runtime: additionalInfo ? parseInt(additionalInfo) : undefined,
        }
      } else {
        mediaItem = {
          ...baseItem,
          creator: creator.trim(),
          totalSeasons: additionalInfo ? parseInt(additionalInfo) : undefined,
        }
      }

      await addMediaItem(mediaItem as any)
      navigate('/')
    } catch (error) {
      console.error('Error adding media:', error)
      alert('Failed to add media item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/')
  }

  const getIcon = () => {
    switch (mediaType) {
      case 'book':
        return <BookOpen size={28} className="text-gray-400 lg:w-8 lg:h-8" />
      case 'movie':
        return <Play size={28} className="text-gray-400 lg:w-8 lg:h-8" />
      case 'tv-show':
        return <Tv size={28} className="text-gray-400 lg:w-8 lg:h-8" />
    }
  }

  const getCreatorLabel = () => {
    switch (mediaType) {
      case 'book':
        return 'Author'
      case 'movie':
        return 'Director'
      case 'tv-show':
        return 'Creator'
    }
  }

  const getAdditionalLabel = () => {
    switch (mediaType) {
      case 'book':
        return 'Total Pages'
      case 'movie':
        return 'Runtime (minutes)'
      case 'tv-show':
        return 'Total Seasons'
    }
  }

  const getPlaceholder = () => {
    switch (mediaType) {
      case 'book':
        return 'Enter total pages'
      case 'movie':
        return 'Enter runtime in minutes'
      case 'tv-show':
        return 'Enter total seasons'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:ml-64 xl:ml-72">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className="p-2 rounded-full hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <X size={20} className="text-gray-600" />
            </motion.button>
            
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">Add to Library</h1>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !creator.trim()}
            className="px-4 lg:px-6 py-2 lg:py-3 bg-gray-900 text-white text-sm lg:text-base font-medium rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-900"
          >
            {loading ? 'Adding...' : 'Add'}
          </motion.button>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Media Type Selection & Cover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 mb-4 lg:mb-6">
              <div className="flex gap-1 p-1 bg-gray-50 rounded-2xl mb-4 sm:mb-6">
                {[
                  { key: 'book', label: 'Book', icon: BookOpen },
                  { key: 'movie', label: 'Movie', icon: Play },
                  { key: 'tv-show', label: 'TV Show', icon: Tv },
                ].map(({ key, label, icon: Icon }) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMediaType(key as MediaType)}
                    className={`relative flex-1 flex items-center justify-center gap-2 px-3 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                      mediaType === key
                        ? 'text-white bg-gray-900 shadow-sm border border-gray-900'
                        : 'text-gray-600 bg-white border border-gray-200 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={14} className="flex-shrink-0" />
                    <span className="hidden xs:inline lg:hidden xl:inline">{label}</span>
                    <span className="xs:hidden lg:inline xl:hidden">{key === 'tv-show' ? 'TV' : label}</span>
                  </motion.button>
                ))}
              </div>

              <div className="text-center">
                <div className="w-20 h-28 sm:w-24 sm:h-32 lg:w-32 lg:h-40 bg-gray-50 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center border border-gray-200">
                  {getIcon()}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-full text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors mx-auto border border-gray-200"
                  onClick={() => alert('Cover upload feature coming soon!')}
                >
                  <Camera size={14} />
                  Add Cover
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 space-y-4 sm:space-y-6"
          >
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Enter ${mediaType === 'tv-show' ? 'TV show' : mediaType} title`}
                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="creator" className="block text-sm font-semibold text-gray-900 mb-2">
                {getCreatorLabel()} *
              </label>
              <input
                type="text"
                id="creator"
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                placeholder={`Enter ${getCreatorLabel().toLowerCase()} name`}
                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-semibold text-gray-900 mb-2">
                  {getAdditionalLabel()}
                </label>
                <input
                  type="number"
                  id="additionalInfo"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="releaseYear" className="block text-sm font-semibold text-gray-900 mb-2">
                  Release Year
                </label>
                <input
                  type="number"
                  id="releaseYear"
                  value={releaseYear}
                  onChange={(e) => setReleaseYear(e.target.value)}
                  placeholder="e.g. 2023"
                  min="1800"
                  max={new Date().getFullYear() + 5}
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-semibold text-gray-900 mb-2">
                Genre
              </label>
              <input
                type="text"
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g. Sci-Fi, Drama, Comedy"
                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Rating (Optional)
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(rating === star ? 0 : star)}
                    className="p-1"
                  >
                    <Star
                      size={20}
                      className={star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-semibold text-gray-900 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={`Add any notes or thoughts about this ${mediaType === 'tv-show' ? 'TV show' : mediaType}`}
                rows={4}
                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
              />
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  )
}