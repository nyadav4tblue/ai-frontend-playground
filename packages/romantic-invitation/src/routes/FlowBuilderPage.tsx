import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2, X } from 'lucide-react'
import { TopNav } from '../components/TopNav'
import { useAuth } from '../lib/auth'
import { createFlow, updateFlow } from '../services/flows'
import type { FlowTheme, QuestionDraft, QuestionType } from '../types'

const TYPES_WITH_OPTIONS: QuestionType[] = ['radio', 'checkbox', 'select']

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  text:     'Short Text',
  textarea: 'Long Text',
  email:    'Email',
  phone:    'Phone',
  number:   'Number',
  date:     'Date',
  time:     'Time',
  radio:    'Radio (single choice)',
  checkbox: 'Checkbox (multi-select)',
  select:   'Dropdown Select',
}

const THEMES: { value: FlowTheme; label: string; color: string }[] = [
  { value: 'rose',    label: 'Rose',    color: '#f43f5e' },
  { value: 'violet',  label: 'Violet',  color: '#7c3aed' },
  { value: 'amber',   label: 'Amber',   color: '#f59e0b' },
  { value: 'emerald', label: 'Emerald', color: '#10b981' },
]

function makeQuestion(): QuestionDraft {
  return { _id: crypto.randomUUID(), type: 'text', label: '', required: false, options: [] }
}

