import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChoiceCard } from '../components/ChoiceCard'
import { DRESS_COLORS, FOOD_OPTIONS, PLACE_OPTIONS } from '../utils/constants'
import { getInvitationBySlug } from '../services/invitations'
import { recordInvitationView, submitInvitationResponse } from '../services/responses'
import type { InvitationRecord } from '../types'

export function PublicInvitationPage() {
  const { slug } = useParams<{ slug: string }>()
  const [loading, setLoading] = useState(true)
  const [invitation, setInvitation] = useState<InvitationRecord | null>(null)
  const [expired, setExpired] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState('')
  const [selectedFood, setSelectedFood] = useState<string[]>([])
  const [selectedDress, setSelectedDress] = useState('')
  const [accepted, setAccepted] = useState<boolean | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    setLoading(true)
    getInvitationBySlug(slug).then(({ data, error: fetchError }) => {
      if (fetchError || !data) {
        setExpired(true)
        setLoading(false)
        return
      }

      const isExpired = new Date(data.expires_at) <= new Date()
      setInvitation(data)
      setExpired(isExpired)
      setLoading(false)

      if (!isExpired) {
        recordInvitationView(data.id)
      }
    })
  }, [slug])

  function toggleFood(item: string) {
    setSelectedFood(prev => prev.includes(item) ? prev.filter(value => value !== item) : [...prev, item])
  }

  async function handleSubmit() {
    if (!invitation || accepted === null) {
      setError('Please select yes or no before submitting.')
      return
    }

    setError(null)
    const payload = {
      invitation_id: invitation.id,
      accepted,
      selected_date: invitation.date,
      selected_place: selectedPlace || invitation.place,
      selected_food: selectedFood.length > 0 ? selectedFood : invitation.food,
      selected_dress: selectedDress || invitation.dressColor,
      submitted_at: new Date().toISOString(),
      device: window.navigator.platform,
      browser: window.navigator.userAgent,
    }

    const { error: submitError } = await submitInvitationResponse(payload)
    if (submitError) {
      setError(submitError.message)
      return
    }

    setSubmitted(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f3460] text-white">
        Loading invitation…
      </div>
    )
  }

  if (expired || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f3460] text-white px-6">
        <div className="max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-2xl">
          <h1 className="text-4xl font-bold mb-4">Invitation Expired</h1>
          <p className="text-white/70">This link is no longer valid. If you need a new invitation, please ask the sender to create and share a fresh link.</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f3460] text-white px-6">
        <div className="max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-2xl shadow-2xl">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold mb-2">Response submitted</h1>
          <p className="text-white/70">Thank you for letting the host know your preferences. Have a lovely day.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] text-white px-6 py-12">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl shadow-2xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.32em] text-white/50">You're invited</p>
              <h1 className="text-5xl font-heading font-bold">{invitation.title ?? `A special evening with ${invitation.senderName}`}</h1>
              <p className="text-white/70">{invitation.welcomeMessage ?? 'Choose your preferences below and respond to the invitation.'}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-white/50">Date</p>
                <p className="mt-3 text-lg">{new Date(invitation.date).toLocaleDateString()}</p>
                <p className="text-white/60">{invitation.time}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-white/50">Location</p>
                <p className="mt-3 text-lg">{invitation.place}</p>
                <p className="text-white/60">Food: {invitation.food.join(', ')}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <p className="text-sm uppercase tracking-[0.32em] text-white/50">Love note</p>
              <p className="mt-4 text-white/80">{invitation.loveLetter}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <p className="text-sm uppercase tracking-[0.32em] text-white/50">Will you attend?</p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setAccepted(true)}
                  className={`flex-1 rounded-3xl px-5 py-4 text-sm font-semibold transition ${accepted === true ? 'bg-rose-500 text-white' : 'bg-white/5 text-white/80 hover:bg-white/10'}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setAccepted(false)}
                  className={`flex-1 rounded-3xl px-5 py-4 text-sm font-semibold transition ${accepted === false ? 'bg-slate-600 text-white' : 'bg-white/5 text-white/80 hover:bg-white/10'}`}
                >
                  No
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <p className="text-sm uppercase tracking-[0.32em] text-white/50">Choose your favorite place</p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {PLACE_OPTIONS.map(opt => (
                  <ChoiceCard
                    key={opt.value}
                    {...opt}
                    selected={selectedPlace === opt.value}
                    onSelect={() => setSelectedPlace(opt.value)}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <p className="text-sm uppercase tracking-[0.32em] text-white/50">Food choices</p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {FOOD_OPTIONS.map(opt => (
                  <ChoiceCard
                    key={opt.value}
                    {...opt}
                    selected={selectedFood.includes(opt.value)}
                    onSelect={() => toggleFood(opt.value)}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <p className="text-sm uppercase tracking-[0.32em] text-white/50">Dress color</p>
              <div className="grid grid-cols-6 gap-3 mt-4">
                {DRESS_COLORS.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedDress(color.value)}
                    className={`h-12 w-12 rounded-full ring-2 transition ${selectedDress === color.value ? 'ring-rose-400' : 'ring-white/10'}`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-rose-300">{error}</p>}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full rounded-3xl bg-rose-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-rose-400"
            >
              Submit response
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
