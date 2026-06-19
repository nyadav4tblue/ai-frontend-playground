/**
 * Portfolio Builder — placeholder entry point
 *
 * This module is a work in progress.
 * Replace this file with the actual experiment.
 */

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-6 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="text-7xl"
      >
        🎨
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-semibold tracking-tight"
        style={{ color: '#f472b6' }}
      >
        Portfolio Builder
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-white/50 max-w-sm leading-relaxed"
      >
        Drag-and-drop personal portfolio with live preview and shareable export.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass px-6 py-3 flex items-center gap-2 text-sm text-white/40"
      >
        <Sparkles size={14} />
        Coming soon — build it with Claude
      </motion.div>
    </div>
  )
}
