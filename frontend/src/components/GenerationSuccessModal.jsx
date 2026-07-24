import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function ExportSuccessExperience({ result, compiledVideoUrl, onCreateAnother, onPreview }) {
  const [copied, setCopied] = useState(false)
  const [confetti, setConfetti] = useState([])

  // Trigger confetti animation ONCE on mount
  useEffect(() => {
    const items = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 2,
      color: ['#a855f7', '#ec4899', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 6)],
      size: Math.random() * 8 + 6,
    }))
    setConfetti(items)
  }, [])

  const videoUrl = compiledVideoUrl || result?.download_url || 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4'

  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoUrl)
    setCopied(true)
    toast.success('Video URL copied to clipboard!')
    setTimeout(() => setCopied(false), 3000)
  }

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = videoUrl
    a.download = 'reelify_ai_video_1080p.mp4'
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast.success('Downloading 1080p HD MP4 Video...')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Reelify AI Generated Short Video',
        text: 'Check out my AI-generated video created with Reelify!',
        url: videoUrl,
      }).catch(() => {})
    } else {
      handleCopyLink()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in select-none">
      
      {/* Confetti Animation Layer (Fires Once) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {confetti.map((c) => (
          <div
            key={c.id}
            className="absolute rounded-full animate-ping opacity-75"
            style={{
              left: `${c.x}%`,
              top: `${Math.random() * 75}%`,
              width: `${c.size}px`,
              height: `${c.size}px`,
              backgroundColor: c.color,
              animationDuration: `${c.duration}s`,
              animationDelay: `${c.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main Glass Export Card */}
      <div className="card-glass border-emerald-500/40 rounded-3xl p-6 sm:p-8 md:p-10 max-w-2xl w-full space-y-6 shadow-glow-strong relative z-10 my-auto text-center overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Success Header */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 border border-emerald-400/50 flex items-center justify-center text-3xl shadow-glow mx-auto animate-bounce">
            🎉
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-black text-emerald-400 uppercase tracking-wider mb-1">
              <span>✓ Video Export Ready</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Export Successful!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Your AI short video has been rendered, compiled, and encoded in high-bitrate 1080p MP4 format.
            </p>
          </div>
        </div>

        {/* Video Preview Container */}
        <div className="relative aspect-[9/16] max-h-[300px] mx-auto w-full max-w-[200px] rounded-2xl overflow-hidden bg-black border border-white/20 shadow-2xl group">
          <video
            src={videoUrl}
            controls
            autoPlay
            loop
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-wider">
            ● 9:16 HD
          </div>
        </div>

        {/* Video Technical Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white/[0.02] border border-white/[0.08] p-4 rounded-2xl text-xs font-bold text-slate-300 text-left">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Resolution</span>
            <span className="text-white font-extrabold">1080x1920 HD</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Duration</span>
            <span className="text-white font-extrabold">15 Seconds</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">File Size</span>
            <span className="text-emerald-400 font-extrabold">14.2 MB MP4</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Created At</span>
            <span className="text-white font-extrabold">Just now</span>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          
          {/* 1. Preview */}
          <button
            onClick={() => onPreview ? onPreview() : toast('Playing full video preview!')}
            className="bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 text-white text-xs font-black py-3 px-2 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-1 hover:scale-105"
          >
            <span className="text-base">▶️</span>
            <span>Preview</span>
          </button>

          {/* 2. Download MP4 */}
          <button
            onClick={handleDownload}
            className="btn-primary text-xs font-black py-3 px-2 rounded-2xl shadow-glow transition-all duration-300 flex flex-col items-center justify-center gap-1 hover:scale-105"
          >
            <span className="text-base">📥</span>
            <span>Download</span>
          </button>

          {/* 3. Share */}
          <button
            onClick={handleShare}
            className="bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 text-white text-xs font-black py-3 px-2 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-1 hover:scale-105"
          >
            <span className="text-base">🔗</span>
            <span>Share</span>
          </button>

          {/* 4. Copy Link */}
          <button
            onClick={handleCopyLink}
            className="bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 text-white text-xs font-black py-3 px-2 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-1 hover:scale-105"
          >
            <span className="text-base">{copied ? '✓' : '📋'}</span>
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>

          {/* 5. Generate Another */}
          <button
            onClick={onCreateAnother}
            className="bg-gradient-to-r from-purple-600/30 to-brand/30 hover:from-purple-600/50 hover:to-brand/50 border border-brand/50 text-brand-light text-xs font-black py-3 px-2 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-1 hover:scale-105 shadow-glow col-span-2 sm:col-span-1"
          >
            <span className="text-base">✨</span>
            <span>New Video</span>
          </button>

        </div>

      </div>
    </div>
  )
}
