import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email] = useState(user?.email || '')
  const [tier] = useState('Pro Studio Member')

  const handleUpdateProfile = (e) => {
    e.preventDefault()
    updateUser({ ...user, name })
    toast.success('Profile updated successfully!')
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <span>👤 Profile & Account</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal account credentials, plan subscription, and profile settings.
        </p>
      </div>

      <div className="card-glass p-8 border-white/[0.08] rounded-3xl flex items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand to-brand-glow border-2 border-white/20 flex items-center justify-center text-white text-3xl font-black shadow-glow flex-shrink-0">
          {(name || email || 'U')?.[0]?.toUpperCase()}
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <h2 className="text-xl font-extrabold text-white truncate">{name || 'Creator User'}</h2>
          <p className="text-xs text-slate-400 truncate">{email || 'user@reelify.ai'}</p>
          <span className="text-[10px] font-black text-brand-light bg-brand/20 border border-brand/40 px-3 py-1 rounded-full w-fit mt-1">
            ✨ {tier}
          </span>
        </div>
      </div>

      <form onSubmit={handleUpdateProfile} className="card-glass p-8 border-white/[0.08] rounded-3xl space-y-5">
        <h3 className="text-base font-extrabold text-white">Account Information</h3>

        <div>
          <label className="section-label">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="input-field"
          />
        </div>

        <div>
          <label className="section-label">Email Address (Read-only)</label>
          <input
            type="email"
            value={email}
            disabled
            className="input-field opacity-60 cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          className="btn-primary text-xs font-black py-3.5 px-8 rounded-xl shadow-glow"
        >
          Save Profile Changes ➔
        </button>
      </form>
    </div>
  )
}
