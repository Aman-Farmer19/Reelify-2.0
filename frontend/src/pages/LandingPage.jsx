import React from 'react'
import { useNavigate } from 'react-router-dom'

const features = [
  { icon: '✦', color: 'bg-brand/20', title: 'AI Script Generation', desc: 'Describe your idea in plain text. Our AI writes a compelling short-form script optimised for engagement.' },
  { icon: '◈', color: 'bg-indigo-500/20', title: 'Auto Visual Matching', desc: 'Scenes are automatically matched with relevant visuals, transitions, and B-roll using generative AI.' },
  { icon: '⚡', color: 'bg-green-500/20', title: 'One-click Export', desc: 'Download in 9:16 or 16:9 format, ready to post on Instagram, YouTube, or TikTok instantly.' },
  { icon: '♬', color: 'bg-amber-500/20', title: 'AI Voiceover', desc: 'Choose from 20+ AI voices. Natural-sounding narration added automatically to your video.' },
  { icon: '⬡', color: 'bg-pink-500/20', title: 'Brand Presets', desc: 'Save your brand colors, fonts, and logo. Every video is auto-styled to match your identity.' },
  { icon: '◉', color: 'bg-cyan-500/20', title: 'Smart Subtitles', desc: 'Auto-generated captions synced perfectly to the audio with beautiful animated styles.' },
]

export default function LandingPage({ onAuth }) {
  const navigate = useNavigate()

  return (
    <main>
      {/* Hero */}
      <section className="relative text-center px-6 py-20 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(124,58,237,0.15) 0%, transparent 65%)' }}>
        <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/30 rounded-full px-4 py-1.5 text-xs text-brand-light mb-8">
          <span>✦</span> Powered by Generative AI
        </div>
        <h1 className="gradient-text text-5xl font-extrabold leading-tight max-w-2xl mx-auto mb-5">
          Turn your ideas into short videos in seconds
        </h1>
        <p className="text-slate-400 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
          Write a prompt. Reelify's AI generates a script, visuals, and edits your reel — instantly.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button onClick={() => navigate('/generate')} className="btn-primary text-base px-7 py-3.5 rounded-xl">
            Generate a video ↗
          </button>
          <button onClick={() => onAuth('signup')} className="btn-ghost text-base px-7 py-3.5 rounded-xl">
            Sign up free
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 pb-16 max-w-5xl mx-auto">
        <h2 className="text-center text-2xl font-bold text-white mb-2">Everything you need to go viral</h2>
        <p className="text-center text-slate-400 text-sm mb-10">No editing skills required. Just describe, generate, and post.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="card p-5">
              <div className={`w-10 h-10 ${f.color} rounded-xl flex items-center justify-center text-lg mb-4`}>
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
