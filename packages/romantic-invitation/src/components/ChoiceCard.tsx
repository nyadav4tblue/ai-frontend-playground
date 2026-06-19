/**
 * ChoiceCard
 *
 * A single selectable option inside a grid (used for place, food).
 * Shows a hover glow and a rose border + checkmark when selected.
 *
 * Multi-select behaviour is opt-in via the `selected` boolean —
 * the parent decides whether to allow multiple selections.
 */

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { ChoiceOption } from '../types'

interface ChoiceCardProps extends ChoiceOption {
  selected:  boolean
  onSelect:  () => void
}

export function ChoiceCard({ emoji, label, description, selected, onSelect }: ChoiceCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`
        relative glass-light p-4 text-left cursor-pointer transition-all duration-200
        ${selected
          ? 'border-rose-400/70 bg-rose-500/15 shadow-lg shadow-rose-500/20'
          : 'hover:bg-white/10 hover:border-white/25'
        }
      `}
    >
      {/* Selected checkmark badge */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 bg-rose-500 rounded-full w-5 h-5 flex items-center justify-center"
        >
          <Check size={11} className="text-white" strokeWidth={3} />
        </motion.div>
      )}

      <div className="text-2xl mb-1">{emoji}</div>
      <div className={`text-sm font-medium ${selected ? 'text-rose-200' : 'text-white/90'}`}>
        {label}
      </div>
      {description && (
        <div className="text-xs text-white/40 mt-0.5 leading-snug">{description}</div>
      )}
    </motion.button>
  )
}
