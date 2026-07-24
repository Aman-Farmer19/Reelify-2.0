import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('account') // 'account' | 'appearance' | 'workspace' | 'notifications' | 'billing' | 'ai' | 'export' | 'shortcuts'

  // Account State
  const [name, setName] = useState(user?.name || 'Aman')
  const [email, setEmail] = useState(user?.email || 'aman@reelify.ai')

  // Appearance State
  const [theme, setTheme] = useState('dark_glass')
  const [fontSize, setFontSize] = useState('standard')

  // Workspace State
  const [workspaceName, setWorkspaceName] = useState("Aman's Studio")
  const [defaultAspect, setDefaultAspect] = useState('9:16')

  // Notifications State
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [lowCreditAlert, setLowCreditAlert] = useState(true)
  const [renderCompletePush, setRenderCompletePush] = useState(true)

  // AI Preferences State
  const [defaultVoice, setDefaultVoice] = useState('Aria (Female)')
  const [defaultStyle, setDefaultStyle] = useState('Cinematic')
  const [negativeSafeguard, setNegativeSafeguard] = useState(true)

  // Export Defaults State
  const [exportFormat, setExportFormat] = useState('MP4')
  const [exportRes, setExportRes] = useState('1080p')
  const [exportFps, setExportFps] = useState('60')
  const [watermark, setWatermark] = useState('none')

  // Autosave status
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)

  const handleSaveSettings = (e) => {
    e.preventDefault()
    toast.success('Settings updated and autosaved!')
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 selection:bg-brand selection:text-white">
      
      {/* ─── 1. PAGE HEADER & AUTOSAVE BADGE ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>⚙️ Settings & Preferences</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
            Manage account credentials, studio appearance, rendering defaults, billing plan, and keyboard shortcuts.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-emerald-400 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Autosave Active</span>
        </div>
      </div>

      {/* ─── 2. SETTINGS TABS SELECTOR ─── */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-white/[0.08]">
        {[
          { id: 'account', label: '👤 Account' },
          { id: 'appearance', label: '🎨 Appearance' },
          { id: 'workspace', label: '💼 Workspace' },
          { id: 'notifications', label: '🔔 Notifications' },
          { id: 'billing', label: '💳 Billing & Plan' },
          { id: 'ai', label: '🤖 AI Preferences' },
          { id: 'export', label: '📦 Export Defaults' },
          { id: 'shortcuts', label: '⌨️ Shortcuts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? 'bg-brand/20 border-brand text-white shadow-glow'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── 3. TAB CONTENT PANELS ─── */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* TAB 1: ACCOUNT */}
        {activeTab === 'account' && (
          <div className="card-glass p-6 md:p-8 rounded-3xl border-white/[0.08] space-y-6 shadow-2xl">
            <h2 className="text-base font-black text-white border-b border-white/[0.08] pb-3">
              👤 Account Profile & Security
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] space-y-3">
              <h3 className="text-xs font-black text-white">Security & Passwords</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => toast('Password reset link sent to your email!')}
                  className="bg-white/[0.04] hover:bg-white/10 border border-white/10 text-white text-xs font-black py-3 px-5 rounded-2xl transition-all"
                >
                  🔒 Change Password
                </button>
                <button
                  type="button"
                  onClick={() => toast.success('Two-Factor Authentication enabled!')}
                  className="bg-brand/15 hover:bg-brand/30 border border-brand/30 text-brand-light text-xs font-black py-3 px-5 rounded-2xl transition-all"
                >
                  🛡️ Enable 2FA Security
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPEARANCE */}
        {activeTab === 'appearance' && (
          <div className="card-glass p-6 md:p-8 rounded-3xl border-white/[0.08] space-y-6 shadow-2xl">
            <h2 className="text-base font-black text-white border-b border-white/[0.08] pb-3">
              🎨 Theme & UI Customization
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                  Theme Preset
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'dark_glass', name: 'Dark Glass (Default)', desc: 'Deep violet mesh with 24px blur' },
                    { id: 'midnight', name: 'Midnight Purple', desc: 'Sleek dark purple contrast' },
                    { id: 'oled', name: 'OLED Black', desc: 'Pure black background' },
                  ].map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setTheme(th.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        theme === th.id
                          ? 'bg-brand/20 border-brand text-white shadow-glow'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                      }`}
                    >
                      <h4 className="text-xs font-black mb-1">{th.name}</h4>
                      <p className="text-[10px] opacity-70 leading-relaxed">{th.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Font Density
                </label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="input-field"
                >
                  <option value="compact">Compact (High Information Density)</option>
                  <option value="standard">Standard (Recommended)</option>
                  <option value="large">Large (High Accessibility)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WORKSPACE */}
        {activeTab === 'workspace' && (
          <div className="card-glass p-6 md:p-8 rounded-3xl border-white/[0.08] space-y-6 shadow-2xl">
            <h2 className="text-base font-black text-white border-b border-white/[0.08] pb-3">
              💼 Workspace Configuration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Default Aspect Ratio
                </label>
                <select
                  value={defaultAspect}
                  onChange={(e) => setDefaultAspect(e.target.value)}
                  className="input-field"
                >
                  <option value="9:16">9:16 (Instagram Reels / TikTok / Shorts)</option>
                  <option value="16:9">16:9 (YouTube Widescreen)</option>
                  <option value="1:1">1:1 (Square Feed Post)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="card-glass p-6 md:p-8 rounded-3xl border-white/[0.08] space-y-4 shadow-2xl">
            <h2 className="text-base font-black text-white border-b border-white/[0.08] pb-3">
              🔔 Notification Preferences
            </h2>

            {[
              { label: 'Email Activity Digest', desc: 'Receive weekly video view and rendering summaries via email.', state: emailAlerts, setState: setEmailAlerts },
              { label: 'Low Credits Alert', desc: 'Notify when credit balance falls below 100 credits.', state: lowCreditAlert, setState: setLowCreditAlert },
              { label: 'Push Notification on Render Complete', desc: 'Show browser popup when batch render completes.', state: renderCompletePush, setState: setRenderCompletePush },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.06] p-4 rounded-2xl">
                <div>
                  <h4 className="text-xs font-black text-white">{n.label}</h4>
                  <p className="text-[11px] text-slate-400">{n.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={n.state}
                  onChange={(e) => n.setState(e.target.checked)}
                  className="w-5 h-5 accent-brand cursor-pointer"
                />
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: BILLING & PLAN */}
        {activeTab === 'billing' && (
          <div className="card-glass p-6 md:p-8 rounded-3xl border-white/[0.08] space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h2 className="text-base font-black text-white">💳 Subscription Plan & Usage</h2>
              <span className="text-xs font-black text-brand-light bg-brand/20 border border-brand/40 px-3 py-1 rounded-full">
                PRO Unlimited Plan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] font-black text-slate-500 uppercase">Monthly Credits</span>
                <div className="text-xl font-black text-brand-light">950 / 1000 Used</div>
              </div>
              <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] font-black text-slate-500 uppercase">Renewal Date</span>
                <div className="text-xl font-black text-white">Aug 24, 2026</div>
              </div>
              <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] font-black text-slate-500 uppercase">Payment Method</span>
                <div className="text-xl font-black text-emerald-400">Visa •••• 4242</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toast('Redirecting to Stripe Billing Portal...')}
              className="btn-primary text-xs font-black py-3 px-6 rounded-2xl shadow-glow"
            >
              ⚡ Upgrade to Unlimited Enterprise Plan
            </button>
          </div>
        )}

        {/* TAB 6: AI PREFERENCES */}
        {activeTab === 'ai' && (
          <div className="card-glass p-6 md:p-8 rounded-3xl border-white/[0.08] space-y-6 shadow-2xl">
            <h2 className="text-base font-black text-white border-b border-white/[0.08] pb-3">
              🤖 AI Director Engine Defaults
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Default Voice Engine
                </label>
                <select
                  value={defaultVoice}
                  onChange={(e) => setDefaultVoice(e.target.value)}
                  className="input-field"
                >
                  <option value="Aria (Female)">Aria (Female Neural)</option>
                  <option value="Marcus (Male)">Marcus (Male Neural)</option>
                  <option value="Zara (Female)">Zara (Female Warm)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Default Visual Style
                </label>
                <select
                  value={defaultStyle}
                  onChange={(e) => setDefaultStyle(e.target.value)}
                  className="input-field"
                >
                  <option value="Cinematic">Cinematic 8K Anamorphic</option>
                  <option value="Luxury">Luxury Golden Hour</option>
                  <option value="Minimal">Aesthetic Minimalist</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.06] p-4 rounded-2xl">
              <div>
                <h4 className="text-xs font-black text-white">Negative Prompt Safeguard</h4>
                <p className="text-[11px] text-slate-400">Automatically appends anti-blur and anti-watermark safeguards.</p>
              </div>
              <input
                type="checkbox"
                checked={negativeSafeguard}
                onChange={(e) => setNegativeSafeguard(e.target.checked)}
                className="w-5 h-5 accent-brand cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* TAB 7: EXPORT DEFAULTS */}
        {activeTab === 'export' && (
          <div className="card-glass p-6 md:p-8 rounded-3xl border-white/[0.08] space-y-6 shadow-2xl">
            <h2 className="text-base font-black text-white border-b border-white/[0.08] pb-3">
              📦 Render & Export Defaults
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Format</label>
                <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)} className="input-field">
                  <option value="MP4">MP4 Video</option>
                  <option value="GIF">Animated GIF</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Resolution</label>
                <select value={exportRes} onChange={(e) => setExportRes(e.target.value)} className="input-field">
                  <option value="1080p">1080p HD</option>
                  <option value="4K">4K Ultra HD</option>
                  <option value="720p">720p HD</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">FPS</label>
                <select value={exportFps} onChange={(e) => setExportFps(e.target.value)} className="input-field">
                  <option value="60">60 FPS</option>
                  <option value="30">30 FPS</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Watermark</label>
                <select value={watermark} onChange={(e) => setWatermark(e.target.value)} className="input-field">
                  <option value="none">No Watermark</option>
                  <option value="logo">Logo Overlay</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: KEYBOARD SHORTCUTS */}
        {activeTab === 'shortcuts' && (
          <div className="card-glass p-6 md:p-8 rounded-3xl border-white/[0.08] space-y-6 shadow-2xl">
            <h2 className="text-base font-black text-white border-b border-white/[0.08] pb-3">
              ⌨️ Keyboard Shortcuts Matrix
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { key: 'Cmd / Ctrl + Enter', desc: 'Trigger AI Video Generation' },
                { key: 'Cmd / Ctrl + S', desc: 'Save Active Project Draft' },
                { key: 'Cmd / Ctrl + K', desc: 'Open Reelify Copilot AI Assistant' },
                { key: 'Spacebar', desc: 'Play / Pause Video Preview Monitor' },
                { key: 'Esc', desc: 'Close Overlay Modals & Drawers' },
                { key: 'Cmd / Ctrl + E', desc: 'Open Export Center Modal' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.06] p-3.5 rounded-2xl">
                  <span className="text-slate-300 font-medium">{s.desc}</span>
                  <span className="text-[10px] font-black text-brand-light bg-black/60 border border-white/10 px-2.5 py-1 rounded-lg">
                    {s.key}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="btn-primary text-xs font-black py-4 px-8 rounded-2xl shadow-glow hover:scale-105 transition-all"
          >
            ✨ Save Preferences
          </button>
        </div>

      </form>
    </div>
  )
}
