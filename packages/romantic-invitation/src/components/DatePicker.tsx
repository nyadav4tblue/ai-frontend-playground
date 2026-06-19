/**
 * DatePicker
 *
 * A styled date + time input pair.
 * We use the native <input type="date"> / <input type="time"> for
 * accessibility and zero-dependency parsing, then overlay custom CSS
 * to match the glassmorphism theme.
 */

import { motion } from 'framer-motion'
import { Calendar, Clock } from 'lucide-react'

interface DatePickerProps {
  date:      string
  time:      string
  onDate:    (v: string) => void
  onTime:    (v: string) => void
}

export function DatePicker({ date, time, onDate, onTime }: DatePickerProps) {
  // Today's date as the minimum selectable value
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-4">
      {/* Date */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-light p-4 flex items-center gap-4"
      >
        <Calendar size={20} className="text-rose-400 shrink-0" />
        <div className="flex-1">
          <label className="block text-xs text-white/50 mb-1 uppercase tracking-widest">
            Date
          </label>
          <input
            type="date"
            value={date}
            min={today}
            onChange={e => onDate(e.target.value)}
            className="w-full bg-transparent text-white text-lg font-light outline-none
                       [color-scheme:dark] cursor-pointer"
          />
        </div>
      </motion.div>

      {/* Time */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-light p-4 flex items-center gap-4"
      >
        <Clock size={20} className="text-rose-400 shrink-0" />
        <div className="flex-1">
          <label className="block text-xs text-white/50 mb-1 uppercase tracking-widest">
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={e => onTime(e.target.value)}
            className="w-full bg-transparent text-white text-lg font-light outline-none
                       [color-scheme:dark] cursor-pointer"
          />
        </div>
      </motion.div>
    </div>
  )
}
