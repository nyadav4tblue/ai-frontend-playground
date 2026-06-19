/**
 * InvitationCard
 *
 * The final "printed" invitation displayed on the summary step.
 * Designed to look like an elegant physical invitation card with:
 *  - Gold ornamental dividers
 *  - Playfair Display typography
 *  - A colour swatch for the dress
 *  - All chosen details laid out beautifully
 */

import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Heart } from 'lucide-react'
import type { InvitationData } from '../types'
import { FOOD_OPTIONS, PLACE_OPTIONS } from '../utils/constants'

interface InvitationCardProps {
  data: InvitationData
}

function formatDate(iso: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

function formatTime(t: string): string {
  if (!t) return '—'
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`
}

function placeLabel(val: string): string {
  return PLACE_OPTIONS.find(p => p.value === val)?.label ?? val
}

function foodLabels(values: string[]): string {
  return values
    .map(v => FOOD_OPTIONS.find(f => f.value === v))
    .filter(Boolean)
    .map(f => `${f!.emoji} ${f!.label}`)
    .join('  ·  ')
}

// Stagger child animations using Framer Motion variants
const containerVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
}

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0,  transition: { type: 'spring', stiffness: 200 } },
}

export function InvitationCard({ data }: InvitationCardProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative rounded-2xl overflow-hidden p-8 text-center space-y-6"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)',
        border:     '1px solid rgba(255,200,150,0.25)',
        boxShadow:  '0 25px 60px rgba(220,20,60,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
    >
      {/* ── Header ────────────────────────────────────── */}
      <motion.div variants={rowVariants} className="space-y-2">
        <div className="text-rose-300/60 tracking-[0.3em] uppercase text-xs font-light">
          You are cordially invited
        </div>
        <h1 className="font-heading text-3xl text-white leading-tight">
          Dear <span className="text-rose-300 italic">{data.recipientName || '…'}</span>
        </h1>
        <div className="text-white/50 text-sm">
          — with love from <span className="text-rose-200">{data.senderName || '…'}</span> —
        </div>
      </motion.div>

      {/* Ornamental divider */}
      <motion.div variants={rowVariants} className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-rose-400/40" />
        <Heart size={14} className="text-rose-400/60 fill-rose-400/30" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-rose-400/40" />
      </motion.div>

      {/* ── Date & Time ────────────────────────────────── */}
      <motion.div variants={rowVariants} className="space-y-2">
        <div className="flex items-center justify-center gap-2 text-white/90">
          <Calendar size={14} className="text-rose-300" />
          <span className="font-heading text-lg">{formatDate(data.date)}</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-white/70">
          <Clock size={13} className="text-rose-300/70" />
          <span className="text-base">{formatTime(data.time)}</span>
        </div>
      </motion.div>

      {/* ── Location ───────────────────────────────────── */}
      <motion.div variants={rowVariants}>
        <div className="flex items-center justify-center gap-2 text-white/80">
          <MapPin size={14} className="text-rose-300" />
          <span className="font-heading text-lg">{placeLabel(data.place) || '—'}</span>
        </div>
      </motion.div>

      {/* ── Food ───────────────────────────────────────── */}
      {data.food.length > 0 && (
        <motion.div variants={rowVariants} className="text-white/60 text-sm">
          {foodLabels(data.food)}
        </motion.div>
      )}

      {/* ── Dress swatch ───────────────────────────────── */}
      {data.dressColor && (
        <motion.div variants={rowVariants} className="flex items-center justify-center gap-3">
          <div
            className="w-5 h-5 rounded-full ring-1 ring-white/20 shadow-lg"
            style={{ background: data.dressColor }}
          />
          <span className="text-white/60 text-sm">Dress colour of the evening</span>
        </motion.div>
      )}

      {/* Ornamental divider */}
      <motion.div variants={rowVariants} className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-rose-400/40" />
        <Heart size={14} className="text-rose-400/60 fill-rose-400/30" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-rose-400/40" />
      </motion.div>

      {/* ── Love Letter excerpt ─────────────────────────── */}
      {data.loveLetter && (
        <motion.div variants={rowVariants}>
          <p
            className="font-heading italic text-white/70 text-sm leading-relaxed text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            "{data.loveLetter.slice(0, 160)}{data.loveLetter.length > 160 ? '…' : ''}"
          </p>
        </motion.div>
      )}

      {/* Corner ornament */}
      <div className="absolute top-3 left-4 text-rose-300/20 text-2xl select-none">✦</div>
      <div className="absolute top-3 right-4 text-rose-300/20 text-2xl select-none">✦</div>
      <div className="absolute bottom-3 left-4 text-rose-300/20 text-2xl select-none">✦</div>
      <div className="absolute bottom-3 right-4 text-rose-300/20 text-2xl select-none">✦</div>
    </motion.div>
  )
}
