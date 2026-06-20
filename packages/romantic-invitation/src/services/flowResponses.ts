import { supabase } from '../lib/supabase'

export interface SubmitFlowPayload {
  flowId:  string
  answers: Array<{ questionId: string; answer: string }>
}

export async function submitFlowResponse(payload: SubmitFlowPayload) {
  // Insert the response row first to get its id
  const { data: response, error: responseError } = await supabase
    .from('flow_responses')
    .insert({
      flow_id:      payload.flowId,
      submitted_at: new Date().toISOString(),
      device:       window.navigator.platform,
      browser:      window.navigator.userAgent,
    })
    .select('id')
    .single()

  if (responseError || !response) return { error: responseError }

  if (payload.answers.length > 0) {
    const { error: answersError } = await supabase.from('flow_answers').insert(
      payload.answers.map(a => ({
        response_id: response.id,
        question_id: a.questionId,
        answer:      a.answer,
      }))
    )
    if (answersError) return { error: answersError }
  }

  return { error: null }
}
