/**
 * URL State Utilities
 *
 * This module serializes and deserializes the InvitationData into URL search
 * params so the invitation is fully shareable with no backend required.
 *
 * Example URL:
 *   ?sn=Alice&rn=Bob&d=2024-02-14&t=19:30&p=rooftop&f=pizza%2Cwine&dc=%23ff69b4&ll=I+love+you
 */

import type { InvitationData } from '../types'

// Short param keys to keep URLs compact
const PARAM_MAP: Record<keyof InvitationData, string> = {
  senderName:    'sn',
  recipientName: 'rn',
  date:          'd',
  time:          't',
  place:         'p',
  food:          'f',  // comma-separated list
  dressColor:    'dc',
  loveLetter:    'll',
}

// Reverse lookup: short key → field name
const REVERSE_MAP = Object.fromEntries(
  Object.entries(PARAM_MAP).map(([k, v]) => [v, k])
) as Record<string, keyof InvitationData>

export function encodeInvitation(data: Partial<InvitationData>): string {
  const params = new URLSearchParams()

  for (const [field, shortKey] of Object.entries(PARAM_MAP)) {
    const value = data[field as keyof InvitationData]
    if (!value) continue

    if (Array.isArray(value)) {
      // food[] → "pizza,wine"
      params.set(shortKey, value.join(','))
    } else {
      params.set(shortKey, String(value))
    }
  }

  return params.toString()
}

export function decodeInvitation(search: string): Partial<InvitationData> {
  const params = new URLSearchParams(search)
  const result: Partial<InvitationData> = {}

  for (const [shortKey, value] of params.entries()) {
    const field = REVERSE_MAP[shortKey]
    if (!field) continue

    if (field === 'food') {
      // Split comma list back into array
      result.food = value.split(',').filter(Boolean)
    } else {
      // TypeScript needs the cast since all other fields are strings
      ;(result as Record<string, unknown>)[field] = value
    }
  }

  return result
}
