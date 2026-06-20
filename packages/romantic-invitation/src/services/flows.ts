import { z } from 'zod'
import { supabase } from '../lib/supabase'
import type { FlowRecord, FlowTheme, FlowWithQuestions, QuestionType } from '../types'

// ─── Validation ───────────────────────────────────────────────────────────────

const QUESTION_TYPES: [QuestionType, ...QuestionType[]] = [
  'text', 'textarea', 'email', 'phone', 'number',
  'date', 'time', 'radio', 'checkbox', 'select',
]

export const questionSchema = z.object({
  type:       z.enum(QUESTION_TYPES),
  label:      z.string().min(1, 'Question label is required'),
  options:    z.array(z.string()).nullable().optional(),
  required:   z.boolean().default(false),
  sort_order: z.number().int().min(0),
})

export const flowSchema = z.object({
  title:       z.string().min(1, 'Title is required').max(120),
  subtitle:    z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  theme:       z.enum(['rose', 'violet', 'amber', 'emerald']).default('rose'),
  cover_image: z.string().url().optional().or(z.literal('')),
  questions:   z.array(questionSchema).min(1, 'Add at least one question'),
})

export type FlowCreate = z.infer<typeof flowSchema>

// ─── Slug generation ──────────────────────────────────────────────────────────

function generateSlug(length = 10): string {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < length; i++) result += alphabet[Math.floor(Math.random() * alphabet.length)]
  return result
}

async function createUniqueSlug(retries = 3): Promise<string> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const slug = generateSlug(10)
    const { data } = await supabase.from('flows').select('id').eq('slug', slug).limit(1).single()
    if (!data) return slug
  }
  throw new Error('Could not generate a unique flow slug. Please try again.')
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export async function createFlow(payload: FlowCreate, userId: string) {
  const parsed = flowSchema.safeParse(payload)
  if (!parsed.success) return { data: null, error: parsed.error }

  const slug = await createUniqueSlug()
  const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()

  const { data: flow, error: flowError } = await supabase
    .from('flows')
    .insert({
      title:       parsed.data.title,
      subtitle:    parsed.data.subtitle ?? null,
      description: parsed.data.description ?? null,
      theme:       parsed.data.theme,
      cover_image: parsed.data.cover_image || null,
      slug,
      user_id:     userId,
      expires_at:  expiresAt,
    })
    .select('*')
    .single()

  if (flowError || !flow) return { data: null, error: flowError }

  const questions = parsed.data.questions.map((q, i) => ({
    flow_id:    flow.id,
    type:       q.type,
    label:      q.label,
    options:    q.options ?? null,
    required:   q.required,
    sort_order: i,
  }))

  const { error: qError } = await supabase.from('flow_questions').insert(questions)
  if (qError) return { data: null, error: qError }

  return { data: flow as FlowRecord, error: null }
}

export async function updateFlow(id: string, userId: string, payload: FlowCreate) {
  const parsed = flowSchema.safeParse(payload)
  if (!parsed.success) return { data: null, error: parsed.error }

  const { error: flowError } = await supabase
    .from('flows')
    .update({
      title:       parsed.data.title,
      subtitle:    parsed.data.subtitle ?? null,
      description: parsed.data.description ?? null,
      theme:       parsed.data.theme,
      cover_image: parsed.data.cover_image || null,
      updated_at:  new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)

  if (flowError) return { data: null, error: flowError }

  await supabase.from('flow_questions').delete().eq('flow_id', id)

  const questions = parsed.data.questions.map((q, i) => ({
    flow_id:    id,
    type:       q.type,
    label:      q.label,
    options:    q.options ?? null,
    required:   q.required,
    sort_order: i,
  }))

  const { error: qError } = await supabase.from('flow_questions').insert(questions)
  if (qError) return { data: null, error: qError }

  return { data: true, error: null }
}

export async function duplicateFlow(id: string, userId: string) {
  const { data: original, error } = await getFlowById(id, userId)
  if (error || !original) return { data: null, error: error ?? new Error('Flow not found') }

  const slug = await createUniqueSlug()
  const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()

  const { data: flow, error: flowError } = await supabase
    .from('flows')
    .insert({
      title:       `${original.title} (copy)`,
      subtitle:    original.subtitle,
      description: original.description,
      theme:       original.theme,
      cover_image: original.cover_image,
      slug,
      user_id:     userId,
      expires_at:  expiresAt,
    })
    .select('*')
    .single()

  if (flowError || !flow) return { data: null, error: flowError }

  if (original.questions.length > 0) {
    const questions = original.questions.map((q, i) => ({
      flow_id:    flow.id,
      type:       q.type,
      label:      q.label,
      options:    q.options ?? null,
      required:   q.required,
      sort_order: i,
    }))
    await supabase.from('flow_questions').insert(questions)
  }

  return { data: flow as FlowRecord, error: null }
}

export async function deleteFlow(id: string, userId: string) {
  return supabase.from('flows').delete().eq('id', id).eq('user_id', userId)
}

export async function getUserFlows(userId: string) {
  return supabase.from('flows').select('*').eq('user_id', userId).order('created_at', { ascending: false })
}

export async function getFlowById(id: string, userId: string): Promise<{ data: FlowWithQuestions | null; error: unknown }> {
  const { data: flow, error } = await supabase.from('flows').select('*').eq('id', id).eq('user_id', userId).single()
  if (error || !flow) return { data: null, error }

  const { data: questions } = await supabase
    .from('flow_questions').select('*').eq('flow_id', flow.id).order('sort_order', { ascending: true })

  return { data: { ...(flow as FlowRecord), questions: questions ?? [] } as FlowWithQuestions, error: null }
}

export async function getFlowBySlug(slug: string): Promise<{ data: FlowWithQuestions | null; error: unknown }> {
  const { data: flow, error } = await supabase.from('flows').select('*').eq('slug', slug).single()
  if (error || !flow) return { data: null, error }

  const { data: questions } = await supabase
    .from('flow_questions').select('*').eq('flow_id', flow.id).order('sort_order', { ascending: true })

  return { data: { ...(flow as FlowRecord), questions: questions ?? [] } as FlowWithQuestions, error: null }
}

export async function getFlowResponsesWithAnswers(flowId: string) {
  const { data: responses, error } = await supabase
    .from('flow_responses').select('*').eq('flow_id', flowId).order('submitted_at', { ascending: false })

  if (error || !responses || responses.length === 0) return { data: [], error }

  const { data: answers } = await supabase
    .from('flow_answers').select('*').in('response_id', responses.map(r => r.id))

  return {
    data: responses.map(r => ({
      ...r,
      answers: (answers ?? []).filter(a => a.response_id === r.id),
    })),
    error: null,
  }
}
