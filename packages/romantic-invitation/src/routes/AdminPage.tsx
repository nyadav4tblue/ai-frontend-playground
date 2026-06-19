import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown } from 'lucide-react'
import { TopNav } from '../components/TopNav'
import { useAuth } from '../lib/auth'
import { getUserInvitations, getInvitationAnalytics } from '../services/invitations'
import type { InvitationRecord } from '../types'

export function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const userId = user?.id ?? ''
  const invitationsQuery = useQuery({
    queryKey: ['userInvitations', userId],
    queryFn: () => getUserInvitations(userId),
    enabled: !authLoading && !!userId,
  })

  const invitations = invitationsQuery.data?.data ?? []

  // Get analytics for all invitations
  const analyticsQueries = useQuery({
    queryKey: ['invitationAnalytics', invitations.map(i => i.id).join(',')],
    queryFn: async () => {
      const results = await Promise.all(
        invitations.map(inv => getInvitationAnalytics(inv.id))
      )
      return invitations.map((inv, idx) => ({ ...inv, analytics: results[idx] }))
    },
    enabled: invitations.length > 0,
  })

  const invitationsWithAnalytics = analyticsQueries.data ?? []

  // Calculate overall stats
  const totalViews = invitationsWithAnalytics.reduce((sum, i) => sum + i.analytics.views, 0)
  const totalResponses = invitationsWithAnalytics.reduce((sum, i) => sum + i.analytics.responses, 0)
  const totalAccepted = invitationsWithAnalytics.reduce((sum, i) => sum + i.analytics.accepted, 0)
  const overallAcceptanceRate = totalResponses > 0 ? Math.round((totalAccepted / totalResponses) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] text-white">
      <TopNav />
      <main className="px-6 py-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl shadow-2xl">
            <p className="text-sm uppercase tracking-[0.32em] text-white/50">Analytics</p>
            <h1 className="mt-3 text-3xl font-bold">Invitation performance</h1>
            <p className="mt-4 text-white/70">Track engagement, responses, and guest preferences across all your invitations.</p>
          </section>

          <section className="grid gap-4 md:grid-cols-4">
            {[
              { label: 'Total Invitations', value: String(invitations.length) },
              { label: 'Total Views', value: String(totalViews) },
              { label: 'Total Responses', value: String(totalResponses) },
              { label: 'Acceptance Rate', value: `${overallAcceptanceRate}%` },
            ].map(card => (
              <div key={card.label} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-white/50">{card.label}</p>
                <p className="mt-4 text-3xl font-semibold">{card.value}</p>
              </div>
            ))}
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold mb-4">Invitation breakdown</h2>
            <div className="space-y-2">
              {invitationsWithAnalytics.length === 0 ? (
                <p className="text-white/60">No invitations yet.</p>
              ) : (
                invitationsWithAnalytics.map(invitation => (
                  <div key={invitation.id} className="rounded-3xl border border-white/10 bg-black/20 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedId(expandedId === invitation.id ? null : invitation.id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition text-left"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-white">{invitation.slug}</p>
                        <p className="text-white/60 text-sm mt-1">
                          {invitation.sender_name} → {invitation.recipient_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <p className="text-white/70">Views</p>
                          <p className="font-semibold">{invitation.analytics.views}</p>
                        </div>
                        <div>
                          <p className="text-white/70">Responses</p>
                          <p className="font-semibold">{invitation.analytics.responses}</p>
                        </div>
                        <div>
                          <p className="text-white/70">Accepted</p>
                          <p className="font-semibold text-rose-300">{invitation.analytics.accepted}</p>
                        </div>
                        <ChevronDown
                          size={18}
                          className={`transition-transform ${expandedId === invitation.id ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </button>

                    {expandedId === invitation.id && invitation.analytics.allResponses.length > 0 && (
                      <div className="border-t border-white/10 p-4 space-y-3">
                        <h3 className="font-semibold text-white mb-4">Guest responses</h3>
                        {invitation.analytics.allResponses.map((response, idx) => (
                          <div key={response.id} className="rounded-2xl border border-white/5 bg-black/30 p-4 text-sm">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <p className="text-white/80">
                                  <span className={`font-semibold ${response.accepted ? 'text-rose-300' : 'text-gray-400'}`}>
                                    {response.accepted ? '✓ Accepted' : '✗ Declined'}
                                  </span>
                                </p>
                                <div className="mt-2 text-white/60 space-y-1 text-xs">
                                  {response.selected_place && <p>📍 {response.selected_place}</p>}
                                  {response.selected_food && response.selected_food.length > 0 && (
                                    <p>🍽️ {response.selected_food.join(', ')}</p>
                                  )}
                                  {response.selected_dress && (
                                    <p className="flex items-center gap-1">
                                      👗
                                      <span
                                        className="inline-block w-4 h-4 rounded-full border border-white/20"
                                        style={{ backgroundColor: response.selected_dress }}
                                      />
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-white/50 text-xs whitespace-nowrap">
                                {new Date(response.submitted_at).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {expandedId === invitation.id && invitation.analytics.allResponses.length === 0 && (
                      <div className="border-t border-white/10 p-4 text-white/60 text-sm">
                        No responses yet.
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
