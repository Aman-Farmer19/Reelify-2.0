import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const MARKETPLACE_TEMPLATES = [
  {
    id: 'tmpl-1',
    title: 'Luxury Espresso Commercial',
    category: 'Ads',
    style: 'Luxury Gold',
    duration: '15s',
    uses: '3.4K',
    rating: '4.9',
    aspect: '9:16',
    icon: '☕',
    tags: ['Commercial', 'Luxury', 'Coffee'],
    thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    prompt: 'A cinematic 8k luxury coffee advertisement with slow-motion pouring shots, warm golden hour lighting, and volumetric steam.',
    shots: ['Scene 1: Close-up pouring', 'Scene 2: Steam volumetric rim light', 'Scene 3: Logo reveal']
  },
  {
    id: 'tmpl-2',
    title: 'Tropical Island Drone Travel Reel',
    category: 'Travel',
    style: 'Cinematic 8K',
    duration: '30s',
    uses: '5.2K',
    rating: '5.0',
    aspect: '9:16',
    icon: '🏝️',
    tags: ['Travel', 'Vlog', 'Ocean'],
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    prompt: 'Serene aerial drone vlog of turquoise ocean waves gently crashing onto tropical island beaches at sunset.',
    shots: ['Scene 1: Drone overhead island', 'Scene 2: Beach sunset waves', 'Scene 3: Palm trees flare']
  },
  {
    id: 'tmpl-3',
    title: 'Gourmet Master Chef Plating',
    category: 'Food',
    style: 'Warm Editorial',
    duration: '15s',
    uses: '2.1K',
    rating: '4.8',
    aspect: '9:16',
    icon: '🍣',
    tags: ['Food', 'Cooking', 'Editorial'],
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    prompt: 'Slow motion macro shot of master chef placing micro-sprouts on high-end salmon dish with dramatic spot lighting.',
    shots: ['Scene 1: Slicing fresh salmon', 'Scene 2: Micro-sprouts placement', 'Scene 3: Finished dish reveal']
  },
  {
    id: 'tmpl-4',
    title: 'High-Intensity Gym Motivation',
    category: 'Fitness',
    style: 'Dynamic High-Cut',
    duration: '15s',
    uses: '4.1K',
    rating: '4.9',
    aspect: '9:16',
    icon: '🏋️',
    tags: ['Fitness', 'Gym', 'Motivation'],
    thumbnail: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    prompt: 'High-intensity athletic workout reel with fast cuts, chalk dust flying in dramatic rim lighting, motivational voiceover.',
    shots: ['Scene 1: Chalk dust explosion', 'Scene 2: Heavy deadlift pull', 'Scene 3: Workout peak rest']
  },
  {
    id: 'tmpl-5',
    title: 'AI Quantum Tech Showcase',
    category: 'Technology',
    style: 'Cyberpunk Neon',
    duration: '30s',
    uses: '6.8K',
    rating: '5.0',
    aspect: '9:16',
    icon: '💻',
    tags: ['Tech', 'AI', 'Cyberpunk'],
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    prompt: 'Futuristic quantum AI technology reveal with floating glowing neon holographic UI overlays and 8k volumetric haze.',
    shots: ['Scene 1: Floating hologram UI', 'Scene 2: Neural network nodes', 'Scene 3: Quantum core spin']
  },
  {
    id: 'tmpl-6',
    title: 'Esports Gaming Montage Highlight',
    category: 'Gaming',
    style: 'Vibrant High-Energy',
    duration: '15s',
    uses: '3.9K',
    rating: '4.8',
    aspect: '9:16',
    icon: '🎮',
    tags: ['Gaming', 'Esports', 'Montage'],
    thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    prompt: 'Fast-paced gaming montage with glowing neon kill overlays, intense bass audio drops, and dramatic camera pans.',
    shots: ['Scene 1: Neon headshot overlay', 'Scene 2: Victory celebration', 'Scene 3: Logo freeze frame']
  },
  {
    id: 'tmpl-7',
    title: 'SaaS Startup Product Demo',
    category: 'Business',
    style: 'Corporate Crisp',
    duration: '30s',
    uses: '2.8K',
    rating: '4.7',
    aspect: '16:9',
    icon: '💼',
    tags: ['Business', 'SaaS', 'Startup'],
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    prompt: 'Professional SaaS application walkthrough with clean typography, smooth cursor movements, and corporate soundtrack.',
    shots: ['Scene 1: Dashboard overview', 'Scene 2: Feature workflow', 'Scene 3: Pricing CTA']
  },
  {
    id: 'tmpl-8',
    title: 'Sci-Fi Space Movie Trailer',
    category: 'Movie Trailer',
    style: 'Cinematic Anamorphic',
    duration: '45s',
    uses: '8.4K',
    rating: '5.0',
    aspect: '16:9',
    icon: '🎬',
    tags: ['Movie', 'SciFi', 'Trailer'],
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    prompt: 'Epic hollywood sci-fi movie trailer with deep space nebulae, giant rotating space stations, and orchestral horns.',
    shots: ['Scene 1: Deep space nebula', 'Scene 2: Space station orbit', 'Scene 3: Title fade to black']
  },
  {
    id: 'tmpl-9',
    title: 'Interactive Code Bootcamp Explainer',
    category: 'Education',
    style: 'Minimal Clean',
    duration: '30s',
    uses: '1.5K',
    rating: '4.6',
    aspect: '9:16',
    icon: '📚',
    tags: ['Education', 'Coding', 'Tutorial'],
    thumbnail: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    prompt: 'Clean educational video breaking down complex coding concepts with animated syntax highlights and clear narration.',
    shots: ['Scene 1: Question graphic', 'Scene 2: Code execution snippet', 'Scene 3: Key takeaway summary']
  }
]

