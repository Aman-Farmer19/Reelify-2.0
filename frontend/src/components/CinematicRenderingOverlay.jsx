import React, { useState, useEffect } from 'react'

const PIPELINE_STAGES = [
  { id: 1, label: 'Generating Script', icon: '📝', minProgress: 0, maxProgress: 15 },
  { id: 2, label: 'Planning Storyboard', icon: '🎨', minProgress: 15, maxProgress: 30 },
  { id: 3, label: 'Generating Voice', icon: '🎙️', minProgress: 30, maxProgress: 50 },
  { id: 4, label: 'Creating Scenes', icon: '🖼️', minProgress: 50, maxProgress: 70 },
  { id: 5, label: 'Rendering Video', icon: '🎬', minProgress: 70, maxProgress: 90 },
  { id: 6, label: 'Optimizing Export', icon: '✨', minProgress: 90, maxProgress: 100 },
]

const AI_TIPS = [
  '💡 Specific camera movement keywords like "slow dolly push" produce 40% smoother transitions.',
  '💡 Adding golden hour or rim lighting keywords creates premium cinematic contrast.',
  '💡 9:16 vertical videos perform 3x better on Instagram Reels, YouTube Shorts, and TikTok.',
  '💡 Edge-TTS neural voices automatically adapt tone and cadence to your prompt style.',
  '💡 You can re-render your video anytime with updated voiceover or music tracks.',
]

export default function CinematicRenderingOverlay({ progress, onCancel }) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  // Rotate AI tips every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % AI_TIPS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const secondsRemaining = Math.max(1, Math.ceil((100 - progress) / 7))

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-white select-none animate-fade-in">
      
      {/* Ambient Runway ML Style Radial Purple Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Cinematic Glass Overlay Card */}
      <div className="card-glass border-brand/40 rounded-3xl p-8 sm:p-10 max-w-xl w-full space-y-7 shadow-glow-strong relative z-10 overflow-hidden text-center">
        
        {/* Large Animated Center Illustration */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-brand via-purple-600 to-brand-glow blur-xl opacity-60 animate-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-black/80 border border-brand/50 flex items-center justify-center text-3xl shadow-glow">
            <span className="animate-spin text-brand-light">⚙️</span>
          </div>
        </div>

        {/* Header & Status */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-brand/20 border border-brand/40 px-3.5 py-1 rounded-full text-xs font-black text-brand-light uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
            <span>Runway AI Render Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Rendering AI Video...
          </h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            Synthesizing script, neural voiceover, visual storyboard, and 9:16 HD MP4 export.
          </p>
        </div>

        {/* Progress Bar & Countdown */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-black text-slate-300">
            <span>Overall Progress</span>
            <span className="text-brand-light text-sm font-black">{progress}%</span>
          </div>

          <div className="w-full h-3.5 bg-black/70 rounded-full overflow-hidden border border-white/15 p-0.5 relative shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand via-purple-500 to-emerald-400 progress-shimmer transition-all duration-300 shadow-glow"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400">
            <span>Executing 11 Neural Modules</span>
            <span className="text-emerald-400">⏱️ ~{secondsRemaining}s remaining</span>
          </div>
        </div>

        {/* 6 Pipeline Stages */}
        <div className="space-y-2 text-left pt-2 border-t border-white/[0.08]">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
            Pipeline Execution Stages
          </span>

          <div className="grid grid-cols-2 gap-2">
            {PIPELINE_STAGES.map((stage) => {
              const isCompleted = progress >= stage.maxProgress
              const isActive = progress >= stage.minProgress && progress < stage.maxProgress

              return (
                <div
                  key={stage.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-bold'
                      : isActive
                      ? 'bg-brand/25 border-brand text-white shadow-glow font-black scale-[1.02]'
                      : 'bg-white/[0.02] border-white/[0.04] text-slate-500 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>{stage.icon}</span>
                    <span className="truncate">{stage.label}</span>
                  </div>

                  {isCompleted ? (
                    <span className="text-emerald-400 font-black text-[10px]">✓</span>
                  ) : isActive ? (
                    <span className="w-2.5 h-2.5 border-2 border-brand-light border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>

        {/* Rotating AI Tips Box (Updates every 5 seconds) */}
        <div className="bg-white/[0.03] border border-white/[0.08] p-3.5 rounded-2xl text-xs text-slate-300 font-medium leading-relaxed animate-fade-in min-h-[50px] flex items-center justify-center">
          <p className="transition-all duration-300">{AI_TIPS[currentTipIndex]}</p>
        </div>

        {/* Cancel Button */}
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-white/[0.04] hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-slate-300 hover:text-red-300 text-xs font-black py-3.5 rounded-2xl transition-all duration-300"
          >
            ✕ Cancel Generation
          </button>
        </div>

      </div>
    </div>
  )
}
