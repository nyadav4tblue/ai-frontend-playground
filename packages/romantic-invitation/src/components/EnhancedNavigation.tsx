/**
 * EnhancedNavigation
 * 
 * Romantic-themed navigation component with glassmorphism effects
 */

import { Link, useLocation } from 'react-router-dom'
import {
  Home, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  User,
  Heart,
  Sparkles,
  PlusCircle
} from 'lucide-react'

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
  isProtected?: boolean
}

export function EnhancedNavigation() {
  const location = useLocation()
  
  const navItems: NavItem[] = [
    { path: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, isProtected: true },
    { path: '/dashboard/flows/new', label: 'Create', icon: <PlusCircle className="w-5 h-5" />, isProtected: true },
    { path: '/admin', label: 'Admin', icon: <Settings className="w-5 h-5" />, isProtected: true },
  ]
  
  const isAuthenticated = false // This should come from your auth context
  
  return (
    <nav
      className="fixed top-4 inset-x-0 z-50 mx-auto w-full max-w-3xl px-4 sm:top-6"
    >
      <div className="glass flex items-center gap-2 rounded-2xl px-4 py-3 shadow-romantic-lg sm:gap-4 sm:px-6">

        {/* Logo/Brand */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="relative">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-heartbeat" />
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-rose-300 animate-pulse" />
          </div>
          <span className="text-lg font-bold text-white font-heading hidden sm:block whitespace-nowrap">
            <span className="text-gradient-romantic">Romantic</span> Flows
          </span>
        </Link>

        {/* Navigation items */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            if (item.isProtected && !isAuthenticated) return null
            
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                  isActive 
                    ? 'text-white bg-white/10' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-rose-500 to-romantic-coral rounded-full"
                  />
                )}
              </Link>
            )
          })}
        </div>
        
        {/* User actions */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
              <button className="p-2 rounded-xl text-white/70 hover:text-rose-300 hover:bg-rose-500/10 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300 whitespace-nowrap"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="btn-romantic px-5 py-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}