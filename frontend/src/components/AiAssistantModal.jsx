import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

// Predefined topic suggestion pills
const predefinedPills = [
  { label: '🏎️ Speed Car', word: 'car' },
  { label: '🐶 Cute Puppy', word: 'puppy' },
  { label: '🪐 Deep Space', word: 'space' },
  { label: '☕ Morning Coffee', word: 'coffee' },
  { label: '🧘 Fitness Grind', word: 'workout' },
  { label: '🍳 Aesthetic Food', word: 'recipe' },
  { label: '💻 Cyberpunk AI', word: 'cyberpunk' },
  { label: '🌊 Ocean Waves', word: 'ocean' },
]

// Fallback generator for instant response on single word
const generatePromptsForWord = (word) => {
  const w = word.trim()
  const capitalized = w.charAt(0).toUpperCase() + w.slice(1)

  return [
    {
      id: 1,
      style: 'Cinematic',
      title: `Cinematic ${capitalized} Story`,
      prompt: `A dramatic 9:16 vertical short reel featuring a cinematic ${w} with stunning neon lighting, slow-motion camera movement, and high-contrast atmospheric depth.`,
    },
    {
      id: 2,
      style: 'Vibrant & Dynamic',
      title: `Fast-Paced ${capitalized} Reel`,
      prompt: `An energetic 9:16 vertical short showing a high-speed ${w} action sequence, vibrant color grading, quick cuts, and viral aesthetic.`,
    },
    {
      id: 3,
      style: 'Minimalist & Calm',
      title: `Aesthetic ${capitalized} Mood`,
      prompt: `A serene 9:16 vertical video of a calm ${w} in warm golden hour light, macro lens focus, subtle motion, and cozy aesthetic.`,
    },
    {
      id: 4,
      style: 'Futuristic AI',
      title: `Cyberpunk ${capitalized} Vision`,
      prompt: `A futuristic 9:16 vertical visual of a glowing ${w} in a hyper-detailed 3D digital world with holographic effects and ray-traced reflections.`,
    }
  ]
}

export default function AiAssistantModal({ onClose }) {
  const navigate = useNavigate()
  const [wordInput, setWordInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState(() => generatePromptsForWord('car'))
  const [activeWord, setActiveWord] = useState('car')

  const generate = async (wordToUse) => {
    const targetWord = (wordToUse || wordInput).trim()
    if (!targetWord) {
      toast.error('Please enter a word or pick a suggestion pill!')
      return
    }

    setLoading(true)
    setActiveWord(targetWord)
    const loadToast = toast.loading(`Generating prompt options for "${targetWord}"...`)

    try {
      // Try backend AI suggestion
      const { data } = await axios.post('/api/ai/suggest', { topic: targetWord })
      if (data && data.prompt) {
        const primary = {
          id: 1,
          style: data.style || 'Cinematic',
          title: data.suggested_title || `Viral ${targetWord} Video`,
          prompt: data.prompt,
        }
        const generatedOthers = generatePromptsForWord(targetWord).slice(1)
        setOptions([primary, ...generatedOthers])
      } else {
        setOptions(generatePromptsForWord(targetWord))
      }
      toast.success(`Found 4 prompt options for "${targetWord}"!`, { id: loadToast })
    } catch (err) {
      setOptions(generatePromptsForWord(targetWord))
      toast.success(`Found 4 prompt options for "${targetWord}"!`, { id: loadToast })
    } finally {
      setLoading(false)
    }
  }

  const handleUsePrompt = (promptText, styleText) => {
    localStorage.setItem('reelify_ai_suggested_prompt', promptText)
    if (styleText) localStorage.setItem('reelify_ai_suggested_style', styleText)
    toast.success('Prompt copied into Studio! Launching...')
    onClose()
    navigate('/generate')
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-surface-1/95 border border-brand/30 rounded-3xl p-5 md:p-6 max-w-lg w-full relative shadow-2xl animate-fade-in flex flex-col gap-4 max-h-[88vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand to-brand-glow flex items-center justify-center text-white text-sm shadow-glow font-bold">
              🤖
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white leading-tight">AI Prompt Assistant</h3>
              <p className="text-[11px] text-slate-400">Type a word to get instant viral prompt options</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-bold w-7 h-7 rounded-full bg-white/[0.04] flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        {/* Input Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={wordInput}
            onChange={(e) => setWordInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generate()}
            placeholder="Type a word (e.g. puppy, space, car, coffee)..."
            className="input-field text-xs flex-1 py-2.5"
          />
          <button
            onClick={() => generate()}
            disabled={loading}
            className="btn-primary text-xs font-bold px-4 py-2.5 rounded-xl disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Thinking...' : '✨ Get Options'}
          </button>
        </div>

        {/* Predefined Topic Pills Suggestion Bar */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Quick Suggestion Pills:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {predefinedPills.map((pill) => (
              <button
                key={pill.label}
                onClick={() => {
                  setWordInput(pill.word)
                  generate(pill.word)
                }}
                disabled={loading}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl border whitespace-nowrap transition-all ${activeWord.toLowerCase() === pill.word
                    ? 'bg-brand/20 border-brand text-brand-light font-bold'
                    : 'bg-white/[0.03] border-white/[0.06] text-slate-300 hover:text-white hover:border-white/15'
                  }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generated Options Stack */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-brand-light uppercase tracking-wider">
              Prompt Options for "{activeWord}":
            </span>
            <span className="text-[10px] text-slate-500">{options.length} options ready</span>
          </div>

          {options.map((opt) => (
            <div
              key={opt.id}
              className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-brand/30 p-3 rounded-2xl transition-all duration-200 flex flex-col gap-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-white truncate group-hover:text-brand-light transition-colors">
                  {opt.title}
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-brand/15 text-brand-light border border-brand/30 flex-shrink-0">
                  {opt.style}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 bg-black/40 p-2.5 rounded-xl border border-white/5 leading-relaxed italic">
                "{opt.prompt}"
              </p>

              <button
                onClick={() => handleUsePrompt(opt.prompt, opt.style)}
                className="bg-brand hover:bg-brand-dark text-white text-[11px] font-bold py-1.5 px-3 rounded-xl shadow-glow transition-all flex items-center justify-center gap-1 self-end mt-0.5"
              >
                <span>✨ Use Prompt in Studio</span>
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
