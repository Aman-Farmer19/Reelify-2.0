import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAiAssistant } from '../context/AiAssistantContext'
import ProfileModal from './ProfileModal'

export default function Navbar({ onAuth }) {
  const { isAuth, user, logout } = useAuth()
  const { openAssistant } = useAiAssistant()
  const navigate = useNavigate()
  const location = useLocation()
  const [showProfile, setShowProfile] = useState(false)

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-surface-0/60 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-tr from-brand to-brand-glow shadow-glow-strong">
            <span className="text-white text-xs font-black">R</span>
          </div>
          <span className="text-white font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text group-hover:to-brand-light transition-all duration-300">
            Reelify
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {!isAuth ? (
            <>
              <Link 
                to="/" 
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all duration-300 ${
                  location.pathname === '/' 
                    ? 'bg-brand/10 border-brand/30 text-brand-light font-bold' 
                    : 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:text-white'
                }`}
              >
                Home
              </Link>
              <a 
                href="/#features" 
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault()
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-300"
              >
                Features
              </a>
              <a 
                href="/#pricing" 
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault()
                    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-300"
              >
                Pricing
              </a>
              <Link 
                to="/sandbox" 
                className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all duration-300 flex items-center gap-1.5 ${
                  location.pathname === '/sandbox' || location.pathname === '/generate'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-glow' 
                    : 'bg-white/[0.02] border-white/[0.05] text-slate-300 hover:text-white'
                }`}
              >
                <span>🧪 Sandbox</span>
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/dashboard" 
                className={`text-sm font-semibold transition-colors duration-300 ${
                  location.pathname === '/dashboard' ? 'text-brand-light font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/studio" 
                className={`text-sm font-semibold transition-colors duration-300 flex items-center gap-1.5 ${
                  location.pathname === '/studio' || location.pathname === '/generate' ? 'text-brand-light font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Creative Studio ✨</span>
              </Link>
              <Link 
                to="/dashboard" 
                className="text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-300"
              >
                Projects
              </Link>
              <Link 
                to="/history" 
                className={`text-sm font-semibold transition-colors duration-300 ${
                  location.pathname === '/history' ? 'text-brand-light font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                History
              </Link>
            </>
          )}
        </div>

        {/* Auth Area */}
        <div className="flex items-center gap-4">
          {isAuth ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowProfile(true)}
                className="flex items-center gap-2 bg-white/[0.04] hover:bg-brand/10 border border-white/[0.08] hover:border-brand/30 rounded-2xl px-3.5 py-1.5 transition-all cursor-pointer group"
                title="Profile Settings"
              >
                <div className="w-6 h-6 rounded-full bg-brand/30 border border-brand/50 flex items-center justify-center text-xs text-brand-light font-extrabold">
                  {(user?.name || user?.email || 'U')?.[0]?.toUpperCase()}
                </div>
                <span className="text-xs text-slate-200 font-bold group-hover:text-brand-light transition-colors">
                  {user?.name || user?.email?.split('@')[0] || 'Profile'}
                </span>
              </button>
              <button
                onClick={() => { logout(); navigate('/') }}
                className="text-xs font-semibold text-slate-400 hover:text-rose-400 bg-transparent border-0 cursor-pointer transition-colors px-2 py-1"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAuth('login')}
                className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2.5 rounded-2xl hover:bg-white/[0.03] transition-all"
              >
                Login
              </button>
              <button
                onClick={() => onAuth('signup')}
                className="bg-brand text-white text-sm font-bold px-5 py-2.5 rounded-2xl hover:bg-brand-dark shadow-glow transition-all"
              >
                Sign up free
              </button>
            </div>
          )}
        </div>
      </nav>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  )
}
