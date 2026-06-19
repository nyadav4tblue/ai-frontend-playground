// ─── Core data shape for the invitation ───────────────────────────────────────
// All fields are optional so we can build up state step-by-step
export interface InvitationData {
  title?: string
  welcomeMessage?: string
  mainQuestion?: string
  senderName: string
  recipientName: string
  date: string          // ISO date string: "2024-02-14"
  time: string          // "19:30"
  place: string         // One of the predefined place options
  food: string[]        // Multiple food choices allowed
  dressColor: string    // Hex color chosen from the palette
  theme?: string
  animation?: string
  imageUrl?: string
  musicUrl?: string
  loveLetter: string    // Free-form message
}

export interface InvitationRecord extends InvitationData {
  id: string
  slug: string
  user_id: string
  is_published: boolean
  expires_at: string
  created_at: string
  updated_at: string | null
}

export interface InvitationResponseData {
  invitation_id: string
  accepted: boolean
  selected_date?: string
  selected_place?: string
  selected_food?: string[]
  selected_dress?: string
  submitted_at: string
  device: string
  browser: string
}

export interface InvitationResponseRecord extends InvitationResponseData {
  id: string
}

// Each step in the wizard has a key and display metadata
export interface Step {
  id: number
  key: keyof InvitationData | 'summary'
  title: string
  subtitle: string
  emoji: string
}

// A choice option used in ChoiceCard grids
export interface ChoiceOption {
  value: string
  label: string
  emoji: string
  description?: string
}
