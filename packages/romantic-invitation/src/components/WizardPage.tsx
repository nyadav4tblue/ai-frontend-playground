/**
 * WizardPage
 *
 * Orchestrates the multi-step invitation wizard.
 * Each step renders the correct input inside a <QuestionCard>.
 * AnimatePresence handles the slide transitions between steps.
 * The final step renders the InvitationCard summary.
 */

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle2, Share2 } from 'lucide-react'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { InvitationData } from '../types'
import { DRESS_COLORS, FOOD_OPTIONS, PLACE_OPTIONS, STEPS } from '../utils/constants'
import { ChoiceCard } from './ChoiceCard'
import { Confetti } from './Confetti'
import { DatePicker } from './DatePicker'
import { InvitationCard } from './InvitationCard'
import { LoveLetter } from './LoveLetter'
import { ProgressBar } from './ProgressBar'
import { QuestionCard } from './QuestionCard'
import { ShareModal } from './ShareModal'
import { useAuth } from '../lib/auth'
import { createInvitation, InvitationCreate } from '../services/invitations'

interface WizardPageProps {
  data:        InvitationData
  updateField: <K extends keyof InvitationData>(key: K, value: InvitationData[K]) => void
  toggleFood:  (food: string) => void
  shareUrl:    string
  editingId?:  string
  onEditSave?: (slug: string) => void
}

