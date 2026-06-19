import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { TopNav } from '../components/TopNav'
import { useAuth } from '../lib/auth'
import { getDashboardStats, getUserInvitations } from '../services/invitations'

export function DashboardPage() {
  const { user, loading } = useAuth()
  const userId = user?.id ?? ''

  const statsQuery = useQuery({
    queryKey: ['dashboardStats', userId],
    queryFn: () => getDashboardStats(userId),
    enabled: !loading && !!userId,
  })

  const invitationsQuery = useQuery({
    queryKey: ['userInvitations', userId],
    queryFn: () => getUserInvitations(userId),
    enabled: !loading && !!userId,
  })

  const stats = statsQuery.data ?? {
    totalInvitations: 0,
    activeInvitations: 0,
    expiredInvitations: 0,
    totalResponses: 0,
    totalViews: 0,
  }

  const invitations = invitationsQuery.data?.data ?? []

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] text-white">
      <TopNav />
      <main className="px-6 py-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl shadow-2xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-white/50">Dashboard</p>
                <h1 className="mt-3 text-3xl font-bold">Your invitations overview</h1>
              </div>
              <Link
                to="/dashboard/builder"
                className="inline-flex items-center justify-center rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
              >
                Create invitation
              </Link>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-4">
            {[
              { label: 'Total Invitations', value: String(stats.totalInvitations) },
              { label: 'Active Invitations', value: String(stats.activeInvitations) },
              { label: 'Expired Invitations', value: String(stats.expiredInvitations) },
              { label: 'Total Responses', value: String(stats.totalResponses) },
            ].map(card => (
              <div key={card.label} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-white/50">{card.label}</p>
                <p className="mt-4 text-3xl font-semibold">{card.value}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Invitation management</h2>
              <p className="mt-3 text-sm text-white/70">Create, edit, duplicate, and publish invitations from your dashboard.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Public invitation links</h2>
              <p className="mt-3 text-sm text-white/70">Each invitation gets a unique public slug and an expiration date.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Analytics</h2>
              <p className="mt-3 text-sm text-white/70">Track views, responses, and acceptance rates for every invitation.</p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-white">Recent invitations</h2>
            <div className="mt-4 space-y-3">
              {invitations.length === 0 ? (
                <p className="text-white/60">No invitations yet. Start by building one in the editor.</p>
              ) : (
                invitations.map(invitation => (
                  <div key={invitation.id} className="rounded-3xl border border-white/10 bg-black/20 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-white">{invitation.slug}</p>
                        <p className="text-white/60 text-sm">Expires {new Date(invitation.expires_at).toLocaleString()}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/dashboard/edit/${invitation.id}`} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition">Edit</Link>
                      </div>
                    </div>
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
