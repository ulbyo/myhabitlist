import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Edit, Trash2, Star, X, Bookmark, Share2, Link, Copy, Check, Grid3X3, List } from 'lucide-react'
import Header from '../components/Header'
import MediaCard from '../components/MediaCard'
import MediaFilterTabs from '../components/MediaFilterTabs'
import MediaTypeTabs from '../components/MediaTypeTabs'
import FloatingActionButton from '../components/FloatingActionButton'
import SearchModal from '../components/SearchModal'
import FilterModal from '../components/FilterModal'
import UserMenu from '../components/UserMenu'
import LoadingSpinner from '../components/LoadingSpinner'
import { useMediaItems } from '../hooks/useMediaItems'
import { MediaStatus, MediaType, MediaItem } from '../types/media'

interface MediaActionModalProps {
  isOpen: boolean
  onClose: () => void
  item: MediaItem | null
  onEdit: (item: MediaItem) => void
  onDelete: (id: string) => void
  onBookmark: (id: string) => void
  onShare: (item: MediaItem) => void
}

function MediaActionModal({ isOpen, onClose, item, onEdit, onDelete, onBookmark, onShare }: MediaActionModalProps) {
  if (!item) return null

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
            className="fixed bottom-0 lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:bottom-auto left-0 right-0 lg:left-auto lg:right-auto bg-white rounded-t-2xl lg:rounded-2xl z-50 max-h-[80vh] overflow-y-auto mx-auto max-w-md border-t lg:border border-gray-200 lg:shadow-xl"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 lg:px-6 py-4 lg:py-5 rounded-t-2xl lg:rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 truncate pr-4">{item.title}</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 border border-gray-200"
                >
                  <X size={16} className="text-gray-500" />
                </motion.button>
              </div>
            </div>

            <div className="p-4 lg:p-6 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onBookmark(item.id)
                  onClose()
                }}
                className={`w-full flex items-center gap-3 p-3 lg:p-4 rounded-xl transition-all duration-200 border ${
                  item.isBookmarked 
                    ? 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-700' 
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                <Bookmark size={16} className={item.isBookmarked ? 'text-yellow-600 fill-current' : 'text-gray-600'} />
                <span className="text-sm lg:text-base font-medium">
                  {item.isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onShare(item)
                  onClose()
                }}
                className="w-full flex items-center gap-3 p-3 lg:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200"
              >
                <Share2 size={16} className="text-gray-600" />
                <span className="text-sm lg:text-base font-medium">Share</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onEdit(item)
                  onClose()
                }}
                className="w-full flex items-center gap-3 p-3 lg:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200"
              >
                <Edit size={16} className="text-gray-600" />
                <span className="text-sm lg:text-base font-medium">Edit Details</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
                    onDelete(item.id)
                    onClose()
                  }
                }}
                className="w-full flex items-center gap-3 p-3 lg:p-4 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 hover:text-red-800 transition-all duration-200"
              >
                <Trash2 size={16} className="text-red-600" />
                <span className="text-sm lg:text-base font-medium">Delete</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  item: MediaItem | null
  onGenerateLink: (id: string) => Promise<string | null>
  onStopSharing: (id: string) => void
}

function ShareModal({ isOpen, onClose, item, onGenerateLink, onStopSharing }: ShareModalProps) {
  const [shareLink, setShareLink] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerateLink = async () => {
    if (!item) return
    
    setLoading(true)
    try {
      const link = await onGenerateLink(item.id)
      setShareLink(link)
    } catch (error) {
      console.error('Error generating share link:', error)
      alert('Failed to generate share link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = async () => {
    if (!shareLink) return
    
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      alert('Failed to copy link to clipboard')
    }
  }

  const handleStopSharing = () => {
    if (!item) return
    onStopSharing(item.id)
    setShareLink(null)
    onClose()
  }

  const existingShareLink = item?.isPublic && item?.shareToken 
    ? `${window.location.origin}/shared/${item.shareToken}` 
    : null

  if (!item) return null

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
            className="fixed bottom-0 lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:bottom-auto left-0 right-0 lg:left-auto lg:right-auto bg-white rounded-t-2xl lg:rounded-2xl z-50 max-h-[80vh] overflow-y-auto mx-auto max-w-md border-t lg:border border-gray-200 lg:shadow-xl"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 lg:px-6 py-4 lg:py-5 rounded-t-2xl lg:rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 truncate pr-4">Share "{item.title}"</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 border border-gray-200"
                >
                  <X size={16} className="text-gray-500" />
                </motion.button>
              </div>
            </div>

            <div className="p-4 lg:p-6 space-y-4">
              {existingShareLink || shareLink ? (
                <>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Link size={16} className="text-gray-700" />
                      <span className="text-sm font-medium text-gray-900">Share Link</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
                      <input
                        type="text"
                        value={existingShareLink || shareLink || ''}
                        readOnly
                        className="flex-1 text-xs lg:text-sm text-gray-600 bg-transparent border-none outline-none"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopyLink}
                        className="p-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors border border-gray-900"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </motion.button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Anyone with this link can view this item
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStopSharing}
                    className="w-full py-3 lg:py-4 px-4 bg-red-50 text-red-700 border border-red-200 text-sm lg:text-base font-medium rounded-xl hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                  >
                    Stop Sharing
                  </motion.button>
                </>
              ) : (
                <>
                  <div className="text-center py-4 lg:py-6">
                    <Share2 size={32} className="text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Share this item</h3>
                    <p className="text-sm lg:text-base text-gray-600 mb-4">
                      Generate a public link that anyone can use to view this item
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerateLink}
                    disabled={loading}
                    className="w-full py-3 lg:py-4 px-4 bg-gray-900 text-white border border-gray-900 text-sm lg:text-base font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Generating Link...' : 'Generate Share Link'}
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  item: MediaItem | null
  onSave: (id: string, updates: Partial<MediaItem>) => void
}

function EditModal({ isOpen, onClose, item, onSave }: EditModalProps) {
  const [title, setTitle] = useState('')
  const [creator, setCreator] = useState('')
  const [status, setStatus] = useState<MediaStatus>('to-read')
  const [progress, setProgress] = useState('')
  const [rating, setRating] = useState(0)
  const [notes, setNotes] = useState('')
  const [currentSeason, setCurrentSeason] = useState('')
  const [currentEpisode, setCurrentEpisode] = useState('')

  useState(() => {
    if (item) {
      setTitle(item.title)
      if (item.type === 'book') {
        setCreator((item as any).author || '')
      } else if (item.type === 'movie') {
        setCreator((item as any).director || '')
      } else {
        setCreator((item as any).creator || '')
      }
      setStatus(item.status)
      setProgress((item as any).progress?.toString() || '')
      setRating(item.rating || 0)
      setNotes(item.notes || '')
      setCurrentSeason((item as any).currentSeason?.toString() || '')
      setCurrentEpisode((item as any).currentEpisode?.toString() || '')
    }
  })

  const handleSave = () => {
    if (!item || !title.trim() || !creator.trim()) {
      alert('Title and creator are required')
      return
    }

    const updates: any = {
      title: title.trim(),
      status: status,
      rating: rating || undefined,
      notes: notes.trim() || undefined,
    }

    // Add creator field based on media type
    if (item.type === 'book') {
      updates.author = creator.trim()
    } else if (item.type === 'movie') {
      updates.director = creator.trim()
    } else {
      updates.creator = creator.trim()
    }

    if (item.type === 'book' && progress) {
      updates.progress = parseInt(progress)
    }

    if (item.type === 'tv-show') {
      if (currentSeason) updates.currentSeason = parseInt(currentSeason)
      if (currentEpisode) updates.currentEpisode = parseInt(currentEpisode)
    }

    if (status === 'completed' && !item.dateCompleted) {
      updates.dateCompleted = new Date()
    }

    if ((status === 'reading' || status === 'watching') && !item.dateStarted) {
      updates.dateStarted = new Date()
    }

    onSave(item.id, updates)
    onClose()
  }

  const getStatusOptions = () => {
    if (!item) return []
    
    if (item.type === 'book') {
      return [
        { value: 'to-read', label: 'To Read' },
        { value: 'reading', label: 'Reading' },
        { value: 'completed', label: 'Completed' },
      ]
    } else {
      return [
        { value: 'to-watch', label: 'To Watch' },
        { value: 'watching', label: 'Watching' },
        { value: 'completed', label: 'Completed' },
      ]
    }
  }

  const getCreatorLabel = () => {
    if (!item) return 'Creator'
    return item.type === 'book' ? 'Author' : 
           item.type === 'movie' ? 'Director' : 'Creator'
  }

  if (!item) return null

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
            className="fixed bottom-0 lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:bottom-auto left-0 right-0 lg:left-auto lg:right-auto bg-white rounded-t-2xl lg:rounded-2xl z-50 max-h-[80vh] lg:max-h-[90vh] overflow-y-auto mx-auto max-w-md lg:max-w-lg border-t lg:border border-gray-200 lg:shadow-xl"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 lg:px-6 py-4 lg:py-5 rounded-t-2xl lg:rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 truncate pr-4">Edit {item.type === 'tv-show' ? 'TV Show' : item.type}</h2>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={!title.trim() || !creator.trim()}
                    className="px-4 py-2 bg-gray-900 text-white border border-gray-900 text-sm font-medium rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <X size={16} className="text-gray-500" />
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  placeholder="Enter title"
                />
              </div>

              {/* Creator */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">{getCreatorLabel()} *</label>
                <input
                  type="text"
                  value={creator}
                  onChange={(e) => setCreator(e.target.value)}
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  placeholder={`Enter ${getCreatorLabel().toLowerCase()}`}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {getStatusOptions().map(({ value, label }) => (
                    <motion.button
                      key={value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStatus(value as MediaStatus)}
                      className={`p-3 rounded-xl text-xs font-medium transition-all duration-200 border ${
                        status === value
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Progress for books */}
              {item.type === 'book' && status === 'reading' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(e.target.value)}
                    className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    placeholder="Enter progress percentage"
                  />
                </div>
              )}

              {/* Season/Episode for TV shows */}
              {item.type === 'tv-show' && status === 'watching' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Current Season</label>
                    <input
                      type="number"
                      min="1"
                      value={currentSeason}
                      onChange={(e) => setCurrentSeason(e.target.value)}
                      className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      placeholder="Season"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Current Episode</label>
                    <input
                      type="number"
                      min="1"
                      value={currentEpisode}
                      onChange={(e) => setCurrentEpisode(e.target.value)}
                      className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      placeholder="Episode"
                    />
                  </div>
                </div>
              )}

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Rating</label>
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

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
                  placeholder="Add your thoughts..."
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function MediaList() {
  const navigate = useNavigate()
  const { mediaItems, loading, error, updateMediaItem, deleteMediaItem, toggleBookmark, generateShareLink, stopSharing } = useMediaItems()
  const [selectedType, setSelectedType] = useState<MediaType>('book')
  const [selectedFilter, setSelectedFilter] = useState<MediaStatus | 'all' | 'bookmarked'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'dateAdded' | 'title' | 'progress'>('dateAdded')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredItems = useMemo(() => {
    let filtered = mediaItems.filter(item => item.type === selectedType)

    // Apply status filter
    if (selectedFilter === 'bookmarked') {
      filtered = filtered.filter(item => item.isBookmarked)
    } else if (selectedFilter !== 'all') {
      filtered = filtered.filter(item => item.status === selectedFilter)
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => {
        const title = item.title.toLowerCase()
        let creator = ''
        if (selectedType === 'book') {
          creator = (item as any).author?.toLowerCase() || ''
        } else if (selectedType === 'movie') {
          creator = (item as any).director?.toLowerCase() || ''
        } else {
          creator = (item as any).creator?.toLowerCase() || ''
        }
        const query = searchQuery.toLowerCase()
        
        return title.includes(query) || creator.includes(query)
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'dateAdded':
          comparison = a.dateAdded.getTime() - b.dateAdded.getTime()
          break
        case 'progress':
          let aProgress = 0
          let bProgress = 0
          
          if (a.type === 'book' && a.status === 'reading') {
            aProgress = (a as any).progress || 0
          } else if (a.type === 'tv-show' && a.status === 'watching' && (a as any).currentEpisode && (a as any).totalEpisodes) {
            const currentSeason = (a as any).currentSeason || 1
            const totalSeasons = (a as any).totalSeasons || 1
            aProgress = Math.round(((currentSeason - 1) * ((a as any).totalEpisodes / totalSeasons) + (a as any).currentEpisode) / (a as any).totalEpisodes * 100)
          }
          
          if (b.type === 'book' && b.status === 'reading') {
            bProgress = (b as any).progress || 0
          } else if (b.type === 'tv-show' && b.status === 'watching' && (b as any).currentEpisode && (b as any).totalEpisodes) {
            const currentSeason = (b as any).currentSeason || 1
            const totalSeasons = (b as any).totalSeasons || 1
            bProgress = Math.round(((currentSeason - 1) * ((b as any).totalEpisodes / totalSeasons) + (b as any).currentEpisode) / (b as any).totalEpisodes * 100)
          }
          
          comparison = aProgress - bProgress
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [mediaItems, selectedType, selectedFilter, searchQuery, sortBy, sortOrder])

  const handleItemPress = (item: MediaItem) => {
    setSelectedItem(item)
    setIsEditModalOpen(true)
  }

  const handleMorePress = (item: MediaItem) => {
    setSelectedItem(item)
    setIsActionModalOpen(true)
  }

  const handleBookmarkPress = async (item: MediaItem) => {
    try {
      await toggleBookmark(item.id)
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      alert('Failed to toggle bookmark. Please try again.')
    }
  }

  const handleEdit = (item: MediaItem) => {
    setSelectedItem(item)
    setIsEditModalOpen(true)
  }

  const handleShare = (item: MediaItem) => {
    setSelectedItem(item)
    setIsShareModalOpen(true)
  }

  const handleSave = async (id: string, updates: Partial<MediaItem>) => {
    try {
      await updateMediaItem(id, updates)
    } catch (error) {
      console.error('Error updating item:', error)
      alert('Failed to update item. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMediaItem(id)
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item. Please try again.')
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  const getEmptyStateText = () => {
    const typeLabel = selectedType === 'book' ? 'books' : 
                     selectedType === 'movie' ? 'movies' : 'TV shows'
    
    if (searchQuery) {
      return `No ${typeLabel} found matching "${searchQuery}"`
    }
    
    if (selectedFilter === 'bookmarked') {
      return `No bookmarked ${typeLabel} yet`
    }
    
    if (selectedFilter === 'all') {
      return `Start building your ${typeLabel} list by adding some ${typeLabel}!`
    }
    
    const statusLabel = selectedFilter === 'to-read' ? 'to read' :
                       selectedFilter === 'to-watch' ? 'to watch' :
                       selectedFilter === 'reading' ? 'reading' :
                       selectedFilter === 'watching' ? 'watching' : 'completed'
    
    return `No ${typeLabel} in "${statusLabel}" status`
  }

  const HeaderActions = () => (
    <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
      {/* View Mode Toggle - Desktop Only */}
      <div className="hidden lg:flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-lg p-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded-md transition-all duration-200 ${
            viewMode === 'grid'
              ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Grid3X3 size={16} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setViewMode('list')}
          className={`p-2 rounded-md transition-all duration-200 ${
            viewMode === 'list'
              ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <List size={16} />
        </motion.button>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsSearchOpen(true)}
        className={`p-2 rounded-full border transition-all duration-200 ${
          searchQuery 
            ? 'bg-gray-900 text-white border-gray-900' 
            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300'
        }`}
      >
        <Search size={18} className="sm:w-5 sm:h-5" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsFilterOpen(true)}
        className={`p-2 rounded-full border transition-all duration-200 ${
          selectedFilter !== 'all' || sortBy !== 'dateAdded' || sortOrder !== 'desc' 
            ? 'bg-gray-900 text-white border-gray-900' 
            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300'
        }`}
      >
        <Filter size={18} className="sm:w-5 sm:h-5" />
      </motion.button>
      <UserMenu />
    </div>
  )

  return (
    <div className="min-h-screen lg:ml-64 xl:ml-72">
      <Header title="My Library" rightComponent={<HeaderActions />} />
      
      <MediaTypeTabs
        selectedType={selectedType}
        onTypeChange={(type) => {
          setSelectedType(type)
          setSelectedFilter('all')
          setSearchQuery('')
        }}
      />
      
      <MediaFilterTabs
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        mediaType={selectedType}
      />

      {/* Search Query Display */}
      {searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Searching for:</span>
            <span className="font-medium text-gray-900">"{searchQuery}"</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchQuery('')}
              className="text-gray-700 hover:text-gray-900 underline"
            >
              Clear
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8">
        <AnimatePresence mode="wait">
          {filteredItems.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16 px-4"
            >
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                No {selectedType === 'book' ? 'books' : selectedType === 'movie' ? 'movies' : 'TV shows'} found
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {getEmptyStateText()}
              </p>
              {searchQuery && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors border border-gray-900"
                >
                  Clear Search
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="items"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6"
                  : "space-y-3 sm:space-y-4"
              }
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MediaCard
                    item={item}
                    onPress={() => handleItemPress(item)}
                    onMorePress={() => handleMorePress(item)}
                    onBookmarkPress={() => handleBookmarkPress(item)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FloatingActionButton onClick={() => navigate('/add-media')} />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        mediaType={selectedType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      <MediaActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        item={selectedItem}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBookmark={toggleBookmark}
        onShare={handleShare}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        item={selectedItem}
        onGenerateLink={generateShareLink}
        onStopSharing={stopSharing}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={selectedItem}
        onSave={handleSave}
      />
    </div>
  )
}