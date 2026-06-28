/**
 * PublicFlowPage  —  /flow/:slug
 *
 * Screens: loading → expired/notFound → welcome → questions (1/step) → success
 */

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Download, Mail, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { submitFlowResponse } from '../services/flowResponses'
import { getFlowBySlug } from '../services/flows'
import type { FlowTheme, FlowWithQuestions, QuestionType } from '../types'

// ─── Theme accent map ────────────────────────────────────────────────────────

const THEME_ACCENT: Record<FlowTheme, string> = {
  rose:    '#f43f5e',
  violet:  '#7c3aed',
  amber:   '#f59e0b',
  emerald: '#10b981',
}

// ─── Slide variants ──────────────────────────────────────────────────────────

function getVariants(direction: 1 | -1) {
  return {
    initial: { opacity: 0, x: direction * 60 },
    animate: { opacity: 1, x: 0,              transition: { type: 'spring', stiffness: 280, damping: 26 } },
    exit:    { opacity: 0, x: direction * -60, transition: { duration: 0.18 } },
  }
}

// ─── Main component ──────────────────────────────────────────────────────────

export function PublicFlowPage() {
  const { slug } = useParams<{ slug: string }>()

  const [loading, setLoading]     = useState(true)
  const [flow, setFlow]           = useState<FlowWithQuestions | null>(null)
  const [expired, setExpired]     = useState(false)
  const [notFound, setNotFound]   = useState(false)
  const [started, setStarted]     = useState(false)

  const [step, setStep]           = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [answers, setAnswers]     = useState<Record<string, string>>(() => {
    if (!slug) return {}
    try { return JSON.parse(localStorage.getItem(`flow_answers_${slug}`) ?? '{}') } catch { return {} }
  })
  const [error, setError]         = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(() => {
    if (!slug) return false
    return localStorage.getItem(`flow_submitted_${slug}`) === '1'
  })
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    getFlowBySlug(slug).then(({ data, error: e }) => {
      if (e || !data) { setNotFound(true); setLoading(false); return }
      if (new Date(data.expires_at) <= new Date()) { setExpired(true); setLoading(false); return }
      setFlow(data)
      setLoading(false)
    })
  }, [slug])

  const accent = THEME_ACCENT[flow?.theme ?? 'rose']

  // ── Answer helpers ────────────────────────────────────────────────────────

  function setAnswer(qId: string, value: string) {
    setAnswers(prev => ({ ...prev, [qId]: value }))
    setError(null)
  }

  function toggleCheckbox(qId: string, option: string) {
    const current: string[] = JSON.parse(answers[qId] || '[]')
    const next = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option]
    setAnswer(qId, JSON.stringify(next))
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  function validateCurrent(): boolean {
    if (!flow) return false
    const q = flow.questions[step]
    if (!q.required) return true
    const val = answers[q.id] ?? ''
    if (q.type === 'checkbox') return JSON.parse(val || '[]').length > 0
    return val.trim().length > 0
  }

  function handleNext() {
    if (!validateCurrent()) { setError('This field is required.'); return }
    setError(null); setDirection(1); setStep(s => s + 1)
  }

  function handleBack() {
    setError(null); setDirection(-1); setStep(s => s - 1)
  }

  async function handleSubmit() {
    if (!flow || !validateCurrent()) { setError('This field is required.'); return }
    setSubmitting(true)
    setSubmitError(null)

    const { error: e } = await submitFlowResponse({
      flowId: flow.id,
      answers: flow.questions
        .filter(q => answers[q.id] !== undefined)
        .map(q => ({ questionId: q.id, answer: answers[q.id] })),
    })

    setSubmitting(false)
    if (e) { setSubmitError((e as Error)?.message ?? 'Submission failed. Please try again.'); return }
    if (slug) {
      localStorage.setItem(`flow_submitted_${slug}`, '1')
      localStorage.setItem(`flow_answers_${slug}`, JSON.stringify(answers))
    }
    setSubmitted(true)
  }

  // ── Shared shell ──────────────────────────────────────────────────────────

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] px-6 py-12 text-white">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) return (
    <Shell>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white/50">
        Loading…
      </motion.div>
    </Shell>
  )

  if (notFound) return (
    <Shell>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-2xl shadow-2xl space-y-4"
      >
        <div className="text-5xl">🔍</div>
        <h1 className="text-2xl font-bold">Flow not found</h1>
        <p className="text-white/60">This link doesn't exist or has been removed by the owner.</p>
      </motion.div>
    </Shell>
  )

  if (expired) return (
    <Shell>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-2xl shadow-2xl space-y-4"
      >
        <div className="text-5xl">⏰</div>
        <h1 className="text-2xl font-bold">This Flow has expired</h1>
        <p className="text-white/60">The link was only valid for 3 days. Ask the sender to share a new link.</p>
      </motion.div>
    </Shell>
  )

  if (submitted && flow) return <SuccessPage flow={flow} answers={answers} accent={accent} />

  if (!flow) return null

  // ── Welcome screen ────────────────────────────────────────────────────────

  if (!started) return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] text-white flex items-center justify-center px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        className="w-full max-w-sm overflow-hidden rounded-[2rem]"
        style={{ boxShadow: `0 0 80px ${accent}20, 0 0 0 1px ${accent}25` }}
      >
        {/* Cover image — inside the card */}
        {flow.cover_image ? (
          <div className="w-full h-56 overflow-hidden">
            <motion.img
              src={flow.cover_image}
              alt="Cover"
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full object-cover"
              onError={e => (e.currentTarget.parentElement!.style.display = 'none')}
            />
          </div>
        ) : (
          /* Decorative gradient header when no image */
          <div className="w-full h-28" style={{ background: `linear-gradient(160deg, ${accent}30, ${accent}08)` }} />
        )}

        {/* Card body */}
        <div className="bg-[#0e0c1f] px-8 pt-8 pb-10 text-center space-y-5">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 280, delay: 0.18 }}
            className="text-5xl -mt-12 mb-2 drop-shadow-lg"
          >
            ❤️
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
              {flow.title}
            </h1>
            <p className="text-white/55 text-[15px] leading-relaxed">
              {flow.subtitle || flow.description || 'Someone special created this experience for you.'}
            </p>
          </div>

          <div className="flex items-center gap-3 opacity-20 py-1">
            <div className="flex-1 h-px" style={{ background: accent }} />
            <span className="text-xs" style={{ color: accent }}>❧</span>
            <div className="flex-1 h-px" style={{ background: accent }} />
          </div>

          <div>
            <motion.button
              type="button"
              onClick={() => setStarted(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ backgroundColor: accent }}
              className="w-full rounded-2xl py-4 text-base font-semibold text-white shadow-lg transition"
            >
              Begin ❤️
            </motion.button>
            <p className="mt-3 text-white/25 text-xs tracking-wide">
              {flow.questions.length} question{flow.questions.length !== 1 ? 's' : ''} · takes about 1 min
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )

  // ── Question flow ─────────────────────────────────────────────────────────

  const questions = flow.questions
  const question  = questions[step]
  const isFirst   = step === 0
  const isLast    = step === questions.length - 1
  const progress  = ((step + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] text-white flex flex-col">

      {/* Progress bar — thicker, more visible */}
      <div className="h-[3px] w-full bg-white/8">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: accent }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 70, damping: 18 }}
        />
      </div>

      {/* Top bar */}
      <div className="px-6 pt-4 pb-3 flex items-center justify-between">
        <p className="text-xs text-white/30 tracking-wide">❤️ {flow.title}</p>
        <p className="text-xs text-white/30 tabular-nums">{step + 1} / {questions.length}</p>
      </div>

      {/* Question card — centered, contained */}
      <div className="flex-1 flex items-center justify-center px-5 py-6 overflow-hidden">
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              variants={getVariants(direction)}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* Card */}
              <div
                className="rounded-[2rem] overflow-hidden"
                style={{ boxShadow: `0 0 50px ${accent}15, 0 0 0 1px ${accent}20` }}
              >
                {/* Question header */}
                <div className="bg-[#0e0c1f] px-7 pt-8 pb-6" style={{ borderBottom: `1px solid ${accent}15` }}>
                  {/* Step badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: `${accent}20`, color: accent }}
                    >
                      {step + 1} of {questions.length}
                    </span>
                    {question.required && (
                      <span className="text-xs text-white/30">required</span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold leading-snug text-white">
                    {question.label}
                  </h2>
                </div>

                {/* Input area */}
                <div className="bg-[#090818] px-7 py-6">
                  <QuestionInput
                    question={question}
                    value={answers[question.id] ?? ''}
                    accent={accent}
                    onChange={val => setAnswer(question.id, val)}
                    onToggleCheckbox={opt => toggleCheckbox(question.id, opt)}
                    onEnter={isLast ? handleSubmit : handleNext}
                  />

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-sm"
                      style={{ color: accent }}
                    >
                      ↑ This field is required
                    </motion.p>
                  )}
                  {submitError && (
                    <p className="mt-3 text-sm text-rose-400">{submitError}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-5 py-5 flex items-center justify-between max-w-sm mx-auto w-full">
        <button
          type="button"
          onClick={handleBack}
          disabled={isFirst}
          className="flex items-center gap-1.5 text-sm text-white/35 hover:text-white/60 disabled:opacity-0 transition px-3 py-2"
        >
          <ArrowLeft size={15} /> Back
        </button>

        <motion.button
          type="button"
          onClick={isLast ? handleSubmit : handleNext}
          disabled={submitting}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{ backgroundColor: accent }}
          className="flex items-center gap-2 px-7 py-3 rounded-2xl text-white text-sm font-semibold transition disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : isLast ? 'Submit ❤️' : 'Next'}
          {!isLast && !submitting && <ArrowRight size={15} />}
        </motion.button>
      </div>
    </div>
  )
}

