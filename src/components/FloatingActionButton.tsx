import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

interface FloatingActionButtonProps {
  onClick: () => void
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="lg:hidden fixed bottom-20 sm:bottom-24 right-4 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-lg hover:shadow-xl border-2 border-white transition-all duration-300 flex items-center justify-center z-40"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
    >
      <Plus size={22} strokeWidth={2.5} />
    </motion.button>
  )
}