import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Target, Clock, TrendingUp, Play, Tv, Star, Calendar, Award, Zap } from 'lucide-react'
import Header from '../components/Header'
import { useMediaItems } from '../hooks/useMediaItems'

interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: string
  subtitle?: string
  delay?: number
  onClick?: () => void
  className?: string
}

function StatCard({ icon, title, value, subtitle, delay = 0, onClick, className = '' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={onClick ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        {icon}
        <h3 className="text-xs sm:text-sm font-medium text-gray-500">{title}</h3>
      </div>
      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>}
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

    const thisMonth = new Date().getMonth()
    const thisMonthItems = mediaItems.filter(item => 
      item.dateCompleted && 
      item.dateCompleted.getFullYear() === thisYear &&
      item.dateCompleted.getMonth() === thisMonth
    )

    const bookmarkedItems = mediaItems.filter(item => item.isBookmarked).length

    return {
      booksRead,
      moviesWatched,
      tvShowsCompleted,
      currentlyReading,
      currentlyWatching,
      totalRuntime: Math.round(totalRuntime / 60), // Convert to hours
      averageRating: Math.round(averageRating * 10) / 10,
      thisYearCompleted: thisYearItems.length,
      thisMonthCompleted: thisMonthItems.length,
      totalItems: mediaItems.length,
      bookmarkedItems,
    }
  }, [mediaItems])

  const handleStatClick = (type: string) => {
    alert(`${type} details feature coming soon!`)
  }

  return (
    <div className="min-h-screen lg:ml-64 xl:ml-72">
      <Header title="Statistics" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 lg:space-y-8 pb-24 lg:pb-8">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            icon={<BookOpen size={18} className="text-blue-600 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
            title="Books Read"
            value={stats.booksRead.toString()}
            subtitle="Completed"
            delay={0}
            onClick={() => handleStatClick('Books')}
          />
          <StatCard
            icon={<Play size={18} className="text-green-600 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
            title="Movies Watched"
            value={stats.moviesWatched.toString()}
            subtitle="Completed"
            delay={0.1}
            onClick={() => handleStatClick('Movies')}
          />
          <StatCard
            icon={<Tv size={18} className="text-purple-600 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
            title="TV Shows"
            value={stats.tvShowsCompleted.toString()}
            subtitle="Completed"
            delay={0.2}
            onClick={() => handleStatClick('TV Shows')}
          />
          <StatCard
            icon={<Clock size={18} className="text-orange-600 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
            title="Watch Time"
            value={`${stats.totalRuntime}h`}
            subtitle="Movies only"
            delay={0.3}
            onClick={() => handleStatClick('Watch Time')}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            icon={<Target size={18} className="text-red-600 sm:w-5 sm:h-5" />}
            title="Currently Reading"
            value={stats.currentlyReading.toString()}
            subtitle="In progress"
            delay={0.4}
            onClick={() => handleStatClick('Currently Reading')}
          />
          <StatCard
            icon={<TrendingUp size={18} className="text-indigo-600 sm:w-5 sm:h-5" />}
            title="Currently Watching"
            value={stats.currentlyWatching.toString()}
            subtitle="In progress"
            delay={0.5}
            onClick={() => handleStatClick('Currently Watching')}
          />
          <StatCard
            icon={<Zap size={18} className="text-yellow-600 sm:w-5 sm:h-5" />}
            title="Bookmarked"
            value={stats.bookmarkedItems.toString()}
            subtitle="Favorites"
            delay={0.6}
            onClick={() => handleStatClick('Bookmarked')}
          />
        </div>

        {/* Detailed Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <Calendar size={20} className="text-gray-700" />
              <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Library Overview</h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm sm:text-base font-medium text-gray-700">Total Items</h3>
                <span className="text-sm sm:text-base font-bold text-gray-900">{stats.totalItems}</span>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-sm sm:text-base font-medium text-gray-700">Completed This Year</h3>
                <span className="text-sm sm:text-base font-bold text-gray-900">{stats.thisYearCompleted}</span>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-sm sm:text-base font-medium text-gray-700">Completed This Month</h3>
                <span className="text-sm sm:text-base font-bold text-gray-900">{stats.thisMonthCompleted}</span>
              </div>
              {stats.averageRating > 0 && (
                <div className="flex justify-between items-center">
                  <h3 className="text-sm sm:text-base font-medium text-gray-700">Average Rating</h3>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500 fill-current sm:w-4 sm:h-4" />
                    <span className="text-sm sm:text-base font-bold text-gray-900">{stats.averageRating}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <Award size={20} className="text-gray-700" />
              <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => alert('Export feature coming soon!')}
                className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-xl text-sm sm:text-base font-medium text-gray-700 hover:text-gray-900 transition-all duration-200 text-left"
              >
                📊 Export Data
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => alert('Backup feature coming soon!')}
                className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-xl text-sm sm:text-base font-medium text-gray-700 hover:text-gray-900 transition-all duration-200 text-left"
              >
                💾 Backup Library
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => alert('Analytics feature coming soon!')}
                className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-xl text-sm sm:text-base font-medium text-gray-700 hover:text-gray-900 transition-all duration-200 text-left"
              >
                📈 View Analytics
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}