import React from 'react'
import { motion } from 'framer-motion'

interface HeaderProps {
  title: string
  rightComponent?: React.ReactNode
  className?: string
}

export default function Header({ title, rightComponent, className = '' }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-200 ${className}`}
    >
      <div className="lg:ml-64 xl:ml-72">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">{title}</h1>
            {/* Breadcrumb for desktop */}
            <div className="hidden lg:flex items-center text-sm text-gray-500">
              <span>/</span>
              <span className="ml-2 capitalize truncate">{title.toLowerCase()}</span>
            </div>
          </div>
          {rightComponent && (
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              {rightComponent}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  )
}