// ─── SuccessPage ──────────────────────────────────────────────────────────────

const HEARTS = [
  { left: '5%',  delay: 0,    dur: 7,   size: 22, opacity: 0.22 },
  { left: '18%', delay: 1.4,  dur: 9,   size: 14, opacity: 0.14 },
  { left: '32%', delay: 0.6,  dur: 8,   size: 28, opacity: 0.18 },
  { left: '50%', delay: 2.2,  dur: 10,  size: 16, opacity: 0.12 },
  { left: '64%', delay: 0.9,  dur: 7.5, size: 24, opacity: 0.20 },
  { left: '80%', delay: 1.8,  dur: 9.5, size: 18, opacity: 0.16 },
  { left: '92%', delay: 0.3,  dur: 8.5, size: 20, opacity: 0.19 },
]

function SuccessPage({ flow, answers, accent }: { flow: FlowWithQuestions; answers: Record<string, string>; accent: string }) {
  function formatAnswer(qId: string, type: QuestionType): string {
    const raw = answers[qId] ?? ''
    if (!raw) return '—'
    if (type === 'checkbox') {
      try { return (JSON.parse(raw) as string[]).join(', ') } catch { return raw }
    }
    if (type === 'date') {
      // raw is YYYY-MM-DD — build a local date so the day doesn't shift across timezones
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw)
      if (m) {
        const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
        return d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      }
    }
    if (type === 'time') {
      const m = /^(\d{1,2}):(\d{2})/.exec(raw)
      if (m) {
        const d = new Date()
        d.setHours(Number(m[1]), Number(m[2]), 0, 0)
        return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
      }
    }
    return raw
  }

  const answeredQuestions = flow.questions.filter(q => answers[q.id])
  const dateStr = new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
  const serif = "'Georgia', 'Times New Roman', serif"

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] text-white flex items-center justify-center px-4 py-16 overflow-hidden">

      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) rotate(-8deg) scale(1); opacity: var(--ho); }
          60%  { opacity: calc(var(--ho) * 0.7); }
          100% { transform: translateY(-100vh) rotate(12deg) scale(0.7); opacity: 0; }
        }
        .fh { animation: floatUp var(--dur) ease-in infinite; animation-delay: var(--del); position: absolute; bottom: -20px; pointer-events: none; user-select: none; }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.08); }
        }
        .heart-seal { animation: pulse-glow 2.4s ease-in-out infinite; }
      `}</style>

      {HEARTS.map((h, i) => (
        <div key={i} className="fh" style={{ left: h.left, fontSize: `${h.size}px`, '--ho': h.opacity, '--dur': `${h.dur}s`, '--del': `${h.delay}s` } as React.CSSProperties}>❤️</div>
      ))}

      {/* Soft radial glow behind card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[480px] h-[480px] rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.93 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 20 }}
        className="relative w-full max-w-md z-10"
      >
        {/* Card with glowing border */}
        <div className="rounded-[2rem] overflow-hidden" style={{ boxShadow: `0 0 60px ${accent}22, 0 0 0 1px ${accent}33` }}>

          {/* ── Header ─────────────────────────────────────── */}
          <div className="relative text-center px-8 pt-12 pb-8" style={{ background: `linear-gradient(160deg, ${accent}28 0%, ${accent}10 40%, transparent 100%)` }}>

            {/* Top ornament row */}
            <div className="flex items-center gap-3 mb-8 opacity-25">
              <div className="flex-1 h-px" style={{ background: accent }} />
              <span className="text-xs tracking-[0.4em]" style={{ color: accent }}>✦ ✦ ✦</span>
              <div className="flex-1 h-px" style={{ background: accent }} />
            </div>

            {/* Pulsing heart seal */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
              className="heart-seal text-6xl mb-5 inline-block"
            >
              ❤️
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="text-4xl font-bold tracking-wide text-white mb-2"
              style={{ fontFamily: serif }}
            >
              Thank You
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38 }}
              className="text-sm font-semibold tracking-[0.2em] uppercase"
              style={{ color: accent }}
            >
              {flow.title}
            </motion.p>

            {flow.subtitle && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.44 }} className="text-sm text-white/50 mt-1">
                {flow.subtitle}
              </motion.p>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 mt-8 opacity-20">
              <div className="flex-1 h-px" style={{ background: accent }} />
              <span className="text-base" style={{ color: accent }}>❧</span>
              <div className="flex-1 h-px" style={{ background: accent }} />
            </div>
          </div>

          {/* ── Body ───────────────────────────────────────── */}
          <div className="bg-[#0c0b1e] px-8 pb-2 pt-9">
            {answeredQuestions.length > 0 && (
              <div className="space-y-9">
                {answeredQuestions.map((q, i) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="text-center"
                  >
                    <p className="text-[14px] italic text-white/45 mb-2.5" style={{ fontFamily: serif }}>
                      {q.label}
                    </p>
                    <p className="text-[26px] leading-tight text-white" style={{ fontFamily: serif }}>
                      {formatAnswer(q.id, q.type)}
                    </p>
                    {i < answeredQuestions.length - 1 && (
                      <span className="mt-7 block text-sm opacity-25" style={{ color: accent }}>✦</span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* ── Footer ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-[#0c0b1e] px-8 pt-4 pb-8"
          >
            {/* Divider */}
            <div className="flex items-center gap-3 mb-5 opacity-20">
              <div className="flex-1 h-px" style={{ background: accent }} />
              <span className="text-base" style={{ color: accent }}>❧</span>
              <div className="flex-1 h-px" style={{ background: accent }} />
            </div>

            <p className="text-center text-[12px] text-white/25 tracking-[0.22em] uppercase mb-5">{dateStr}</p>

            {/* Share buttons */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { icon: <MessageCircle size={16} />, label: 'WhatsApp' },
                { icon: <Mail size={16} />,          label: 'Email'    },
                { icon: <Download size={16} />,      label: 'Save'     },
              ].map(btn => (
                <button
                  key={btn.label}
                  type="button"
                  disabled
                  className="flex flex-col items-center gap-2 py-3.5 rounded-2xl text-xs font-medium cursor-not-allowed"
                  style={{ border: `1px solid ${accent}25`, color: `${accent}50`, background: `${accent}0a` }}
                >
                  {btn.icon}
                  {btn.label}
                </button>
              ))}
            </div>
            <p className="text-center text-[10px] mt-3 tracking-wider" style={{ color: `${accent}30` }}>Sharing options coming soon</p>
          </motion.div>

        </div>
      </motion.div>
    </div>
  )
}

// ─── QuestionInput ────────────────────────────────────────────────────────────

interface QuestionInputProps {
  question:         { id: string; type: QuestionType; options: string[] | null }
  value:            string
  accent:           string
  onChange:         (val: string) => void
  onToggleCheckbox: (opt: string) => void
  onEnter:          () => void
}

const INPUT_BASE =
  'w-full rounded-2xl border bg-white/5 px-5 py-4 text-white text-lg outline-none placeholder:text-white/25 transition [color-scheme:dark]'

function useAccentFocus(accent: string) {
  const [focused, setFocused] = useState(false)
  const borderStyle = { borderColor: focused ? accent : 'rgba(255,255,255,0.15)' }
  const handlers = {
    onFocus: () => setFocused(true),
    onBlur:  () => setFocused(false),
  }
  return { borderStyle, handlers }
}

function QuestionInput({ question, value, accent, onChange, onToggleCheckbox, onEnter }: QuestionInputProps) {
  const opts = question.options ?? []
  const checkboxSelected: string[] = question.type === 'checkbox'
    ? (() => { try { return JSON.parse(value || '[]') } catch { return [] } })()
    : []

  const { borderStyle, handlers } = useAccentFocus(accent)

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && question.type !== 'textarea') onEnter()
  }

  switch (question.type) {
    case 'textarea':
      return (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={4}
          autoFocus
          placeholder="Type your answer…"
          className={`${INPUT_BASE} resize-none`}
          style={borderStyle}
          {...handlers}
        />
      )

    case 'date':
      return <input type="date" value={value} onChange={e => onChange(e.target.value)} autoFocus className={INPUT_BASE} style={borderStyle} {...handlers} />

    case 'time':
      return <input type="time" value={value} onChange={e => onChange(e.target.value)} autoFocus className={INPUT_BASE} style={borderStyle} {...handlers} />

    case 'number':
      return <input type="number" value={value} onChange={e => onChange(e.target.value)} onKeyDown={handleKey} autoFocus placeholder="0" className={INPUT_BASE} style={borderStyle} {...handlers} />

    case 'email':
      return <input type="email" value={value} onChange={e => onChange(e.target.value)} onKeyDown={handleKey} autoFocus placeholder="you@example.com" className={INPUT_BASE} style={borderStyle} {...handlers} />

    case 'phone':
      return <input type="tel" value={value} onChange={e => onChange(e.target.value)} onKeyDown={handleKey} autoFocus placeholder="+1 234 567 890" className={INPUT_BASE} style={borderStyle} {...handlers} />

    case 'radio':
      return (
        <div className="space-y-3">
          {opts.map(opt => {
            const selected = value === opt
            return (
              <motion.button
                key={opt}
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onChange(opt)}
                style={selected ? { borderColor: accent, backgroundColor: `${accent}22` } : {}}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition ${
                  selected ? 'text-white' : 'border-white/15 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                  style={{ borderColor: selected ? accent : 'rgba(255,255,255,0.3)' }}
                >
                  {selected && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }} />}
                </div>
                <span className="text-base">{opt}</span>
              </motion.button>
            )
          })}
        </div>
      )

    case 'checkbox':
      return (
        <div className="space-y-3">
          {opts.map(opt => {
            const checked = checkboxSelected.includes(opt)
            return (
              <motion.button
                key={opt}
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onToggleCheckbox(opt)}
                style={checked ? { borderColor: accent, backgroundColor: `${accent}22` } : {}}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition ${
                  checked ? 'text-white' : 'border-white/15 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                <div
                  className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0"
                  style={{ borderColor: checked ? accent : 'rgba(255,255,255,0.3)', backgroundColor: checked ? `${accent}44` : 'transparent' }}
                >
                  {checked && <span className="text-xs font-bold leading-none" style={{ color: accent }}>✓</span>}
                </div>
                <span className="text-base">{opt}</span>
              </motion.button>
            )
          })}
        </div>
      )

    case 'select':
      return (
        <select value={value} onChange={e => onChange(e.target.value)} autoFocus className={INPUT_BASE} style={borderStyle} {...handlers}>
          <option value="" disabled>Choose an option…</option>
          {opts.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      )

    default:
      return (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKey}
          autoFocus
          placeholder="Type your answer…"
          className={INPUT_BASE}
          style={borderStyle}
          {...handlers}
        />
      )
  }
}
