import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'



// 10 Fixed Cinematic Topics for Auto-Command Prompt Sandbox
const PRESET_TOPICS = [
  {
    id: 'horse',
    label: '🐎 Majestic Wild Horse',
    prompt: 'A majestic white horse running through desert sand dunes, golden hour lighting, cinematic.',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    imageUrl: 'https://image.pollinations.ai/prompt/Majestic%20white%20horse%20running%20in%20desert%20dunes%20photorealistic?width=1024&height=1024&seed=10'
  },
  {
    id: 'space',
    label: '👨‍🚀 Astronaut Space Walk',
    prompt: 'An astronaut slowly floating in open space, reflection of Earth in the visor, realistic.',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    imageUrl: 'https://image.pollinations.ai/prompt/Astronaut%20floating%20in%20deep%20space%20with%20earth%20reflection%20photorealistic?width=1024&height=1024&seed=20'
  },
  {
    id: 'tiger',
    label: '🐯 Tiger in Snow',
    prompt: 'A majestic Siberian tiger walking slowly through thick snow in a dense pine forest.',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    imageUrl: 'https://image.pollinations.ai/prompt/Majestic%20Siberian%20tiger%20walking%20in%20snowy%20pine%20forest%20photorealistic?width=1024&height=1024&seed=30'
  },
  {
    id: 'mountain',
    label: '🌅 Mountain Drone View',
    prompt: 'Breathtaking drone flyover of snow-capped mountains at sunrise, clouds parting, 8k.',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    imageUrl: 'https://image.pollinations.ai/prompt/Breathtaking%20aerial%20drone%20flyover%20of%20snowy%20mountain%20peaks%20at%20sunrise?width=1024&height=1024&seed=40'
  },
  {
    id: 'chef',
    label: '🍳 Chef Sizzling Pan',
    prompt: 'Close up of a professional chef flipping pasta in a hot skillet with a burst of fire.',
    videoUrl: 'https://github.com/intel-iot-devkit/sample-videos/raw/master/classroom.mp4',
    imageUrl: 'https://image.pollinations.ai/prompt/Close%20up%20of%20chef%20cooking%20in%20high%20end%20kitchen%20with%20fire%20flare%20photorealistic?width=1024&height=1024&seed=50'
  },
  {
    id: 'car',
    label: '🚗 Cyberpunk Sports Car',
    prompt: 'A sleek black sports car driving fast along a wet neon-lit highway at night, cyberpunk reflections.',
    videoUrl: 'https://github.com/intel-iot-devkit/sample-videos/raw/master/people-detection.mp4',
    imageUrl: 'https://image.pollinations.ai/prompt/Cyberpunk%20sports%20car%20driving%20on%20wet%20neon-lit%20highway%20at%20night%208k?width=1024&height=1024&seed=60'
  },
  {
    id: 'aurora',
    label: '🌌 Aurora Over Lake',
    prompt: 'Stunning green aurora lights dancing across the starry night sky over a quiet lake, realistic.',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    imageUrl: 'https://image.pollinations.ai/prompt/Aurora%20borealis%20green%20lights%20dancing%20over%20quiet%20northern%20lake%20photorealistic?width=1024&height=1024&seed=70'
  },
  {
    id: 'coffee',
    label: '☕ Espresso Slow Pour',
    prompt: 'Creamy hot coffee espresso being poured slowly into a glass mug, slow motion, cinematic.',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    imageUrl: 'https://image.pollinations.ai/prompt/Creamy%20hot%20coffee%20espresso%20pouring%20into%20glass%20mug%20slow%20motion%20photorealistic?width=1024&height=1024&seed=80'
  },
  {
    id: 'coding',
    label: '💻 Minimalist Developer',
    prompt: 'A clean coding workspace setup with ambient purple backlighting, code scrolling on screen.',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    imageUrl: 'https://image.pollinations.ai/prompt/Clean%20minimalist%20coding%20setup%20with%20ambient%20purple%20glow%20on%20desk?width=1024&height=1024&seed=90'
  },
  {
    id: 'surf',
    label: '🏄 Surfer Wave Barrel',
    prompt: 'A surfer riding inside the barrel of a massive crystal-clear blue ocean wave, realistic.',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    imageUrl: 'https://image.pollinations.ai/prompt/Surfer%20riding%20inside%20barrel%20of%20huge%20blue%20wave%20spray%20photorealistic?width=1024&height=1024&seed=100'
  },
]

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

  // Sandbox States
  const [selectedTopic, setSelectedTopic] = useState(PRESET_TOPICS[0])
  const [generationType, setGenerationType] = useState('video') // video | image
  const [sandboxPhase, setSandboxPhase] = useState('idle') // idle | rendering | done
  const [sandboxProgress, setSandboxProgress] = useState(0)
  const [sandboxResultUrl, setSandboxResultUrl] = useState('')
  const [usedTrialCount, setUsedTrialCount] = useState(() => {
    return parseInt(localStorage.getItem('sandbox_generations_count') || '0', 10)
  })

  // Scroll to sandbox
  const scrollToSandbox = () => {
    const sandboxElement = document.getElementById('sandbox-container')
    if (sandboxElement) {
      sandboxElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Handle Free Sandbox Trial (up to 3 times)
  const generateSandboxDemo = async () => {
    const currentCount = parseInt(localStorage.getItem('sandbox_generations_count') || '0', 10)
    
    if (currentCount >= 3) {
      toast.error('You have reached your limit of 3 free demo generations! Please sign up to access the full studio.')
      onAuth('signup')
      return
    }

    setSandboxPhase('rendering')
    setSandboxProgress(0)

    // Simulate realistic generation steps
    const simulationTime = 3000 // 3 seconds
    const intervalTime = 100
    const increment = 100 / (simulationTime / intervalTime)

    const timer = setInterval(() => {
      setSandboxProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return Math.min(prev + increment, 100)
      })
    }, intervalTime)

    await new Promise(resolve => setTimeout(resolve, simulationTime))

    // Set the result URL based on selection
    if (generationType === 'video') {
      setSandboxResultUrl(`/api/video_stream?url=${encodeURIComponent(selectedTopic.videoUrl)}`)
    } else {
      setSandboxResultUrl(`/api/generate_image?prompt=${encodeURIComponent(selectedTopic.prompt)}&seed=${42 + currentCount}`)
    }

    // Increment trial count up to 3
    const newCount = currentCount + 1
    localStorage.setItem('sandbox_generations_count', newCount.toString())
    setUsedTrialCount(newCount)
    setSandboxPhase('done')
    toast.success(`Demo generated! (${newCount}/3 free generations used)`)
  }

  return (
    <main className="min-h-screen relative overflow-hidden pb-24 bg-surface-0">
      
      {/* ─── GOOGLE FLOW STYLE MEDIA WALL BACKGROUND ─── */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-3.5 opacity-20 -z-20 overflow-hidden scale-105 pointer-events-none select-none">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div 
            key={idx} 
            className="aspect-[9/16] md:aspect-[3/4] bg-gradient-to-br from-white/[0.01] to-white/[0.04] rounded-3xl border border-white/[0.03] relative overflow-hidden flex items-center justify-center"
          >
            <div className="absolute w-24 h-24 rounded-full bg-brand/10 blur-xl"></div>
          </div>
        ))}
      </div>
      
      {/* Background radial overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-0/30 via-surface-0/60 to-surface-0 -z-10 pointer-events-none"></div>

      {/* ─── HERO BRANDING HEADER (Google Flow Layout) ─── */}
      <section className="relative text-center px-6 pt-32 pb-20 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white mb-6 select-none">
          Reelify
        </h1>
        
        <p className="text-slate-300 text-base md:text-lg font-medium max-w-xl mb-12 leading-relaxed text-slate-400">
          An AI-Powered platform that turns your prompts into stunning short videos — automatically.
        </p>

        <button 
          onClick={scrollToSandbox}
          className="bg-white text-black font-extrabold text-sm px-8 py-4 rounded-full hover:bg-slate-200 transition-all duration-300 shadow-2xl hover:scale-105"
        >
          Create with Reelify
        </button>
      </section>

      {/* ─── INTERACTIVE SANDBOX: TRY WITH REELIFY ─── */}
      <section id="sandbox-container" className="px-6 mb-28 max-w-4xl mx-auto scroll-mt-24">
        <div className="card-glass p-8 md:p-10 border-brand/20 relative shadow-glow-strong">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/25 rounded-full px-4 py-1.5 text-xs font-bold text-brand-light mb-4 shadow-glow">
              ⚡ Try Reelify Demo ({Math.max(0, 3 - usedTrialCount)} / 3 Free Generations Left)
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              Free Generation Sandbox
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Select one of the 10 cinematic preset prompts below. Get up to 3 free photorealistic image or video generations before signing up.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Preset Prompts Selection & Controls */}
            <div className="flex-1 flex flex-col gap-6">
              <div>
                <label className="section-label">Select a Preset Cinematic Topic</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                  {PRESET_TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => {
                        if (sandboxPhase !== 'rendering') {
                          setSelectedTopic(topic)
                        }
                      }}
                      className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all duration-300 ${
                        selectedTopic.id === topic.id
                          ? 'bg-brand/10 border-brand/40 text-brand-light'
                          : 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Options Selection */}
              <div>
                <label className="section-label">Generation Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setGenerationType('video')}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all duration-300 ${
                      generationType === 'video'
                        ? 'bg-brand/15 border-brand/40 text-brand-light shadow-glow'
                        : 'bg-white/[0.02] border-white/[0.05] text-slate-400'
                    }`}
                  >
                    🎥 Video Rendering
                  </button>
                  <button
                    onClick={() => setGenerationType('image')}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all duration-300 ${
                      generationType === 'image'
                        ? 'bg-brand/15 border-brand/40 text-brand-light shadow-glow'
                        : 'bg-white/[0.02] border-white/[0.05] text-slate-400'
                    }`}
                  >
                    🎨 Image generation
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  if (usedTrialCount >= 3) {
                    toast.error('Free trial limit reached (3/3). Please sign up to continue generating!')
                    onAuth('signup')
                  } else {
                    generateSandboxDemo()
                  }
                }}
                disabled={sandboxPhase === 'rendering'}
                className="btn-primary text-xs font-bold py-4 rounded-xl shadow-glow w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {sandboxPhase === 'rendering' 
                  ? 'Rendering Free Trial...' 
                  : usedTrialCount >= 3 
                    ? '🔒 3/3 Free Limit Reached — Sign Up to Unlock Studio' 
                    : `Generate Free Demo (${3 - usedTrialCount} Left)`}
              </button>

              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3.5 text-center flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400">Want to generate custom videos with your own prompts?</span>
                <button
                  onClick={() => onAuth('signup')}
                  className="text-[11px] font-bold text-brand-light hover:underline whitespace-nowrap"
                >
                  Sign up for Full Studio →
                </button>
              </div>
            </div>

            {/* Right: Render Preview Screen */}
            <div className="w-full lg:w-[320px] flex flex-col gap-4">
              <label className="section-label">Rendering Screen Monitor</label>
              
              <div className="aspect-[9/16] max-h-[380px] w-full rounded-2xl overflow-hidden bg-surface-0 border border-white/[0.04] relative flex items-center justify-center shadow-inner">
                {sandboxPhase === 'idle' && (
                  <div className="text-center p-6 flex flex-col items-center gap-2">
                    <div className="text-2xl animate-pulse">📺</div>
                    <p className="text-[10px] text-slate-500 font-bold">Screen Offline</p>
                    <p className="text-[9px] text-slate-600 leading-normal max-w-[160px]">Select a cinematic topic and click Generate to start.</p>
                  </div>
                )}

                {sandboxPhase === 'rendering' && (
                  <div className="text-center p-6 flex flex-col items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-brand/20 border-t-brand animate-spin"></div>
                      <span className="text-[9px] font-extrabold text-brand-light">{Math.round(sandboxProgress)}%</span>
                    </div>
                    <p className="text-[10px] font-bold text-white">Rendering visuals...</p>
                  </div>
                )}

                {sandboxPhase === 'done' && sandboxResultUrl && (
                  <div className="w-full h-full">
                    {generationType === 'video' ? (
                      <video
                        src={sandboxResultUrl}
                        controls
                        autoPlay
                        loop
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={sandboxResultUrl}
                        alt="AI Generation sandbox"
                        className="w-full h-full object-cover transform scale-105 animate-pulse"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {sandboxPhase === 'done' && (
            <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-brand/20 via-brand-glow/20 to-brand/20 border border-brand/40 text-center flex flex-col sm:flex-row items-center justify-between gap-4 shadow-glow">
              <div className="text-left">
                <p className="text-sm font-extrabold text-white">✨ Ready for Original & Custom Video Generation?</p>
                <p className="text-xs text-slate-300">Sign up free to access the full Reelify Studio, script editor & high-res exports.</p>
              </div>
              <button
                onClick={() => onAuth('signup')}
                className="bg-white text-black text-xs font-black px-6 py-3 rounded-xl hover:bg-slate-200 transition-all whitespace-nowrap shadow-lg"
              >
                Sign Up for Real Studio →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── BRAND PREVIEW SHOWCASE ─── */}
      <section className="px-6 mb-28 max-w-5xl mx-auto">
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

      {/* ─── DYNAMIC FEATURES GRID ─── */}
      <section id="features" className="px-6 max-w-5xl mx-auto scroll-mt-24">
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

      {/* ─── PRICING SECTION ─── */}
      <section id="pricing" className="px-6 mt-28 max-w-5xl mx-auto scroll-mt-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/25 rounded-full px-4 py-1.5 text-xs font-bold text-brand-light mb-4">
            💎 Pricing
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Simple, transparent pricing</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">Start free, upgrade when you're ready. No hidden fees.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Tier */}
          <div className="card-glass p-8 border-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
            <h3 className="text-lg font-bold text-white mb-2">Free</h3>
            <p className="text-3xl font-black text-white mb-1">$0<span className="text-sm font-medium text-slate-500">/mo</span></p>
            <p className="text-xs text-slate-400 mb-6">Perfect to get started</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-xs text-slate-300"><span className="text-brand-light">✓</span> 1 free generation</li>
              <li className="flex items-center gap-2 text-xs text-slate-300"><span className="text-brand-light">✓</span> 10 preset templates</li>
              <li className="flex items-center gap-2 text-xs text-slate-300"><span className="text-brand-light">✓</span> Standard quality</li>
              <li className="flex items-center gap-2 text-xs text-slate-500"><span className="text-slate-600">✗</span> No voice assistant</li>
            </ul>
            <button onClick={() => onAuth('signup')} className="btn-secondary w-full py-3 text-xs font-bold">Get Started</button>
          </div>

          {/* Pro Tier */}
          <div className="card-glass p-8 border-brand/30 relative shadow-glow-strong">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand to-brand-glow text-white text-[10px] font-bold px-4 py-1 rounded-full">
              MOST POPULAR
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Pro</h3>
            <p className="text-3xl font-black text-white mb-1">$19<span className="text-sm font-medium text-slate-500">/mo</span></p>
            <p className="text-xs text-slate-400 mb-6">For creators & marketers</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-xs text-slate-300"><span className="text-brand-light">✓</span> 100 generations/mo</li>
              <li className="flex items-center gap-2 text-xs text-slate-300"><span className="text-brand-light">✓</span> HD quality output</li>
              <li className="flex items-center gap-2 text-xs text-slate-300"><span className="text-brand-light">✓</span> Voice assistant</li>
              <li className="flex items-center gap-2 text-xs text-slate-300"><span className="text-brand-light">✓</span> Custom templates</li>
            </ul>
            <button onClick={() => onAuth('signup')} className="btn-primary w-full py-3 text-xs font-bold">Upgrade to Pro</button>
          </div>

          {/* Enterprise Tier */}
          <div className="card-glass p-8 border-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
            <h3 className="text-lg font-bold text-white mb-2">Enterprise</h3>
            <p className="text-3xl font-black text-white mb-1">$49<span className="text-sm font-medium text-slate-500">/mo</span></p>
            <p className="text-xs text-slate-400 mb-6">For teams & agencies</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-xs text-slate-300"><span className="text-brand-light">✓</span> Unlimited generations</li>
              <li className="flex items-center gap-2 text-xs text-slate-300"><span className="text-brand-light">✓</span> 4K cinematic quality</li>
              <li className="flex items-center gap-2 text-xs text-slate-300"><span className="text-brand-light">✓</span> Priority rendering</li>
              <li className="flex items-center gap-2 text-xs text-slate-300"><span className="text-brand-light">✓</span> API access & support</li>
            </ul>
            <button onClick={() => onAuth('signup')} className="btn-secondary w-full py-3 text-xs font-bold">Contact Sales</button>
          </div>
        </div>
      </section>

      {/* ─── ABOUT SECTION ─── */}
      <section id="about" className="px-6 mt-28 max-w-4xl mx-auto scroll-mt-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/25 rounded-full px-4 py-1.5 text-xs font-bold text-brand-light mb-4">
            🎬 About Reelify
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Built for the next generation of creators</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Reelify is an AI-powered creative platform designed to transform the way content is produced. 
            From scriptwriting to cinematic rendering, our engine automates every step of short-form video creation — 
            so you can focus on ideas, not editing software.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="card-glass p-6">
            <p className="text-3xl font-black text-brand-light mb-2">10K+</p>
            <p className="text-xs text-slate-400 font-semibold">Videos Generated</p>
          </div>
          <div className="card-glass p-6">
            <p className="text-3xl font-black text-brand-light mb-2">50+</p>
            <p className="text-xs text-slate-400 font-semibold">AI Models Integrated</p>
          </div>
          <div className="card-glass p-6">
            <p className="text-3xl font-black text-brand-light mb-2">99.9%</p>
            <p className="text-xs text-slate-400 font-semibold">Uptime Guaranteed</p>
          </div>
        </div>
      </section>

      {/* ─── CONTACT SECTION ─── */}
      <section id="contact" className="px-6 mt-28 mb-12 max-w-2xl mx-auto scroll-mt-24">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/25 rounded-full px-4 py-1.5 text-xs font-bold text-brand-light mb-4">
            ✉️ Contact
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Get in touch</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">Have questions, feedback, or partnership ideas? Drop us a message.</p>
        </div>
        <div className="card-glass p-8">
          <form onSubmit={(e) => { e.preventDefault(); toast.success('Message sent! We\'ll get back to you soon.') }} className="space-y-4">
            <div>
              <label className="section-label">Your Name</label>
              <input type="text" placeholder="ABC" required className="input-field" />
            </div>
            <div>
              <label className="section-label">Email</label>
              <input type="email" placeholder="you@example.com" required className="input-field" />
            </div>
            <div>
              <label className="section-label">Message</label>
              <textarea placeholder="Tell us what you're thinking..." rows={4} required className="input-field resize-none" />
            </div>
            <button type="submit" className="btn-primary w-full py-3 text-sm font-bold">Send Message</button>
          </form>
        </div>
      </section>
    </main>
  )
}
