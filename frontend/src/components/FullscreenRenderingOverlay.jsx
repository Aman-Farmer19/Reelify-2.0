import React from 'react'

const RENDERING_STAGES = [
  { id: 1, label: 'Generating Script', icon: '📝', minProgress: 0, maxProgress: 20 },
  { id: 2, label: 'Creating Storyboard', icon: '🎨', minProgress: 20, maxProgress: 40 },
  { id: 3, label: 'Generating Voice', icon: '🎙️', minProgress: 40, maxProgress: 60 },
  { id: 4, label: 'Rendering Video', icon: '🎬', minProgress: 60, maxProgress: 85 },
  { id: 5, label: 'Finalizing', icon: '✨', minProgress: 85, maxProgress: 100 },
]

export default function FullscreenRenderingOverlay({ progress, onCancel }) {
  const secondsRemaining = Math.max(1, Math.ceil((100 - progress) / 8))

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-white select-none animate-fade-in">
      
      {/* Ambient Radial Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Dark Glass Rendering Container */}
      <div className="card-glass border-brand/40 rounded-3xl p-8 sm:p-10 max-w-xl w-full space-y-8 shadow-glow-strong relative z-10 overflow-hidden text-center">
        
        {/* Top Spinning AI Icon & Header */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand to-brand-glow border border-brand/50 flex items-center justify-center text-3xl shadow-glow mx-auto animate-bounce">
            ⚡
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Rendering AI Video...
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Reelify's neural engine is synthesizing your script, voiceover, storyboard clips and final MP4 render.
            </p>
          </div>
        </div>

        {/* Animated Progress Bar & Percentage */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
              <span>AI Processing Pipeline</span>
            </span>
            <span className="text-brand-light font-black text-sm">{progress}%</span>
          </div>

          {/* Glowing Shimmer Progress Track */}
          <div className="w-full h-3 bg-black/70 rounded-full overflow-hidden border border-white/10 p-0.5 relative shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand via-purple-500 to-emerald-400 progress-shimmer transition-all duration-300 shadow-glow"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Time Remaining Indicator */}
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 pt-1">
            <span>Executing 11 AI Neural Modules</span>
            <span className="text-emerald-400 font-extrabold flex items-center gap-1">
              ⏱️ ~{secondsRemaining}s remaining
            </span>
          </div>
        </div>

        {/* 5 Pipeline Stages Checklist */}
        <div className="space-y-2 text-left pt-2 border-t border-white/[0.08]">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
            Pipeline Stages
          </span>

          {RENDERING_STAGES.map((stage) => {
            const isCompleted = progress >= stage.maxProgress
            const isActive = progress >= stage.minProgress && progress < stage.maxProgress

            return (
              <div
                key={stage.id}
                className={`flex items-center justify-between px-4 py-2.5 rounded-2xl border text-xs transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-bold'
                    : isActive
                    ? 'bg-brand/20 border-brand text-white shadow-glow scale-[1.02] font-black'
                    : 'bg-white/[0.02] border-white/[0.04] text-slate-500 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{stage.icon}</span>
                  <span>{stage.label}</span>
                </div>

                <div>
                  {isCompleted ? (
                    <span className="text-emerald-400 font-black text-xs flex items-center gap-1">
                      ✓ Done
                    </span>
                  ) : isActive ? (
                    <div className="flex items-center gap-1.5 text-brand-light font-extrabold text-xs">
                      <span className="w-3 h-3 border-2 border-brand-light border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-600 font-bold">Pending</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Cancel Generation Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-white/[0.04] hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-slate-300 hover:text-red-300 text-xs font-extrabold py-3.5 rounded-2xl transition-all duration-300"
          >
            ✕ Cancel Generation
          </button>
        </div>

      </div>
    </div>
  )
}
