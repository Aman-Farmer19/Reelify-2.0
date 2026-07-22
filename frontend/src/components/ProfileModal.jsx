import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function ProfileModal({ onClose }) {
  const { token, user, logout } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!name.trim() && !password) {
      toast.error('Please enter a new name or password to update.')
      return
    }

    setLoading(true)
    const updateToast = toast.loading('Updating profile...')

    try {
      const { data } = await axios.put(
        '/api/user/profile',
        { name: name.trim(), password: password || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      toast.success(data.message || 'Profile updated successfully!', { id: updateToast })
      setPassword('')
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Profile update failed.', { id: updateToast })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('⚠️ WARNING: This will permanently delete your account, saved videos, and all files. This action CANNOT be undone!\n\nAre you sure?')) {
      return
    }

    setDeleting(true)
    const deleteToast = toast.loading('Wiping account & data...')

    try {
      await axios.delete('/api/user/account', {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Account and data deleted successfully.', { id: deleteToast })
      logout()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not delete account.', { id: deleteToast })
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="card-glass max-w-md w-full p-6 border-white/10 relative shadow-2xl animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center transition-all"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand-light font-extrabold text-sm">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Profile Settings</h2>
            <p className="text-xs text-slate-400">{user?.email || 'Registered User'}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="input-field text-xs w-full"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field text-xs w-full"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={loading || deleting}
              className="btn-primary text-xs font-bold py-3 px-5 rounded-xl flex-1 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs font-bold py-3 px-4 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Danger Zone: Delete Account */}
        <div className="mt-6 pt-6 border-t border-white/[0.08] flex flex-col gap-2">
          <label className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
            Danger Zone
          </label>
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={loading || deleting}
            className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold py-2.5 px-4 rounded-xl text-left transition-all flex items-center justify-between"
          >
            <span>Delete Account & Wipe All Data</span>
            <span className="text-[10px] text-rose-400 font-normal">Permanent</span>
          </button>
        </div>

      </div>
    </div>
  )
}
