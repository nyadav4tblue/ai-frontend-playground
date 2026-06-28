/**
 * MinimalLoginPage
 * 
 * Minimal version with enhanced design but without complex components
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Lock, Mail, Sparkles } from 'lucide-react'

export function MinimalLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      if (email && password) {
        navigate('/dashboard')
      } else {
        setError('Please enter email and password')
      }
    }, 1000)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 text-white bg-gradient-to-br from-[#0c0521] via-[#1a0a2e] to-[#0f3460] relative">
      {/* Simple background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-rose-500/10 to-purple-500/5 blur-3xl animate-pulse" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass p-10 rounded-3xl">
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-rose-500" />
              <p className="text-sm uppercase tracking-[0.36em] text-white/60">Welcome back</p>
              <Heart className="w-6 h-6 text-purple-500" />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Sign in to continue
            </h1>
            <p className="text-white/70">Your romantic journey awaits</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm text-white/70 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-4 pl-12 text-white outline-none focus:border-rose-400 focus:bg-white/10 transition-all"
                  placeholder="your.email@example.com"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-white/70 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-4 pl-12 text-white outline-none focus:border-rose-400 focus:bg-white/10 transition-all"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3">
                <p className="text-sm text-rose-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-4 text-lg font-semibold text-white transition hover:from-rose-600 hover:to-rose-700 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  Sign in
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-white/70">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-rose-300 hover:text-rose-200 font-semibold"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  )
}