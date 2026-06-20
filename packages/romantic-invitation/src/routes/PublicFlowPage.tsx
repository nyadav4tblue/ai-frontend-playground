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
  const [answers, setAnswers]     = useState<Record<string, string>>({})
  const [error, setError]         = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
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
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] text-white flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Cover image */}
        {flow.cover_image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full h-48 rounded-[2rem] overflow-hidden"
          >
            <img
              src={flow.cover_image}
              alt="Cover"
              className="w-full h-full object-cover"
              onError={e => (e.currentTarget.parentElement!.style.display = 'none')}
            />
          </motion.div>
        )}

        {/* Title card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-2xl shadow-2xl space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
            className="text-5xl"
          >
            ❤️
          </motion.div>

          <h1 className="text-3xl font-bold">{flow.title}</h1>

          {(flow.subtitle || flow.description) && (
            <p className="text-white/60 text-base leading-relaxed">
              {flow.subtitle || flow.description}
            </p>
          )}

          {!flow.subtitle && !flow.description && (
            <p className="text-white/40 text-sm">Someone special created this experience for you.</p>
          )}

          <motion.button
            type="button"
            onClick={() => setStarted(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{ backgroundColor: accent }}
            className="mt-2 inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg transition"
          >
            Start ❤️
          </motion.button>

          <p className="text-white/30 text-xs">{flow.questions.length} question{flow.questions.length !== 1 ? 's' : ''}</p>
        </motion.div>
      </motion.div>
    </div>
  )

  // ── Question flow ─────────────────────────────────────────────────────────

  const questions = flow.questions
  const question  = questions[step]
  const isFirst   = step === 0
  const isLast    = step === questions.length - 1
  const progress  = ((step) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] text-white flex flex-col">

      {/* Progress bar */}
      <div className="h-1 w-full bg-white/10">
        <motion.div
          className="h-full"
          style={{ backgroundColor: accent }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        />
      </div>

      {/* Flow title header */}
      <div className="px-6 py-5 border-b border-white/5">
        <p className="text-sm text-white/40 text-center tracking-wide">❤️ {flow.title}</p>
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-hidden">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              variants={getVariants(direction)}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-bold text-sm tabular-nums" style={{ color: accent }}>
                    {step + 1}
                    <span className="text-white/30 font-normal"> / {questions.length}</span>
                  </span>
                </div>
                <h2 className="text-2xl font-bold leading-snug">
                  {question.label}
                  {question.required && <span className="ml-1" style={{ color: accent }}>*</span>}
                </h2>
              </div>

              <QuestionInput
                question={question}
                value={answers[question.id] ?? ''}
                accent={accent}
                onChange={val => setAnswer(question.id, val)}
                onToggleCheckbox={opt => toggleCheckbox(question.id, opt)}
                onEnter={isLast ? handleSubmit : handleNext}
              />

              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-rose-400">
                  {error}
                </motion.p>
              )}

              {submitError && <p className="text-sm text-rose-400">{submitError}</p>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 py-6 border-t border-white/5 flex items-center justify-between max-w-md mx-auto w-full">
        <button
          type="button"
          onClick={handleBack}
          disabled={isFirst}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 disabled:opacity-0 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <button
          type="button"
          onClick={isLast ? handleSubmit : handleNext}
          disabled={submitting}
          style={{ backgroundColor: accent }}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold transition disabled:opacity-60 hover:opacity-90"
        >
          {submitting ? 'Submitting…' : isLast ? 'Submit' : 'Next'}
          {!isLast && !submitting && <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  )
}

// ─── SuccessPage ──────────────────────────────────────────────────────────────

function SuccessPage({ flow, answers, accent }: { flow: FlowWithQuestions; answers: Record<string, string>; accent: string }) {
  function formatAnswer(qId: string, type: QuestionType): string {
    const raw = answers[qId] ?? ''
    if (!raw) return '—'
    if (type === 'checkbox') {
      try { return (JSON.parse(raw) as string[]).join(', ') } catch { return raw }
    }
    return raw
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-6">

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-2xl shadow-2xl space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
            className="text-6xl"
          >
            ❤️
          </motion.div>
          <h1 className="text-3xl font-bold">Thank you</h1>
          <p className="text-white/70">Your response has been submitted successfully.</p>
        </motion.div>

        {/* Answer summary */}
        {flow.questions.some(q => answers[q.id]) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Your answers</p>
              <p className="text-xs text-white/30">{flow.title}</p>
            </div>
            <div className="space-y-3">
              {flow.questions.map(q => (
                <div key={q.id} className="flex flex-col gap-0.5">
                  <span className="text-xs text-white/50">{q.label}</span>
                  <span className="text-sm text-white/90">{formatAnswer(q.id, q.type)}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-white/25 pt-1">
              Submitted {new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </motion.div>
        )}

        {/* Share placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <p className="text-center text-xs text-white/30 uppercase tracking-widest">Share</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <MessageCircle size={18} />, label: 'WhatsApp' },
              { icon: <Mail size={18} />,          label: 'Email'    },
              { icon: <Download size={18} />,      label: 'Save'     },
            ].map(btn => (
              <button
                key={btn.label}
                type="button"
                disabled
                title="Coming soon"
                className="flex flex-col items-center gap-2 py-4 rounded-3xl border border-white/10 bg-white/5 text-white/25 text-xs cursor-not-allowed"
              >
                {btn.icon}
                {btn.label}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-white/20">Sharing options coming soon</p>
        </motion.div>

      </div>
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

const INPUT_CLASS =
  'w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-white text-lg outline-none focus:border-rose-400 placeholder:text-white/25 transition [color-scheme:dark]'

function QuestionInput({ question, value, accent, onChange, onToggleCheckbox, onEnter }: QuestionInputProps) {
  const opts = question.options ?? []
  const checkboxSelected: string[] = JSON.parse(value || '[]')

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
          className={`${INPUT_CLASS} resize-none`}
        />
      )

    case 'date':
      return <input type="date" value={value} onChange={e => onChange(e.target.value)} autoFocus className={INPUT_CLASS} />

    case 'time':
      return <input type="time" value={value} onChange={e => onChange(e.target.value)} autoFocus className={INPUT_CLASS} />

    case 'number':
      return <input type="number" value={value} onChange={e => onChange(e.target.value)} onKeyDown={handleKey} autoFocus placeholder="0" className={INPUT_CLASS} />

    case 'email':
      return <input type="email" value={value} onChange={e => onChange(e.target.value)} onKeyDown={handleKey} autoFocus placeholder="you@example.com" className={INPUT_CLASS} />

    case 'phone':
      return <input type="tel" value={value} onChange={e => onChange(e.target.value)} onKeyDown={handleKey} autoFocus placeholder="+1 234 567 890" className={INPUT_CLASS} />

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
        <select value={value} onChange={e => onChange(e.target.value)} autoFocus className={INPUT_CLASS}>
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
          className={INPUT_CLASS}
        />
      )
  }
}
