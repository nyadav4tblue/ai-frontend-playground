import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { signUp } from '../lib/auth'
import { EnhancedFloatingHearts } from '../components/EnhancedFloatingHearts'
import { RomanticBackground } from '../components/RomanticBackground'
import { Heart, Mail, Lock, Check, Sparkles, UserPlus } from 'lucide-react'

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
      <main className="min-h-screen flex items-center justify-center px-6 py-12 text-white relative overflow-hidden">
        <RomanticBackground />
        <EnhancedFloatingHearts intensity="romantic" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-strong p-12 text-center relative z-10 border-gradient-romantic"
        >
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500/20 to-romantic-lavender/20 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-rose-400 animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold font-heading">
              Account <span className="text-gradient-romantic">created!</span>
            </h1>
            
            <div className="space-y-3">
              <p className="text-white/70 text-lg">
                Welcome to your romantic journey ✨
              </p>
              <p className="text-white/60">
                Check your email to confirm your account. You should receive a confirmation link shortly.
              </p>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full btn-romantic py-4 text-lg font-semibold flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Go to sign in
              </button>
            </div>
            
            <div className="pt-4">
              <p className="text-white/40 text-sm">
                Ready to create beautiful moments together
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 text-white relative overflow-hidden">
      {/* Enhanced background elements */}
      <RomanticBackground showOrbs={false} />
      <EnhancedFloatingHearts intensity="medium" count={15} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Romantic decorative elements */}
        <div className="absolute -top-8 -left-8 w-16 h-16 rounded-full bg-gradient-to-br from-rose-500/20 to-romantic-coral/10 blur-xl" />
        <div className="absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-tr from-romantic-lavender/20 to-rose-400/10 blur-xl" />
        
        <div className="glass-strong p-10 border-gradient-romantic">
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <UserPlus className="w-8 h-8 text-rose-500" />
              <p className="text-sm uppercase tracking-[0.36em] text-white/60">Start your journey</p>
              <Heart className="w-6 h-6 text-romantic-lavender fill-romantic-lavender/20" />
            </div>
            <h1 className="text-4xl font-bold font-heading mb-2">
              Create your <span className="text-gradient-romantic">free account</span>
            </h1>
            <p className="text-white/70">Join our community of romantic creators</p>
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
                  placeholder="At least 8 characters"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              </div>
              <p className="text-xs text-white/40 pl-2">Use a strong, unique password</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-white/70 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-4 pl-12 text-white outline-none focus:border-rose-400/50 focus:bg-white/10 transition-all duration-300"
                  placeholder="Confirm your password"
                />
                <Check className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
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

            {/* Password requirements */}
            <div className="glass-light p-4 space-y-2">
              <p className="text-sm text-white/70 font-medium">Password requirements:</p>
              <ul className="text-xs text-white/50 space-y-1">
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-white/20'}`} />
                  At least 8 characters
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${password === confirmPassword && password ? 'bg-green-500' : 'bg-white/20'}`} />
                  Passwords must match
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-romantic py-4 text-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating your account…
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Start your romantic journey
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-white/70">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-gradient-romantic hover:underline font-semibold transition-all duration-300"
              >
                Sign in here
              </Link>
            </p>
            <p className="text-center text-white/50 text-sm mt-2">
              By signing up, you agree to our{' '}
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                Terms
              </a>{' '}
              and{' '}
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Romantic footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
            <Heart className="w-4 h-4" />
            <p>Where love stories begin with a single signup</p>
            <Heart className="w-4 h-4" />
          </div>
        </div>
      </motion.div>
    </main>
  )
}