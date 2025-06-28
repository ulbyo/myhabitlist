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
      className={`sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 ${className}`}
    >
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-black">{title}</h1>
        {rightComponent && (
          <div className="flex items-center gap-2">
            {rightComponent}
          </div>
        )}
      </div>
    </motion.header>
  )
}