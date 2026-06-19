/**
 * LoveLetter
 *
 * A stylised textarea for the free-form love message.
 * The background uses a parchment-like warm tint and the font
 * shifts to the Playfair Display serif for an old-letter feel.
 */

import { motion } from 'framer-motion'
import { PenLine } from 'lucide-react'

interface LoveLetterProps {
  value:    string
  onChange: (v: string) => void
}

// Gentle prompt suggestions shown as fading placeholder lines
const PLACEHOLDER =
  `My dearest,\n\nEvery moment with you feels like a poem I never want to end...\n\nWith all my love,`

export function LoveLetter({ value, onChange }: LoveLetterProps) {
  const charCount = value.length
  const maxChars  = 600

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="relative"
    >
      {/* Parchment-style container */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,240,220,0.07) 0%, rgba(255,220,200,0.04) 100%)',
          border:     '1px solid rgba(255,200,150,0.2)',
        }}
      >
        {/* Decorative quill icon */}
        <div className="absolute top-3 right-3 text-rose-300/30">
          <PenLine size={18} />
        </div>

        {/* Decorative top rule */}
        <div className="px-5 pt-4 pb-1">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-rose-300/30 to-transparent" />
        </div>

        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={PLACEHOLDER}
          maxLength={maxChars}
          rows={8}
          className="w-full bg-transparent px-5 pb-4 pt-3 text-white/90
                     font-heading text-sm leading-relaxed italic resize-none
                     outline-none placeholder:text-white/25"
          style={{ fontFamily: "'Playfair Display', serif" }}
        />

        {/* Bottom rule */}
        <div className="px-5 pb-3">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-rose-300/30 to-transparent" />
        </div>
      </div>

      {/* Character counter */}
      <div className="text-right text-xs text-white/30 mt-1 pr-1">
        {charCount} / {maxChars}
      </div>
    </motion.div>
  )
}
