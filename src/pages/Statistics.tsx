import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Target, Clock, TrendingUp, Play, Tv, Star } from 'lucide-react'
import Header from '../components/Header'
import { useMediaItems } from '../hooks/useMediaItems'

interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: string
  subtitle?: string
  delay?: number
  onClick?: () => void
}

function StatCard({ icon, title, value, subtitle, delay = 0, onClick }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={onClick ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-xs font-medium text-gray-400">{title}</h3>
      </div>
      <p className="text-xl font-bold text-black mb-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </motion.div>
  )
}

export default function Statistics() {
  const { mediaItems } = useMediaItems()

  const stats = useMemo(() => {
    const books = mediaItems.filter(item => item.type === 'book')
    const movies = mediaItems.filter(item => item.type === 'movie')
    const tvShows = mediaItems.filter(item => item.type === 'tv-show')

    const booksRead = books.filter(book => book.status === 'completed').length
    const moviesWatched = movies.filter(movie => movie.status === 'completed').length
    const tvShowsCompleted = tvShows.filter(show => show.status === 'completed').length

    const currentlyReading = books.filter(book => book.status === 'reading').length
    const currentlyWatching = movies.filter(movie => movie.status === 'watching').length + 
                             tvShows.filter(show => show.status === 'watching').length

    const totalRuntime = movies
      .filter(movie => movie.status === 'completed' && movie.runtime)
      .reduce((total, movie) => total + (movie.runtime || 0), 0)

    const averageRating = mediaItems
      .filter(item => item.rating)
      .reduce((sum, item, _, arr) => sum + (item.rating || 0) / arr.length, 0)

    const thisYear = new Date().getFullYear()
    const thisYearItems = mediaItems.filter(item => 
      item.dateCompleted && item.dateCompleted.getFullYear() === thisYear
    )

    return {
      booksRead,
      moviesWatched,
      tvShowsCompleted,
      currentlyReading,
      currentlyWatching,
      totalRuntime: Math.round(totalRuntime / 60), // Convert to hours
      averageRating: Math.round(averageRating * 10) / 10,
      thisYearCompleted: thisYearItems.length,
      totalItems: mediaItems.length,
    }
  }, [mediaItems])

  const handleStatClick = (type: string) => {
    alert(`${type} details feature coming soon!`)
  }

  return (
    <div className="min-h-screen">
      <Header title="Statistics" />

      <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<BookOpen size={20} className="text-black" />}
            title="Books Read"
            value={stats.booksRead.toString()}
            subtitle="Completed"
            delay={0}
            onClick={() => handleStatClick('Books')}
          />
          <StatCard
            icon={<Play size={20} className="text-black" />}
            title="Movies Watched"
            value={stats.moviesWatched.toString()}
            subtitle="Completed"
            delay={0.1}
            onClick={() => handleStatClick('Movies')}
          />
          <StatCard
            icon={<Tv size={20} className="text-black" />}
            title="TV Shows"
            value={stats.tvShowsCompleted.toString()}
            subtitle="Completed"
            delay={0.2}
            onClick={() => handleStatClick('TV Shows')}
          />
          <StatCard
            icon={<Clock size={20} className="text-black" />}
            title="Watch Time"
            value={`${stats.totalRuntime}h`}
            subtitle="Movies only"
            delay={0.3}
            onClick={() => handleStatClick('Watch Time')}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Target size={20} className="text-black" />}
            title="Currently Reading"
            value={stats.currentlyReading.toString()}
            subtitle="In progress"
            delay={0.4}
            onClick={() => handleStatClick('Currently Reading')}
          />
          <StatCard
            icon={<TrendingUp size={20} className="text-black" />}
            title="Currently Watching"
            value={stats.currentlyWatching.toString()}
            subtitle="In progress"
            delay={0.5}
            onClick={() => handleStatClick('Currently Watching')}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-black mb-4">Library Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-black">Total Items</h3>
              <span className="text-sm font-bold text-black">{stats.totalItems}</span>
            </div>
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-black">Completed This Year</h3>
              <span className="text-sm font-bold text-black">{stats.thisYearCompleted}</span>
            </div>
            {stats.averageRating > 0 && (
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-black">Average Rating</h3>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400 fill-current" />
                  <span className="text-sm font-bold text-black">{stats.averageRating}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-black mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => alert('Export feature coming soon!')}
              className="p-3 bg-gray-50 rounded-xl text-sm font-medium text-black hover:bg-gray-100 transition-colors"
            >
              Export Data
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => alert('Backup feature coming soon!')}
              className="p-3 bg-gray-50 rounded-xl text-sm font-medium text-black hover:bg-gray-100 transition-colors"
            >
              Backup Library
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}