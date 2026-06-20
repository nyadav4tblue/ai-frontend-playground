import { Link, useNavigate } from 'react-router-dom'
import { signOut } from '../lib/auth'

export function TopNav() {
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/10 text-white">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="font-semibold text-lg tracking-tight">
          ❤️ FlowBuilder
        </Link>
        <nav className="hidden md:flex gap-3 text-sm text-white/70">
          <Link to="/dashboard" className="hover:text-white transition">Dashboard</Link>
          <Link to="/admin" className="hover:text-white transition">Flows</Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/dashboard/flows/new"
          className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400 transition"
        >
          + New Flow
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
