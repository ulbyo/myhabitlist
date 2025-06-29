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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{title}</h1>
        {rightComponent && (
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-4">
            {rightComponent}
          </div>
        )}
      </div>
    </motion.header>
  )
}