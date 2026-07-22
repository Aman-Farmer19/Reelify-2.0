import React, { useRef, useState } from 'react'

export default function VideoCard({ video, index = 0, onDelete }) {
  const videoRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const handleMouseEnter = () => {
    setHovered(true)
    if (videoRef.current && video?.download_url && video.download_url !== '#') {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    setHovered(false)
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  // Pre-configured cover gradient fallbacks
  const gradients = [
    'from-purple-600/30 to-indigo-900/50',
    'from-blue-600/30 to-cyan-900/50',
    'from-pink-600/30 to-rose-900/50',
    'from-emerald-600/30 to-teal-900/50',
  ]
  const gradient = gradients[index % gradients.length]

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="card-glass overflow-hidden cursor-pointer group hover:-translate-y-1.5 transition-all duration-300 border-white/[0.05] hover:border-brand/40 shadow-xl"
    >
      {/* Thumbnail / Video Preview Area */}
      <div className={`h-40 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
        
        {/* Playable Video Preview */}
        {video?.download_url && video.download_url !== '#' ? (
          <video
            ref={videoRef}
            src={video.download_url}
            muted
            playsInline
            loop
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : null}

        {/* Static Cover Placeholder */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          hovered && video?.download_url && video.download_url !== '#' ? 'opacity-0' : 'opacity-100'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
            <svg className="w-5 h-5 text-brand-light" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Video status pill & Delete button */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {onDelete && video?.id && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(video.id)
              }}
              title="Delete Video"
              className="bg-black/60 hover:bg-rose-500/80 text-white p-1.5 rounded-lg border border-white/10 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          <span className="bg-brand/10 backdrop-blur-md border border-brand/35 text-brand-light text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {video?.duration || '15s'}
          </span>
        </div>
      </div>

      {/* Info Panel */}
      <div className="p-4 bg-surface-1/40">
        <p className="text-sm font-extrabold text-white mb-1 truncate group-hover:text-brand-light transition-colors duration-300">
          {video?.title || 'Untitled Generation'}
        </p>
        
        <p className="text-[10px] text-slate-500 font-semibold mb-3 flex items-center gap-1.5">
          <span>{video?.format || '9:16'}</span>
          <span>•</span>
          <span>{video?.style || 'Cinematic'}</span>
          <span>•</span>
          <span>{video?.views || '0'} views</span>
        </p>

        <div className="flex gap-1.5 flex-wrap">
          {(video?.tags || ['AI', 'Reel']).map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-slate-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
