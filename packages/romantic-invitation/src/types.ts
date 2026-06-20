export type QuestionType =
  | 'text' | 'textarea' | 'email' | 'phone' | 'number'
  | 'date' | 'time'
  | 'radio' | 'checkbox' | 'select'

export type FlowTheme = 'rose' | 'violet' | 'amber' | 'emerald'

export interface FlowRecord {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  slug: string
  user_id: string
  theme: FlowTheme
  cover_image: string | null
  expires_at: string
  created_at: string
  updated_at: string | null
}

export interface FlowQuestion {
  id: string
  flow_id: string
  type: QuestionType
  label: string
  options: string[] | null   // only used for radio / checkbox / select
  required: boolean
  sort_order: number
}

export interface FlowWithQuestions extends FlowRecord {
  questions: FlowQuestion[]
}

export interface FlowResponseRecord {
  id: string
  flow_id: string
  submitted_at: string
  device: string
  browser: string
}

export interface FlowAnswer {
  id: string
  response_id: string
  question_id: string
  answer: string  // checkbox answers are JSON.stringify of string[]
}

export interface FlowResponseWithAnswers extends FlowResponseRecord {
  answers: FlowAnswer[]
}

// Transient question shape used only in the builder UI (not persisted directly)
export interface QuestionDraft {
  _id: string       // temp React key — not the DB id
  type: QuestionType
  label: string
  required: boolean
  options: string[]
}
