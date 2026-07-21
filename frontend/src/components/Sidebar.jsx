import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { 
    to: '/dashboard?tab=overview', 
    tab: 'overview',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
      </svg>
    )
  },
  { 
    to: '/generate', 
    tab: 'generate',
    label: 'AI Studio',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    )
  },
  { 
    to: '/dashboard?tab=overview', 
    tab: 'overview',
    label: 'My Videos',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    to: '/dashboard?tab=analytics', 
    tab: 'analytics',
    label: 'Analytics',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
]

const settingsLinks = [
  { 
    to: '/dashboard?tab=preferences', 
    tab: 'preferences',
    label: 'Preferences',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  { 
    to: '/dashboard?tab=profile', 
    tab: 'profile',
    label: 'Profile',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
]

export default function Sidebar() {
  const location = useLocation()
  const currentTab = new URLSearchParams(location.search).get('tab') || 'overview'

  const NavItem = ({ to, tab, icon, label }) => {
    // Determine active menu item
    const active = location.pathname === '/generate' 
      ? tab === 'generate'
      : (location.pathname === '/dashboard' && (currentTab === tab || (tab === 'overview' && !currentTab)))

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
        
        <div>
          <div className="mb-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Settings</div>
          <div className="flex flex-col gap-1.5">
            {settingsLinks.map((l) => <NavItem key={l.label} {...l} />)}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-tr from-brand/10 to-brand-glow/5 border border-brand/20 rounded-2xl p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-brand-glow/20 rounded-full blur-2xl"></div>
        <p className="text-xs font-bold text-white mb-1">Upgrade to Pro</p>
        <p className="text-[10px] text-slate-400 leading-normal mb-3">Unlimited video generation & higher quality formats.</p>
        <button className="w-full bg-brand hover:bg-brand-dark text-white text-[10px] font-extrabold py-2 px-3 rounded-xl transition-all shadow-glow">
          Upgrade Now
        </button>
      </div>
    </aside>
  )
}
