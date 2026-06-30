import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/generate', icon: '✦', label: 'Generate' },
  { to: '/dashboard', icon: '▶', label: 'My Videos' },
  { to: '/dashboard', icon: '◉', label: 'Analytics' },
]

const settingsLinks = [
  { to: '/dashboard', icon: '⚙', label: 'Preferences' },
  { to: '/dashboard', icon: '◎', label: 'Profile' },
]

export default function Sidebar() {
  const { pathname } = useLocation()

  const NavItem = ({ to, icon, label }) => {
    const active = pathname === to && label !== 'My Videos' && label !== 'Analytics' && label !== 'Profile' && label !== 'Preferences'
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
          active
            ? 'bg-brand/20 text-white'
            : 'text-slate-500 hover:bg-brand/10 hover:text-slate-200'
        }`}
      >
        <span className="text-base w-4 text-center">{icon}</span>
        {label}
      </Link>
    )
  }

  return (
    <aside className="w-48 bg-surface-1 border-r border-border p-4 flex-shrink-0 min-h-[calc(100vh-57px)]">
      <div className="flex flex-col gap-1">
        {links.map((l) => <NavItem key={l.label} {...l} />)}
      </div>
      <div className="mt-4 mb-2 px-3.5 text-[10px] text-slate-600 uppercase tracking-wider">Settings</div>
      <div className="flex flex-col gap-1">
        {settingsLinks.map((l) => <NavItem key={l.label} {...l} />)}
      </div>
    </aside>
  )
}
