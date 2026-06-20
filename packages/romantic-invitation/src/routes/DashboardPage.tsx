import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Copy, Eye, Pencil } from 'lucide-react'
import { useState } from 'react'
import { TopNav } from '../components/TopNav'
import { useAuth } from '../lib/auth'
import { getUserFlows } from '../services/flows'

export function DashboardPage() {
  const { user, loading } = useAuth()
  const userId = user?.id ?? ''
  const [copied, setCopied] = useState<string | null>(null)

  const flowsQuery = useQuery({
    queryKey: ['userFlows', userId],
    queryFn:  () => getUserFlows(userId),
    enabled:  !loading && !!userId,
  })

  const flows = flowsQuery.data?.data ?? []
  const now = new Date().toISOString()
  const activeFlows  = flows.filter((f: { expires_at: string }) => f.expires_at > now).length
  const expiredFlows = flows.length - activeFlows

  function handleCopy(slug: string) {
    const url = `${window.location.origin}/flow/${slug}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(slug)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] text-white">
      <TopNav />
      <main className="px-6 py-10">
        <div className="mx-auto max-w-6xl space-y-8">

          {/* Hero */}
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl shadow-2xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-white/50">Dashboard</p>
                <h1 className="mt-3 text-3xl font-bold">Your relationship flows</h1>
              </div>
              <Link
                to="/dashboard/flows/new"
                className="inline-flex items-center justify-center rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
              >
                + Create flow
              </Link>
            </div>
          </section>

          {/* Stats */}
          <section className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Total Flows',   value: String(flows.length) },
              { label: 'Active Flows',  value: String(activeFlows) },
              { label: 'Expired Flows', value: String(expiredFlows) },
            ].map(card => (
              <div key={card.label} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-white/50">{card.label}</p>
                <p className="mt-4 text-3xl font-semibold">{card.value}</p>
              </div>
            ))}
          </section>

          {/* Recent flows */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent flows</h2>
              <Link to="/admin" className="text-sm text-rose-300 hover:text-rose-200 transition">View all →</Link>
            </div>

            {flowsQuery.isLoading ? (
              <p className="text-white/60">Loading…</p>
            ) : flows.length === 0 ? (
              <p className="text-white/60">No flows yet. Create your first one above.</p>
            ) : (
              <div className="space-y-3">
                {flows.slice(0, 5).map((flow: { id: string; title: string; slug: string; expires_at: string }) => {
                  const isActive = flow.expires_at > now
                  return (
                    <div key={flow.id} className="rounded-3xl border border-white/10 bg-black/20 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-white">{flow.title}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/40'}`}>
                              {isActive ? 'Active' : 'Expired'}
                            </span>
                          </div>
                          <p className="text-white/40 text-xs mt-0.5">
                            Expires {new Date(flow.expires_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopy(flow.slug)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10 transition"
                          >
                            <Copy size={12} />
                            {copied === flow.slug ? 'Copied!' : 'Copy link'}
                          </button>
                          <Link
                            to={`/dashboard/flows/${flow.id}/responses`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10 transition"
                          >
                            <Eye size={12} /> Responses
                          </Link>
                          <Link
                            to={`/dashboard/flows/${flow.id}/edit`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10 transition"
                          >
                            <Pencil size={12} /> Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  )
}
