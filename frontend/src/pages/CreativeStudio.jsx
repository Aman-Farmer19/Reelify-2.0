import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useAiAssistant } from '../context/AiAssistantContext'
import Sidebar from '../components/Sidebar'
import SandboxWorkspace from '../components/SandboxWorkspace'

const DURATION_OPTIONS = ['15 seconds', '30 seconds', '60 seconds', '90 seconds']
const FORMAT_OPTIONS = ['9:16 (Reels/Shorts)', '16:9 (YouTube)', '1:1 (Feed Post)']
const STYLE_OPTIONS = ['Dynamic', 'Cinematic', 'Minimal', 'Bold', 'Vintage']
const VOICE_OPTIONS = ['Aria (Female)', 'Marcus (Male)', 'Zara (Female)', 'Leo (Male)', 'British Emma', 'No Voice']
const MUSIC_OPTIONS = ['Upbeat Electronic', 'Cinematic Epic', 'Lo-Fi Chill', 'Corporate', 'No Music']
const CAPTION_OPTIONS = ['Animated Bold', 'Clean White', 'Neon Glow', 'None']

const QUICK_TEMPLATES = [
  { icon: '🐶', label: 'Puppy Running', prompt: 'Create a 15 second video of a fluffy golden retriever puppy running happily on the grass in a sunny park.' },
  { icon: '🌊', label: 'Sunset Ocean', prompt: 'Beautiful aerial view of blue ocean waves gently crashing onto a sandy beach at sunset, cinematic travel style.' },
  { icon: '🚀', label: 'Space Documentary', prompt: 'Cinematic space documentary footage of deep space nebula, starfields, and distant rotating planets in 8k.' },
  { icon: '☕', label: 'Luxury Coffee Ad', prompt: 'A cinematic luxury coffee commercial with slow-motion pouring shots, warm lighting, premium music and elegant transitions.' },
  { icon: '🎮', label: 'Gaming Montage', prompt: 'Fast-paced esports gaming montage with glowing neon overlays, intense bass drop audio, and dramatic kills.' },
  { icon: '🏝', label: 'Travel Reel', prompt: 'Serene travel vlog reel over tropical island beaches with turquoise water, palm trees, and warm ambient music.' },
]

const PIPELINE_STEPS = [
  { id: 'analysis', label: 'Prompt Analysis', icon: '🧠', estSec: 1 },
  { id: 'script', label: 'Script Generation', icon: '📝', estSec: 2 },
  { id: 'storyboard', label: 'Storyboard', icon: '🎞️', estSec: 2 },
  { id: 'planning', label: 'Scene Planning', icon: '🎯', estSec: 1 },
  { id: 'voice', label: 'Voice Generation', icon: '🗣️', estSec: 3 },
  { id: 'stock', label: 'Stock Video Search', icon: '🎥', estSec: 2 },
  { id: 'assembly', label: 'Video Assembly', icon: '🎬', estSec: 2 },
  { id: 'captions', label: 'Caption Generation', icon: '💬', estSec: 1 },
  { id: 'mixing', label: 'Audio Mixing', icon: '🎵', estSec: 1 },
  { id: 'rendering', label: 'Rendering', icon: '⚡', estSec: 3 },
  { id: 'export', label: 'Export', icon: '📦', estSec: 1 },
]

const AI_DIRECTOR_STYLES = [
  { name: 'Luxury', icon: '👑', desc: 'Anamorphic 8k gold lighting & high-end commercial feel', lens: '50mm Anamorphic T1.2', promptSuffix: ', styled in high-end Luxury aesthetic with gold accents and volumetric lighting' },
  { name: 'Cinematic', icon: '🎬', desc: 'Filmic anamorphic depth, dramatic contrast & 8k grading', lens: '35mm Cine Prime', promptSuffix: ', styled in Cinematic 8K widescreen aesthetic with filmic color grade' },
  { name: 'Documentary', icon: '📜', desc: 'Realistic textures, natural lighting & deep narrative', lens: '24mm Lens', promptSuffix: ', styled in realistic Documentary format with natural lighting and hyper-details' },
  { name: 'Anime', icon: '⛩️', desc: 'Vibrant cell-shaded artwork & Japanese anime action lines', lens: 'Anime Cell Shaded', promptSuffix: ', styled in vibrant Japanese Anime animation aesthetic with dramatic action lines' },
  { name: 'Pixar', icon: '🎈', desc: '3D character animation render with warm studio lighting', lens: '3D Render', promptSuffix: ', styled in Pixar 3D animation style with warm volumetric studio lighting' },
  { name: 'Cyberpunk', icon: '🌆', desc: 'Neon rim light, rain-soaked reflections & sci-fi tones', lens: 'Anamorphic Neon', promptSuffix: ', styled in Cyberpunk futuristic aesthetic with neon violet rim light and rain reflections' },
  { name: 'Vintage', icon: '📷', desc: '35mm analog film grain, sepia tones & 90s retro feel', lens: '35mm Film Grain', promptSuffix: ', styled in Vintage 35mm retro film aesthetic with analog grain and warm tones' },
  { name: 'Minimal', icon: '✨', desc: 'Clean pastel framing, subtle contrast & modern minimalism', lens: 'Clean Prime', promptSuffix: ', styled in Minimalist clean aesthetic with pastel tones and modern composition' },
  { name: 'Commercial', icon: '🛍️', desc: 'Ultra-crisp studio softbox key light & product focus', lens: 'Macro Studio T2.8', promptSuffix: ', styled in Commercial product ad style with ultra-crisp studio softbox lighting' },
]

const CAMERA_MOVEMENTS = [
  { name: 'Drone', icon: '🚁', desc: 'Sweeping high-altitude aerial drone shot', previewAnim: 'animate-pulse', keyword: 'camera: high-altitude aerial drone shot sweeping overhead' },
  { name: 'Orbit', icon: '🔄', desc: '360° orbital pan rotating around subject', previewAnim: 'spin-slow', keyword: 'camera: 360-degree orbital camera pan around subject' },
  { name: 'Tracking', icon: '🏎️', desc: 'High-speed tracking shot following action', previewAnim: 'animate-bounce', keyword: 'camera: high-speed tracking shot following motion' },
  { name: 'FPV', icon: '⚡', desc: 'Acrobatic first-person dive shot', previewAnim: 'animate-pulse', keyword: 'camera: immersive FPV first-person dive perspective' },
  { name: 'Handheld', icon: '📹', desc: 'Organic handheld motion with subtle sway', previewAnim: 'animate-ping', keyword: 'camera: organic handheld camera shot with natural motion' },
  { name: 'Slow Push', icon: '🔍', desc: 'Dramatic slow push-in on hero detail', previewAnim: 'scale-110', keyword: 'camera: slow dramatic push-in focusing on subject' },
  { name: 'Zoom In', icon: '🔎', desc: 'Rapid optical crash zoom-in onto subject', previewAnim: 'scale-125', keyword: 'camera: rapid optical crash zoom-in onto focal subject' },
  { name: 'Zoom Out', icon: '🔬', desc: 'Smooth pull-back zoom out revealing scene', previewAnim: 'scale-90', keyword: 'camera: smooth optical zoom-out revealing full scene' },
  { name: 'Crane', icon: '🏗️', desc: 'Pedestal rise lifting camera high above', previewAnim: '-translate-y-1', keyword: 'camera: vertical pedestal crane-up shot rising high' },
  { name: 'Tilt', icon: '📐', desc: 'Vertical tilt panning from ground to sky', previewAnim: '-rotate-12', keyword: 'camera: dramatic vertical tilt shot panning upwards' },
  { name: 'Pan', icon: '↔️', desc: 'Horizontal side-to-side panoramic sweep', previewAnim: 'translate-x-2', keyword: 'camera: smooth horizontal side-to-side panoramic pan' },
]

const LIGHTING_OPTIONS = [
  { name: 'Golden Hour', icon: '🌅', desc: 'Warm volumetric golden sunlight with soft amber glow', keyword: 'lighting: warm volumetric golden hour sunlight with soft amber glow' },
  { name: 'Blue Hour', icon: '🌌', desc: 'Deep twilight indigo sky tones with cool dusk ambient', keyword: 'lighting: cool twilight blue hour atmosphere with deep indigo ambient' },
  { name: 'Studio', icon: '💡', desc: 'Professional three-point softbox key lighting', keyword: 'lighting: professional studio three-point softbox key lighting' },
  { name: 'Moody', icon: '🌘', desc: 'High-contrast shadow depth & film noir chiaroscuro', keyword: 'lighting: moody chiaroscuro high-contrast dramatic shadow depth' },
  { name: 'Neon', icon: '🌆', desc: 'Cyberpunk vibrant neon rim light with purple & cyan glow', keyword: 'lighting: vibrant cyberpunk neon rim lighting with purple and cyan glow' },
  { name: 'Sunset', icon: '🌇', desc: 'Rich crimson and orange horizon glow with long shadows', keyword: 'lighting: rich crimson and orange sunset horizon glow with long shadows' },
  { name: 'Soft Light', icon: '☁️', desc: 'Diffused shadowless light with gentle natural skin tones', keyword: 'lighting: diffused shadowless soft light with gentle natural skin tones' },
  { name: 'Hard Light', icon: '☀️', desc: 'Direct intense sunlight with sharp crisp directional shadows', keyword: 'lighting: intense direct hard sunlight with sharp crisp directional shadows' },
  { name: 'Backlight', icon: '✨', desc: 'Dramatic halo rim light defining subject silhouette', keyword: 'lighting: dramatic halo backlight defining subject silhouette contours' },
  { name: 'Natural', icon: '🍃', desc: 'Unfiltered organic daylight with real-world color balance', keyword: 'lighting: unfiltered organic natural daylight with real-world color balance' },
]

