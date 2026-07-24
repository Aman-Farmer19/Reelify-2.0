import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const MOCK_PROMPTS = [
  {
    id: 'pr-1',
    title: 'Luxury Espresso Coffee Commercial',
    category: '☕ Commercial Ads',
    style: 'Luxury Gold',
    prompt: 'A cinematic 8k luxury coffee commercial featuring slow-motion pouring shots of rich espresso crema into a white porcelain cup, warm volumetric rim lighting, camera tracking depth.',
    likes: 1240,
    copies: 890,
    camera: '📹 35mm Dolly Push-In',
    lighting: '💡 Golden Hour Warm Light',
    duration: '15s',
    isFavorite: true,
    isTrending: true,
    isCommunity: false
  },
  {
    id: 'pr-2',
    title: 'Cyberpunk Neon Street Racing',
    category: '🌸 Anime & SciFi',
    style: 'Cyberpunk Neon',
    prompt: 'Hyper-realistic 8k footage of futuristic sports cars racing through rain-soaked neon city streets at night, purple and cyan reflections, motion blur tracking shot.',
    likes: 2150,
    copies: 1420,
    camera: '📹 High-Speed Tracking Orbit',
    lighting: '💡 Cyberpunk Neon Rim Key',
    duration: '30s',
    isFavorite: false,
    isTrending: true,
    isCommunity: true
  },
  {
    id: 'pr-3',
    title: 'Sunrise Ocean Wave Meditation',
    category: '🏝 Travel & Vlog',
    style: 'Aesthetic Minimal',
    prompt: 'Aerial drone footage of serene turquoise ocean waves gently lapping onto a pristine golden beach at sunrise, warm ambient glow, 4k ultra-crisp resolution.',
    likes: 980,
    copies: 620,
    camera: '📹 24mm Ultra-Wide Drone',
    lighting: '💡 Soft Sunrise Atmosphere',
    duration: '15s',
    isFavorite: true,
    isTrending: false,
    isCommunity: false
  },
  {
    id: 'pr-4',
    title: 'High-Energy Fitness Motivation',
    category: '🏋️ Fitness & Gym',
    style: 'Dynamic High-Cut',
    prompt: 'Fast-paced high-energy gym montage of athlete performing heavy deadlift in dramatic dark studio lighting, chalk dust particles floating, intense bass audio pacing.',
    likes: 1780,
    copies: 1100,
    camera: '📹 Dynamic Handheld Orbit',
    lighting: '💡 Dramatic High-Contrast Key',
    duration: '15s',
    isFavorite: false,
    isTrending: true,
    isCommunity: true
  },
  {
    id: 'pr-5',
    title: 'Japanese Anime Sword Battle',
    category: '🌸 Anime & SciFi',
    style: 'Vibrant Anime',
    prompt: 'Vibrant cell-shaded anime action sequence of samurais clashing swords under cherry blossom trees, dramatic speed lines, glowing energy aura artifacts.',
    likes: 3120,
    copies: 2400,
    camera: '📹 Anamorphic Action Zoom',
    lighting: '💡 High-Contrast Anime Rim',
    duration: '30s',
    isFavorite: true,
    isTrending: true,
    isCommunity: false
  },
  {
    id: 'pr-6',
    title: 'SaaS Product Interface Showcase',
    category: '🎮 Gaming & Tech',
    style: 'Corporate Crisp',
    prompt: 'Sleek 3D motion graphics breakdown of modern AI software dashboard UI floating in dark space, volumetric glass refraction, smooth 60fps pan.',
    likes: 850,
    copies: 510,
    camera: '📹 Smooth Crane Pan',
    lighting: '💡 Soft Studio Key Light',
    duration: '15s',
    isFavorite: false,
    isTrending: false,
    isCommunity: true
  }
]

const CATEGORIES = ['All Categories', '☕ Commercial Ads', '🌸 Anime & SciFi', '🏝 Travel & Vlog', '🏋️ Fitness & Gym', '🎮 Gaming & Tech']

