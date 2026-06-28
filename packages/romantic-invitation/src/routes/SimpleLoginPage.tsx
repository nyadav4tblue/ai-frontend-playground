/**
 * SimpleLoginPage
 * 
 * Minimal version to test if login page renders
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export function SimpleLoginPage() {
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
      if (email === 'test@example.com' && password === 'password') {
        navigate('/dashboard')
      } else {
        setError('Invalid credentials')
      }
    }, 1000)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 text-white bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460]">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl shadow-2xl">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.36em] text-white/50">Secure access</p>
          <h1 className="mt-4 text-3xl font-bold">Sign in to your account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm text-white/70">
            Email
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-rose-400"
            />
          </label>

          <label className="block text-sm text-white/70">
            Password
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-rose-400"
            />
          </label>

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/70">
          Don't have an account?{' '}
          <Link to="/signup" className="text-rose-300 hover:text-rose-200 font-semibold">
            Sign up here
          </Link>
        </p>
      </div>
    </main>
  )
}