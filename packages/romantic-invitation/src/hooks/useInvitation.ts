/**
 * useInvitation — central state hook for the invitation wizard
 *
 * Reads initial state from URL params (so shared links auto-populate),
 * exposes update helpers, and keeps the URL in sync as the user fills in steps.
 */

import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { InvitationData } from '../types'
import { decodeInvitation, encodeInvitation } from '../utils/urlState'

const DEFAULT_DATA: InvitationData = {
  senderName:    '',
  recipientName: '',
  date:          '',
  time:          '19:00',
  place:         '',
  food:          [],
  dressColor:    '#dc143c',
  loveLetter:    '',
}

export function useInvitation() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Hydrate from URL on first load (supports incoming shared links)
  const [data, setData] = useState<InvitationData>(() => ({
    ...DEFAULT_DATA,
    ...decodeInvitation(searchParams.toString()),
  }))

  // Keep URL in sync whenever data changes
  useEffect(() => {
    const encoded = encodeInvitation(data)
    navigate({ search: encoded ? `?${encoded}` : '' }, { replace: true })
  }, [data, navigate])

  // Generic field updater — works for string fields
  const updateField = useCallback(
    <K extends keyof InvitationData>(key: K, value: InvitationData[K]) => {
      setData(prev => ({ ...prev, [key]: value }))
    },
    []
  )

  // Toggle a food option in the food[] array
  const toggleFood = useCallback((food: string) => {
    setData(prev => ({
      ...prev,
      food: prev.food.includes(food)
        ? prev.food.filter(f => f !== food)
        : [...prev.food, food],
    }))
  }, [])

  // Compute a shareable absolute URL
  const shareUrl = `${window.location.origin}${window.location.pathname}?${encodeInvitation(data)}`

  return { data, updateField, toggleFood, shareUrl }
}
