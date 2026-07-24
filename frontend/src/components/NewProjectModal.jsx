import React from 'react'
import { useNavigate } from 'react-router-dom'

const PROJECT_MODES = [
  {
    id: 'prompt',
    title: 'AI Prompt',
    icon: '✨',
    description: 'Generate a complete video from a natural language prompt idea.',
    action: '/app/studio',
    badge: 'Popular'
  },
  {
    id: 'template',
    title: 'Template',
    icon: '🎬',
    description: 'Choose from pre-built high-converting commercial & reel presets.',
    action: '/app/templates',
    badge: 'Fastest'
  },
  {
    id: 'image-to-video',
    title: 'Image to Video',
    icon: '🖼️',
    description: 'Animate static photos and Canva graphics into dynamic motion clips.',
    action: '/app/studio',
    badge: 'New'
  },
  {
    id: 'video-to-video',
    title: 'Video to Video',
    icon: '🎥',
    description: 'Stylize existing raw footage with AI camera movements and filters.',
    action: '/app/studio',
    badge: 'AI FX'
  },
  {
    id: 'import-script',
    title: 'Import Script',
    icon: '📄',
    description: 'Paste a voiceover narration script to auto-plan multi-scene storyboards.',
    action: '/app/studio',
    badge: 'Scriptwriter'
  }
]

export default function NewProjectModal({ onClose }) {
  const navigate = useNavigate()

  const handleSelectMode = (mode) => {
    onClose()
    if (mode.id === 'template') {
      navigate('/app/templates')
    } else {
      navigate('/app/studio', { state: { projectCreationMode: mode.id } })
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Main Glass Modal Card */}
      <div className="w-full max-w-3xl card-glass border-brand/30 rounded-3xl p-6 sm:p-8 md:p-10 space-y-6 shadow-2xl relative shadow-glow-strong my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-all"
          title="Close modal"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/30 px-3 py-1 rounded-full text-xs font-black text-brand-light mb-1">
            <span>🚀 Create New AI Project</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            How would you like to start?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Select a project creation mode to launch Reelify's AI workflow.
          </p>
        </div>

        {/* 5 Project Modes Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {PROJECT_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleSelectMode(mode)}
              className="group bg-white/[0.02] hover:bg-gradient-to-br hover:from-brand/25 hover:via-purple-900/30 hover:to-brand-glow/20 border border-white/[0.08] hover:border-brand/40 p-5 rounded-2xl text-left transition-all duration-300 flex flex-col justify-between gap-4 shadow-lg hover:-translate-y-1.5 active:scale-95 cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                  {mode.icon}
                </div>
                <span className="text-[9px] font-black text-brand-light bg-brand/20 border border-brand/40 px-2.5 py-0.5 rounded-full">
                  {mode.badge}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-black text-white group-hover:text-brand-light transition-colors">
                  {mode.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {mode.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-slate-500 font-extrabold group-hover:text-white transition-colors">
                <span>Start Project</span>
                <span className="group-hover:translate-x-1 transition-transform">➔</span>
              </div>
            </button>
          ))}
        </div>

        {/* Modal Footer Tip */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
          <span>💡 You can change project parameters anytime inside Creative Studio</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-semibold underline text-xs"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  )
}
