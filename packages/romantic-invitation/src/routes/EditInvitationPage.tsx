import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { TopNav } from '../components/TopNav'
import { WizardPage } from '../components/WizardPage'
import { useAuth } from '../lib/auth'
import { getInvitationById, updateInvitation, InvitationCreate, invitationSchema } from '../services/invitations'
import type { InvitationData, InvitationRecord } from '../types'

const DEFAULT_DATA: InvitationData = {
  senderName: '',
  recipientName: '',
  date: '',
  time: '19:00',
  place: '',
  food: [],
  dressColor: '#dc143c',
  loveLetter: '',
}

export function EditInvitationPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const [data, setData] = useState<InvitationData>(DEFAULT_DATA)
  const [invitation, setInvitation] = useState<InvitationRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load invitation from Supabase
  useEffect(() => {
    if (!id || !user || authLoading) return

    setLoading(true)
    getInvitationById(id, user.id).then(({ data: inv, error: err }) => {
      if (err || !inv) {
        setError(err?.message ?? 'Invitation not found')
        setLoading(false)
        return
      }

      setInvitation(inv)
      setData({
        title: inv.title,
        welcomeMessage: inv.welcome_message,
        mainQuestion: inv.main_question,
        senderName: inv.sender_name,
        recipientName: inv.recipient_name,
        date: inv.date,
        time: inv.time,
        place: inv.place,
        food: inv.food ?? [],
        dressColor: inv.dress_color ?? '#dc143c',
        loveLetter: inv.love_letter,
        theme: inv.theme,
        animation: inv.animation,
        imageUrl: inv.image_url,
        musicUrl: inv.music_url,
      })
      setLoading(false)
    })
  }, [id, user, authLoading])

  const updateMutation = useMutation(async (payload: InvitationCreate) => {
    if (!user || !id) {
      throw new Error('Missing user or invitation ID')
    }
    return updateInvitation(id, user.id, payload)
  })

  function updateField<K extends keyof InvitationData>(key: K, value: InvitationData[K]) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  function toggleFood(food: string) {
    setData(prev => ({
      ...prev,
      food: prev.food.includes(food) ? prev.food.filter(f => f !== food) : [...prev.food, food],
    }))
  }

  async function handleEditSave(slug: string) {
    // Prepare payload for update
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

    const parsed = invitationSchema.safeParse(payload)
    if (!parsed.success) {
      setError('Invalid invitation data')
      return
    }

    try {
      const result = await updateMutation.mutateAsync(parsed.data)
      if (result.error) {
        setError(result.error.message)
        return
      }
      // Redirect back to dashboard
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save invitation')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-4xl mb-4">✨</div>
          <p>Loading invitation…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center text-white px-6">
        <div className="max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-2xl">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="text-white/70">{error}</p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="mt-6 rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] text-white">
      <TopNav />
      <main className="px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <WizardPage
            data={data}
            updateField={updateField}
            toggleFood={toggleFood}
            shareUrl=""
            editingId={id}
            onEditSave={handleEditSave}
          />
        </div>
      </main>
    </div>
  )
}
