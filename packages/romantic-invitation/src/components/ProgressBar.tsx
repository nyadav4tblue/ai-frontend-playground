/**
 * ProgressBar
 *
 * Animated horizontal bar that fills as the user moves through wizard steps.
 * The filled portion uses a rose gradient and animates via Framer Motion's
 * layout animation — no manual width calculation needed.
 */

import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number  // 0-indexed current step
  total:   number  // total number of steps
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / (total - 1)) * 100)

  return (
    <div className="w-full max-w-md mx-auto px-4">
      {/* Step counter */}
      <div className="flex justify-between text-xs text-white/50 mb-2 font-light tracking-widest uppercase">
        <span>Step {current + 1}</span>
        <span>{total} steps</span>
      </div>

      {/* Track */}
      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
        {/* Fill — animates width smoothly */}
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #e11d48, #f97316)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
        />
      </div>
    </div>
  )
}
