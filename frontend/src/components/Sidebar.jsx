import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProfileModal from './ProfileModal'

export default function Sidebar({ onAuth }) {
  const { pathname } = useLocation()
  const { isAuth } = useAuth()
  const [showProfileModal, setShowProfileModal] = useState(false)

  const links = isAuth ? [
    { 
      to: '/dashboard', 
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      )
    },
    { 
      to: '/history', 
      label: 'History',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      to: '/generate', 
      label: 'Studio',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
  ] : [
    { 
      to: '/generate', 
      label: 'Sandbox Mode',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
  ]

  const settingsLinks = isAuth ? [
    { 
      to: '/dashboard', 
      label: 'Preferences',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      to: '/dashboard', 
      label: 'Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
  ] : []

  const NavItem = ({ to, icon, label, onClick }) => {
    const active = pathname === to && label !== 'Profile' && label !== 'Preferences'

    if (onClick) {
      return (
        <button
          onClick={onClick}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 text-slate-400 border border-transparent hover:bg-white/[0.03] hover:text-slate-200 text-left"
        >
          <span className="flex-shrink-0 text-slate-400 group-hover:text-white">{icon}</span>
          {label}
        </button>
      )
    }

    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
          active
            ? 'bg-gradient-to-r from-brand/20 to-brand-glow/10 border border-brand/20 text-brand-light shadow-glow'
            : 'text-slate-400 border border-transparent hover:bg-white/[0.03] hover:text-slate-200'
        }`}
      >
        <span className="flex-shrink-0 text-slate-400 group-hover:text-white">{icon}</span>
        {label}
      </Link>
    )
  }

  return (
    <aside className="w-56 bg-surface-1/50 backdrop-blur-xl border-r border-white/[0.05] p-5 flex-shrink-0 min-h-[calc(100vh-77px)] flex flex-col justify-between">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          {links.map((l) => <NavItem key={l.label} {...l} />)}
        </div>
        
        {settingsLinks.length > 0 && (
          <div>
            <div className="mb-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Settings</div>
            <div className="flex flex-col gap-1.5">
              {settingsLinks.map((l) => (
                <NavItem key={l.label} {...l} onClick={() => setShowProfileModal(true)} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 bg-gradient-to-tr from-brand/10 to-brand-glow/5 border border-brand/20 rounded-2xl p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-brand-glow/20 rounded-full blur-2xl"></div>
        <p className="text-xs font-bold text-white mb-1">Upgrade to Pro</p>
        <p className="text-[10px] text-slate-400 leading-normal mb-3">Unlimited video generation & higher quality formats.</p>
        <button 
          onClick={() => onAuth && onAuth('signup')}
          className="w-full bg-brand hover:bg-brand-dark text-white text-[10px] font-extrabold py-2 px-3 rounded-xl transition-all shadow-glow"
        >
          Upgrade Now
        </button>
      </div>

      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
    </aside>
  )
}
