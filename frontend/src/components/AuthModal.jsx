import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function AuthModal({ mode, onClose, onSwitch }) {
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const isLogin = mode === 'login'

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password }
      const { data } = await axios.post(endpoint, payload)
      login(data.user, data.token)
      toast.success(isLogin ? 'Welcome back!' : 'Account created!')
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card p-8 w-full max-w-sm mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white text-xl transition-colors"
        >
          ✕
        </button>

        {/* Tabs */}
        <div className="flex bg-surface-1 rounded-xl p-1 mb-6">
          {['login', 'signup'].map((t) => (
            <button
              key={t}
              onClick={() => onSwitch(t)}
              className={`flex-1 py-2 text-sm rounded-lg font-medium transition-all ${
                mode === t ? 'bg-brand text-white' : 'text-slate-400'
              }`}
            >
              {t === 'login' ? 'Log in' : 'Sign up'}
            </button>
          ))}
        </div>

        <h3 className="text-xl font-bold text-white mb-1">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          {isLogin ? 'Log in to generate AI videos' : 'Start generating AI videos for free'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="section-label">Full name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Aman Tiwari"
                required={!isLogin}
                className="input-field"
              />
            </div>
          )}
          <div>
            <label className="section-label">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="section-label">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="input-field"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-sm mt-2 disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isLogin ? 'Log in to Reelify' : 'Create free account'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-4">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => onSwitch(isLogin ? 'signup' : 'login')}
            className="text-brand-light hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  )
}
