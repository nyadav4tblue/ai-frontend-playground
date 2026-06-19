/**
 * QuestionCard
 *
 * The glass panel wrapper that surrounds each wizard step.
 * Uses Framer Motion's AnimatePresence pattern:
 *  - Each step slides in from the right and exits to the left
 *  - The `key` prop on the motion.div triggers this when the step changes
 *
 * Children are rendered inside so each step just fills this shell.
 */

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface QuestionCardProps {
  stepKey: string | number  // unique key per step — triggers re-animation
  emoji:   string
  title:   string
  subtitle: string
  children: ReactNode
}

// Variants describe enter/exit states
const cardVariants = {
  // Card starts offscreen to the right, invisible
  initial: { opacity: 0, x: 60, scale: 0.97 },
  // Animates into view
  animate: { opacity: 1, x: 0,  scale: 1 },
  // Exits to the left
  exit:    { opacity: 0, x: -60, scale: 0.97 },
}

export function QuestionCard({ stepKey, emoji, title, subtitle, children }: QuestionCardProps) {
  return (
    <motion.div
      key={stepKey}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="glass w-full max-w-lg mx-auto p-8 flex flex-col gap-6"
    >
      {/* Step header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.15 }}
          className="text-5xl"
        >
          {emoji}
        </motion.div>

        <h2 className="font-heading text-2xl text-white font-bold leading-tight">
          {title}
        </h2>

        <p className="text-white/60 text-sm font-light">
          {subtitle}
        </p>
      </div>

      {/* Step content */}
      <div className="w-full">
        {children}
      </div>
    </motion.div>
  )
}
