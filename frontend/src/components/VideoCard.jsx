import React from 'react'

const EMOJIS = ['🚀', '🎬', '💡', '🌿', '⚡', '🎯', '🔥', '🌟']
const GRADIENTS = [
  'from-purple-900/50 to-indigo-900/50',
  'from-blue-900/50 to-cyan-900/50',
  'from-green-900/50 to-teal-900/50',
  'from-rose-900/50 to-pink-900/50',
]

export default function VideoCard({ video, index = 0 }) {
  const emoji = EMOJIS[index % EMOJIS.length]
  const gradient = GRADIENTS[index % GRADIENTS.length]

  return (
    <div className="card overflow-hidden cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:border-brand/50">
      {/* Thumbnail */}
      <div className={`h-36 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
        <span className="text-4xl">{emoji}</span>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-white text-lg">
            ▶
          </div>
        </div>
        <span className="absolute top-2 right-2 bg-green-500/20 border border-green-500/50 text-green-400 text-[10px] px-2 py-0.5 rounded-full">
          Done
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-semibold text-white mb-1 truncate">
          {video?.title || 'AI Generated Reel'}
        </p>
        <p className="text-xs text-slate-500">
          {video?.duration || '60s'} • {video?.format || '9:16'} • {video?.views || '0'} views
        </p>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {(video?.tags || ['AI', 'Generated']).map((t) => (
            <span
              key={t}
              className="text-[10px] px-2 py-0.5 rounded-full bg-brand/20 border border-brand/40 text-brand-light"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
