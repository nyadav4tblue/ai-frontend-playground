import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signUp } from '../lib/auth'

export function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    // Validate inputs
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    const { error: authError } = await signUp(email, password)
    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center px-6 py-12 text-white">
        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl shadow-2xl">
          <div className="text-center space-y-4">
            <div className="text-5xl">✨</div>
            <h1 className="text-3xl font-bold">Account created!</h1>
            <p className="text-white/70">Check your email to confirm your account. You should receive a confirmation link shortly.</p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full mt-6 rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
            >
              Go to sign in
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center px-6 py-12 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl shadow-2xl">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.36em] text-white/50">Create account</p>
          <h1 className="mt-4 text-3xl font-bold">Sign up for free</h1>
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
              placeholder="your@email.com"
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
              placeholder="At least 8 characters"
            />
          </label>

          <label className="block text-sm text-white/70">
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-rose-400"
              placeholder="Confirm your password"
            />
          </label>

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/70">
          Already have an account?{' '}
          <Link to="/login" className="text-rose-300 hover:text-rose-200 font-semibold">
            Sign in here
          </Link>
        </p>
      </div>
    </main>
  )
}