import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const STYLES = [
  { id: 'Cinematic', label: 'Cinematic', icon: '🎬', desc: '35mm anamorphic film look with shallow depth of field' },
  { id: 'Luxury', label: 'Luxury', icon: '💎', desc: 'Warm golden hour rim light with elegant transitions' },
  { id: 'Corporate', label: 'Corporate', icon: '💼', desc: 'Clean high-contrast professional presentation style' },
  { id: 'Anime', label: 'Anime', icon: '🌸', desc: 'Vibrant cell-shaded animation aesthetics' },
  { id: 'Minimal', label: 'Minimal', icon: '✨', desc: 'Sleek dark background with bold typography' },
  { id: 'Documentary', label: 'Documentary', icon: '📜', desc: 'Raw authentic footage with ambient narration' },
  { id: 'Hyper Realistic', label: 'Hyper Realistic', icon: '📸', desc: '8k photorealistic Octane render details' },
]

const PLATFORMS = [
  { id: 'Instagram', label: 'Instagram', icon: '📸' },
  { id: 'TikTok', label: 'TikTok', icon: '🎵' },
  { id: 'YouTube Shorts', label: 'YouTube Shorts', icon: '▶️' },
  { id: 'LinkedIn', label: 'LinkedIn', icon: '💼' },
  { id: 'Facebook', label: 'Facebook', icon: '📘' },
]

const EXAMPLE_PROMPTS = [
  { label: '☕ Luxury Coffee Advertisement', text: 'A cinematic luxury coffee commercial with slow-motion pouring shots, warm lighting, and elegant transitions.' },
  { label: '🏝 Travel Reel', text: 'Serene aerial vlog over tropical island beaches with turquoise water and warm ambient music.' },
  { label: '🚀 Startup Product Demo', text: 'Sleek tech product reveal video with glowing neon overlays and futuristic UI animations.' },
  { label: '🏋️ Fitness Motivation', text: 'High-intensity athletic gym workout reel with fast cuts and aggressive rim lighting.' },
  { label: '🎙️ Podcast Clip', text: 'Engaging podcast highlight reel with animated bold captions and acoustic backing track.' },
]