export default function PromptLibraryPage() {
  const navigate = useNavigate()
  const [prompts, setPrompts] = useState(MOCK_PROMPTS)
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'trending' | 'favorites' | 'community'
  const [activeCategory, setActiveCategory] = useState('All Categories')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPrompt, setSelectedPrompt] = useState(null)

  // Toggle favorite
  const handleToggleFavorite = (id) => {
    setPrompts(prompts.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    toast.success('Favorite status updated!')
  }

  // Copy prompt text
  const handleCopyPrompt = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Prompt copied to clipboard!')
  }

  // Use prompt in studio
  const handleUsePrompt = (promptObj) => {
    localStorage.setItem('reelify_ai_suggested_prompt', promptObj.prompt)
    localStorage.setItem('reelify_ai_suggested_style', promptObj.style)
    toast.success('Loaded prompt into Creative Studio!')
    navigate('/app/studio')
  }

  // Filter Prompts Logic
  const filteredPrompts = prompts.filter((p) => {
    if (activeTab === 'trending' && !p.isTrending) return false
    if (activeTab === 'favorites' && !p.isFavorite) return false
    if (activeTab === 'community' && !p.isCommunity) return false
    if (activeCategory !== 'All Categories' && p.category !== activeCategory) return false

    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.style.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 selection:bg-brand selection:text-white">
      
      {/* ─── 1. PAGE HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>✨ Prompt Library</span>
            <span className="text-xs font-black text-brand-light bg-brand/10 border border-brand/30 px-3 py-1 rounded-full">
              {filteredPrompts.length} Prompts
            </span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
            Browse, search, favorite, and load high-converting 8K AI video prompts directly into Creative Studio.
          </p>
        </div>
      </div>

      {/* ─── 2. TAB CONTROLS & SEARCH BAR ─── */}
      <div className="card-glass p-5 border-white/[0.08] rounded-3xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-xl">
        
        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Prompts' },
            { id: 'trending', label: '🔥 Trending' },
            { id: 'favorites', label: '🌟 Favorites' },
            { id: 'community', label: '🌐 Community' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-brand text-white shadow-glow'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Dropdown & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand font-medium w-full sm:w-auto"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ─── 3. PROMPT CARDS GRID ─── */}
      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPrompt(p)}
              className="card-glass border-white/[0.06] hover:border-brand/40 rounded-3xl p-5 space-y-4 transition-all duration-300 group hover:-translate-y-1 shadow-xl flex flex-col justify-between cursor-pointer relative"
            >
              <div className="space-y-3">
                {/* Category Badges & Favorite Button */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-brand-light bg-brand/20 border border-brand/40 px-2.5 py-0.5 rounded-full">
                    {p.category}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleToggleFavorite(p.id); }}
                    className={`text-base transition-transform hover:scale-125 ${p.isFavorite ? 'text-rose-500' : 'text-slate-500'}`}
                    title="Favorite Prompt"
                  >
                    {p.isFavorite ? '❤️' : '🤍'}
                  </button>
                </div>

                {/* Title & Prompt Text Snippet */}
                <div className="space-y-1.5">
                  <h3 className="text-sm font-black text-white group-hover:text-brand-light transition-colors">
                    {p.title}
                  </h3>
                  <div className="bg-black/50 p-3 rounded-2xl border border-white/[0.06] text-xs text-slate-300 font-mono leading-relaxed italic line-clamp-3">
                    "{p.prompt}"
                  </div>
                </div>

                {/* Camera & Lighting Tags */}
                <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-400">
                  <span className="bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-md">{p.camera}</span>
                  <span className="bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-md">{p.lighting}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleUsePrompt(p); }}
                  className="btn-primary flex-1 text-xs font-black py-2.5 rounded-xl shadow-glow"
                >
                  ✨ Use Prompt
                </button>

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleCopyPrompt(p.prompt); }}
                  className="bg-white/[0.04] hover:bg-white/10 text-slate-300 text-xs font-bold py-2.5 px-3 rounded-xl border border-white/10 transition-all"
                  title="Copy Prompt"
                >
                  📋 Copy
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="card-glass p-12 text-center border-dashed border-white/15 rounded-3xl flex flex-col items-center justify-center gap-3">
          <span className="text-3xl">✨</span>
          <p className="text-sm font-black text-white">No matching prompts found</p>
          <p className="text-xs text-slate-400">Try clearing search filters or selecting another category.</p>
        </div>
      )}

      {/* PROMPT PREVIEW MODAL */}
      {selectedPrompt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in">
          <div className="card-glass border-brand/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-glow-strong relative">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="text-xs font-black text-brand-light bg-brand/20 border border-brand/40 px-2.5 py-0.5 rounded-md">
                {selectedPrompt.category}
              </span>
              <button
                onClick={() => setSelectedPrompt(null)}
                className="text-slate-400 hover:text-white text-sm font-bold w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <h3 className="text-base font-black text-white">{selectedPrompt.title}</h3>

            <div className="bg-black/60 p-4 rounded-2xl border border-white/10 text-xs text-slate-200 font-mono leading-relaxed italic">
              "{selectedPrompt.prompt}"
            </div>

            <div className="grid grid-cols-2 gap-3 bg-white/[0.02] border border-white/[0.06] p-3 rounded-2xl text-xs">
              <div>
                <span className="text-[9px] font-black text-slate-500 uppercase block">Camera Angle</span>
                <span className="text-white font-extrabold">{selectedPrompt.camera}</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-500 uppercase block">Lighting Setup</span>
                <span className="text-white font-extrabold">{selectedPrompt.lighting}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleUsePrompt(selectedPrompt)}
                className="btn-primary flex-1 text-xs font-black py-3.5 rounded-2xl shadow-glow"
              >
                ✨ Use Prompt in Studio
              </button>
              <button
                onClick={() => handleCopyPrompt(selectedPrompt.prompt)}
                className="bg-white/[0.04] hover:bg-white/10 text-white text-xs font-black px-5 py-3.5 rounded-2xl border border-white/10"
              >
                📋 Copy Text
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