const CATEGORIES = ['All', 'Ads', 'Travel', 'Food', 'Fitness', 'Education', 'Technology', 'Gaming', 'Business', 'Movie Trailer']

export default function TemplatesPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popularity') // 'popularity' | 'newest' | 'duration'
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  // Use template in Creative Studio
  const handleUseTemplate = (tmpl) => {
    localStorage.setItem('reelify_ai_suggested_prompt', tmpl.prompt)
    localStorage.setItem('reelify_ai_suggested_style', tmpl.style)
    toast.success(`Loaded "${tmpl.title}" into Creative Studio!`)
    navigate('/app/studio')
  }

  // Filter & Search Logic
  const filteredTemplates = MARKETPLACE_TEMPLATES.filter((t) => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  // Sort Logic
  filteredTemplates.sort((a, b) => {
    if (sortBy === 'popularity') return parseFloat(b.uses) - parseFloat(a.uses)
    if (sortBy === 'duration') return parseInt(b.duration) - parseInt(a.duration)
    return 0
  })

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 selection:bg-brand selection:text-white">
      
      {/* ─── 1. MARKETPLACE HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>🎨 Templates Marketplace</span>
            <span className="text-xs font-black text-brand-light bg-brand/10 border border-brand/30 px-3 py-1 rounded-full">
              {filteredTemplates.length} Pro Presets
            </span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
            Discover, preview, and load high-converting video templates across 9 industry categories.
          </p>
        </div>
      </div>

      {/* ─── 2. CATEGORY TABS & SEARCH CONTROL BAR ─── */}
      <div className="card-glass p-5 border-white/[0.08] rounded-3xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-xl">
        
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-brand text-white shadow-glow'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand font-medium w-full sm:w-auto"
          >
            <option value="popularity">Most Popular</option>
            <option value="duration">Duration</option>
          </select>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search templates..."
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

      {/* ─── 3. TEMPLATE CARDS GRID ─── */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((t) => (
            <div
              key={t.id}
              className="card-glass border-white/[0.06] hover:border-brand/40 rounded-3xl p-4 space-y-4 transition-all duration-300 group hover:-translate-y-1 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Video Thumbnail Container */}
                <div className="aspect-video w-full rounded-2xl bg-black border border-white/10 relative overflow-hidden group">
                  <img
                    src={t.thumbnail}
                    alt={t.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setSelectedTemplate(t)}
                      className="bg-white/20 hover:bg-white/40 text-white text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-md transition-all"
                    >
                      ▶ Preview
                    </button>
                  </div>

                  <span className="absolute top-2 left-2 text-[9px] font-black text-brand-light bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/10 uppercase">
                    {t.category}
                  </span>

                  <span className="absolute bottom-2 right-2 text-[9px] font-black text-white bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md">
                    ⏱️ {t.duration} • {t.aspect}
                  </span>
                </div>

                {/* Title & Ratings Header */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white truncate max-w-[200px] group-hover:text-brand-light transition-colors">
                      {t.title}
                    </h3>
                    <span className="text-[10px] font-bold text-amber-400">⭐ {t.rating} ({t.uses})</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    "{t.prompt}"
                  </p>
                </div>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1.5">
                  {t.tags.map((tag) => (
                    <span key={tag} className="text-[9px] font-bold text-slate-400 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setSelectedTemplate(t)}
                  className="bg-white/[0.04] hover:bg-white/10 text-slate-300 text-xs font-bold py-2.5 px-3 rounded-xl border border-white/10 transition-all"
                >
                  ▶ Preview
                </button>

                <button
                  type="button"
                  onClick={() => handleUseTemplate(t)}
                  className="btn-primary flex-1 text-xs font-black py-2.5 rounded-xl shadow-glow"
                >
                  ✨ Use Template
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="card-glass p-12 text-center border-dashed border-white/15 rounded-3xl flex flex-col items-center justify-center gap-3">
          <span className="text-3xl">🎨</span>
          <p className="text-sm font-black text-white">No matching templates found</p>
          <p className="text-xs text-slate-400">Try selecting another category tab or clearing your search term.</p>
        </div>
      )}

      {/* TEMPLATE PREVIEW MODAL */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in">
          <div className="card-glass border-brand/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-glow-strong relative">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-brand-light bg-brand/20 border border-brand/40 px-2.5 py-0.5 rounded-md">
                  {selectedTemplate.category}
                </span>
                <h3 className="text-sm font-black text-white truncate max-w-[240px]">{selectedTemplate.title}</h3>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-slate-400 hover:text-white text-sm font-bold w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video w-full rounded-2xl bg-black border border-white/10 overflow-hidden relative">
              <video src={selectedTemplate.videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
            </div>

            {/* Prompt Recipe & Shots */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Prompt Recipe</label>
              <div className="bg-black/60 p-3 rounded-2xl border border-white/10 text-xs text-slate-200 font-mono italic">
                "{selectedTemplate.prompt}"
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleUseTemplate(selectedTemplate)}
                className="btn-primary flex-1 text-xs font-black py-3.5 rounded-2xl shadow-glow"
              >
                ✨ Use Template in Studio
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
