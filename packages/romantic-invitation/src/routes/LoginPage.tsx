import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { signInWithPassword, resendConfirmation } from '../lib/auth'
import { EnhancedFloatingHearts } from '../components/EnhancedFloatingHearts'
import { RomanticBackground } from '../components/RomanticBackground'
import { Heart, Lock, Mail, Sparkles, MailCheck } from 'lucide-react'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent'>('idle')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setNeedsConfirmation(false)
    setResendState('idle')
    setLoading(true)

    const { error: authError } = await signInWithPassword(email, password)
    setLoading(false)

    if (authError) {
      // Supabase returns "Email not confirmed" when the account exists but the
      // confirmation link hasn't been clicked yet.
      if (/email not confirmed/i.test(authError.message)) {
        setNeedsConfirmation(true)
      }
      setError(authError.message)
      return
    }

    navigate('/dashboard')
  }

  async function handleResend() {
    if (!email) return
    setResendState('sending')
    const { error: resendError } = await resendConfirmation(email)
    if (resendError) {
      setError(resendError.message)
      setResendState('idle')
      return
    }
    setResendState('sent')
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 text-white relative overflow-hidden">
      {/* Enhanced background elements */}
      <RomanticBackground showOrbs={false} />
      <EnhancedFloatingHearts intensity="subtle" count={10} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Romantic decorative elements */}
        <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-br from-rose-500/20 to-romantic-lavender/10 blur-xl" />
        <div className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full bg-gradient-to-tr from-romantic-coral/20 to-rose-400/10 blur-xl" />
        
        <div className="glass-strong p-10 border-gradient-romantic">
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-heartbeat" />
              <p className="text-sm uppercase tracking-[0.36em] text-white/60">Secure romantic access</p>
              <Lock className="w-6 h-6 text-romantic-lavender" />
            </div>
            <h1 className="text-4xl font-bold font-heading mb-2">
              Welcome <span className="text-gradient-romantic">back</span>
            </h1>
            <p className="text-white/70">Sign in to continue your romantic journey</p>
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
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-4 pl-12 text-white outline-none focus:border-rose-400/50 focus:bg-white/10 transition-all duration-300"
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
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-4 pl-12 text-white outline-none focus:border-rose-400/50 focus:bg-white/10 transition-all duration-300"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3"
              >
                <p className="text-sm text-rose-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {error}
                </p>
              </motion.div>
            )}

            {needsConfirmation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-xl bg-romantic-lavender/10 border border-romantic-lavender/30 p-4 space-y-3"
              >
                <p className="text-sm text-white/70 flex items-center gap-2">
                  <MailCheck className="w-4 h-4 text-romantic-lavender" />
                  Please confirm your email before signing in.
                </p>
                {resendState === 'sent' ? (
                  <p className="text-sm text-green-300 flex items-center gap-2">
                    <MailCheck className="w-4 h-4" />
                    Confirmation email sent to {email}. Check your inbox.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendState === 'sending'}
                    className="text-sm font-semibold text-romantic-lavender hover:text-white transition-colors disabled:opacity-60"
                  >
                    {resendState === 'sending' ? 'Sending…' : 'Resend confirmation email'}
                  </button>
                )}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-romantic py-4 text-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  Sign in to continue
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-white/70">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-gradient-romantic hover:underline font-semibold transition-all duration-300"
              >
                Create one here
              </Link>
            </p>
            <p className="text-center text-white/50 text-sm mt-2">
              Or{' '}
              <Link 
                to="/" 
                className="text-white/70 hover:text-white transition-colors"
              >
                return home
              </Link>
            </p>
          </div>
        </div>

        {/* Romantic footer */}
        <div className="mt-8 text-center">
          <p className="text-white/40 text-sm">
            Where every login is a step closer to creating something beautiful ❤️
          </p>
        </div>
      </motion.div>
    </main>
  )
}