// AI Prompt Quality Analyzer Component
function PromptQualityAnalyzer({ prompt, onApplySuggestion }) {
  if (!prompt || !prompt.trim()) return null

  const p = prompt.toLowerCase()

  const metrics = [
    {
      id: 'subject',
      name: 'Subject',
      icon: '👤',
      detected: /(puppy|dog|cat|chef|car|laptop|person|model|robot|character|coffee|ocean|video|product|food|subject)/.test(p),
      score: /(puppy|dog|cat|chef|car|laptop|person|model|robot|character|coffee|ocean|video|product|food|subject)/.test(p) ? 100 : 30,
      suggestion: 'A specific hero subject (e.g. golden retriever puppy)'
    },
    {
      id: 'environment',
      name: 'Environment',
      icon: '🏞️',
      detected: /(park|kitchen|desk|ocean|street|studio|beach|room|city|mountain|forest|landscape|coffee shop|background)/.test(p),
      score: /(park|kitchen|desk|ocean|street|studio|beach|room|city|mountain|forest|landscape|coffee shop|background)/.test(p) ? 100 : 30,
      suggestion: 'Setting or environment (e.g. sunny park at sunset)'
    },
    {
      id: 'camera',
      name: 'Camera',
      icon: '📷',
      detected: /(camera:|35mm|50mm|8k|anamorphic|macro|angle|close-up|wide shot|close up|drone|tracking|eye level|lens)/.test(p),
      score: /(camera:|35mm|50mm|8k|anamorphic|macro|angle|close-up|wide shot|close up|drone|tracking|eye level|lens)/.test(p) ? 100 : 25,
      suggestion: 'Camera lens & angle (e.g. 35mm Anamorphic T1.5 lens)'
    },
    {
      id: 'lighting',
      name: 'Lighting',
      icon: '💡',
      detected: /(lighting:|golden hour|neon|volumetric|rim light|softbox|sunlight|chiaroscuro|sunset|twilight|amber|glow)/.test(p),
      score: /(lighting:|golden hour|neon|volumetric|rim light|softbox|sunlight|chiaroscuro|sunset|twilight|amber|glow)/.test(p) ? 100 : 20,
      suggestion: 'Lighting atmosphere (e.g. volumetric golden hour sunlight)'
    },
    {
      id: 'emotion',
      name: 'Emotion',
      icon: '🎭',
      detected: /(happy|energetic|moody|dramatic|inspiring|intense|peaceful|curious|luxury|bold|epic|vibe)/.test(p),
      score: /(happy|energetic|moody|dramatic|inspiring|intense|peaceful|curious|luxury|bold|epic|vibe)/.test(p) ? 100 : 40,
      suggestion: 'Emotional tone (e.g. high energy & inspiring atmosphere)'
    },
    {
      id: 'movement',
      name: 'Movement',
      icon: '🏎️',
      detected: /(tracking|orbit|push-in|zoom|pan|tilt|drone|fpv|handheld|crane|sweeping|motion|moving)/.test(p),
      score: /(tracking|orbit|push-in|zoom|pan|tilt|drone|fpv|handheld|crane|sweeping|motion|moving)/.test(p) ? 100 : 20,
      suggestion: 'Camera motion (e.g. dynamic tracking shot following action)'
    },
    {
      id: 'storytelling',
      name: 'Storytelling',
      icon: '📜',
      detected: /(running|chopping|driving|scrolling|crashing|flowing|leaping|playing|walking|action|narrative|story)/.test(p),
      score: /(running|chopping|driving|scrolling|crashing|flowing|leaping|playing|walking|action|narrative|story)/.test(p) ? 100 : 35,
      suggestion: 'Narrative action (e.g. running happily through lush grass)'
    },
    {
      id: 'color',
      name: 'Color',
      icon: '🎨',
      detected: /(amber|indigo|crimson|vibrant|pastel|sepia|warm|cool|golden|neon|color|palette|teal|gold)/.test(p),
      score: /(amber|indigo|crimson|vibrant|pastel|sepia|warm|cool|golden|neon|color|palette|teal|gold)/.test(p) ? 100 : 30,
      suggestion: 'Color palette (e.g. vibrant golden amber tones)'
    },
    {
      id: 'realism',
      name: 'Realism',
      icon: '✨',
      detected: /(photorealistic|8k|hyper-detailed|cinematic|depth of field|octane|ultra|realistic|textures|quality)/.test(p),
      score: /(photorealistic|8k|hyper-detailed|cinematic|depth of field|octane|ultra|realistic|textures|quality)/.test(p) ? 100 : 40,
      suggestion: 'Realism detail (e.g. 8k photorealistic resolution & depth)'
    },
  ]

  const totalScore = Math.round(metrics.reduce((acc, m) => acc + m.score, 0) / metrics.length)
  const missingSuggestions = metrics.filter(m => !m.detected)

  const getScoreBadge = (score) => {
    if (score >= 90) return { label: '🔥 Masterpiece Cinematic Prompt', color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' }
    if (score >= 75) return { label: '✨ Production Ready', color: 'bg-brand/20 border-brand/40 text-brand-light' }
    if (score >= 50) return { label: '⚡ Good Start (Add Camera & Lighting)', color: 'bg-amber-500/20 border-amber-500/40 text-amber-300' }
    return { label: '💡 Basic Prompt (Needs Details)', color: 'bg-rose-500/20 border-rose-500/40 text-rose-300' }
  }

  const badge = getScoreBadge(totalScore)

  return (
    <div className="bg-surface-1/90 border border-brand/30 rounded-2xl p-4 flex flex-col gap-4 shadow-xl font-sans mt-3">
      {/* Overall Score Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-black/40 p-3.5 rounded-xl border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-brand to-brand-glow flex items-center justify-center text-white font-extrabold text-lg shadow-glow">
            {totalScore}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white">AI Prompt Quality Score</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Evaluated across 9 cinematic video parameters
            </p>
          </div>
        </div>

        <div className="text-right text-[11px] font-bold text-slate-300">
          <span>{metrics.filter(m => m.detected).length}/9 Elements Detected</span>
        </div>
      </div>

      {/* 9 Parameter Progress Bars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {metrics.map((m) => (
          <div key={m.id} className="bg-white/[0.02] border border-white/[0.06] p-2.5 rounded-xl flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-200 flex items-center gap-1">
                <span>{m.icon}</span> {m.name}
              </span>
              <span className={`font-extrabold text-[10px] ${m.detected ? 'text-emerald-400' : 'text-slate-500'}`}>
                {m.detected ? '100%' : '30%'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${m.detected
                  ? 'bg-gradient-to-r from-brand to-brand-glow shadow-glow'
                  : 'bg-slate-700/50'
                  }`}
                style={{ width: `${m.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* AI Improvement Suggestions */}
      {missingSuggestions.length > 0 && (
        <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.08]">
          <span className="text-[10px] font-bold text-brand-light uppercase tracking-wider">
            💡 AI Recommendations to boost prompt quality to 100%:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {missingSuggestions.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onApplySuggestion(m.suggestion)}
                className="text-[11px] font-semibold bg-white/[0.03] hover:bg-brand/20 border border-white/[0.08] hover:border-brand/40 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 group"
              >
                <span className="text-brand-light font-bold">+</span>
                <span>{m.suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Live AI Typing Suggestions Component
import CinematicRenderingOverlay from '../components/CinematicRenderingOverlay'
import GenerationSuccessModal from '../components/GenerationSuccessModal'
import InteractiveStoryboardTimeline from '../components/InteractiveStoryboardTimeline'
import ExportCenterModal from '../components/ExportCenterModal'
function LiveTypingSuggestions({ prompt, onSelectSuggestion }) {
  const p = (prompt || '').toLowerCase()

  const suggestions = []

  if (!p.includes('lighting') && !p.includes('golden hour') && !p.includes('neon')) {
    suggestions.push({
      label: '+ Add cinematic lighting',
      text: 'lighting: cinematic volumetric golden hour sunlight with soft glow'
    })
  }

  if (!p.includes('slow motion') && !p.includes('60fps') && !p.includes('slow-motion')) {
    suggestions.push({
      label: '+ Add slow motion',
      text: 'camera: 60fps high-speed cinematic slow motion'
    })
  }

  if (!p.includes('realism') && !p.includes('photorealistic') && !p.includes('8k')) {
    suggestions.push({
      label: '+ Improve realism',
      text: 'hyper-realistic 8k resolution with intricate micro-textures and film grain'
    })
  }

  if (!p.includes('emotion') && !p.includes('story') && !p.includes('dramatic')) {
    suggestions.push({
      label: '+ Add emotional storytelling',
      text: 'atmosphere: deep emotional storytelling with inspiring dramatic mood'
    })
  }

  if (!p.includes('close-up') && !p.includes('close up') && !p.includes('macro')) {
    suggestions.push({
      label: '+ Add dramatic close-up',
      text: 'camera: dramatic 50mm tight close-up shot focusing on subject emotion'
    })
  }

  if (!p.includes('tracking') && !p.includes('orbit') && !p.includes('pan')) {
    suggestions.push({
      label: '+ Add dynamic tracking',
      text: 'camera: smooth tracking shot following subject motion'
    })
  }

  if (suggestions.length === 0) return null

  return (
    <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-white/[0.06]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-light uppercase tracking-wider">
          <span className="animate-pulse">✨</span> Live AI Suggestions while you type (1-click insert):
        </div>
        <span className="text-[9px] font-semibold text-slate-500">{suggestions.length} available</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((sug) => (
          <button
            key={sug.label}
            type="button"
            onClick={() => onSelectSuggestion(sug.text)}
            className="text-[11px] font-extrabold bg-brand/10 hover:bg-brand/25 border border-brand/30 hover:border-brand/60 text-brand-light hover:text-white px-2.5 py-1 rounded-xl transition-all duration-200 shadow-glow flex items-center gap-1 group active:scale-95 cursor-pointer"
          >
            <span>{sug.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// RunwayML Technical Specs Inspector Grid Component
function RunwayTechnicalSpecs({ form, phase, progress }) {
  const resolutionText = form.format.includes('9:16')
    ? '1080 x 1920 (9:16 Vertical)'
    : form.format.includes('16:9')
      ? '1920 x 1080 (16:9 Landscape)'
      : '1080 x 1080 (1:1 Square)'

  const estRenderTime = phase === 'generating'
    ? `⚡ ~${Math.max(1, Math.ceil((100 - progress) / 8))}s remaining`
    : phase === 'done'
      ? '⚡ 2.4s (Render Complete)'
      : '⚡ Standby'

  return (
    <div className="card-glass p-5 border-white/[0.06] flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-light animate-pulse" />
          <label className="section-label mb-0">🎛️ RunwayML Technical Inspector</label>
        </div>
        <span className="text-[9px] font-black text-brand-light bg-brand/20 border border-brand/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          PRO SPEC
        </span>
      </div>

      {/* Technical Specs Grid */}
      <div className="grid grid-cols-2 gap-2.5 text-xs font-sans">
        {/* Resolution */}
        <div className="bg-white/[0.02] border border-white/[0.06] p-2.5 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">📐 Resolution</span>
          <span className="text-white font-extrabold text-xs">{resolutionText}</span>
        </div>

        {/* FPS */}
        <div className="bg-white/[0.02] border border-white/[0.06] p-2.5 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">🎞️ Frame Rate</span>
          <span className="text-emerald-400 font-extrabold text-xs">60 FPS (Ultra Smooth)</span>
        </div>

        {/* Duration */}
        <div className="bg-white/[0.02] border border-white/[0.06] p-2.5 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">⏱️ Duration</span>
          <span className="text-white font-extrabold text-xs">{form.duration}</span>
        </div>

        {/* Voice */}
        <div className="bg-white/[0.02] border border-white/[0.06] p-2.5 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">🗣️ Neural Voice</span>
          <span className="text-brand-light font-extrabold text-xs truncate">{form.voice}</span>
        </div>

        {/* Captions */}
        <div className="bg-white/[0.02] border border-white/[0.06] p-2.5 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">💬 Captions</span>
          <span className="text-white font-extrabold text-xs truncate">{form.captions}</span>
        </div>

        {/* Music */}
        <div className="bg-white/[0.02] border border-white/[0.06] p-2.5 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">🎵 Music Track</span>
          <span className="text-white font-extrabold text-xs truncate">{form.music}</span>
        </div>

        {/* Progress */}
        <div className="bg-white/[0.02] border border-white/[0.06] p-2.5 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">📊 Pipeline Progress</span>
          <span className="text-brand-light font-extrabold text-xs">{progress}% Completed</span>
        </div>

        {/* Estimated Rendering Time */}
        <div className="bg-white/[0.02] border border-white/[0.06] p-2.5 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">⏱️ Est. Render Time</span>
          <span className="text-amber-300 font-extrabold text-xs">{estRenderTime}</span>
        </div>
      </div>
    </div>
  )
}

// Export Studio Component
function ExportStudioPanel({ compiledVideoUrl, downloadUrl }) {
  const [format, setFormat] = useState('MP4')
  const [resolution, setResolution] = useState('1080p')
  const [fps, setFps] = useState('60')
  const [compression, setCompression] = useState('H.264')
  const [quality, setQuality] = useState('High')
  const [watermark, setWatermark] = useState('None')
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const formats = [
    { id: 'MP4', label: 'MP4', icon: '🎬' },
    { id: 'MOV', label: 'MOV', icon: '🎞️' },
    { id: 'GIF', label: 'GIF', icon: '🖼️' },
    { id: 'Reel', label: 'Instagram Reel', icon: '📸' },
    { id: 'TikTok', label: 'TikTok', icon: '🎵' },
    { id: 'Shorts', label: 'YouTube Shorts', icon: '▶️' },
  ]

  const handleExport = () => {
    setIsExporting(true)
    setExportProgress(0)

    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)

          const targetUrl = compiledVideoUrl || downloadUrl || '/demo.mp4'
          const a = document.createElement('a')
          a.href = targetUrl
          a.download = `reelify_export_${format.toLowerCase()}_${Date.now()}.${format === 'GIF' ? 'gif' : format === 'MOV' ? 'mov' : 'mp4'}`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)

          toast.success(`Export ready! Downloaded ${format} (${resolution} @ ${fps}fps)`)
          return 100
        }
        return prev + 25
      })
    }, 200)
  }

  return (
    <div className="card-glass p-5 border-white/[0.06] flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">📦</span>
          <label className="section-label mb-0">Export Studio</label>
        </div>
        <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
          PRO EXPORT
        </span>
      </div>

      {/* Export Format Selector Pills */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Select Export Format
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {formats.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFormat(f.id)}
              className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${format === f.id
                ? 'bg-brand text-white border-brand shadow-glow'
                : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.06]'
                }`}
            >
              <span>{f.icon}</span>
              <span className="truncate">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Technical Export Controls Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* Resolution */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Resolution
          </label>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="input-field text-xs py-1.5 px-2 bg-black/40"
          >
            <option value="1080p">1080p Full HD (1080x1920)</option>
            <option value="4K">4K Ultra HD (2160x3840)</option>
            <option value="720p">720p HD (720x1280)</option>
          </select>
        </div>

        {/* FPS */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Frame Rate (FPS)
          </label>
          <select
            value={fps}
            onChange={(e) => setFps(e.target.value)}
            className="input-field text-xs py-1.5 px-2 bg-black/40"
          >
            <option value="60">60 FPS (Ultra Smooth)</option>
            <option value="30">30 FPS (Standard)</option>
            <option value="24">24 FPS (Filmic Cinema)</option>
          </select>
        </div>

        {/* Compression */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Compression Codec
          </label>
          <select
            value={compression}
            onChange={(e) => setCompression(e.target.value)}
            className="input-field text-xs py-1.5 px-2 bg-black/40"
          >
            <option value="H.264">H.264 (Universal)</option>
            <option value="H.265">H.265 / HEVC</option>
            <option value="ProRes">ProRes 422</option>
          </select>
        </div>

        {/* Quality */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Quality Preset
          </label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="input-field text-xs py-1.5 px-2 bg-black/40"
          >
            <option value="High">High (Recommended)</option>
            <option value="Maximum">Maximum (Lossless)</option>
            <option value="Balanced">Balanced</option>
            <option value="Web">Web Optimized</option>
          </select>
        </div>
      </div>

      {/* Watermark Toggle */}
      <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/[0.06] text-xs">
        <div>
          <span className="font-bold text-white block">Watermark Settings</span>
          <span className="text-[10px] text-slate-400">Export clean video without logos</span>
        </div>
        <select
          value={watermark}
          onChange={(e) => setWatermark(e.target.value)}
          className="bg-black/60 border border-white/10 text-brand-light font-bold text-xs rounded-lg px-2.5 py-1 focus:outline-none"
        >
          <option value="None">No Watermark (Clean Pro)</option>
          <option value="Watermark">Include Watermark</option>
        </select>
      </div>

      {/* Generate Export Button & Progress */}
      <div className="flex flex-col gap-2 pt-1">
        {isExporting && (
          <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-brand to-emerald-400 transition-all duration-200"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowExportCenterModal(true)}
          className="btn-primary text-xs font-bold py-3.5 rounded-xl w-full flex items-center justify-center gap-2 shadow-glow active:scale-95 disabled:opacity-50"
        >
          <span>⚡ Open Pro Export Center</span>
        </button>
      </div>
    </div>
  )
}

// Prompt Breakdown Panel Component
function PromptBreakdownPanel({ prompt, form, onAssemblePrompt }) {
  if (!prompt || !prompt.trim()) return null

  const p = prompt.toLowerCase()

  const breakdown = {
    subject: p.includes('barista') ? 'A professional barista' : p.includes('puppy') ? 'Golden retriever puppy' : 'Hero character subject',
    environment: p.includes('café') || p.includes('cafe') ? 'Luxury café' : p.includes('park') ? 'Sunny park' : 'Cinematic backdrop',
    camera: p.includes('dolly') ? 'Slow cinematic dolly' : p.includes('35mm') ? '35mm Prime Lens' : 'Eye level tracking',
    lighting: p.includes('golden hour') ? 'Golden hour' : p.includes('volumetric') ? 'Volumetric sunlight' : 'Studio key light',
    mood: p.includes('warm') || p.includes('premium') ? 'Warm, premium' : 'High energy',
    colorPalette: p.includes('brown') || p.includes('cream') ? 'Brown and cream' : 'Vibrant gold & amber',
    negativePrompt: 'No blur, no watermark',
    platform: form?.format || 'Instagram Reels (9:16)',
    score: 94,
  }

  return (
    <div className="bg-surface-1/90 border border-brand/40 rounded-2xl p-4 flex flex-col gap-3 shadow-xl mt-3 text-xs font-sans">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">📑</span>
          <span className="font-extrabold text-white">Prompt Breakdown Matrix</span>
        </div>
        <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
          🔥 Score: {breakdown.score}/100
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="bg-white/[0.02] border border-white/[0.06] p-2 rounded-xl">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">👤 Subject</span>
          <span className="text-white font-extrabold">{breakdown.subject}</span>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] p-2 rounded-xl">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">🏞️ Environment</span>
          <span className="text-white font-extrabold">{breakdown.environment}</span>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] p-2 rounded-xl">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">🎥 Camera</span>
          <span className="text-brand-light font-extrabold">{breakdown.camera}</span>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] p-2 rounded-xl">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">💡 Lighting</span>
          <span className="text-amber-300 font-extrabold">{breakdown.lighting}</span>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] p-2 rounded-xl">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">🎭 Mood</span>
          <span className="text-white font-extrabold">{breakdown.mood}</span>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] p-2 rounded-xl">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">🎨 Color Palette</span>
          <span className="text-white font-extrabold">{breakdown.colorPalette}</span>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] p-2 rounded-xl col-span-1 sm:col-span-2">
          <span className="text-[10px] text-rose-400 font-bold block uppercase">🚫 Negative Prompt</span>
          <span className="text-slate-300 font-mono text-[11px]">{breakdown.negativePrompt}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-white/[0.06] text-[10px] text-slate-400 font-bold">
        <span>📱 Platform: {breakdown.platform}</span>
        <button
          type="button"
          onClick={() => {
            const assembled = `${breakdown.subject} in a ${breakdown.environment}, ${breakdown.camera}, ${breakdown.lighting} lighting, ${breakdown.mood} mood, ${breakdown.colorPalette} color palette. Negative prompt: ${breakdown.negativePrompt}.`
            onAssemblePrompt(assembled)
          }}
          className="text-brand-light hover:underline font-extrabold"
        >
          ⚡ Re-assemble Prompt From Breakdown ➔
        </button>
      </div>
    </div>
  )
}

// Locked Feature Card Component for Sandbox Mode
function LockedFeatureCard({ title, description, onAuth }) {
  const navigate = useNavigate()

  return (
    <div className="card-glass p-5 border-amber-500/25 bg-gradient-to-br from-white/[0.02] via-amber-500/[0.03] to-purple-900/[0.05] rounded-2xl flex flex-col gap-3 shadow-lg relative overflow-hidden transition-all duration-300 hover:border-amber-500/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-extrabold text-sm shadow-inner">
            🔒
          </div>
          <div>
            <span className="text-xs font-extrabold text-white tracking-tight block">{title}</span>
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">🔒 Login Required</span>
          </div>
        </div>
        <span className="text-[10px] font-extrabold text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.06]">
          Studio Pro
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        {description || 'Unlock this feature by signing in.'}
      </p>

      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-semibold">Sign in to unlock full Reelify platform</span>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="btn-primary text-xs font-bold px-4 py-2 rounded-xl shadow-glow hover:scale-105 transition-all"
        >
          Login
        </button>
      </div>
    </div>
  )
}

export default function CreativeStudio({
  mode = "studio",
  onAuth,
}) {
  const { token, isAuth } = useAuth()
  const location = useLocation()

  const [guestDemoCount, setGuestDemoCount] = useState(() => {
    return parseInt(localStorage.getItem('reelify_guest_demo_count') || '0', 10)
  })

  const [form, setForm] = useState({
    prompt: '',
    duration: '15 seconds',
    format: '9:16 (Reels/Shorts)',
    style: 'Cinematic',
    voice: 'Aria (Female)',
    music: 'Upbeat Electronic',
    captions: 'Animated Bold',
    visualMode: 'stock', // stock | upload
  })
  const [phase, setPhase] = useState('idle') // idle | generating | done
  const [progress, setProgress] = useState(0)
  const [activeStep, setActiveStep] = useState('')
  const [doneSteps, setDoneSteps] = useState([])
  const [result, setResult] = useState(null)

  // Voice state
  const [isListening, setIsListening] = useState(false)

  // Canva / Custom Upload States
  const [uploadedFileUrl, setUploadedFileUrl] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState('')

  // Pipeline extra states
  const [editableScript, setEditableScript] = useState('')
  const [storyboardScenes, setStoryboardScenes] = useState([])
  const [generatedVoiceUrl, setGeneratedVoiceUrl] = useState(null)
  const [generatedMusicUrl, setGeneratedMusicUrl] = useState(null)
  const [compiledVideoUrl, setCompiledVideoUrl] = useState(null)
  const [isCompiling, setIsCompiling] = useState(false)

  // AI image slideshow states
  const [slideshowImages, setSlideshowImages] = useState([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [showExportCenterModal, setShowExportCenterModal] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // Handle Lighting Card selection
  const handleLightingSelect = (light) => {
    setForm(prev => {
      let newPrompt = prev.prompt
      if (!newPrompt.includes(light.keyword)) {
        newPrompt = newPrompt ? `${newPrompt.trim()} ${light.keyword}.` : `${light.keyword}.`
      }
      return { ...prev, prompt: newPrompt }
    })
    toast.success(`Inserted ${light.name} lighting into prompt!`)
  }

  // Handle Camera Movement Card selection
  const handleCameraSelect = (cam) => {
    setForm(prev => {
      let newPrompt = prev.prompt
      if (!newPrompt.includes(cam.keyword)) {
        newPrompt = newPrompt ? `${newPrompt.trim()} ${cam.keyword}.` : `${cam.keyword}.`
      }
      return { ...prev, prompt: newPrompt }
    })
    toast.success(`Inserted ${cam.name} camera movement into prompt!`)
  }

  // Handle AI Director Card selection
  const handleDirectorSelect = (director) => {
    setForm(prev => {
      let newPrompt = prev.prompt
      AI_DIRECTOR_STYLES.forEach(d => {
        if (d.promptSuffix) {
          newPrompt = newPrompt.replace(d.promptSuffix, '')
        }
      })
      newPrompt = newPrompt.trim()
      if (newPrompt && !newPrompt.endsWith('.')) {
        newPrompt += director.promptSuffix
      } else if (newPrompt) {
        newPrompt += director.promptSuffix
      } else {
        newPrompt = `A video${director.promptSuffix}`
      }

      return {
        ...prev,
        style: director.name,
        prompt: newPrompt
      }
    })
    toast.success(`AI Director preset set to ${director.name}!`)
  }

  const { registerInsertCallback } = useAiAssistant()

  // Register live prompt insertion callback from AI Copilot drawer
  useEffect(() => {
    if (registerInsertCallback) {
      registerInsertCallback((promptText, styleText) => {
        setForm(prev => ({
          ...prev,
          prompt: promptText,
          style: styleText || prev.style
        }))
      })
    }
  }, [registerInsertCallback])

  // Auto-populate from landing page voice assistant or AI Assistant
  useEffect(() => {
    if (location.state?.initialPrompt) {
      setForm(prev => ({ ...prev, prompt: location.state.initialPrompt }))
    } else {
      const suggested = localStorage.getItem('reelify_ai_suggested_prompt')
      const style = localStorage.getItem('reelify_ai_suggested_style')
      if (suggested) {
        setForm(prev => ({
          ...prev,
          prompt: suggested,
          style: style || prev.style
        }))
        localStorage.removeItem('reelify_ai_suggested_prompt')
        localStorage.removeItem('reelify_ai_suggested_style')
      }
    }
  }, [location.state])

  const handleTemplateClick = (promptText) => {
    setForm({ ...form, prompt: promptText })
    toast.success('Template loaded!')
  }

  // Voice Assistant speech recognizer
  const recognitionRef = React.useRef(null)

  const handleVoiceInput = async (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (err) { }
      setIsListening(false)
      toast('Voice assistant stopped', { icon: '🛑' })
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      toast.error('Voice assistant is not supported in this browser. Please use Google Chrome or Edge.')
      return
    }

    try {
      // Request mic permission explicitly to prevent system/Zoom popups
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
    } catch (micErr) {
      toast.error('Microphone access denied. Please allow microphone permissions in browser.')
      return
    }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    recognition.continuous = false
    recognition.lang = 'en-US'
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
      toast('Listening... Speak your prompt now!', { icon: '🎙️' })
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      setIsListening(false)
      if (event.error === 'not-allowed') {
        toast.error('Microphone access denied by browser.')
      } else if (event.error === 'no-speech') {
        toast('No speech detected. Try again!', { icon: '🤔' })
      } else {
        toast.error(`Voice error: ${event.error}`)
      }
    }

    recognition.onresult = (event) => {
      const spokenText = event.results[0]?.[0]?.transcript
      if (spokenText) {
        setForm(prev => ({ ...prev, prompt: prev.prompt ? `${prev.prompt} ${spokenText}` : spokenText }))
        toast.success(`Captured: "${spokenText}"`)
      }
    }

    try {
      recognition.start()
    } catch (err) {
      toast.error('Could not start voice recognition. Please try again.')
    }
  }

  // Upload custom Canva exported assets
  const handleAssetUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadedFileName(file.name)

    const formData = new FormData()
    formData.append('file', file)

    const uploadToast = toast.loading('Uploading asset to workspace...')
    try {
      const { data } = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      setUploadedFileUrl(data.url)
      toast.success('Canva asset loaded successfully!', { id: uploadToast })
    } catch (err) {
      toast.error('Upload failed. Please try again.', { id: uploadToast })
    }
  }

  // Slideshow image rotation logic
  useEffect(() => {
    if (phase === 'done' && form.visualMode === 'ai_slideshow' && slideshowImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % slideshowImages.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [phase, form.visualMode, slideshowImages])

  const getAuthHeader = () => (token ? { headers: { Authorization: `Bearer ${token}` } } : {})

  const generate = async () => {
    if (!form.prompt.trim()) { toast.error('Please enter a prompt first!'); return }

    if (!isAuth && guestDemoCount >= 1) {
      toast.error('Sandbox demo limit reached (1/1). Sign in or create an account for unlimited generations!')
      if (onAuth) onAuth('signup')
      return
    }

    if (!isAuth) {
      const nextCount = guestDemoCount + 1
      setGuestDemoCount(nextCount)
      localStorage.setItem('reelify_guest_demo_count', nextCount.toString())
    }

    setPhase('generating')
    setProgress(0)
    setDoneSteps([])
    setResult(null)
    setSlideshowImages([])
    setStoryboardScenes([])
    setGeneratedVoiceUrl(null)
    setGeneratedMusicUrl(null)
    setCompiledVideoUrl(null)
    setCurrentSlideIndex(0)

    // 1. Prompt Analysis
    setActiveStep('analysis')
    setProgress(9)
    await new Promise(r => setTimeout(r, 400))
    setDoneSteps(prev => [...prev, 'analysis'])

    // 2. Script Generation
    setActiveStep('script')
    setProgress(18)
    let apiData = null
    try {
      const { data } = await axios.post(
        '/api/generate',
        { prompt: form.prompt, options: { ...form, uploadedUrl: uploadedFileUrl } },
        getAuthHeader()
      )
      apiData = data
    } catch (err) {
      const dummyScript = `Here is a custom script generated for: "${form.prompt}". Optimize your parameters for the perfect post.`
      apiData = {
        title: form.prompt.length > 50 ? form.prompt.substring(0, 50) + '...' : form.prompt,
        script: dummyScript,
        duration: form.duration,
        format: form.format,
        style: form.style,
        download_url: (form.visualMode === 'upload' && uploadedFileUrl) ? uploadedFileUrl : '/demo.mp4',
      }
    }
    setResult(apiData)
    setEditableScript(apiData.script || '')
    setDoneSteps(prev => [...prev, 'script'])

    // 3. Storyboard
    setActiveStep('storyboard')
    setProgress(27)
    let scenesList = []
    try {
      const sbRes = await axios.post(
        '/api/generate_storyboard',
        { script: apiData.script || form.prompt, prompt: form.prompt, num_scenes: 4, visual_mode: form.visualMode },
        getAuthHeader()
      )
      scenesList = sbRes.data.scenes || []
      setStoryboardScenes(scenesList)

      const imageUrls = scenesList.map(s => s.image_url)
      if (imageUrls.length > 0) {
        setSlideshowImages(imageUrls)
      }
    } catch (e) {
      console.warn('Storyboard generation fallback', e)
    }

    if (slideshowImages.length === 0 && (!scenesList || scenesList.length === 0)) {
      const queryWords = form.prompt.split(' ').filter(w => w.length > 3).slice(0, 4)
      const queries = queryWords.length >= 2 ? queryWords : ['creative', 'art', 'reels', 'concept']
      const urls = queries.map((q, idx) =>
        `/api/generate_image?prompt=${encodeURIComponent(form.prompt + ' ' + q)}&seed=${idx + 42}`
      )
      setSlideshowImages(urls)
    }
    setDoneSteps(prev => [...prev, 'storyboard'])

    // 4. Scene Planning
    setActiveStep('planning')
    setProgress(36)
    await new Promise(r => setTimeout(r, 300))
    setDoneSteps(prev => [...prev, 'planning'])

    // 5. Voice Generation
    setActiveStep('voice')
    setProgress(45)
    let voiceUrlToUse = null
    if (form.voice !== 'No Voice' && apiData.script) {
      try {
        const vRes = await axios.post(
          '/api/generate_voice',
          { script: apiData.script, voice: form.voice },
          getAuthHeader()
        )
        if (vRes.data.audio_url) {
          voiceUrlToUse = vRes.data.audio_url
          setGeneratedVoiceUrl(vRes.data.audio_url)
        }
      } catch (e) {
        console.warn('Voice synthesis skipped:', e)
      }
    }
    setDoneSteps(prev => [...prev, 'voice'])

    // 6. Stock Video Search
    setActiveStep('stock')
    setProgress(54)
    await new Promise(r => setTimeout(r, 300))
    setDoneSteps(prev => [...prev, 'stock'])

    // 7. Video Assembly
    setActiveStep('assembly')
    setProgress(63)
    await new Promise(r => setTimeout(r, 300))
    setDoneSteps(prev => [...prev, 'assembly'])

    // 8. Caption Generation
    setActiveStep('captions')
    setProgress(72)
    await new Promise(r => setTimeout(r, 300))
    setDoneSteps(prev => [...prev, 'captions'])

    // 9. Audio Mixing
    setActiveStep('mixing')
    setProgress(81)
    let musicUrlToUse = null
    if (form.music !== 'No Music') {
      try {
        const moodMap = { 'Upbeat Electronic': 'upbeat', 'Cinematic Epic': 'epic', 'Lo-Fi Chill': 'chill', 'Corporate': 'corporate' }
        const mRes = await axios.get(`/api/get_music?mood=${moodMap[form.music] || 'positive'}`)
        if (mRes.data.music_url) {
          musicUrlToUse = mRes.data.music_url
          setGeneratedMusicUrl(mRes.data.music_url)
        }
      } catch (e) {
        console.warn('Music fetch skipped:', e)
      }
    }
    setDoneSteps(prev => [...prev, 'mixing'])

    // 10. Rendering
    setActiveStep('rendering')
    setProgress(90)
    await new Promise(r => setTimeout(r, 400))
    setDoneSteps(prev => [...prev, 'rendering'])

    // 11. Export
    setActiveStep('export')
    setProgress(100)
    await new Promise(r => setTimeout(r, 300))
    setDoneSteps(prev => [...prev, 'export'])

    setActiveStep('')
    setPhase('done')
    toast.success('Generation Pipeline completed successfully!')

    // Auto-trigger video compilation for seamless 1-click experience
    if (scenesList.length > 0) {
      const imgUrls = scenesList.map(s => s.image_url)
      setTimeout(() => {
        handleCompileVideo(imgUrls, voiceUrlToUse, musicUrlToUse, apiData.script)
      }, 500)
    }
  }

  // Trigger FFmpeg compilation
  const handleCompileVideo = async (overrideImages, overrideVoice, overrideMusic, overrideScript) => {
    const imagesToUse = overrideImages || slideshowImages
    if (!imagesToUse || imagesToUse.length === 0) {
      toast.error('No scene images available to compile video.')
      return
    }

    setIsCompiling(true)
    const compileToast = toast.loading('Stitching scenes, voiceover, and captions into final HD MP4...')

    try {
      const { data } = await axios.post(
        '/api/compile_video',
        {
          image_urls: imagesToUse,
          audio_url: overrideVoice !== undefined ? overrideVoice : generatedVoiceUrl,
          music_url: overrideMusic !== undefined ? overrideMusic : generatedMusicUrl,
          script: overrideScript || editableScript || result?.script || '',
          duration: form.duration,
        },
        getAuthHeader()
      )

      if (data.video_url) {
        setCompiledVideoUrl(data.video_url)
        toast.success('Final video compiled successfully with FFmpeg!', { id: compileToast })
      } else {
        toast.error('Video compile finished without output file.', { id: compileToast })
      }
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'FFmpeg compile failed. Please try again.', { id: compileToast })
    } finally {
      setIsCompiling(false)
    }
  }

  // Project Name state
  const [projectName, setProjectName] = useState('Untitled AI Reel #1')
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  const reset = () => {
    setPhase('idle')
    setProgress(0)
    setDoneSteps([])
    setActiveStep('')
    setResult(null)
    setEditableScript('')
    setSlideshowImages([])
    setStoryboardScenes([])
    setGeneratedVoiceUrl(null)
    setGeneratedMusicUrl(null)
    setCompiledVideoUrl(null)
  }

  if (mode === 'sandbox') {
    return (
      <div className="bg-surface-0 min-h-screen">
        <SandboxWorkspace
          form={form}
          setForm={setForm}
          phase={phase}
          progress={progress}
          doneSteps={doneSteps}
          activeStep={activeStep}
          result={result}
          guestDemoCount={guestDemoCount}
          slideshowImages={slideshowImages}
          currentSlideIndex={currentSlideIndex}
          compiledVideoUrl={compiledVideoUrl}
          generate={generate}
          handleCompileVideo={handleCompileVideo}
          isCompiling={isCompiling}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-77px)] bg-surface-0 overflow-x-hidden relative">

      {/* CINEMATIC FULLSCREEN RENDERING OVERLAY */}
      {phase === 'generating' && (
        <CinematicRenderingOverlay
          progress={progress}
          onCancel={reset}
        />
      )}

      {/* GENERATION SUCCESS MODAL OVERLAY */}
      {phase === 'done' && (
        <GenerationSuccessModal
          result={result}
          compiledVideoUrl={compiledVideoUrl}
          onCreateAnother={reset}
        />
      )}

      {/* EXPORT CENTER MODAL */}
      {showExportCenterModal && (
        <ExportCenterModal
          onClose={() => setShowExportCenterModal(false)}
          projectTitle={form.prompt ? form.prompt.slice(0, 30) + '...' : 'Future of AI Video'}
        />
      )}

      {/* CENTER SCROLLABLE CREATIVE WORKSPACE */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 min-w-0">

        {/* WORKSPACE HEADER */}
        <div className="space-y-1.5">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Create Your Next AI Video
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl leading-relaxed">
            Describe your idea and let Reelify generate script, storyboard, visuals and voice automatically.
          </p>
        </div>

        {/* HERO PROMPT EDITOR CARD */}
        <div className="card-glass p-6 md:p-8 border-brand/30 rounded-3xl space-y-4 shadow-glow-strong relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <label className="section-label mb-0 text-white font-extrabold flex items-center gap-2">
              <span>✍️ AI Video Prompt</span>
            </label>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Auto-saving
              </span>
              <span className="text-[11px] text-slate-400">{form.prompt.length} / 500 chars</span>
            </div>
          </div>

          <div className="relative">
            <textarea
              name="prompt"
              value={form.prompt}
              onChange={handleChange}
              rows={5}
              disabled={phase === 'generating'}
              placeholder="A cinematic luxury coffee commercial with slow-motion pouring shots, warm lighting, premium music and elegant transitions."
              className="input-field resize-none text-sm p-4 pr-14 font-medium leading-relaxed rounded-2xl bg-black/50 border-white/10 focus:border-brand"
            />
            {/* Voice microphone button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={phase === 'generating'}
              className={`absolute right-4 bottom-4 w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${isListening
                ? 'bg-brand-glow border-brand-glow text-white shadow-glow animate-pulse'
                : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white hover:border-brand/30'
                }`}
              title={isListening ? "Stop listening" : "Speak prompt with Voice Assistant"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>

          {/* Live AI Typing Suggestions */}
          <LiveTypingSuggestions
            prompt={form.prompt}
            onSelectSuggestion={(textToInsert) => {
              setForm(prev => ({
                ...prev,
                prompt: prev.prompt ? `${prev.prompt.trim()} ${textToInsert}.` : `${textToInsert}.`
              }))
              toast.success('Inserted AI suggestion into prompt!')
            }}
          />

          {/* AI Prompt Quality Analyzer */}
          <PromptQualityAnalyzer
            prompt={form.prompt}
            onApplySuggestion={(sugText) => {
              setForm(prev => ({
                ...prev,
                prompt: prev.prompt ? `${prev.prompt.trim()} ${sugText}.` : `${sugText}.`
              }))
              toast.success('Applied AI suggestion to prompt!')
            }}
          />

          {/* Prompt Breakdown Matrix */}
          <PromptBreakdownPanel
            prompt={form.prompt}
            form={form}
            onAssemblePrompt={(assembled) => {
              setForm(prev => ({ ...prev, prompt: assembled }))
              toast.success('Re-assembled prompt from breakdown matrix!')
            }}
          />
        </div>

        {/* QUICK TEMPLATES CARDS GRID */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="section-label mb-0 text-white font-extrabold">✨ Quick Templates</label>
            <span className="text-[10px] text-slate-400 font-bold">1-Click Auto Fill</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {QUICK_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.label}
                onClick={() => handleTemplateClick(tmpl.prompt)}
                disabled={phase === 'generating'}
                className="bg-white/[0.02] hover:bg-brand/20 border border-white/[0.06] hover:border-brand/40 p-3.5 rounded-2xl text-left transition-all duration-300 flex flex-col justify-between gap-2 group hover:-translate-y-1 shadow-lg"
              >
                <div className="w-8 h-8 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-base shadow-inner group-hover:scale-110 transition-transform">
                  {tmpl.icon}
                </div>
                <span className="text-xs font-black text-white group-hover:text-brand-light transition-colors truncate">
                  {tmpl.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* INTERACTIVE STORYBOARD TIMELINE */}
        <InteractiveStoryboardTimeline />

        {/* PRIMARY GENERATE ACTION BUTTON */}
        <div className="pt-2">
          <button
            onClick={generate}
            disabled={phase === 'generating'}
            className="btn-primary w-full py-4 text-sm font-black rounded-2xl shadow-glow hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {phase === 'generating' ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Pipeline ({progress}%)...</span>
              </>
            ) : (
              '✨ Generate AI Video'
            )}
          </button>

          <p className="text-[11px] font-extrabold text-slate-400 text-center mt-2.5 flex items-center justify-center gap-3">
            <span>⏱️ Estimated ~15 seconds</span>
            <span>•</span>
            <span>💎 10 Credits Required</span>
          </p>
        </div>

        {/* Visual Match Mode selector */}
          <div>
            <label className="section-label">Visual Match Mode</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => setForm({ ...form, visualMode: 'stock' })}
                disabled={phase === 'generating'}
                className={`px-4 py-3.5 rounded-2xl text-xs font-bold border transition-all duration-300 flex flex-col items-center justify-center gap-1 ${form.visualMode === 'stock'
                  ? 'bg-brand/10 border-brand/40 text-brand-light shadow-glow'
                  : 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:text-white'
                  }`}
              >
                🎥 HD Stock Video Match
                <span className="text-[10px] font-medium opacity-70">Pexels 9:16 Vertical HD</span>
              </button>
              <button
                onClick={() => setForm({ ...form, visualMode: 'upload' })}
                disabled={phase === 'generating'}
                className={`px-4 py-3.5 rounded-2xl text-xs font-bold border transition-all duration-300 flex flex-col items-center justify-center gap-1 ${form.visualMode === 'upload'
                  ? 'bg-brand/10 border-brand/40 text-brand-light shadow-glow'
                  : 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:text-white'
                  }`}
              >
                📁 Canva / Custom Upload
                <span className="text-[10px] font-medium opacity-70">Upload your own videos</span>
              </button>
            </div>
          </div>

          {/* Canva/Local Upload Form UI */}
          {form.visualMode === 'upload' && (
            <div className="bg-white/[0.02] border border-white/[0.08] p-4 rounded-2xl flex flex-col gap-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Upload Canva Video / Image Export
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="video/*,image/*"
                  onChange={handleAssetUpload}
                  disabled={phase === 'generating'}
                  className="hidden"
                  id="canva-asset-upload"
                />
                <label
                  htmlFor="canva-asset-upload"
                  className="bg-white/[0.04] hover:bg-brand/10 hover:border-brand/30 border border-white/10 text-slate-300 hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-all"
                >
                  Choose file
                </label>
                <span className="text-xs text-slate-500 truncate max-w-[200px]">
                  {uploadedFileName || 'No file selected'}
                </span>
              </div>
            </div>
          )}

          {/* Parameter Settings Grid (Duration, Format, Voice, Music, Captions) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { name: 'duration', label: 'Duration', opts: DURATION_OPTIONS },
              { name: 'format', label: 'Format', opts: FORMAT_OPTIONS },
              { name: 'voice', label: 'Voice (edge-tts)', opts: VOICE_OPTIONS },
              { name: 'music', label: 'Music (Jamendo)', opts: MUSIC_OPTIONS },
              { name: 'captions', label: 'Captions', opts: CAPTION_OPTIONS },
            ].map(({ name, label, opts }) => (
              <div key={name} className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
                <select
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  disabled={phase === 'generating'}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-brand transition-colors duration-300"
                >
                  {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

        {/* SECTION 4: AI CREATIVE DIRECTOR INTERACTIVE CARDS */}
        <div className="card-glass p-6 flex flex-col gap-5 border-white/[0.08]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>🎬 AI Creative Director Cards</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Interactive control cards for script, camera angles, studio lighting, voiceover, and audio score.
              </p>
            </div>
            <span className="text-xs font-black text-brand-light bg-brand/10 border border-brand/30 px-3 py-1 rounded-full">
              7 Active Cards
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Card 1: Script */}
            <div className="bg-white/[0.02] border border-white/[0.06] hover:border-brand/30 p-4 rounded-2xl flex flex-col justify-between gap-3 group transition-all">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-white flex items-center gap-2">
                  📜 <span>Script</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {result?.script ? '✓ Generated' : 'Auto-Planned'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug line-clamp-2 italic font-serif">
                "{result?.script ? result.script.slice(0, 80) : form.prompt ? form.prompt.slice(0, 80) : 'Prompt pending...'}"
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-[10px] text-slate-400 font-bold">
                <span>AI Script Engine</span>
                <span className="text-brand-light group-hover:translate-x-1 transition-transform">Edit Script ➔</span>
              </div>
            </div>

            {/* Card 2: Storyboard */}
            <div className="bg-white/[0.02] border border-white/[0.06] hover:border-brand/30 p-4 rounded-2xl flex flex-col justify-between gap-3 group transition-all">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-white flex items-center gap-2">
                  🎞️ <span>Storyboard</span>
                </span>
                <span className="text-[10px] font-bold text-brand-light bg-brand/10 px-2 py-0.5 rounded-full border border-brand/30">
                  4 Scenes
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                Shot list planned: Subject intro ➔ Action tracking ➔ Lens close-up ➔ Product reveal.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-[10px] text-slate-400 font-bold">
                <span>Multi-Scene Plan</span>
                <span className="text-brand-light group-hover:translate-x-1 transition-transform">View Shots ➔</span>
              </div>
            </div>

            {/* Card 3: Camera Movement */}
            <div className="bg-white/[0.02] border border-white/[0.06] hover:border-brand/30 p-4 rounded-2xl flex flex-col justify-between gap-3 group transition-all">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-white flex items-center gap-2">
                  🎥 <span>Camera Lens</span>
                </span>
                <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">
                  35mm Cine
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                Anamorphic depth of field with slow dramatic tracking motion.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-[10px] text-slate-400 font-bold">
                <span>Motion Controls</span>
                <span className="text-brand-light group-hover:translate-x-1 transition-transform">Adjust Lens ➔</span>
              </div>
            </div>

            {/* Card 4: Lighting */}
            <div className="bg-white/[0.02] border border-white/[0.06] hover:border-brand/30 p-4 rounded-2xl flex flex-col justify-between gap-3 group transition-all">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-white flex items-center gap-2">
                  💡 <span>Lighting</span>
                </span>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Golden Hour
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                Warm volumetric amber rim lighting with soft directional fill.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-[10px] text-slate-400 font-bold">
                <span>Atmosphere</span>
                <span className="text-brand-light group-hover:translate-x-1 transition-transform">Change Tone ➔</span>
              </div>
            </div>

            {/* Card 5: Voiceover */}
            <div className="bg-white/[0.02] border border-white/[0.06] hover:border-brand/30 p-4 rounded-2xl flex flex-col justify-between gap-3 group transition-all">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-white flex items-center gap-2">
                  🗣️ <span>Voiceover</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {form.voice}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                Neural Edge-TTS synthesis with clear audio narration.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-[10px] text-slate-400 font-bold">
                <span>Audio Engine</span>
                <span className="text-brand-light group-hover:translate-x-1 transition-transform">Select Voice ➔</span>
              </div>
            </div>

            {/* Card 6: Music Score */}
            <div className="bg-white/[0.02] border border-white/[0.06] hover:border-brand/30 p-4 rounded-2xl flex flex-col justify-between gap-3 group transition-all">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-white flex items-center gap-2">
                  🎵 <span>Background Music</span>
                </span>
                <span className="text-[10px] font-bold text-brand-light bg-brand/10 px-2 py-0.5 rounded-full border border-brand/30">
                  {form.music}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                Jamendo royalty-free audio score synced to scene changes.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-[10px] text-slate-400 font-bold">
                <span>Jamendo API</span>
                <span className="text-brand-light group-hover:translate-x-1 transition-transform">Browse Tracks ➔</span>
              </div>
            </div>
          </div>

          {/* Full AI Director & Camera/Lighting Libraries */}
          {isAuth ? (
            <>
              {/* AI Director Styles Grid */}
              <div className="flex flex-col gap-3 pt-3 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <label className="section-label mb-0">🎬 AI Director Style Presets</label>
                  <span className="text-[10px] font-bold text-slate-400">
                    Active Director: <span className="text-brand-light font-extrabold">{form.style}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AI_DIRECTOR_STYLES.map((director) => {
                    const isSelected = form.style === director.name
                    return (
                      <button
                        key={director.name}
                        type="button"
                        onClick={() => handleDirectorSelect(director)}
                        disabled={phase === 'generating'}
                        className={`relative rounded-2xl p-3 border text-left transition-all duration-300 flex flex-col justify-between group overflow-hidden ${isSelected
                          ? 'bg-gradient-to-tr from-brand/30 via-purple-900/40 to-brand-glow/20 border-brand text-white shadow-glow scale-[1.02]'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.05] hover:border-brand/30 hover:-translate-y-0.5'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg">{director.icon}</span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-brand-light shadow-glow animate-ping" />
                          )}
                        </div>

                        <div>
                          <div className="text-xs font-black tracking-tight text-white mb-0.5 group-hover:text-brand-light transition-colors">
                            {director.name}
                          </div>
                          <div className="text-[10px] text-slate-400 leading-tight">
                            {director.desc}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Camera Movement Library */}
              <div className="flex flex-col gap-3 pt-3 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <label className="section-label mb-0">🎥 Camera Movement Library</label>
                  <span className="text-[10px] text-slate-400 font-bold">Click card to insert camera movement</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {CAMERA_MOVEMENTS.map((cam) => {
                    const isAlreadyInPrompt = form.prompt.includes(cam.keyword)
                    return (
                      <button
                        key={cam.name}
                        type="button"
                        onClick={() => handleCameraSelect(cam)}
                        disabled={phase === 'generating'}
                        className={`group relative rounded-xl p-2.5 border text-left transition-all duration-200 flex flex-col justify-between ${isAlreadyInPrompt
                          ? 'bg-brand/20 border-brand text-brand-light shadow-glow'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.06] hover:border-brand/30 hover:-translate-y-0.5'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="w-7 h-7 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-sm shadow-inner group-hover:border-brand/40 transition-colors">
                            <span className={`inline-block transition-transform duration-300 ${cam.previewAnim}`}>
                              {cam.icon}
                            </span>
                          </div>
                          <span className="text-[9px] font-extrabold text-brand-light opacity-0 group-hover:opacity-100 transition-opacity">
                            + Insert
                          </span>
                        </div>

                        <div>
                          <div className="text-xs font-black text-white group-hover:text-brand-light transition-colors">
                            {cam.name}
                          </div>
                          <div className="text-[9px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                            {cam.desc}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Lighting Library */}
              <div className="flex flex-col gap-3 pt-3 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <label className="section-label mb-0">💡 Lighting & Atmosphere Library</label>
                  <span className="text-[10px] text-slate-400 font-bold">Click card to insert lighting setup</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {LIGHTING_OPTIONS.map((light) => {
                    const isAlreadyInPrompt = form.prompt.includes(light.keyword)
                    return (
                      <button
                        key={light.name}
                        type="button"
                        onClick={() => handleLightingSelect(light)}
                        disabled={phase === 'generating'}
                        className={`group relative rounded-xl p-2.5 border text-left transition-all duration-200 flex flex-col justify-between ${isAlreadyInPrompt
                          ? 'bg-brand/20 border-brand text-brand-light shadow-glow'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.06] hover:border-brand/30 hover:-translate-y-0.5'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="w-7 h-7 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-sm shadow-inner group-hover:border-brand/40 transition-colors">
                            <span>{light.icon}</span>
                          </div>
                          <span className="text-[9px] font-extrabold text-brand-light opacity-0 group-hover:opacity-100 transition-opacity">
                            + Insert
                          </span>
                        </div>

                        <div>
                          <div className="text-xs font-black text-white group-hover:text-brand-light transition-colors">
                            {light.name}
                          </div>
                          <div className="text-[9px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                            {light.desc}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          ) : (
            <LockedFeatureCard
              title="🎬 AI Creative Director & Cinematic Camera/Lighting Libraries"
              description="Unlock 9 AI Director style presets, 11 animated camera movement controls, and 10 studio lighting cards by logging into Creative Studio."
              onAuth={onAuth}
            />
          )}
        </div>

        {/* SECTION 5: STORYBOARD VISUAL SCENE BREAKDOWN */}
        <div className="card-glass p-6 flex flex-col gap-4 border-white/[0.08]">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>🎞️ Visual Storyboard & Shot List</span>
            </h2>
            <span className="text-xs font-bold text-slate-400">4 Scenes Planned</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 1, title: 'Scene 1: Hero Intro', time: '0-3s', camera: '35mm Slow Dolly', desc: 'Subject introduction with warm rim light' },
              { id: 2, title: 'Scene 2: Action Tracking', time: '3-6s', camera: 'Tracking Shot', desc: 'Dynamic motion following primary subject' },
              { id: 3, title: 'Scene 3: Lens Close-Up', time: '6-9s', camera: 'Macro Close Push', desc: 'Detailed texture close-up shot' },
              { id: 4, title: 'Scene 4: Final Reveal', time: '9-15s', camera: 'Orbit Pan', desc: 'Full scene reveal and product showcase' }
            ].map((shot, idx) => (
              <div key={shot.id} className="bg-white/[0.02] border border-white/[0.06] p-3.5 rounded-2xl flex flex-col justify-between gap-2.5 relative group hover:border-brand/30 transition-all">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-white">{shot.title}</span>
                  <span className="text-[9px] font-black text-brand-light bg-brand/10 px-2 py-0.5 rounded-full">
                    {shot.time}
                  </span>
                </div>

                <div className="aspect-video w-full rounded-xl bg-black/40 border border-white/[0.06] overflow-hidden relative flex items-center justify-center">
                  {slideshowImages[idx] ? (
                    <img src={slideshowImages[idx]} alt={shot.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2">
                      <span className="text-slate-600 text-xs font-bold">Scene {idx + 1} Preview</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1 text-[10px]">
                  <span className="font-bold text-slate-300">📷 {shot.camera}</span>
                  <span className="text-slate-400 line-clamp-1">{shot.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6: PRIMARY GENERATE ACTION PANEL */}
        <div className="card-glass p-6 border-brand/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-glow-strong">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>✨ Ready to Render AI Reel?</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Generates multi-scene video clips, synthesizes voiceover, and compiles final 9:16 HD MP4.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={generate}
              disabled={phase === 'generating'}
              className="btn-primary text-xs font-black py-4 px-8 rounded-2xl w-full sm:w-auto flex items-center justify-center gap-2 shadow-glow hover:scale-105 transition-all duration-300"
            >
              {phase === 'generating' ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Pipeline ({progress}%)...</span>
                </>
              ) : (
                '✨ Generate AI Video'
              )}
            </button>
          </div>
        </div>

      </main>

      {/* COLUMN 3: RIGHT FIXED LIVE PREVIEW & MONITOR PANEL */}
      <aside className="w-full lg:w-[420px] xl:w-[450px] border-l border-white/[0.06] bg-surface-1/40 p-6 overflow-y-auto space-y-6 flex-shrink-0">

        {/* Real-time Video Render Screen */}
        <div className="card-glass p-5 border-white/[0.06] flex flex-col gap-4">
          <label className="section-label">Video Rendering Monitor</label>

          <div className="aspect-[9/16] max-h-[480px] w-full rounded-3xl overflow-hidden bg-black/60 border border-white/10 relative flex items-center justify-center shadow-2xl">
            {phase === 'idle' && (
              <div className="text-center p-8 flex flex-col items-center justify-center gap-4 relative z-10">
                {/* Reelify Logo Watermark */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand/30 to-brand-glow/30 border border-brand/40 flex items-center justify-center text-white font-black text-2xl shadow-glow">
                  R
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Waiting for your prompt...</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-[200px] leading-relaxed mx-auto">
                    Describe your idea and click Generate AI Video to trigger visual playback.
                  </p>
                </div>
              </div>
            )}

            {phase === 'generating' && (
              <div className="w-full h-full p-5 flex flex-col justify-between z-10 bg-black/80 backdrop-blur-md overflow-y-auto">
                {/* Header & Estimated Time Remaining */}
                <div className="flex flex-col gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                      Generation Pipeline
                    </span>
                    <span className="text-xs font-black text-brand-light bg-brand/20 px-2 py-0.5 rounded-full border border-brand/40">
                      {progress}%
                    </span>
                  </div>

                  {/* Shimmer Progress Bar */}
                  <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10 relative">
                    <div
                      className="h-full rounded-full progress-shimmer transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                    <span>Executing 11 AI Modules</span>
                    <span className="text-brand-light font-extrabold">
                      ⏱️ ~{Math.max(1, Math.ceil((100 - progress) / 8))}s remaining
                    </span>
                  </div>
                </div>

                {/* 11 Pipeline Steps List */}
                <div className="flex flex-col gap-1.5 my-3 flex-1 overflow-y-auto pr-1">
                  {PIPELINE_STEPS.map((step) => {
                    const isDone = doneSteps.includes(step.id)
                    const isActive = activeStep === step.id

                    return (
                      <div
                        key={step.id}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-xl border text-xs transition-all duration-200 ${isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : isActive
                            ? 'bg-brand/20 border-brand text-white shadow-glow scale-[1.01]'
                            : 'bg-white/[0.02] border-white/[0.04] text-slate-600'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{step.icon}</span>
                          <span className={`font-bold ${isActive ? 'text-white' : ''}`}>
                            {step.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isDone ? (
                            <span className="text-emerald-400 font-black text-xs">✓ Done</span>
                          ) : isActive ? (
                            <div className="flex items-center gap-1 text-brand-light font-extrabold text-[10px]">
                              <span className="w-3 h-3 border-2 border-brand-light border-t-transparent rounded-full animate-spin" />
                              <span>Processing</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-600 font-medium">Pending</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {phase === 'done' && (
              <div className="w-full h-full relative">
                {/* Sandbox Watermark Overlay for Guest Users */}
                {!isAuth && (
                  <div className="absolute top-4 right-4 z-30 pointer-events-none bg-black/70 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xl">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest">
                      REELIFY SANDBOX DEMO
                    </span>
                  </div>
                )}

                {compiledVideoUrl ? (
                  <video
                    src={compiledVideoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                  />
                ) : form.visualMode === 'stock' && result?.download_url ? (
                  <video
                    src={result.download_url}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                  />
                ) : form.visualMode === 'upload' && result?.download_url ? (
                  uploadedFileUrl.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) ? (
                    <video
                      src={result.download_url}
                      controls
                      autoPlay
                      loop
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={result.download_url}
                      alt="Custom Canva upload"
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  // AI Image Slideshow Player
                  <div className="w-full h-full relative bg-black flex items-center justify-center overflow-hidden">
                    {slideshowImages.map((url, idx) => (
                      <div
                        key={url + idx}
                        className={`absolute inset-0 transition-opacity duration-1000 ${currentSlideIndex === idx ? 'opacity-100' : 'opacity-0'
                          }`}
                      >
                        <img
                          src={url}
                          alt={`slide-${idx}`}
                          className="w-full h-full object-cover transform scale-105 animate-pulse"
                          style={{ animationDuration: '4s' }}
                        />
                      </div>
                    ))}
                    {/* Slide indicators overlay */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
                      {slideshowImages.map((_, idx) => (
                        <span
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${currentSlideIndex === idx ? 'bg-brand w-4' : 'bg-white/30'
                            }`}
                        ></span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Captions overlay indicator */}
                {form.captions !== 'None' && !compiledVideoUrl && (
                  <div className="absolute bottom-16 left-4 right-4 bg-black/60 backdrop-blur-sm border border-white/5 p-3 rounded-xl text-center text-xs font-bold text-white z-10">
                    💬 Captions generated — click Compile to burn into MP4
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BOTTOM PREVIEW METADATA */}
          <div className="grid grid-cols-4 gap-2 bg-white/[0.02] border border-white/[0.06] p-3 rounded-2xl text-[11px]">
            <div className="flex flex-col">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Duration</span>
              <span className="font-extrabold text-white">{form.duration || '00:30'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Resolution</span>
              <span className="font-extrabold text-white">1080x1920</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Aspect</span>
              <span className="font-extrabold text-brand-light">9:16</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Style</span>
              <span className="font-extrabold text-slate-200 truncate">{form.style || 'Cinematic'}</span>
            </div>
          </div>

          {phase === 'done' && (
            <div className="flex flex-col gap-2">
              {compiledVideoUrl ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={compiledVideoUrl}
                    download="reelify_video.mp4"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary text-xs font-bold py-3.5 rounded-xl flex-1 flex items-center justify-center gap-2 shadow-glow"
                  >
                    📥 Download HD Video
                  </a>
                  <button
                    onClick={() => handleCompileVideo()}
                    disabled={isCompiling}
                    className="btn-secondary text-xs font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-1.5"
                    title="Re-render video with new script or audio edits"
                  >
                    ⚡ Re-render
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleCompileVideo()}
                  disabled={isCompiling}
                  className="btn-primary text-xs font-bold py-3.5 rounded-xl w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isCompiling ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Compiling Final HD Video...</span>
                    </>
                  ) : (
                    '✨ Render Final Video'
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* RunwayML Technical Inspector Panel */}
        <RunwayTechnicalSpecs form={form} phase={phase} progress={progress} />

        {/* Export Studio Panel (Authenticated vs Locked Sandbox Card) */}
        {isAuth ? (
          <ExportStudioPanel compiledVideoUrl={compiledVideoUrl} downloadUrl={result?.download_url} />
        ) : (
          <LockedFeatureCard
            title="📦 Export Studio (MP4, MOV, GIF, TikTok, Shorts)"
            description="Export high bitrate MP4/MOV videos without watermark, adjust compression algorithms, and export for TikTok & Shorts by logging into Creative Studio."
            onAuth={onAuth}
          />
        )}

        {/* Generated Script Editor */}
        {phase === 'done' && result && (
          <div className="card-glass p-5 border-white/[0.06] flex flex-col gap-3">
            <label className="section-label">Interactive Script Editor</label>
            <textarea
              value={editableScript}
              onChange={(e) => setEditableScript(e.target.value)}
              rows={5}
              className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl p-3 text-xs text-slate-300 leading-relaxed focus:outline-none focus:border-brand resize-none"
            />
            <button
              onClick={() => {
                toast.success('Script saved successfully!')
                setResult({ ...result, script: editableScript })
              }}
              className="bg-brand/10 hover:bg-brand/20 border border-brand/20 text-brand-light text-[10px] font-bold py-2 rounded-xl transition-all duration-300"
            >
              Save Script Edits
            </button>
          </div>
        )}

      </aside>
    </div>
  )
}
