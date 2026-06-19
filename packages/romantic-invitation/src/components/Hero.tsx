/**
 * Hero
 *
 * The opening landing screen before the wizard starts.
 * Features a pulsing heart, animated title, and a CTA button.
 * Fades out as the wizard begins — handled by parent AnimatePresence.
 */

import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'

interface HeroProps {
  onStart: () => void
}

// Text characters stagger in one by one
const titleVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.04 } },
}

const charVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } },
}

const title = "Create a Romantic Invitation"

export function Hero({ onStart }: HeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center min-h-screen text-center px-6 gap-8"
    >
      {/* Pulsing heart */}
      <motion.div
        animate={{
          scale:  [1, 1.15, 1],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 2,
          repeat:   Infinity,
          ease:     'easeInOut',
        }}
        className="text-8xl drop-shadow-2xl"
      >
        ❤️
      </motion.div>

      {/* Animated title */}
      <motion.h1
        variants={titleVariants}
        initial="hidden"
        animate="show"
        className="font-heading text-4xl md:text-5xl text-white font-bold leading-tight max-w-md"
      >
        {title.split('').map((char, i) => (
          <motion.span key={i} variants={charVariants}>
            {char === ' ' ? ' ' : char}
          </motion.span>
        ))}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="text-white/60 text-lg font-light max-w-xs leading-relaxed"
      >
        A beautiful, shareable invitation built entirely in your browser
      </motion.p>

      {/* Feature pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="flex flex-wrap justify-center gap-2"
      >
        {['No backend', 'Shareable URL', 'Animated', 'Personalised'].map(tag => (
          <span
            key={tag}
            className="text-xs px-3 py-1 glass-light text-white/50 rounded-full"
          >
            {tag}
          </span>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, type: 'spring' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-medium text-lg shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #e11d48 0%, #f97316 100%)',
          boxShadow:  '0 8px 32px rgba(225,29,72,0.4)',
        }}
      >
        <Sparkles size={20} />
        Begin crafting
        <Heart size={18} className="fill-white/80" />
      </motion.button>

      {/* Small print */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="text-white/25 text-xs"
      >
        All data lives in the URL — nothing is stored on any server
      </motion.p>
    </motion.div>
  )
}
