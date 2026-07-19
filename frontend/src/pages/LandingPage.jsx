import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  { 
    color: 'from-brand to-brand-glow', 
    title: 'AI Scriptwriting', 
    desc: 'Describe your concept in natural language. Our dual-engine writer builds a viral short-form script optimized for audience watch-time.',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )
  },
  { 
    color: 'from-blue-500 to-indigo-500', 
    title: 'Dynamic Asset Matching', 
    desc: 'Intelligently parses generated keywords and automatically queries stock video clips matching your theme with fluid B-rolls.',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    color: 'from-amber-500 to-orange-500', 
    title: 'Voice Assistant Promoter', 
    desc: 'Speak your creative prompts directly into the app using our voice assistant module for completely hands-free workspace setup.',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    )
  },
  { 
    color: 'from-teal-500 to-emerald-500', 
    title: 'Pre-designed Templates', 
    desc: 'Launch short-form video generation in a single click with pre-populated parameters optimized for animals, technology, and travel.',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  },
  { 
    color: 'from-cyan-500 to-blue-500', 
    title: 'Dynamic Ken Burns Slideshow', 
    desc: 'Compiles custom generated images with animated panning and zoom effects, synced to caption displays for a premium storytelling feel.',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  },
]

export default function LandingPage({ onAuth }) {
  const navigate = useNavigate()
  const { isAuth } = useAuth()

  // Voice Assistant state
  const [isListening, setIsListening] = useState(false)
  const [voiceText, setVoiceText] = useState('')

  const handleListen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser. Please try Chrome or Safari.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.lang = 'en-US'
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      setVoiceText(text)
    }

    recognition.start()
  }

  const navigateWithPrompt = () => {
    if (!voiceText) return
    navigate('/generate', { state: { initialPrompt: voiceText } })
  }

  return (
    <main className="min-h-screen relative overflow-hidden pb-20">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-brand-glow/10 rounded-full blur-3xl -z-10"></div>

      {/* Hero Section */}
      <section className="relative text-center px-6 pt-24 pb-16 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 rounded-full px-4 py-1.5 text-xs font-semibold text-brand-light mb-8 shadow-glow">
          <span className="animate-pulse">✦</span> Next-Gen AI Video Studio
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-white">
          Turn Ideas Into <br />
          <span className="bg-gradient-to-r from-brand-light via-brand-glow to-purple-400 bg-clip-text text-transparent">
            Viral Reels in Seconds
          </span>
        </h1>
        
        <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed">
          Write a simple prompt. Reelify's unified AI platform writes your script, gathers the visual assets, and renders your finished video — instantly.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button 
            onClick={() => navigate('/generate')} 
            className="btn-primary text-sm px-8 py-4 rounded-2xl flex items-center gap-2 group shadow-glow"
          >
            Create a Video Now
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          {!isAuth && (
            <button 
              onClick={() => onAuth('signup')} 
              className="btn-secondary text-sm px-8 py-4 rounded-2xl"
            >
              Sign up free
            </button>
          )}
        </div>
      </section>

      {/* Interactive Voice Assistant Sandbox Section (Kept ABOVE Platform Demonstration) */}
      <section className="px-6 mb-16 max-w-3xl mx-auto">
        <div className="card-glass p-6 md:p-8 border-brand/20 relative shadow-glow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-glow/10 rounded-full blur-2xl"></div>
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              🎙 Voice Assistant Sandbox
            </h2>
            <p className="text-xs text-slate-400">Click the microphone to command a prompt verbally, then send it straight to the editor.</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleListen}
              className={`w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-300 ${
                isListening 
                  ? 'bg-brand-glow border-brand-glow text-white shadow-glow-strong scale-110 animate-pulse'
                  : 'bg-white/[0.04] border-white/10 text-slate-300 hover:border-brand/40 hover:text-white'
              }`}
            >
              {isListening ? (
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>

            <div className="w-full bg-black/35 rounded-2xl border border-white/[0.06] p-4 min-h-[70px] flex items-center justify-center text-center">
              {isListening ? (
                <p className="text-xs text-brand-light italic">Listening... Speak now</p>
              ) : voiceText ? (
                <p className="text-xs text-white leading-normal font-medium">{voiceText}</p>
              ) : (
                <p className="text-xs text-slate-500">Your dictated prompt will appear here.</p>
              )}
            </div>

            {voiceText && (
              <button
                onClick={navigateWithPrompt}
                className="btn-primary text-xs px-5 py-2.5 rounded-xl shadow-glow animate-fade-in"
              >
                Go to Generation Studio ↗
              </button>
            )}
          </div>
        </div>
      </section>

      {/* UI Showcase / Mockup Area (Kept BELOW Voice Assistant Sandbox) */}
      <section className="px-6 mb-24 max-w-5xl mx-auto">
        <div className="card-glass p-3 relative shadow-glow-strong">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-brand/25 to-brand-glow/25 blur-xl opacity-40 -z-10"></div>
          <div className="bg-surface-0 rounded-2xl border border-white/[0.04] p-5 aspect-[16/9] flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 bg-cover bg-center opacity-70 filter blur-[1px]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000')" }}></div>
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 bg-surface-0/60 backdrop-blur-md rounded-2xl max-w-md border border-white/10">
              <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white mb-4 animate-bounce">
                ▶
              </div>
              <p className="text-white font-extrabold text-lg mb-2">Platform Demonstration</p>
              <p className="text-xs text-slate-300 leading-normal">
                Generates script and video content based on your prompt, automatically streams matching high-quality visuals, and compiles the final output instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-3">Everything you need to go viral</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">Zero editing skills required. Just describe your idea, choose your style, and let AI render the rest.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card-glass p-6 hover:bg-white/[0.04] border-white/[0.04] hover:border-white/[0.08] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className={`w-11 h-11 bg-gradient-to-tr ${f.color} rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-3">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