export function FlowBuilderPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const isEditing = Boolean(id)

  const [title, setTitle]           = useState('')
  const [subtitle, setSubtitle]     = useState('')
  const [description, setDescription] = useState('')
  const [theme, setTheme]           = useState<FlowTheme>('rose')
  const [coverImage, setCoverImage] = useState('')
  const [questions, setQuestions]   = useState<QuestionDraft[]>([makeQuestion()])
  const [loading, setLoading]       = useState(isEditing)
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState<string | null>(null)

  useEffect(() => {
    if (!isEditing || !id || !user || authLoading) return

    import('../services/flows').then(({ getFlowById }) =>
      getFlowById(id, user.id).then(({ data }) => {
        if (!data) { setError('Flow not found'); setLoading(false); return }
        setTitle(data.title)
        setSubtitle(data.subtitle ?? '')
        setDescription(data.description ?? '')
        setTheme(data.theme ?? 'rose')
        setCoverImage(data.cover_image ?? '')
        setQuestions(
          data.questions.length > 0
            ? data.questions.map(q => ({
                _id:      q.id,
                type:     q.type,
                label:    q.label,
                required: q.required,
                options:  q.options ?? [],
              }))
            : [makeQuestion()]
        )
        setLoading(false)
      })
    )
  }, [id, user, authLoading, isEditing])

  // ── Question helpers ──────────────────────────────────────────────────────

  function addQuestion() {
    setQuestions(prev => [...prev, makeQuestion()])
  }

  function removeQuestion(idx: number) {
    setQuestions(prev => prev.filter((_, i) => i !== idx))
  }

  function updateQuestion(idx: number, patch: Partial<QuestionDraft>) {
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, ...patch } : q))
  }

  function addOption(qi: number) {
    updateQuestion(qi, { options: [...questions[qi].options, ''] })
  }

  function updateOption(qi: number, oi: number, value: string) {
    const opts = [...questions[qi].options]
    opts[oi] = value
    updateQuestion(qi, { options: opts })
  }

  function removeOption(qi: number, oi: number) {
    updateQuestion(qi, { options: questions[qi].options.filter((_, i) => i !== oi) })
  }

  function moveQuestion(from: number, to: number) {
    setQuestions(prev => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

  // ── Save ──────────────────────────────────────────────────────────────────

  async function handleSave() {
    if (!user) return
    setError(null)

    const payload = {
      title:       title.trim(),
      subtitle:    subtitle.trim() || undefined,
      description: description.trim() || undefined,
      theme,
      cover_image: coverImage.trim() || undefined,
      questions:   questions.map((q, i) => ({
        type:       q.type,
        label:      q.label.trim(),
        options:    TYPES_WITH_OPTIONS.includes(q.type) ? q.options.filter(Boolean) : null,
        required:   q.required,
        sort_order: i,
      })),
    }

    setSaving(true)
    const result = isEditing && id
      ? await updateFlow(id, user.id, payload)
      : await createFlow(payload, user.id)

    setSaving(false)

    if (result.error) {
      const e = result.error as { issues?: { message: string }[]; message?: string }
      setError(e.issues?.[0]?.message ?? e.message ?? 'Something went wrong. Please try again.')
      return
    }

    navigate('/admin')
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center text-white">
        <p>Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] text-white">
      <TopNav />

      <main className="px-6 py-10">
        <div className="mx-auto max-w-3xl space-y-8">

          {/* Header */}
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl shadow-2xl">
            <p className="text-sm uppercase tracking-[0.32em] text-white/50">
              {isEditing ? 'Edit Flow' : 'New Flow'}
            </p>
            <h1 className="mt-3 text-3xl font-bold">
              {isEditing ? 'Edit your relationship flow' : 'Create a relationship flow'}
            </h1>
            <p className="mt-2 text-white/60">
              Build an interactive experience for your partner. Flows expire 3 days after creation.
            </p>
          </section>

          {/* Flow details */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-5">
            <h2 className="text-sm uppercase tracking-[0.3em] text-white/50">Flow details</h2>

            <div>
              <label className="block text-sm text-white/70 mb-1">
                Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder='e.g. "Our First Date ❤️"'
                className="w-full rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-rose-400 placeholder:text-white/30"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">Subtitle (optional)</label>
              <input
                type="text"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                placeholder='e.g. "Someone special created this for you ❤️"'
                className="w-full rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-rose-400 placeholder:text-white/30"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">Description (optional)</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                placeholder="A short note shown to your partner before they start"
                className="w-full rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-rose-400 placeholder:text-white/30 resize-none"
              />
            </div>

            {/* Theme picker */}
            <div>
              <label className="block text-sm text-white/70 mb-2">Theme</label>
              <div className="flex gap-3">
                {THEMES.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTheme(t.value)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm border transition ${
                      theme === t.value
                        ? 'border-white/40 bg-white/10 text-white'
                        : 'border-white/10 text-white/50 hover:bg-white/5'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cover image */}
            <div>
              <label className="block text-sm text-white/70 mb-1">Cover image URL (optional)</label>
              <input
                type="url"
                value={coverImage}
                onChange={e => setCoverImage(e.target.value)}
                placeholder="https://…"
                className="w-full rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-rose-400 placeholder:text-white/30"
              />
              {coverImage && (
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="mt-3 h-32 w-full rounded-2xl object-cover opacity-80"
                  onError={e => (e.currentTarget.style.display = 'none')}
                />
              )}
            </div>
          </section>

          {/* Questions */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2 rounded-full border border-rose-500/40 px-4 py-2 text-sm text-rose-300 hover:bg-rose-500/10 transition"
              >
                <Plus size={14} />
                Add question
              </button>
            </div>

            {questions.map((q, qi) => (
              <div
                key={q._id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4"
              >
                {/* Question header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40 uppercase tracking-widest">Q{qi + 1}</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => qi > 0 && moveQuestion(qi, qi - 1)}
                        disabled={qi === 0}
                        className="text-white/20 hover:text-white/60 disabled:opacity-10 transition text-xs px-1"
                        title="Move up"
                      >↑</button>
                      <button
                        type="button"
                        onClick={() => qi < questions.length - 1 && moveQuestion(qi, qi + 1)}
                        disabled={qi === questions.length - 1}
                        className="text-white/20 hover:text-white/60 disabled:opacity-10 transition text-xs px-1"
                        title="Move down"
                      >↓</button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQuestion(qi)}
                    disabled={questions.length === 1}
                    className="text-white/30 hover:text-rose-400 disabled:opacity-20 transition"
                    title="Remove question"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Type selector */}
                <div>
                  <label className="block text-sm text-white/70 mb-1">Type</label>
                  <select
                    value={q.type}
                    onChange={e => updateQuestion(qi, { type: e.target.value as QuestionType, options: [] })}
                    className="w-full rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-rose-400 [color-scheme:dark]"
                  >
                    {Object.entries(QUESTION_TYPE_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Label */}
                <div>
                  <label className="block text-sm text-white/70 mb-1">
                    Question <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={q.label}
                    onChange={e => updateQuestion(qi, { label: e.target.value })}
                    placeholder='e.g. "Will you go on a date with me?"'
                    className="w-full rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-rose-400 placeholder:text-white/30"
                  />
                </div>

                {/* Options */}
                {TYPES_WITH_OPTIONS.includes(q.type) && (
                  <div className="space-y-2">
                    <label className="block text-sm text-white/70">Options</label>
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={opt}
                          onChange={e => updateOption(qi, oi, e.target.value)}
                          placeholder={`Option ${oi + 1}`}
                          className="flex-1 rounded-3xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white outline-none focus:border-rose-400 placeholder:text-white/30"
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(qi, oi)}
                          className="text-white/30 hover:text-rose-400 transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(qi)}
                      className="flex items-center gap-1 text-sm text-rose-300 hover:text-rose-200 transition"
                    >
                      <Plus size={13} /> Add option
                    </button>
                  </div>
                )}

                {/* Required toggle */}
                <label className="flex items-center gap-3 cursor-pointer w-fit">
                  <div
                    onClick={() => updateQuestion(qi, { required: !q.required })}
                    className={`relative w-10 h-6 rounded-full transition-colors ${q.required ? 'bg-rose-500' : 'bg-white/20'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${q.required ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                  <span className="text-sm text-white/70">Required</span>
                </label>
              </div>
            ))}
          </section>

          {error && (
            <p className="text-sm text-rose-300 px-2">{error}</p>
          )}

          <div className="flex gap-3 pb-8">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="rounded-full border border-white/15 px-6 py-3 text-sm text-white/80 hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:opacity-60"
            >
              {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Publish flow'}
            </button>
          </div>

        </div>
      </main>
    </div>
  )
}
