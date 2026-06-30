import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ onAuth }) {
  const { isAuth, user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3.5 bg-surface-1 border-b border-border">
      <Link to="/" className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-brand inline-block"></span>
        <span className="text-white font-bold text-lg tracking-tight">Reelify</span>
      </Link>

      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">Home</Link>
        <Link to="/generate" className="text-sm text-slate-400 hover:text-white transition-colors">Generate</Link>
        {isAuth && (
          <Link to="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">Dashboard</Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        {isAuth ? (
          <>
            <span className="text-sm text-slate-400">Hi, {user?.name || 'Aman'}</span>
            <button
              onClick={() => { logout(); navigate('/') }}
              className="btn-ghost text-sm px-4 py-2 rounded-lg"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onAuth('login')}
              className="btn-ghost text-sm px-4 py-2 rounded-lg"
            >
              Log in
            </button>
            <button
              onClick={() => onAuth('signup')}
              className="btn-primary text-sm px-4 py-2 rounded-lg"
            >
              Sign up free
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
