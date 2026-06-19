import { z } from 'zod'
import { supabase } from '../lib/supabase'
import type { InvitationData, InvitationRecord } from '../types'

export const invitationSchema = z.object({
  title: z.string().max(120).optional(),
  senderName: z.string().min(1),
  recipientName: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  place: z.string().min(1),
  food: z.array(z.string()).optional(),
  dressColor: z.string().optional(),
  loveLetter: z.string().optional(),
  theme: z.string().optional(),
  animation: z.string().optional(),
  imageUrl: z.string().url().optional(),
  musicUrl: z.string().url().optional(),
})

export type InvitationCreate = z.infer<typeof invitationSchema>

function generateSlug(length = 10) {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < length; i += 1) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return result
}

async function createUniqueSlug(retries = 3): Promise<string> {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    const slug = generateSlug(10)
    const { data } = await supabase
      .from('invitations')
      .select('id')
      .eq('slug', slug)
      .limit(1)
      .single()

    if (!data) {
      return slug
    }
  }

  throw new Error('Could not generate a unique invitation slug. Please try again.')
}

export async function createInvitation(data: InvitationCreate, userId: string) {
  const parsed = invitationSchema.safeParse(data)
  if (!parsed.success) {
    return { data: null, error: parsed.error }
  }

  const slug = await createUniqueSlug()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()

  const payload = {
    ...parsed.data,
    slug,
    user_id: userId,
    expires_at: expiresAt,
    is_published: true,
  }

  const response = await supabase
    .from<InvitationRecord>('invitations')
    .insert(payload)
    .select('*')
    .single()

  return response
}

export async function updateInvitation(id: string, userId: string, data: InvitationCreate) {
  const parsed = invitationSchema.safeParse(data)
  if (!parsed.success) {
    return { data: null, error: parsed.error }
  }

  return supabase
    .from<InvitationRecord>('invitations')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .single()
}

export async function getInvitationBySlug(slug: string) {
  return supabase
    .from<InvitationRecord>('invitations')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
}

export async function getUserInvitations(userId: string) {
  return supabase
    .from<InvitationRecord>('invitations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

export async function duplicateInvitation(id: string, userId: string) {
  const { data, error } = await supabase
    .from<InvitationRecord>('invitations')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    return { data: null, error: error ?? new Error('Invitation not found') }
  }

  const slug = await createUniqueSlug()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()

  const duplicate = {
    ...data,
    id: undefined,
    slug,
    created_at: undefined,
    updated_at: undefined,
    user_id: userId,
    expires_at: expiresAt,
    is_published: true,
  }

  return supabase
    .from<InvitationRecord>('invitations')
    .insert(duplicate)
    .select('*')
    .single()
}

export async function getInvitationById(id: string, userId: string) {
  return supabase
    .from<InvitationRecord>('invitations')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()
}

export async function deleteInvitation(id: string, userId: string) {
  return supabase
    .from('invitations')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
}

export async function getInvitationAnalytics(invitationId: string) {
  const [responses, views] = await Promise.all([
    supabase
      .from('invitation_responses')
      .select('*')
      .eq('invitation_id', invitationId),
    supabase
      .from('invitation_views')
      .select('id')
      .eq('invitation_id', invitationId),
  ])

  const responseData = responses.data ?? []
  const acceptCount = responseData.filter(r => r.accepted).length
  const declineCount = responseData.filter(r => !r.accepted).length
  const viewCount = views.count ?? 0

  return {
    views: viewCount,
    responses: responseData.length,
    accepted: acceptCount,
    declined: declineCount,
    responseRate: viewCount > 0 ? Math.round((responseData.length / viewCount) * 100) : 0,
    acceptanceRate: responseData.length > 0 ? Math.round((acceptCount / responseData.length) * 100) : 0,
    allResponses: responseData,
  }
}

export async function getInvitationResponses(invitationId: string) {
  return supabase
    .from('invitation_responses')
    .select('*')
    .eq('invitation_id', invitationId)
    .order('created_at', { ascending: false })
}

export async function getDashboardStats(userId: string) {
  const invitationsResponse = await getUserInvitations(userId)
  if (invitationsResponse.error || !invitationsResponse.data) {
    return {
      totalInvitations: 0,
      activeInvitations: 0,
      expiredInvitations: 0,
      totalResponses: 0,
      totalViews: 0,
    }
  }

  const invitationIds = invitationsResponse.data.map(invite => invite.id)
  const now = new Date().toISOString()

  const activeInvitations = invitationsResponse.data.filter(invite => invite.expires_at > now).length
  const expiredInvitations = invitationsResponse.data.filter(invite => invite.expires_at <= now).length

  let totalResponses = 0
  let totalViews = 0

  if (invitationIds.length > 0) {
    const [responsesResult, viewsResult] = await Promise.all([
      supabase
        .from('invitation_responses')
        .select('id', { count: 'exact' })
        .in('invitation_id', invitationIds),
      supabase
        .from('invitation_views')
        .select('id', { count: 'exact' })
        .in('invitation_id', invitationIds),
    ])
    totalResponses = responsesResult.count ?? 0
    totalViews = viewsResult.count ?? 0
  }

  return {
    totalInvitations: invitationsResponse.data.length,
    activeInvitations,
    expiredInvitations,
    totalResponses,
    totalViews,
  }
}
