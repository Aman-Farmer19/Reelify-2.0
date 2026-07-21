import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ onAuth }) {
  const { isAuth, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
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
      <div className="hidden md:flex items-center gap-8">
        <Link 
          to="/" 
          className={`text-sm font-semibold transition-colors duration-300 ${location.pathname === '/' ? 'text-brand-light' : 'text-slate-400 hover:text-white'}`}
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
        <a 
          href="/#about" 
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault()
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
            }
          }}
          className="text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-300"
        >
          About
        </a>
        <a 
          href="/#contact" 
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault()
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }
          }}
          className="text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-300"
        >
          Contact
        </a>
        {!isAuth ? (
          <a 
            href="/#sandbox-container" 
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault()
                document.getElementById('sandbox-container')?.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="relative group text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-1.5"
            title="Try Free Generation Sandbox"
          >
            <span>Generate</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-brand/20 border border-brand/40 text-brand-light rounded-full transition-transform duration-200 group-hover:scale-105 group-hover:bg-brand/30">
              Free Demo
            </span>
          </a>
        ) : (
          <Link 
            to="/generate" 
            className={`text-sm font-semibold transition-colors duration-300 ${location.pathname === '/generate' ? 'text-brand-light' : 'text-slate-400 hover:text-white'}`}
          >
            Generate
          </Link>
        )}
        {isAuth && (
          <Link 
            to="/dashboard" 
            className={`text-sm font-semibold transition-colors duration-300 ${location.pathname === '/dashboard' ? 'text-brand-light' : 'text-slate-400 hover:text-white'}`}
          >
            Dashboard
          </Link>
        )}
      </div>

      {/* Auth Area */}
      <div className="flex items-center gap-4">
        {isAuth ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-2">
              <div className="w-5 h-5 rounded-full bg-brand-dark/50 flex items-center justify-center text-[10px] text-brand-light font-bold">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <span className="text-xs text-slate-300 font-medium">
                {user?.name || 'User'}
              </span>
            </div>
            <button
              onClick={() => { logout(); navigate('/') }}
              className="text-xs font-semibold text-slate-400 hover:text-white bg-transparent border-0 cursor-pointer transition-colors"
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
              Log in
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
  )
}