export default function AICreativeDirectorWizard({ onClose }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  // Configured Wizard State
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('Cinematic')
  const [platform, setPlatform] = useState('Instagram')
  const [duration, setDuration] = useState('30')
  const [aspectRatio, setAspectRatio] = useState('9:16')
  const [voice, setVoice] = useState('Male')
  const [music, setMusic] = useState('Inspirational')
  const [isListening, setIsListening] = useState(false)

  // Microphone Voice Handler
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice input is not supported in this browser.')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setPrompt(prev => prev ? `${prev} ${transcript}` : transcript)
      toast.success('Voice prompt captured!')
    }

    recognition.start()
  }

  // Final Submission -> Navigate to Creative Studio
  const handleCompleteWizard = () => {
    if (onClose) onClose()
    navigate('/app/studio', {
      state: {
        initialPrompt: prompt || 'A cinematic luxury short video with ambient music and narration.',
        initialStyle: style,
        initialPlatform: platform,
        initialDuration: duration,
        initialAspectRatio: aspectRatio,
        initialVoice: voice,
        initialMusic: music,
      }
    })
    toast.success('AI Director configured your Creative Studio workspace!')
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in select-none">
      
      {/* Main Glass Wizard Card */}
      <div className="card-glass border-brand/40 rounded-3xl p-6 sm:p-8 md:p-10 max-w-3xl w-full space-y-8 shadow-glow-strong relative z-10 my-auto overflow-hidden">
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-all"
          >
            ✕
          </button>
        )}

        {/* Top 5-Step Stepper Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
              <span>AI Director Wizard</span>
            </span>
            <span className="text-brand-light font-extrabold">Step {step} of 5</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-full rounded-full transition-all duration-300 ${
                  i <= step ? 'bg-gradient-to-r from-brand to-brand-glow shadow-glow' : 'bg-white/[0.04]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ─── STEP 1: WELCOME ─── */}
        {step === 1 && (
          <div className="space-y-8 text-center py-4 animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand to-brand-glow border border-brand/40 flex items-center justify-center text-4xl shadow-glow mx-auto animate-bounce">
              🎬
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Welcome to Reelify AI Director
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Let's build your next high-converting video in under 30 seconds.
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              className="btn-primary text-sm font-black py-4 px-10 rounded-2xl shadow-glow hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <span>Start Building</span>
              <span>➔</span>
            </button>
          </div>
        )}

        {/* ─── STEP 2: WHAT DO YOU WANT TO CREATE? ─── */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white tracking-tight">
                What do you want to create?
              </h2>
              <p className="text-xs text-slate-400">
                Describe your video idea in natural language or choose an example prompt below.
              </p>
            </div>

            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder="A cinematic luxury coffee commercial for Instagram Reels with slow-motion pouring shots and warm lighting..."
                className="input-field resize-none text-sm p-4 pr-14 rounded-2xl bg-black/50 border-white/15 focus:border-brand"
              />
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`absolute right-4 bottom-4 w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  isListening ? 'bg-brand-glow border-brand-glow text-white shadow-glow animate-pulse' : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white'
                }`}
                title="Speak prompt with Voice Assistant"
              >
                🎙️
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                Popular Inspirations
              </label>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((ex) => (
                  <button
                    key={ex.label}
                    onClick={() => setPrompt(ex.text)}
                    className="bg-white/[0.03] hover:bg-brand/20 border border-white/[0.08] hover:border-brand/40 text-slate-300 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 3: CHOOSE YOUR STYLE ─── */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Choose your style
              </h2>
              <p className="text-xs text-slate-400">
                Select an AI visual director style preset to guide shot selection and color grading.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[320px] overflow-y-auto pr-1">
              {STYLES.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStyle(st.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between gap-2 group hover:-translate-y-1 ${
                    style === st.id
                      ? 'bg-brand/25 border-brand text-white shadow-glow'
                      : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-base shadow-inner group-hover:scale-110 transition-transform">
                    {st.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white truncate">{st.label}</h4>
                    <p className="text-[9px] text-slate-400 line-clamp-2 leading-tight mt-0.5">{st.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── STEP 4: VIDEO SETTINGS ─── */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Video Settings
              </h2>
              <p className="text-xs text-slate-400">
                Configure export platform, clip duration, and video aspect ratio.
              </p>
            </div>

            {/* Target Platform */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Target Platform</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {PLATFORMS.map((plat) => (
                  <button
                    key={plat.id}
                    onClick={() => setPlatform(plat.id)}
                    className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                      platform === plat.id ? 'bg-brand/25 border-brand text-white shadow-glow' : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{plat.icon}</span>
                    <span className="truncate">{plat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Duration</label>
              <div className="grid grid-cols-4 gap-2">
                {['15', '30', '45', '60'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`py-3 rounded-2xl border text-center text-xs font-black transition-all ${
                      duration === d ? 'bg-brand/25 border-brand text-white shadow-glow' : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                    }`}
                  >
                    {d} Seconds
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { ratio: '9:16', label: '9:16 Vertical', icon: '📱' },
                  { ratio: '1:1', label: '1:1 Square', icon: '⏹️' },
                  { ratio: '16:9', label: '16:9 Landscape', icon: '🖥️' },
                ].map((ar) => (
                  <button
                    key={ar.ratio}
                    onClick={() => setAspectRatio(ar.ratio)}
                    className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      aspectRatio === ar.ratio ? 'bg-brand/25 border-brand text-white shadow-glow' : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{ar.icon}</span>
                    <span>{ar.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 5: VOICE & MUSIC + FINAL SUMMARY ─── */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Voice & Music Setup
              </h2>
              <p className="text-xs text-slate-400">
                Choose Edge-TTS voice synthesis and background soundtrack style.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Voice */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Neural Voice</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Male', label: '👨 Male' },
                    { id: 'Female', label: '👩 Female' },
                    { id: 'None', label: '🚫 None' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVoice(v.id)}
                      className={`py-3 rounded-2xl border text-center text-xs font-bold transition-all ${
                        voice === v.id ? 'bg-brand/25 border-brand text-white shadow-glow' : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Music */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Soundtrack</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Epic', 'Corporate', 'Lo-Fi', 'Inspirational', 'None'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMusic(m)}
                      className={`py-2.5 rounded-2xl border text-center text-xs font-bold transition-all ${
                        music === m ? 'bg-brand/25 border-brand text-white shadow-glow' : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Summary Box */}
            <div className="bg-white/[0.02] border border-brand/30 p-4 rounded-2xl space-y-2">
              <label className="text-[10px] font-black text-brand-light uppercase tracking-wider block">
                📋 Configured Project Summary
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold text-slate-300">
                <div>Style: <span className="text-white">{style}</span></div>
                <div>Platform: <span className="text-white">{platform}</span></div>
                <div>Format: <span className="text-white">{duration}s ({aspectRatio})</span></div>
                <div>Audio: <span className="text-white">{voice} / {music}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          {step > 1 ? (
            <button
              onClick={() => setStep(prev => prev - 1)}
              className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white text-xs font-bold px-5 py-3 rounded-2xl transition-all"
            >
              ⬅ Back
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              onClick={() => setStep(prev => prev + 1)}
              className="btn-primary text-xs font-black px-7 py-3.5 rounded-2xl shadow-glow hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Next Step</span>
              <span>➔</span>
            </button>
          ) : (
            <button
              onClick={handleCompleteWizard}
              className="btn-primary text-xs font-black px-8 py-3.5 rounded-2xl shadow-glow hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>🚀 Launch Creative Studio</span>
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
