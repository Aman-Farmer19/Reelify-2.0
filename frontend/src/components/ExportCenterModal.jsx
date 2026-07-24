import React, { useState } from 'react'
import toast from 'react-hot-toast'

const PLATFORM_PRESETS = [
  { id: 'ig', name: 'Instagram Reel', icon: '📸', format: 'MP4', res: '1080x1920', fps: '30 FPS', ratio: '9:16' },
  { id: 'tt', name: 'TikTok', icon: '🎵', format: 'MP4', res: '1080x1920', fps: '60 FPS', ratio: '9:16' },
  { id: 'yt', name: 'YouTube Shorts', icon: '▶️', format: 'MP4', res: '1080x1920', fps: '60 FPS', ratio: '9:16' },
  { id: 'li', name: 'LinkedIn Video', icon: '💼', format: 'MP4', res: '1080x1080', fps: '30 FPS', ratio: '1:1' },
  { id: 'gif', name: 'Animated GIF', icon: '🎨', format: 'GIF', res: '720x1280', fps: '15 FPS', ratio: '9:16' },
]

export default function ExportCenterModal({ onClose, projectTitle = 'Future of AI in 60 Seconds' }) {
  const [selectedPreset, setSelectedPreset] = useState('ig')
  const [fileFormat, setFileFormat] = useState('MP4')
  const [resolution, setResolution] = useState('1080p')
  const [fps, setFps] = useState('60')
  const [quality, setQuality] = useState('ultra') // 'compact' | 'balanced' | 'ultra'
  const [watermark, setWatermark] = useState('none') // 'none' | 'logo'
  const [compression, setCompression] = useState('h264') // 'h264' | 'hevc'

  // Export Queue & State
  const [exportQueue, setExportQueue] = useState([])
  const [isExporting, setIsExporting] = useState(false)
  const [activeProgress, setActiveProgress] = useState(0)

  // Dynamic estimated size calculation
  const getEstimatedSize = () => {
    let base = resolution === '4K' ? 48 : resolution === '1080p' ? 14.2 : 6.5
    if (fps === '60') base *= 1.3
    if (quality === 'ultra') base *= 1.2
    if (fileFormat === 'GIF') base *= 0.6
    return base.toFixed(1)
  }

  // Handle Preset Select
  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset.id)
    setFileFormat(preset.format)
    if (preset.id === 'gif') {
      setResolution('720p')
      setFps('30')
    } else {
      setResolution('1080p')
      setFps(preset.fps.includes('60') ? '60' : '30')
    }
  }

  // Add item to export queue
  const handleAddToQueue = () => {
    const newItem = {
      id: 'eq-' + Date.now(),
      title: projectTitle,
      format: fileFormat,
      resolution,
      fps: `${fps} FPS`,
      size: `${getEstimatedSize()} MB`,
      status: 'Queued',
      progress: 0
    }
    setExportQueue([...exportQueue, newItem])
    toast.success(`Added "${projectTitle}" (${resolution}) to Export Queue!`)
  }

  // Start Batch Export Processing
  const handleStartBatchExport = () => {
    if (exportQueue.length === 0) {
      handleAddToQueue()
    }
    setIsExporting(true)
    setActiveProgress(10)

    const interval = setInterval(() => {
      setActiveProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          toast.success('Batch Export Complete! All MP4 clips saved.')
          return 100
        }
        return prev + 15
      })
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in select-none">
      
      {/* Main Glass Export Center Card */}
      <div className="card-glass border-brand/40 rounded-3xl p-6 sm:p-8 md:p-10 max-w-2xl w-full space-y-6 shadow-glow-strong relative z-10 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand/20 border border-brand/40 px-3.5 py-1 rounded-full text-xs font-black text-brand-light uppercase tracking-wider mb-1">
              <span>⚡ Pro Export Center</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Export Video Settings</h2>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm font-bold w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center transition-all hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Target Platform Presets Grid */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
            Target Platform Preset
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {PLATFORM_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className={`p-3 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between gap-2 ${
                  selectedPreset === p.id
                    ? 'bg-brand/20 border-brand text-white shadow-glow scale-[1.02]'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white hover:border-brand/40'
                }`}
              >
                <span className="text-xl">{p.icon}</span>
                <div>
                  <h4 className="text-xs font-extrabold truncate">{p.name}</h4>
                  <span className="text-[9px] opacity-70 block">{p.res}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Technical Configurations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/[0.02] border border-white/[0.06] p-4 rounded-2xl">
          
          {/* Format & Resolution */}
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['MP4', 'GIF'].map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFileFormat(fmt)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      fileFormat === fmt ? 'bg-brand text-white border-brand shadow-glow' : 'bg-black/40 border-white/10 text-slate-400'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                Resolution
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['720p', '1080p', '4K'].map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setResolution(res)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      resolution === res ? 'bg-brand text-white border-brand shadow-glow' : 'bg-black/40 border-white/10 text-slate-400'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FPS & Quality */}
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                FPS (Frame Rate)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['30', '60'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFps(f)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      fps === f ? 'bg-brand text-white border-brand shadow-glow' : 'bg-black/40 border-white/10 text-slate-400'
                    }`}
                  >
                    {f} FPS
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                Bitrate / Quality
              </label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="input-field text-xs py-2 bg-black/40 border-white/10"
              >
                <option value="compact">Compact (Small File Size)</option>
                <option value="balanced">Balanced (Standard High Bitrate)</option>
                <option value="ultra">Ultra High (Pro 8K Bitrate)</option>
              </select>
            </div>
          </div>

        </div>

        {/* Watermark & Compression Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
              Watermark Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setWatermark('none')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  watermark === 'none' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-glow' : 'bg-black/40 border-white/10 text-slate-400'
                }`}
              >
                ✓ No Watermark
              </button>
              <button
                type="button"
                onClick={() => setWatermark('logo')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  watermark === 'logo' ? 'bg-brand text-white border-brand' : 'bg-black/40 border-white/10 text-slate-400'
                }`}
              >
                Logo Overlay
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
              Codec Compression
            </label>
            <select
              value={compression}
              onChange={(e) => setCompression(e.target.value)}
              className="input-field text-xs py-2 bg-black/40 border-white/10"
            >
              <option value="h264">H.264 (Universal Device Compatibility)</option>
              <option value="hevc">HEVC / H.265 (High Efficiency 50% Compression)</option>
            </select>
          </div>
        </div>

        {/* Dynamic Estimated Size Box */}
        <div className="bg-brand/10 border border-brand/30 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📦</span>
            <div>
              <h4 className="text-xs font-black text-white">Estimated Output File Size</h4>
              <span className="text-[10px] text-slate-400">{resolution} • {fps} FPS • {fileFormat} • {watermark === 'none' ? 'No Watermark' : 'Watermarked'}</span>
            </div>
          </div>
          <span className="text-base font-black text-brand-light">~{getEstimatedSize()} MB</span>
        </div>

        {/* Export Progress Bar */}
        {isExporting && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>Encoding Video Batch...</span>
              <span className="text-emerald-400">{activeProgress}%</span>
            </div>
            <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand via-purple-500 to-emerald-400 progress-shimmer transition-all duration-300"
                style={{ width: `${activeProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleAddToQueue}
            className="bg-white/[0.04] hover:bg-white/10 border border-white/10 text-white text-xs font-black py-3.5 px-5 rounded-2xl transition-all flex-1"
          >
            + Add to Queue ({exportQueue.length})
          </button>

          <button
            type="button"
            onClick={handleStartBatchExport}
            disabled={isExporting}
            className="btn-primary text-xs font-black py-3.5 px-7 rounded-2xl shadow-glow transition-all flex-1 disabled:opacity-50"
          >
            {isExporting ? '⚡ Encoding...' : '🚀 Start Export Now'}
          </button>
        </div>

      </div>
    </div>
  )
}
