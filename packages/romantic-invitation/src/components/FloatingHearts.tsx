/**
 * FloatingHearts
 *
 * Renders N hearts that float upward continuously in the background.
 * Each heart gets randomised: size, speed, horizontal position, delay.
 * Pure CSS animation would also work but Framer Motion gives us easy
 * random values and staggered delays in JS.
 */

import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface Heart {
  id: number
  x: number       // left% position
  size: number    // font size in px
  duration: number
  delay: number
  opacity: number
}

interface FloatingHeartsProps {
  count?: number
}

export function FloatingHearts({ count = 15 }: FloatingHeartsProps) {
  // Generate heart configs once — stable across re-renders
  const hearts = useMemo<Heart[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      id:       i,
      x:        Math.random() * 100,
      size:     Math.random() * 20 + 12,   // 12–32px
      duration: Math.random() * 8 + 6,     // 6–14s to reach top
      delay:    Math.random() * 10,        // stagger start
      opacity:  Math.random() * 0.4 + 0.1, // 0.1–0.5 — subtle
    })),
  [count])

  return (
    // Pointer-events: none so hearts don't block clicks
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          className="absolute select-none"
          style={{
            left:     `${heart.x}%`,
            bottom:   '-2rem',
            fontSize: `${heart.size}px`,
            opacity:  heart.opacity,
          }}
          animate={{
            // Float from below the fold to above the viewport
            y:       [0, -(window.innerHeight + 60)],
            // Gentle left-right sway
            x:       [0, Math.sin(heart.id) * 40, 0],
            rotate:  [0, 15, -10, 0],
          }}
          transition={{
            duration: heart.duration,
            delay:    heart.delay,
            repeat:   Infinity,
            ease:     'linear',
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  )
}
