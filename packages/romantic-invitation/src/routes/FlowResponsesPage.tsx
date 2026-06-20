/**
 * FlowResponsesPage  —  /dashboard/flows/:id/responses
 *
 * Shows all submitted responses for a flow. Each response expands to reveal
 * individual answers keyed by their question label.
 */

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ArrowLeft } from 'lucide-react'
import { TopNav } from '../components/TopNav'
import { useAuth } from '../lib/auth'
import { getFlowById, getFlowResponsesWithAnswers } from '../services/flows'

export function FlowResponsesPage() {
  const { id } = useParams<{ id: string }>()
  const { user, loading: authLoading } = useAuth()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const userId = user?.id ?? ''

  const flowQuery = useQuery({
    queryKey: ['flow', id, userId],
    queryFn:  () => getFlowById(id!, userId),
    enabled:  !authLoading && !!userId && !!id,
  })

  const responsesQuery = useQuery({
    queryKey: ['flowResponses', id],
    queryFn:  () => getFlowResponsesWithAnswers(id!),
    enabled:  !authLoading && !!userId && !!id,
  })

  const flow      = flowQuery.data?.data
  const questions = flow?.questions ?? []
  const responses = responsesQuery.data?.data ?? []

  // Build a lookup: questionId → label for fast rendering
  const questionLabels = Object.fromEntries(questions.map(q => [q.id, q.label]))

  function formatAnswer(answer: string): string {
    try {
      const parsed = JSON.parse(answer)
      if (Array.isArray(parsed)) return parsed.join(', ')
    } catch { /* not JSON */ }
    return answer
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] text-white">
      <TopNav />

      <main className="px-6 py-10">
        <div className="mx-auto max-w-4xl space-y-8">

          {/* Header */}
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl shadow-2xl">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition mb-4"
            >
              <ArrowLeft size={14} /> Back to admin
            </Link>
            <p className="text-sm uppercase tracking-[0.32em] text-white/50">Flow Responses</p>
            <h1 className="mt-3 text-3xl font-bold">{flow?.title ?? '…'}</h1>
            <p className="mt-2 text-white/60">
              {responses.length} response{responses.length !== 1 ? 's' : ''} received
            </p>
          </section>

          {/* Responses list */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
            {responsesQuery.isLoading ? (
              <p className="text-white/60">Loading responses…</p>
            ) : responses.length === 0 ? (
              <p className="text-white/60">No responses yet.</p>
            ) : (
              responses.map((response, idx) => (
                <div key={response.id} className="rounded-3xl border border-white/10 bg-black/20 overflow-hidden">

                  {/* Row header */}
                  <button
                    type="button"
                    onClick={() => setExpandedId(expandedId === response.id ? null : response.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition text-left"
                  >
                    <div>
                      <p className="font-semibold text-white">Response #{responses.length - idx}</p>
                      <p className="text-white/50 text-sm mt-0.5">
                        {new Date(response.submitted_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-white/40">{response.answers.length} answer{response.answers.length !== 1 ? 's' : ''}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform text-white/50 ${expandedId === response.id ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>

                  {/* Expanded answers */}
                  {expandedId === response.id && (
                    <div className="border-t border-white/10 p-5 space-y-3">
                      {response.answers.length === 0 ? (
                        <p className="text-white/50 text-sm">No answers recorded.</p>
                      ) : (
                        response.answers.map(a => (
                          <div key={a.id} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 text-sm">
                            <span className="text-white/50 shrink-0 sm:w-48 truncate">
                              {questionLabels[a.question_id] ?? a.question_id}
                            </span>
                            <span className="text-white/90">{formatAnswer(a.answer)}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </section>

        </div>
      </main>
    </div>
  )
}
