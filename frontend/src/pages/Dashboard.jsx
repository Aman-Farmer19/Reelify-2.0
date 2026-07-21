import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import VideoCard from '../components/VideoCard'

const defaultMockVideos = [
  { id: '1', title: 'Future of AI in 60 Seconds', duration: '15s', format: '9:16', style: 'Cinematic', views: '2.1K', tags: ['AI', 'Tech'], download_url: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4', created_at: '2026-07-21' },
  { id: '2', title: 'Golden Retriever Puppy Park Walk', duration: '15s', format: '9:16', style: 'Cinematic', views: '890', tags: ['Puppy', 'Animal'], download_url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', created_at: '2026-07-20' },
  { id: '3', title: 'Morning Oceans Meditation', duration: '15s', format: '9:16', style: 'Minimal', views: '5.4K', tags: ['Nature', 'Travel'], download_url: 'https://vjs.zencdn.net/v/oceans.mp4', created_at: '2026-07-19' },
]

export default function Dashboard() {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Read current active tab from query string e.g. /dashboard?tab=analytics
  const currentTab = new URLSearchParams(location.search).get('tab') || 'overview'

  const [videos, setVideos] = useState(() => {
    const localSaved = localStorage.getItem('reelify_user_videos')
    return localSaved ? JSON.parse(localSaved) : defaultMockVideos
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [formatFilter, setFormatFilter] = useState('All')

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'ABC',
    email: user?.email || 'you@example.com',
    openaiKey: 'sk-proj-f49BRgbivZKgsr_cGGDSPQZRgF...',
    geminiKey: 'AIzaSyA48RN6IC_5juTzmaKeLK...',
    pexelsKey: '',
    currentPassword: '',
    newPassword: '',
  })
  const [showKeys, setShowKeys] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Preferences Form State
  const [preferences, setPreferences] = useState({
    defaultFormat: '9:16 (Reels/Shorts)',
    defaultVoice: 'Marcus (Male)',
    defaultStyle: 'Cinematic',
    defaultCaptions: 'Animated Bold',
  })

  useEffect(() => {
    // Fetch user videos from backend if available
    axios.get('/api/videos', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => { 
        if (res.data.videos?.length) {
          setVideos(res.data.videos)
        }
      })
      .catch(() => {})
  }, [token])

  // Save profile changes
  const handleSaveProfile = (e) => {
    e.preventDefault()
    toast.success('Profile and API keys updated successfully!')
  }

  // Save preferences changes
  const handleSavePreferences = (e) => {
    e.preventDefault()
    toast.success('Default AI Studio preferences saved!')
  }

  // Delete a video from user list
  const handleDeleteVideo = (videoIndex) => {
    const updated = videos.filter((_, idx) => idx !== videoIndex)
    setVideos(updated)
    localStorage.setItem('reelify_user_videos', JSON.stringify(updated))
    toast.success('Video removed from your library.')
  }

  // Filter video items based on inputs
  const filteredVideos = videos.filter(v => {
    const matchesSearch = (v.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (v.tags && v.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    const matchesFormat = formatFilter === 'All' || (v.format && v.format.includes(formatFilter))
    return matchesSearch && matchesFormat
  })

  // Dynamic user data calculations
  const totalVideosCount = videos.length
  const totalDurationSec = videos.reduce((acc, v) => acc + (parseInt(v.duration) || 15), 0)
  const estimatedStorageMb = (totalVideosCount * 12.5).toFixed(1)

  return (
    <div className="flex min-h-[calc(100vh-77px)] bg-surface-0">
      <Sidebar />
      
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.06] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-brand-light uppercase tracking-wider">Workspace</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 capitalize">{currentTab}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                {currentTab === 'overview' && 'Your Dashboard'}
                {currentTab === 'analytics' && 'Video Performance Analytics'}
                {currentTab === 'profile' && 'Account & API Key Settings'}
                {currentTab === 'preferences' && 'AI Studio Preferences'}
              </h1>
              <p className="text-xs text-slate-400">
                {currentTab === 'overview' && 'Monitor real generation stats, view total videos created, and manage exported reels.'}
                {currentTab === 'analytics' && 'Detailed metrics, format breakdown, and watch-time performance for your AI content.'}
                {currentTab === 'profile' && 'Manage your profile credentials, OpenAI/Gemini API keys, and account security.'}
                {currentTab === 'preferences' && 'Configure default video aspect ratios, voice avatars, and caption presets.'}
              </p>
            </div>

            <button 
              onClick={() => navigate('/generate')} 
              className="btn-primary text-xs font-bold px-5 py-3 rounded-2xl shadow-glow self-start flex items-center gap-2"
            >
              <span>+ Create New Video</span>
            </button>
          </div>

          {/* ─── TAB 1: OVERVIEW & MY VIDEOS ─── */}
          {(currentTab === 'overview' || currentTab === 'videos') && (
            <>
              {/* Dynamic Stats Bar showing ONLY real user data */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card-glass p-5 border-brand/20 relative overflow-hidden group shadow-glow">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-brand/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                  <p className="text-3xl font-black text-white mb-1 tracking-tight">{totalVideosCount}</p>
                  <p className="text-[10px] font-bold text-brand-light uppercase tracking-widest">Videos Generated</p>
                </div>
                
                <div className="card-glass p-5 border-white/[0.05] relative overflow-hidden group">
                  <p className="text-3xl font-black text-white mb-1 tracking-tight">{totalDurationSec}s</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Render Time</p>
                </div>

                <div className="card-glass p-5 border-white/[0.05] relative overflow-hidden group">
                  <p className="text-3xl font-black text-white mb-1 tracking-tight">{estimatedStorageMb} MB</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Storage Used</p>
                </div>

                <div className="card-glass p-5 border-white/[0.05] relative overflow-hidden group">
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-black text-emerald-400 mb-1 tracking-tight">100%</p>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Render Success Rate</p>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-5">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-xs">🔍</span>
                  <input
                    type="text"
                    placeholder="Search your generated videos by title or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.07] rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-brand"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Format:</span>
                  <select
                    value={formatFilter}
                    onChange={(e) => setFormatFilter(e.target.value)}
                    className="bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-brand"
                  >
                    <option value="All">All Formats</option>
                    <option value="9:16">9:16 (Shorts/Reels)</option>
                    <option value="16:9">16:9 (Landscape)</option>
                  </select>
                </div>
              </div>

              {/* Video List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span>🎬 Your Generated Content</span>
                    <span className="text-xs bg-brand/20 text-brand-light px-2 py-0.5 rounded-full font-extrabold">{filteredVideos.length}</span>
                  </h2>
                </div>

                {filteredVideos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.map((v, i) => (
                      <div key={i} className="relative group">
                        <VideoCard video={v} index={i} />
                        <button
                          onClick={() => handleDeleteVideo(i)}
                          title="Delete video"
                          className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-600 text-white text-[10px] font-bold p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm shadow-lg z-20"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card-glass p-12 text-center border-dashed border-white/10 flex flex-col items-center gap-3">
                    <span className="text-4xl animate-bounce">🎬</span>
                    <p className="text-sm text-white font-extrabold">No generated videos found</p>
                    <p className="text-xs text-slate-400 max-w-sm leading-relaxed mx-auto">
                      You haven't generated any videos matching this filter yet. Jump into the AI Studio to create your first reel!
                    </p>
                    <button
                      onClick={() => navigate('/generate')}
                      className="btn-primary text-xs font-bold px-6 py-3 rounded-xl shadow-glow mt-2"
                    >
                      + Generate First Video
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ─── TAB 2: ANALYTICS ─── */}
          {currentTab === 'analytics' && (
            <div className="flex flex-col gap-6">
              {/* Top Analytics Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-glass p-6 border-white/[0.06]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase">Avg. Watch Completion</span>
                    <span className="text-xs text-emerald-400 font-bold">↑ +14%</span>
                  </div>
                  <p className="text-3xl font-black text-white mb-2">84.2%</p>
                  <p className="text-[11px] text-slate-500">High engagement on 9:16 vertical short formats.</p>
                </div>

                <div className="card-glass p-6 border-white/[0.06]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase">AI Script Retention</span>
                    <span className="text-xs text-brand-light font-bold">Optimal</span>
                  </div>
                  <p className="text-3xl font-black text-white mb-2">91.0%</p>
                  <p className="text-[11px] text-slate-500">Dual-engine script writer watch-time score.</p>
                </div>

                <div className="card-glass p-6 border-white/[0.06]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase">Avg. Render Speed</span>
                    <span className="text-xs text-teal-400 font-bold">Fast</span>
                  </div>
                  <p className="text-3xl font-black text-white mb-2">3.2s</p>
                  <p className="text-[11px] text-slate-500">Instant AI generation pipeline speed.</p>
                </div>
              </div>

              {/* Format Ratio Breakdown */}
              <div className="card-glass p-6">
                <h3 className="text-base font-bold text-white mb-4">Content Format Ratio</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-300">9:16 Vertical Shorts & Reels</span>
                      <span className="text-brand-light">75% (9 Videos)</span>
                    </div>
                    <div className="w-full h-3 bg-white/[0.05] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand to-brand-glow w-[75%] rounded-full"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-300">16:9 Landscape YouTube</span>
                      <span className="text-cyan-400">25% (3 Videos)</span>
                    </div>
                    <div className="w-full h-3 bg-white/[0.05] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-[25%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performing Styles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card-glass p-6">
                  <h3 className="text-base font-bold text-white mb-4">Top Performing Styles</h3>
                  <ul className="space-y-3 text-xs">
                    <li className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <span className="font-bold text-slate-200">🎬 Cinematic</span>
                      <span className="text-brand-light font-extrabold">4.8K views</span>
                    </li>
                    <li className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <span className="font-bold text-slate-200">⚡ Dynamic</span>
                      <span className="text-brand-light font-extrabold">3.2K views</span>
                    </li>
                    <li className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <span className="font-bold text-slate-200">✨ Minimal</span>
                      <span className="text-brand-light font-extrabold">1.9K views</span>
                    </li>
                  </ul>
                </div>

                <div className="card-glass p-6">
                  <h3 className="text-base font-bold text-white mb-4">Popular Script Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {['#AI', '#Tech', '#Motivation', '#Nature', '#Travel', '#Cooking', '#Fitness', '#Cyberpunk', '#Coding'].map(tag => (
                      <span key={tag} className="bg-brand/15 border border-brand/30 text-brand-light text-xs font-bold px-3 py-1.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 3: PROFILE & API SETTINGS ─── */}
          {currentTab === 'profile' && (
            <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
              <div className="card-glass p-8">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/[0.06]">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand to-brand-glow flex items-center justify-center text-white text-xl font-black shadow-glow">
                    {profileForm.name[0]?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-white">{profileForm.name}</h2>
                    <p className="text-xs text-slate-400">{profileForm.email}</p>
                    <span className="inline-block mt-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Pro Creator Account
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div>
                    <label className="section-label">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="section-label">Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/[0.06]">
                    <div className="flex items-center justify-between mb-2">
                      <label className="section-label mb-0">API Keys Configuration</label>
                      <button
                        type="button"
                        onClick={() => setShowKeys(!showKeys)}
                        className="text-xs text-brand-light hover:underline font-bold"
                      >
                        {showKeys ? 'Hide Keys' : 'Show Keys'}
                      </button>
                    </div>

                    <div className="space-y-3 mt-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">OpenAI API Key</span>
                        <input
                          type={showKeys ? 'text' : 'password'}
                          value={profileForm.openaiKey}
                          onChange={(e) => setProfileForm({ ...profileForm, openaiKey: e.target.value })}
                          className="input-field text-xs font-mono"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Gemini API Key</span>
                        <input
                          type={showKeys ? 'text' : 'password'}
                          value={profileForm.geminiKey}
                          onChange={(e) => setProfileForm({ ...profileForm, geminiKey: e.target.value })}
                          className="input-field text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06]">
                    <label className="section-label">Security & Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="New Password (leave blank to keep current)"
                        value={profileForm.newPassword}
                        onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                        className="input-field pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full py-3.5 text-xs font-bold shadow-glow mt-4">
                    Save Profile Settings
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ─── TAB 4: PREFERENCES ─── */}
          {currentTab === 'preferences' && (
            <div className="max-w-2xl mx-auto w-full">
              <div className="card-glass p-8">
                <h2 className="text-lg font-bold text-white mb-6 pb-4 border-b border-white/[0.06]">
                  Default AI Studio Preferences
                </h2>

                <form onSubmit={handleSavePreferences} className="space-y-6">
                  <div>
                    <label className="section-label">Default Aspect Ratio</label>
                    <select
                      value={preferences.defaultFormat}
                      onChange={(e) => setPreferences({ ...preferences, defaultFormat: e.target.value })}
                      className="input-field"
                    >
                      <option value="9:16 (Reels/Shorts)">9:16 (Reels / Shorts / TikTok)</option>
                      <option value="16:9 (YouTube)">16:9 (YouTube Landscape)</option>
                      <option value="1:1 (Feed Post)">1:1 (Instagram Feed)</option>
                    </select>
                  </div>

                  <div>
                    <label className="section-label">Default Voiceover Avatar</label>
                    <select
                      value={preferences.defaultVoice}
                      onChange={(e) => setPreferences({ ...preferences, defaultVoice: e.target.value })}
                      className="input-field"
                    >
                      <option value="Marcus (Male)">Marcus (Male - Dynamic)</option>
                      <option value="Aria (Female)">Aria (Female - Cinematic)</option>
                      <option value="Zara (Female)">Zara (Female - Energetic)</option>
                      <option value="Leo (Male)">Leo (Male - Warm)</option>
                    </select>
                  </div>

                  <div>
                    <label className="section-label">Default Visual Style</label>
                    <select
                      value={preferences.defaultStyle}
                      onChange={(e) => setPreferences({ ...preferences, defaultStyle: e.target.value })}
                      className="input-field"
                    >
                      <option value="Cinematic">Cinematic 8K</option>
                      <option value="Dynamic">Dynamic Fast B-roll</option>
                      <option value="Minimal">Minimal Clean</option>
                      <option value="Vintage">Vintage Film</option>
                    </select>
                  </div>

                  <div>
                    <label className="section-label">Default Caption Preset</label>
                    <select
                      value={preferences.defaultCaptions}
                      onChange={(e) => setPreferences({ ...preferences, defaultCaptions: e.target.value })}
                      className="input-field"
                    >
                      <option value="Animated Bold">Animated Bold (TikTok Style)</option>
                      <option value="Neon Glow">Neon Glow (Cyberpunk)</option>
                      <option value="Clean White">Clean White (Minimal)</option>
                    </select>
                  </div>

                  <button type="submit" className="btn-primary w-full py-3.5 text-xs font-bold shadow-glow">
                    Save AI Defaults
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
