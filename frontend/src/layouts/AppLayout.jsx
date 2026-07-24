import React, { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProfileModal from '../components/ProfileModal'
import NotificationCenter from '../components/NotificationCenter'

export default function AppLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showProfileModal, setShowProfileModal] = useState(false)

  const navItems = [
    {
      to: '/app',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      )
    },
    {
      to: '/app/studio',
      label: 'Creative Studio',
      badge: 'PRO',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      to: '/app/projects',
      label: 'Projects',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      )
    },
    {
      to: '/app/assets',
      label: 'Asset Library',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      to: '/app/analytics',
      label: 'Analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      to: '/app/prompts',
      label: 'Prompt Library',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      to: '/app/history',
      label: 'History',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      to: '/app/templates',
      label: 'Templates',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      to: '/app/settings',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      to: '/app/profile',
      label: 'Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ]

  const handleSignOut = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-surface-0 flex text-white font-sans selection:bg-brand selection:text-white">
      
      {/* FIXED LEFT SIDEBAR */}
      <aside className="w-64 bg-surface-1/70 backdrop-blur-2xl border-r border-white/[0.06] p-5 flex flex-col justify-between flex-shrink-0 sticky top-0 h-screen z-40">
        
        <div className="flex flex-col gap-6">
          {/* Top Logo & Notification Center */}
          <div className="flex items-center justify-between px-2 py-1">
            <Link to="/app" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand to-brand-glow flex items-center justify-center text-white font-black text-base shadow-glow group-hover:scale-105 transition-transform">
                R
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-white group-hover:text-brand-light transition-colors">
                  Reelify <span className="text-brand-light text-xs font-black">2.0</span>
                </span>
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                  AI Video Studio
                </span>
              </div>
            </Link>

            <NotificationCenter />
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <div className="px-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">
              Workspace
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.to || (item.to !== '/app' && pathname.startsWith(item.to))

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-extrabold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand/25 to-brand-glow/10 border border-brand/40 text-white shadow-glow'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-brand-light' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] font-black text-brand-light bg-brand/20 border border-brand/40 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom User Profile Section */}
        <div className="flex flex-col gap-3 border-t border-white/[0.08] pt-4">
          <div 
            onClick={() => setShowProfileModal(true)}
            className="flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] rounded-2xl p-3 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand to-brand-glow border border-white/20 flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0 shadow-inner">
                {(user?.name || user?.email || 'U')?.[0]?.toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-extrabold text-white truncate group-hover:text-brand-light transition-colors">
                  {user?.name || user?.email?.split('@')[0] || 'User Profile'}
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {user?.email || 'pro.account@reelify.ai'}
                </span>
              </div>
            </div>

            <span className="text-slate-500 group-hover:text-white text-xs">⚙️</span>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 bg-white/[0.02] hover:bg-rose-500/10 border border-white/[0.06] hover:border-rose-500/30 text-slate-400 hover:text-rose-400 text-xs font-extrabold py-2.5 rounded-xl transition-all"
          >
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* SCROLLABLE MAIN CONTENT WORKSPACE */}
      <main className="flex-1 min-w-0 overflow-y-auto min-h-screen">
        <Outlet />
      </main>

      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
    </div>
  )
}