export function WizardPage({ data, updateField, toggleFood, shareUrl, editingId, onEditSave }: WizardPageProps) {
  const [step, setStep]           = useState(0)
  const [shareOpen, setShareOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)

  const { user } = useAuth()
  const publishMutation = useMutation(async (payload: InvitationCreate) => {
    if (!user) {
      throw new Error('You must be signed in to publish an invitation.')
    }
    return createInvitation(payload, user.id)
  })

  const current = STEPS[step]
  const isLast  = step === STEPS.length - 1

  function next() {
    if (step < STEPS.length - 1) {
      if (step === STEPS.length - 2) setShowConfetti(true) // fire confetti on last step entry
      setStep(s => s + 1)
    }
  }

  function prev() {
    setStep(s => Math.max(0, s - 1))
  }

  // Check if the current step has a value so Next can be enabled
  function hasValue(): boolean {
    if (current.key === 'summary') return true
    const val = data[current.key as keyof InvitationData]
    if (Array.isArray(val)) return val.length > 0
    return Boolean(val)
  }

  async function handlePublish() {
    if (!user) return

    const payload: InvitationCreate = {
      senderName: data.senderName,
      recipientName: data.recipientName,
      date: data.date,
      time: data.time,
      place: data.place,
      food: data.food,
      dressColor: data.dressColor,
      loveLetter: data.loveLetter,
      title: data.senderName ? `${data.senderName} invites you` : undefined,
      welcomeMessage: data.loveLetter,
      mainQuestion: 'Will you join me for this special evening?',
    }

    const result = await publishMutation.mutateAsync(payload)
    if (result.data?.slug) {
      setPublishedUrl(`${window.location.origin}/i/${result.data.slug}`)
      if (onEditSave) {
        onEditSave(result.data.slug)
      } else {
        setShareOpen(true)
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen px-4 py-8 gap-6">
      {/* ── Progress ──────────────────────────────────────────── */}
      <ProgressBar current={step} total={STEPS.length} />

      {/* ── Step content ──────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {/* Summary step */}
          {current.key === 'summary' ? (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-lg mx-auto space-y-6"
            >
              {showConfetti && <Confetti />}

              <div className="text-center space-y-1">
                <div className="text-5xl">🎉</div>
                <h2 className="font-heading text-2xl text-white font-bold">
                  Your invitation is ready!
                </h2>
                <p className="text-white/50 text-sm">Here's how it looks</p>
              </div>

              <InvitationCard data={data} />

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePublish}
                  disabled={publishMutation.isLoading}
                  className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #e11d48, #f97316)' }}
                >
                  {publishMutation.isLoading ? 'Saving…' : editingId ? 'Save changes' : 'Publish invitation'}
                </motion.button>

                {publishedUrl && !editingId && (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                    <div className="flex items-center gap-2 mb-3 text-white/90">
                      <CheckCircle2 size={18} />
                      Invitation published successfully
                    </div>
                    <div className="break-words">{publishedUrl}</div>
                  </div>
                )}

                {!editingId && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShareOpen(true)}
                    className="w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #0f766e, #14b8a6)' }}
                  >
                    <Share2 size={18} />
                    Share this invitation
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            // Regular wizard step
            <QuestionCard
              stepKey={step}
              emoji={current.emoji}
              title={current.title}
              subtitle={current.subtitle}
            >
              <StepContent
                step={current.key as keyof InvitationData}
                data={data}
                updateField={updateField}
                toggleFood={toggleFood}
              />
            </QuestionCard>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation buttons ─────────────────────────────────── */}
      {!isLast && (
        <div className="flex justify-between items-center max-w-lg mx-auto w-full px-2">
          {/* Back */}
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={prev}
            disabled={step === 0}
            className="flex items-center gap-2 text-white/50 hover:text-white/80 disabled:opacity-20 transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </motion.button>

          {/* Next */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={next}
            disabled={!hasValue()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            style={{ background: 'linear-gradient(135deg, #e11d48, #f97316)' }}
          >
            {step === STEPS.length - 2 ? 'See invitation' : 'Continue'}
            <ArrowRight size={16} />
          </motion.button>
        </div>
      )}

      {/* Share modal */}
      <ShareModal
        url={publishedUrl ?? shareUrl}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </div>
  )
}

// ─── Step Content ─────────────────────────────────────────────────────────────
// Renders the correct input widget for each step key

interface StepContentProps {
  step:        keyof InvitationData
  data:        InvitationData
  updateField: <K extends keyof InvitationData>(key: K, value: InvitationData[K]) => void
  toggleFood:  (food: string) => void
}

function StepContent({ step, data, updateField, toggleFood }: StepContentProps) {
  // Reusable styled text input
  const TextInput = ({ field, placeholder }: { field: 'senderName' | 'recipientName'; placeholder: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-light p-4"
    >
      <input
        type="text"
        value={data[field]}
        onChange={e => updateField(field, e.target.value)}
        placeholder={placeholder}
        autoFocus
        className="w-full bg-transparent text-white text-xl font-heading italic outline-none
                   placeholder:text-white/30 text-center"
      />
    </motion.div>
  )

  switch (step) {
    case 'senderName':
      return <TextInput field="senderName" placeholder="Your name..." />

    case 'recipientName':
      return <TextInput field="recipientName" placeholder="Their name..." />

    case 'date':
      return (
        <DatePicker
          date={data.date}
          time={data.time}
          onDate={v => updateField('date', v)}
          onTime={v => updateField('time', v)}
        />
      )

    case 'place':
      return (
        <div className="grid grid-cols-2 gap-3">
          {PLACE_OPTIONS.map(opt => (
            <ChoiceCard
              key={opt.value}
              {...opt}
              selected={data.place === opt.value}
              onSelect={() => updateField('place', opt.value)}
            />
          ))}
        </div>
      )

    case 'food':
      return (
        <div className="space-y-2">
          <p className="text-center text-white/40 text-xs mb-3">Select as many as you like</p>
          <div className="grid grid-cols-2 gap-3">
            {FOOD_OPTIONS.map(opt => (
              <ChoiceCard
                key={opt.value}
                {...opt}
                selected={data.food.includes(opt.value)}
                onSelect={() => toggleFood(opt.value)}
              />
            ))}
          </div>
        </div>
      )

    case 'dressColor':
      return (
        <div className="space-y-4">
          {/* Large preview swatch */}
          <motion.div
            className="w-20 h-20 rounded-full mx-auto shadow-2xl ring-2 ring-white/20"
            animate={{ backgroundColor: data.dressColor }}
            transition={{ duration: 0.3 }}
          />
          {/* Color grid */}
          <div className="grid grid-cols-6 gap-3 justify-items-center">
            {DRESS_COLORS.map(c => (
              <motion.button
                key={c.value}
                title={c.label}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => updateField('dressColor', c.value)}
                className="w-9 h-9 rounded-full shadow-lg transition-all"
                style={{
                  background: c.value,
                  ring: data.dressColor === c.value ? '2px solid white' : 'none',
                  outline: data.dressColor === c.value ? '2px solid rgba(255,255,255,0.8)' : '2px solid transparent',
                  outlineOffset: '2px',
                }}
              />
            ))}
          </div>
          <p className="text-center text-white/40 text-xs">
            {DRESS_COLORS.find(c => c.value === data.dressColor)?.label}
          </p>
        </div>
      )

    case 'loveLetter':
      return (
        <LoveLetter
          value={data.loveLetter}
          onChange={v => updateField('loveLetter', v)}
        />
      )

    default:
      return null
  }
}
