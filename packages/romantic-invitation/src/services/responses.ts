import { supabase } from '../lib/supabase'
import type { InvitationResponseData } from '../types'

export async function recordInvitationView(invitationId: string) {
  return supabase
    .from('invitation_views')
    .insert({ invitation_id: invitationId, viewed_at: new Date().toISOString() })
}

export async function submitInvitationResponse(payload: InvitationResponseData) {
  return supabase
    .from('invitation_responses')
    .insert(payload)
}
