import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const SANDBOX_PRESETS = [
  {
    id: 'coffee',
    title: 'Luxury Coffee Commercial',
    category: 'Commercial',
    duration: '15s',
    difficulty: '⭐ 4.9 (Pro)',
    style: 'Cinematic 35mm',
    voice: 'Aria Female (Neural)',
    resolution: '1080x1920 HD',
    platform: 'Instagram Reels (9:16)',
    prompt: 'A cinematic luxury coffee advertisement for Instagram Reels with slow-motion pouring shots, warm golden hour lighting and elegant typography.',
    icon: '☕',
  },
  {
    id: 'cyberpunk',
    title: 'Cyberpunk Tech Gadget',
    category: 'Tech',
    duration: '15s',
    difficulty: '⭐ 5.0 (Trending)',
    style: 'Cyberpunk Neon',
    voice: 'Guy Male (Neural)',
    resolution: '1080x1920 HD',
    platform: 'TikTok (9:16)',
    prompt: 'Futuristic sci-fi gadget reveal with neon glows, holographic UI overlays, chromatic aberration, and dramatic electronic bass score.',
    icon: '⚡',
  },
  {
    id: 'fitness',
    title: 'Fitness Gym Motivation',
    category: 'Fitness',
    duration: '15s',
    difficulty: '⭐ 4.8 (Popular)',
    style: 'Dynamic High-Energy',
    voice: 'Guy Male (Aggressive)',
    resolution: '1080x1920 HD',
    platform: 'YouTube Shorts (9:16)',
    prompt: 'High-intensity athletic workout reel with fast cuts, aggressive amber rim lighting, sweat textures, and motivational narration.',
    icon: '🏋️',
  },
  {
    id: 'travel',
    title: 'Travel Vlog Japan',
    category: 'Travel',
    duration: '15s',
    difficulty: '⭐ 4.9 (Viral)',
    style: 'Vibrant Anime',
    voice: 'Jenny Female (Soft)',
    resolution: '1080x1920 HD',
    platform: 'Instagram Reels (9:16)',
    prompt: 'Serene sunset over Kyoto temples with cherry blossom petals drifting, warm ambient acoustic music, and golden hour reflections.',
    icon: '⛩️',
  },
  {
    id: 'food',
    title: 'Gourmet Master Chef',
    category: 'Food',
    duration: '15s',
    difficulty: '⭐ 4.7 (Top Pick)',
    style: 'Editorial Warm',
    voice: 'Aria Female (Soft)',
    resolution: '1080x1920 HD',
    platform: 'Instagram Reels (9:16)',
    prompt: 'Slow motion chef plating artisanal sushi dish with micro-sprouts, dramatic spot lighting, macro close-up lens, and soft acoustic score.',
    icon: '🍣',
  },
  {
    id: 'car',
    title: 'Supercar Acceleration',
    category: 'Automotive',
    duration: '15s',
    difficulty: '⭐ 4.9 (Featured)',
    style: 'Dramatic Dark',
    voice: 'Guy Male (Deep)',
    resolution: '1080x1920 HD',
    platform: 'TikTok (9:16)',
    prompt: 'Matte black supercar accelerating through rainy city streets at night with wet reflections, motion blur, and roaring engine soundtrack.',
    icon: '🏎️',
  },
]

const PIPELINE_DEMO_STEPS = [
  { id: 'analysis', label: '1. Prompt Selected', icon: '✍️' },
  { id: 'planning', label: '2. Scene Planning', icon: '📋' },
  { id: 'storyboard', label: '3. Storyboard', icon: '🎞️' },
  { id: 'voice', label: '4. Voice Synthesis', icon: '🗣️' },
  { id: 'mixing', label: '5. Audio Score', icon: '🎵' },
  { id: 'rendering', label: '6. Video Rendering', icon: '⚙️' },
  { id: 'export', label: '7. Export Package', icon: '📦' },
]

