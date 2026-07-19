import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  { 
    color: 'from-brand to-brand-glow', 
    title: 'AI Scriptwriting', 
    desc: 'Input your topic or idea. Our AI writes a compelling short-form script optimized to catch user attention in the first 3 seconds.',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )
  },
  { 
    color: 'from-blue-500 to-indigo-500', 
    title: 'Dynamic Asset Matching', 
    desc: 'Automatically matches generated keywords with beautiful, high-quality, royalty-free stock footage or custom AI image slideshows.',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    color: 'from-purple-500 to-pink-500', 
    title: 'Custom AI Images', 
    desc: 'Don\'t want stock? Generate custom, free AI illustrations on the fly using Pollinations.ai, animated with premium zoom effects.',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
      </svg>
    )
  },
  { 
    color: 'from-amber-500 to-orange-500', 
    title: 'Integrated Video Stream', 
    desc: 'Bypasses hotlinking protection blocks by proxying all remote video downloads securely through a local Flask backend stream.',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    color: 'from-teal-500 to-emerald-500', 
    title: 'Dual-API Failover', 
    desc: 'If Gemini hits quota restrictions, the backend automatically fails over to OpenAI GPT-4o-mini to guarantee script delivery.',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  { 
    color: 'from-cyan-500 to-blue-500', 
    title: 'Unified Server Architecture', 
    desc: 'Both frontend static files and backend APIs run under a single port. No cross-origin problems, no server complications.',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    )
  },
]

export default function LandingPage({ onAuth }) {
  const navigate = useNavigate()
  const { isAuth } = useAuth()

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

      {/* UI Showcase / Mockup Area */}
      <section className="px-6 mb-24 max-w-5xl mx-auto">
        <div className="card-glass p-3 relative shadow-glow-strong">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-brand/25 to-brand-glow/25 blur-xl opacity-40 -z-10"></div>
          <div className="bg-surface-0 rounded-2xl border border-white/[0.04] p-5 aspect-[16/9] flex items-center justify-center overflow-hidden relative">
            {/* Displaying mockup details inside showcase */}
            <div className="absolute inset-0 bg-cover bg-center opacity-70 filter blur-[1px]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000')" }}></div>
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 bg-surface-0/60 backdrop-blur-md rounded-2xl max-w-md border border-white/10">
              <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white mb-4 animate-bounce">
                ▶
              </div>
              <p className="text-white font-extrabold text-lg mb-2">Platform Demonstration</p>
              <p className="text-xs text-slate-300 leading-normal">
                Generates scripts dynamically with Gemini / OpenAI, automatically streams background videos, and handles complete user auth.
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
