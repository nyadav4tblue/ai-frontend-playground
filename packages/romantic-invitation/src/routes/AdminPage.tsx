import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Copy, Eye, Pencil, Plus, Trash2, CopyPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { TopNav } from '../components/TopNav'
import { useAuth } from '../lib/auth'
import { getUserFlows, deleteFlow, duplicateFlow } from '../services/flows'
import type { FlowRecord } from '../types'

export function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const [copied, setCopied] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const userId = user?.id ?? ''

  const flowsQuery = useQuery({
    queryKey: ['userFlows', userId],
    queryFn:  () => getUserFlows(userId),
    enabled:  !authLoading && !!userId,
  })

  const flows: FlowRecord[] = (flowsQuery.data?.data ?? []) as FlowRecord[]

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteFlow(id, userId),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['userFlows', userId] }),
  })

  const duplicateMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => duplicateFlow(id, userId),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['userFlows', userId] }),
  })

  function handleCopyUrl(slug: string) {
    const url = `${window.location.origin}/flow/${slug}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(slug)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  function confirmDelete(id: string) {
    if (window.confirm('Delete this flow and all its responses? This cannot be undone.')) {
      deleteMutation.mutate({ id })
    }
  }

  const now = new Date().toISOString()
  const activeCount  = flows.filter(f => f.expires_at > now).length
  const expiredCount = flows.length - activeCount

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] text-white">
      <TopNav />
      <main className="px-6 py-10">
        <div className="mx-auto max-w-6xl space-y-8">

          {/* Header */}
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl shadow-2xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-white/50">Flow Management</p>
                <h1 className="mt-3 text-3xl font-bold">Your relationship flows</h1>
                <p className="mt-2 text-white/60">
                  {flows.length} flow{flows.length !== 1 ? 's' : ''} · {activeCount} active · {expiredCount} expired
                </p>
              </div>
              <Link
                to="/dashboard/flows/new"
                className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
              >
                <Plus size={14} /> Create flow
              </Link>
            </div>
          </section>

          {/* Flow list */}
          <section className="space-y-3">
            {flowsQuery.isLoading ? (
              <p className="text-white/60">Loading flows…</p>
            ) : flows.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
                <p className="text-4xl mb-4">❤️</p>
                <p className="font-semibold text-white mb-1">No flows yet</p>
                <p className="text-sm">Create your first relationship flow above.</p>
              </div>
            ) : (
              flows.map(flow => {
                const isActive = flow.expires_at > now
                return (
                  <div key={flow.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-white truncate">{flow.title}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/40'}`}>
                            {isActive ? 'Active' : 'Expired'}
                          </span>
                        </div>
                        {flow.subtitle && (
                          <p className="text-white/50 text-sm mt-0.5 truncate">{flow.subtitle}</p>
                        )}
                        <p className="text-white/30 text-xs mt-1">
                          /flow/{flow.slug} · Expires {new Date(flow.expires_at).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(flow.slug)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10 transition"
                        >
                          <Copy size={12} />
                          {copied === flow.slug ? 'Copied!' : 'Copy URL'}
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

                        <button
                          type="button"
                          onClick={() => duplicateMutation.mutate({ id: flow.id })}
                          disabled={duplicateMutation.isPending}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10 transition disabled:opacity-40"
                          title="Duplicate flow"
                        >
                          <CopyPlus size={12} /> Duplicate
                        </button>

                        <button
                          type="button"
                          onClick={() => confirmDelete(flow.id)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 transition"
                          title="Delete flow"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </section>

        </div>
      </main>
    </div>
  )
}