export default function SandboxWorkspace({
  form,
  setForm,
  phase,
  progress,
  doneSteps,
  activeStep,
  result,
  guestDemoCount,
  slideshowImages,
  currentSlideIndex,
  compiledVideoUrl,
  generate,
  handleCompileVideo,
  isCompiling,
}) {
  const navigate = useNavigate()
  const [selectedPresetId, setSelectedPresetId] = useState(SANDBOX_PRESETS[0].id)

  const activePreset = SANDBOX_PRESETS.find((p) => p.id === selectedPresetId) || SANDBOX_PRESETS[0]

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id)
    setForm((prev) => ({
      ...prev,
      prompt: preset.prompt,
      style: preset.style,
    }))
    toast.success(`Loaded "${preset.title}" preset!`)
  }

  const remainingDemos = Math.max(0, 1 - guestDemoCount)

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">

      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-500/15 via-brand/15 to-purple-600/15 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-extrabold text-lg shadow-inner flex-shrink-0">
            🧪
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white uppercase tracking-wider">Reelify Sandbox Mode</span>
              <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                {remainingDemos} / 1 Free Demo Remaining
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Explore Reelify before creating an account. Full AI Creative Director & unlimited exports unlock after signing in.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/login?tab=signup')}
          className="btn-primary text-xs font-black px-6 py-2.5 rounded-xl shadow-glow whitespace-nowrap"
        >
          ✨ Create Free Account ➔
        </button>
      </div>

      {/* Main 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ─── LEFT PANEL: PRESETS & DEMO CONTROLS ─── */}
        <div className="lg:col-span-7 space-y-6">

          {/* Preset Cards Grid */}
          <div className="card-glass p-6 border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>🎨 Select Demo Preset</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose a curated preset card to prefill prompt, camera, and lighting parameters.
                </p>
              </div>
              <span className="text-[10px] font-black text-brand-light bg-brand/10 border border-brand/30 px-3 py-1 rounded-full">
                6 Presets
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {SANDBOX_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    disabled={phase === 'generating'}
                    className={`relative p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between gap-3 group overflow-hidden ${isSelected
                        ? 'bg-gradient-to-br from-brand/30 via-purple-900/40 to-brand-glow/20 border-brand text-white shadow-glow scale-[1.02]'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.05] hover:border-brand/30 hover:-translate-y-0.5'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-lg shadow-inner">
                        {preset.icon}
                      </div>
                      <span className="text-[9px] font-black text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                        {preset.difficulty}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-black text-white group-hover:text-brand-light transition-colors mb-0.5">
                        {preset.title}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Category: <strong className="text-slate-200">{preset.category}</strong></span>
                        <span className="text-brand-light font-bold">{preset.duration}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Simplified Prompt Editor */}
          <div className="card-glass p-6 border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <label className="section-label mb-0">Prompt Editor</label>
              <span className="text-[10px] text-slate-400 font-bold">{form.prompt.length} / 500 chars</span>
            </div>

            <textarea
              name="prompt"
              value={form.prompt}
              onChange={(e) => setForm({ ...form, prompt: e.target.value })}
              rows={4}
              disabled={phase === 'generating'}
              className="input-field resize-none text-xs font-medium leading-relaxed"
              placeholder="Describe your video prompt..."
            />

            {/* GENERATE ACTION BUTTON */}
            <div className="space-y-2 pt-2">
              <button
                onClick={generate}
                disabled={phase === 'generating' || remainingDemos <= 0}
                className="btn-primary w-full py-4 text-xs font-black rounded-2xl shadow-glow hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {phase === 'generating' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating Pipeline ({progress}%)...</span>
                  </>
                ) : (
                  '⚡ Generate AI Demo'
                )}
              </button>

              {/* Free Credits Counter Badge */}
              <div className="text-center">
                <span className="text-[11px] font-extrabold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full inline-block">
                  🧪 {remainingDemos} / 1 Free Demo Video Remaining
                </span>
              </div>
            </div>
          </div>

          {/* PREMIUM UPGRADE CARD (Replaces old bottom bar) */}
          <div className="card-glass p-6 border-brand/40 bg-gradient-to-br from-brand/20 via-purple-950/30 to-surface-0 rounded-3xl space-y-5 shadow-glow-strong relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-brand-light bg-brand/20 border border-brand/40 px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Reelify Pro Platform
                </span>
                <h3 className="text-lg font-black text-white mt-1">Unlock Reelify Creative Studio</h3>
              </div>
              <span className="text-2xl">✨</span>
            </div>

            {/* Benefits Checklist Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              {[
                'Unlimited AI Videos',
                'AI Creative Director',
                'Prompt Optimizer',
                'Storyboard Editor',
                'HD 1080p Export',
                'Project History'
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-slate-200 font-bold">
                  <span className="text-emerald-400 font-black">✓</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/login?tab=signup')}
              className="btn-primary w-full py-3.5 text-xs font-black rounded-xl shadow-glow hover:scale-[1.01] transition-all"
            >
              Create Free Account ➔
            </button>
          </div>

        </div>

        {/* ─── RIGHT PANEL: LIVE PREVIEW & PIPELINE ─── */}
        <div className="lg:col-span-5 space-y-6">

          {/* Live Preview Container */}
          <div className="card-glass p-5 border-white/[0.08] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="section-label mb-0">Live Demo Monitor</label>
              <span className="text-[10px] font-black text-brand-light bg-brand/10 border border-brand/30 px-2.5 py-0.5 rounded-full">
                9:16 Reel Player
              </span>
            </div>

            <div className="aspect-[9/16] max-h-[460px] w-full rounded-2xl overflow-hidden bg-black/60 border border-white/[0.06] relative flex items-center justify-center shadow-inner">

              {/* State 1: No Preview Yet */}
              {phase === 'idle' && (
                <div className="text-center p-8 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-400 text-2xl shadow-inner">
                    🎬
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">No Preview Yet</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
                      Choose a preset to preview your AI video, then click "⚡ Generate AI Demo".
                    </p>
                  </div>
                </div>
              )}

              {/* State 2: Generating Pipeline */}
              {phase === 'generating' && (
                <div className="w-full h-full p-6 flex flex-col justify-between z-10 bg-black/85 backdrop-blur-md overflow-y-auto">
                  <div className="flex flex-col gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                        Generating Reel...
                      </span>
                      <span className="text-xs font-black text-brand-light bg-brand/20 px-2 py-0.5 rounded-full border border-brand/40">
                        {progress}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
                      <div className="h-full bg-gradient-to-r from-brand to-brand-glow transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="text-center p-4">
                    <span className="text-slate-300 text-xs font-bold animate-pulse">
                      Synthesizing multi-scene visuals & Edge-TTS voice...
                    </span>
                  </div>
                </div>
              )}

              {/* State 3: Done Playback */}
              {phase === 'done' && (
                <div className="w-full h-full relative">
                  {/* Sandbox Watermark Overlay */}
                  <div className="absolute top-4 right-4 z-30 pointer-events-none bg-black/80 backdrop-blur-md border border-amber-500/40 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-2xl">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-[9px] font-black text-amber-300 uppercase tracking-widest">
                      REELIFY SANDBOX DEMO
                    </span>
                  </div>

                  {compiledVideoUrl ? (
                    <video src={compiledVideoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full relative bg-black flex items-center justify-center overflow-hidden">
                      {slideshowImages.map((url, idx) => (
                        <div
                          key={url + idx}
                          className={`absolute inset-0 transition-opacity duration-1000 ${currentSlideIndex === idx ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                          <img src={url} alt={`slide-${idx}`} className="w-full h-full object-cover transform scale-105 animate-pulse" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* DYNAMIC METADATA CARD */}
            <div className="bg-white/[0.02] border border-white/[0.06] p-4 rounded-2xl space-y-2 text-xs">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                📊 Preset Technical Metadata
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration:</span>
                  <span className="font-bold text-white">{activePreset.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Style:</span>
                  <span className="font-bold text-brand-light truncate max-w-[100px]">{activePreset.style}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Voice:</span>
                  <span className="font-bold text-slate-200 truncate max-w-[100px]">{activePreset.voice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Resolution:</span>
                  <span className="font-bold text-slate-200">{activePreset.resolution}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-white/[0.04] flex justify-between text-[10px] text-slate-400">
                <span>Platform Preset:</span>
                <span className="font-bold text-amber-300">{activePreset.platform}</span>
              </div>
            </div>
          </div>

          {/* AI PROCESSING PIPELINE */}
          <div className="card-glass p-5 border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <label className="section-label mb-0">⚡ AI Processing Pipeline</label>
              <span className="text-[10px] font-bold text-slate-400">7 Modules</span>
            </div>

            <div className="space-y-1.5">
              {PIPELINE_DEMO_STEPS.map((step) => {
                const isDone = doneSteps.includes(step.id) || phase === 'done'
                const isActive = activeStep === step.id

                return (
                  <div
                    key={step.id}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-xl border text-xs transition-all duration-200 ${isDone
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : isActive
                          ? 'bg-brand/20 border-brand text-white shadow-glow'
                          : 'bg-white/[0.02] border-white/[0.04] text-slate-500'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{step.icon}</span>
                      <span className="font-bold">{step.label}</span>
                    </div>

                    {isDone ? (
                      <span className="text-emerald-400 font-black text-xs">✓ Done</span>
                    ) : isActive ? (
                      <span className="text-brand-light font-extrabold text-[10px] animate-pulse">Processing...</span>
                    ) : (
                      <span className="text-[10px] text-slate-600 font-medium">Pending</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* SUCCESS DEMO COMPLETED CARD */}
          {phase === 'done' && (
            <div className="card-glass p-6 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-surface-1 to-brand/10 rounded-3xl space-y-4 shadow-glow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-xl flex items-center justify-center shadow-inner">
                  🎉
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Demo Completed!</h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Your demo video reel has been generated with watermarked preview.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/10 text-xs text-slate-300">
                Unlock 1080p clean exports, custom uploads, AI Scriptwriter, and multi-scene storyboard editing by creating a free account.
              </div>

              <button
                onClick={() => navigate('/login?tab=signup')}
                className="btn-primary w-full py-3 text-xs font-black rounded-xl shadow-glow hover:scale-[1.01] transition-all"
              >
                Create Free Account for Unlimited Access ➔
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
