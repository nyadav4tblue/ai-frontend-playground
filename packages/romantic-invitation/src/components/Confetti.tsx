/**
 * Confetti
 *
 * Burst of coloured confetti pieces that animate in from the top
 * when the invitation summary is revealed. Each piece has a random:
 * - starting X position
 * - rotation
 * - horizontal drift
 * - fall speed
 * - shape (square or circle via border-radius)
 */

import { motion } from 'framer-motion'
import { useMemo } from 'react'

const COLORS = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#c084fc', '#f472b6']

interface Piece {
  id:       number
  x:        number
  color:    string
  size:     number
  duration: number
  delay:    number
  drift:    number   // horizontal drift during fall
  shape:    string   // border-radius css value
}

export function Confetti() {
  const pieces = useMemo<Piece[]>(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id:       i,
      x:        Math.random() * 100,
      color:    COLORS[i % COLORS.length],
      size:     Math.random() * 8 + 6,        // 6–14px
      duration: Math.random() * 2 + 2,        // 2–4s fall
      delay:    Math.random() * 0.8,
      drift:    (Math.random() - 0.5) * 200,  // ±100px left/right
      shape:    Math.random() > 0.5 ? '50%' : '2px', // circle or square
    })),
  [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-50">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left:         `${p.x}%`,
            top:          '-1rem',
            width:        p.size,
            height:       p.size,
            background:   p.color,
            borderRadius: p.shape,
          }}
          initial={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
          animate={{
            y:       window.innerHeight + 20,
            x:       p.drift,
            opacity: [1, 1, 0],
            rotate:  360 * (Math.random() > 0.5 ? 1 : -1),
          }}
          transition={{
            duration: p.duration,
            delay:    p.delay,
            ease:     'easeIn',
            // Confetti only fires once — no repeat
          }}
        />
      ))}
    </div>
  )
}
