import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'

const DURATION_OPTIONS = ['15 seconds', '30 seconds', '60 seconds', '90 seconds']
const FORMAT_OPTIONS = ['9:16 (Reels/Shorts)', '16:9 (YouTube)', '1:1 (Feed Post)']
const STYLE_OPTIONS = ['Dynamic', 'Cinematic', 'Minimal', 'Bold', 'Vintage']
const VOICE_OPTIONS = ['Aria (Female)', 'Marcus (Male)', 'Zara (Female)', 'Leo (Male)', 'No Voice']
const MUSIC_OPTIONS = ['Upbeat Electronic', 'Cinematic Epic', 'Lo-Fi Chill', 'Corporate', 'No Music']
const CAPTION_OPTIONS = ['Animated Bold', 'Clean White', 'Neon Glow', 'None']

const GEN_STEPS = [
  { id: 'script', label: 'Writing AI script' },
  { id: 'visuals', label: 'Selecting visuals' },
  { id: 'voice', label: 'Adding voiceover & music' },
  { id: 'render', label: 'Final render' },
]

export default function Generator() {
  const { token } = useAuth()
  const [form, setForm] = useState({
    prompt: '',
    duration: '60 seconds',
    format: '9:16 (Reels/Shorts)',
    style: 'Cinematic',
    voice: 'Marcus (Male)',
    music: 'Upbeat Electronic',
    captions: 'Animated Bold',
  })
  const [phase, setPhase] = useState('idle') // idle | generating | done
  const [progress, setProgress] = useState(0)
  const [activeStep, setActiveStep] = useState('')
  const [doneSteps, setDoneSteps] = useState([])
  const [result, setResult] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const generate = async () => {
    if (!form.prompt.trim()) { toast.error('Please enter a prompt first!'); return }
    setPhase('generating')
    setProgress(0)
    setDoneSteps([])
    setResult(null)

    // Simulate step-by-step progress
    const steps = ['script', 'visuals', 'voice', 'render']
    const pcts = [25, 55, 78, 100]

    for (let i = 0; i < steps.length; i++) {
      setActiveStep(steps[i])
      setProgress(pcts[i])
      await new Promise((r) => setTimeout(r, 1200))
      setDoneSteps((prev) => [...prev, steps[i]])
    }

    // Call backend API
    try {
      const { data } = await axios.post(
        '/api/generate',
        { prompt: form.prompt, options: form },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setResult(data)
    } catch {
      // Use demo result if backend not running
      setResult({
        title: form.prompt.length > 50 ? form.prompt.substring(0, 50) + '…' : form.prompt,
        script: `Here is an AI-generated script for: "${form.prompt}". The script is optimised for short-form content with a hook in the first 3 seconds, followed by 3 key points and a strong call-to-action.`,
        duration: form.duration,
        format: form.format,
        style: form.style,
        download_url: '#',
      })
    }

    setActiveStep('')
    setPhase('done')
  }

  const reset = () => {
    setPhase('idle')
    setProgress(0)
    setDoneSteps([])
    setActiveStep('')
    setResult(null)
  }

  return (
    <div className="flex min-h-[calc(100vh-57px)]">
      <Sidebar />
      <main className="flex-1 p-7 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold text-white mb-1">Generate a video</h1>
          <p className="text-sm text-slate-400 mb-6">Describe what you want — our AI handles the script, visuals, and editing.</p>

          {/* Prompt box */}
          <div className="card p-5 mb-4">
            <label className="section-label">Your prompt</label>
            <textarea
              name="prompt"
              value={form.prompt}
              onChange={handleChange}
              rows={4}
              disabled={phase === 'generating'}
              placeholder="e.g. Create a 60-second reel about the top 3 benefits of learning to code in 2025, with an energetic tech vibe and motivational tone..."
              className="input-field resize-none"
            />

            {/* Options grid */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { name: 'duration', label: 'Duration', opts: DURATION_OPTIONS },
                { name: 'format', label: 'Format', opts: FORMAT_OPTIONS },
                { name: 'style', label: 'Style', opts: STYLE_OPTIONS },
                { name: 'voice', label: 'Voice', opts: VOICE_OPTIONS },
                { name: 'music', label: 'Music', opts: MUSIC_OPTIONS },
                { name: 'captions', label: 'Captions', opts: CAPTION_OPTIONS },
              ].map(({ name, label, opts }) => (
                <div key={name}>
                  <label className="text-[10px] text-slate-500 block mb-1.5">{label}</label>
                  <select
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    disabled={phase === 'generating'}
                    className="w-full bg-surface-1 border border-border rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-brand"
                  >
                    {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={generate}
                disabled={phase === 'generating'}
                className="btn-primary text-sm px-6 py-2.5 rounded-xl disabled:opacity-50"
              >
                ✦ Generate Video
              </button>
              {phase === 'done' && (
                <button onClick={reset} className="btn-ghost text-sm px-5 py-2.5 rounded-xl">
                  Generate Another
                </button>
              )}
            </div>
          </div>

          {/* Progress */}
          {phase === 'generating' && (
            <div className="card p-5 mb-4">
              <p className="text-sm text-slate-300 mb-3">
                {GEN_STEPS.find((s) => s.id === activeStep)?.label || 'Processing...'}
              </p>
              <div className="h-2 bg-surface-1 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full progress-shimmer rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {GEN_STEPS.map((s) => {
                  const done = doneSteps.includes(s.id)
                  const active = activeStep === s.id
                  return (
                    <span
                      key={s.id}
                      className={`text-[11px] px-3 py-1 rounded-full border transition-all ${
                        done
                          ? 'bg-green-500/10 border-green-500/50 text-green-400'
                          : active
                          ? 'bg-brand/10 border-brand/50 text-brand-light'
                          : 'bg-surface-1 border-border text-slate-500'
                      }`}
                    >
                      {done ? '✓ ' : active ? '◉ ' : '○ '}
                      {s.label}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Result */}
          {phase === 'done' && result && (
            <div className="card p-5 border-green-500/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-green-400">✓ Your video is ready!</span>
                <a href={result.download_url || '#'} className="btn-primary text-xs px-4 py-2 rounded-lg">
                  ⬇ Download
                </a>
              </div>

              {/* Fake video thumbnail */}
              <div className="h-52 rounded-xl flex items-center justify-center text-5xl mb-4 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1a0a3a 0%, #0a1a4a 100%)' }}>
                🎬
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-white text-2xl cursor-pointer hover:bg-white/20 transition-all">
                    ▶
                  </div>
                </div>
              </div>

              <p className="text-sm font-semibold text-white mb-2">{result.title}</p>
              <div className="flex gap-2 flex-wrap mb-4">
                {[result.duration, result.format, result.style, 'AI Generated'].map((t) => t && (
                  <span key={t} className="text-[11px] px-2.5 py-0.5 rounded-full bg-brand/20 border border-brand/40 text-brand-light">
                    {t}
                  </span>
                ))}
              </div>

              {result.script && (
                <div className="bg-surface-1 rounded-xl p-4 border border-border">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Generated Script</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{result.script}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
