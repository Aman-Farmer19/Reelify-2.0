import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login, isAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Determine initial mode from query string e.g. /login?tab=signup
  const queryParams = new URLSearchParams(location.search)
  const initialTab = queryParams.get('tab') === 'signup' ? 'signup' : 'login'

  const [mode, setMode] = useState(initialTab) // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '', rememberMe: true })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuth) {
      navigate('/app/dashboard', { replace: true })
    }
  }, [isAuth, navigate])

  const isLogin = mode === 'login'

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

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
      toast.success(isLogin ? 'Welcome back to Reelify!' : 'Account created successfully!')
      navigate('/studio')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialAuth = (provider) => {
    toast.success(`Redirecting to ${provider} authentication...`)
    // Simulated Social OAuth redirect
    setTimeout(() => {
      const dummyUser = { name: `${provider} User`, email: `creator@${provider.toLowerCase()}.com` }
      login(dummyUser, 'social_demo_token_12345')
      toast.success(`Successfully signed in with ${provider}!`)
      navigate('/studio')
    }, 1000)
  }

  return (
    <div className="min-h-[calc(100vh-77px)] bg-surface-0 flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden">

      {/* Background Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Split Glass Card */}
      <div className="w-full max-w-5xl card-glass border-white/[0.08] rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl relative shadow-glow-strong">

        {/* LEFT SIDE: AUTHENTICATION FORM */}
        <div className="lg:col-span-6 p-8 sm:p-10 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.06] bg-surface-1/60">

          <div>
            {/* Header Branding */}
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand to-brand-glow flex items-center justify-center text-white font-black text-sm shadow-glow">
                  R
                </div>
                <span className="text-white font-extrabold text-xl tracking-tight">
                  Reelify
                </span>
              </Link>

              <Link
                to="/sandbox"
                className="text-xs font-extrabold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
              >
                <span>🧪 Try Sandbox</span>
              </Link>
            </div>

            {/* Mode Selector Tabs */}
            <div className="flex bg-black/40 rounded-2xl p-1 mb-8 border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all duration-300 ${isLogin ? 'bg-brand text-white shadow-glow' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all duration-300 ${!isLogin ? 'bg-brand text-white shadow-glow' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Create Account
              </button>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white tracking-tight mb-1">
                {isLogin ? 'Welcome Back to Reelify' : 'Create Your Account'}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isLogin
                  ? 'Sign in to access Creative Studio, saved projects, and AI Director features.'
                  : 'Start generating professional AI short videos with full studio controls.'
                }
              </p>
            </div>

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="section-label">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required={!isLogin}
                    className="input-field"
                  />
                </div>
              )}

              <div>
                <label className="section-label">Email Address</label>
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
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="input-field pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={form.rememberMe}
                    onChange={handleChange}
                    className="rounded border-white/20 bg-black/40 text-brand focus:ring-0 cursor-pointer"
                  />
                  <span>Remember Me</span>
                </label>

                <button
                  type="button"
                  onClick={() => toast('Password reset link sent to your email!')}
                  className="text-brand-light font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-xs font-black rounded-xl shadow-glow hover:scale-[1.01] transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : isLogin ? (
                  'Login to Creative Studio ➔'
                ) : (
                  'Create Account Free ➔'
                )}
              </button>
            </form>

            {/* Social Auth Section */}
            <div className="mt-8">
              <div className="relative flex items-center justify-center mb-6">
                <div className="border-t border-white/[0.08] w-full" />
                <span className="bg-surface-1 px-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest absolute">
                  Or Continue With
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Google')}
                  className="bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl py-2.5 px-4 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialAuth('GitHub')}
                  className="bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl py-2.5 px-4 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="mt-8 text-center text-[10px] text-slate-500">
            By continuing, you agree to Reelify's Terms of Service and Privacy Policy.
          </div>
        </div>

        {/* RIGHT SIDE: ANIMATED REELIFY PREVIEW SHOWCASE */}
        <div className="lg:col-span-6 p-8 sm:p-10 md:p-12 bg-gradient-to-br from-brand/20 via-purple-950/30 to-surface-0 flex flex-col justify-between relative overflow-hidden">

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/30 rounded-full px-3.5 py-1 text-xs font-extrabold text-brand-light mb-4 shadow-glow">
              <span>✨ AI Video Pipeline</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Transform Ideas Into Short Videos
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Reelify's multi-step AI engine plans scripts, synthesizes voiceovers, generates shot list storyboards, and renders 9:16 vertical reels.
            </p>
          </div>

          {/* 4-Step Animated Pipeline Visual */}
          <div className="my-8 space-y-3 relative z-10">
            {[
              { num: '1', title: 'Prompt Workspace', desc: 'Natural language input with live prompt quality analyzer', icon: '✍️' },
              { num: '2', title: 'AI Creative Director', desc: 'Script synthesis, camera shot list & voice selection', icon: '🎬' },
              { num: '3', title: 'Video Assembly', desc: 'HD stock matching & FFmpeg audio mixing', icon: '⚡' },
              { num: '4', title: 'Export Anywhere', desc: '1080x1920 MP4 ready for Reels, TikTok & Shorts', icon: '📦' }
            ].map((step, idx) => (
              <div key={step.num} className="bg-black/40 border border-white/[0.08] p-3.5 rounded-2xl flex items-center gap-3 shadow-lg">
                <div className="w-8 h-8 rounded-xl bg-brand/20 border border-brand/40 text-brand-light font-black text-xs flex items-center justify-center flex-shrink-0 shadow-inner">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">{step.title}</span>
                    <span className="text-[9px] font-extrabold text-emerald-400 uppercase">Step 0{step.num}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Card Mockup */}
          <div className="bg-black/50 border border-white/10 p-4 rounded-2xl flex items-center justify-between text-xs relative z-10 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-extrabold text-white">Reelify Studio Engine</span>
            </div>
            <span className="text-[10px] font-extrabold text-brand-light uppercase tracking-wider">
              1080p 60 FPS HD
            </span>
          </div>

        </div>

      </div>
    </div>
  )
}
