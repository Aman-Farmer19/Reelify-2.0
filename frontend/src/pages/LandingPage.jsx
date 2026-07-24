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

// Showcase Presets Data (Coffee, Fitness, Travel, Car, Food, Tech)
const SHOWCASE_PRESETS = [
  {
    id: 'coffee',
    category: 'Commercial',
    icon: '☕',
    title: 'Coffee Advertisement',
    prompt: 'A cinematic luxury coffee advertisement for Instagram Reels with slow-motion pouring shots, warm lighting and elegant typography.',
    checklist: [
      'Script Generated',
      'Storyboard Created',
      'Camera Plan Ready (35mm Anamorphic)',
      'Voice Selected (Aria Warm Tone)',
      'Music Selected (Upbeat Jazz & Chill)'
    ],
    scenes: ['Coffee Beans', 'Grinding', 'Pouring', 'Product Reveal'],
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    posterUrl: 'https://image.pollinations.ai/prompt/Creamy%20hot%20coffee%20espresso%20pouring%20into%20glass%20mug%20slow%20motion%20photorealistic?width=720&height=1280&seed=80',
    tag: 'Reels 9:16'
  },
  {
    id: 'fitness',
    category: 'Motivation',
    icon: '🏋️',
    title: 'Fitness Motivation',
    prompt: 'High-energy fitness motivational reel with fast-paced cuts, intense gym workout action, volumetric lighting, and dramatic voiceover.',
    checklist: [
      'Script Generated',
      'Storyboard Created',
      'Camera Plan Ready (Handheld Tracking)',
      'Voice Selected (Guy Energetic Tone)',
      'Music Selected (Aggressive Rock Beat)'
    ],
    scenes: ['Warmup Focus', 'Heavy Lifts', 'Sweat & Drive', 'Victory Shot'],
    videoUrl: 'https://github.com/intel-iot-devkit/sample-videos/raw/master/classroom.mp4',
    posterUrl: 'https://image.pollinations.ai/prompt/Aggressive%20gym%20workout%20crossfit%20athlete%20cinematic%20lighting%20photorealistic?width=720&height=1280&seed=12',
    tag: 'TikTok 9:16'
  },
  {
    id: 'travel',
    category: 'Vlog',
    icon: '⛩️',
    title: 'Travel Japan',
    prompt: 'A breathtaking 4K travel vlog reel showcasing neon Tokyo streets, serene Kyoto temples, bullet trains, and Mount Fuji at sunrise.',
    checklist: [
      'Script Generated',
      'Storyboard Created',
      'Camera Plan Ready (Drone Smooth Glide)',
      'Voice Selected (Jenny Calm Accent)',
      'Music Selected (Lo-fi Chill Hop)'
    ],
    scenes: ['Kyoto Temple', 'Shinjuku Neon', 'Bullet Train', 'Fuji Sunrise'],
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    posterUrl: 'https://image.pollinations.ai/prompt/Tokyo%20neon%20street%20rain%20reflections%20japan%20travel%20vlog%20cinematic?width=720&height=1280&seed=70',
    tag: 'YouTube Shorts 9:16'
  },
  {
    id: 'car',
    category: 'Automotive',
    icon: '🏎️',
    title: 'Luxury Car',
    prompt: 'Sleek black supercar driving fast along wet neon city streets at night with rain reflections and 35mm cinematic lens flare.',
    checklist: [
      'Script Generated',
      'Storyboard Created',
      'Camera Plan Ready (Low Dolly Tracking)',
      'Voice Selected (Davis Deep Voice)',
      'Music Selected (Cyberpunk Synthwave)'
    ],
    scenes: ['Engine Ignition', 'Rain Drift', 'Cockpit View', 'Neon Highway'],
    videoUrl: 'https://github.com/intel-iot-devkit/sample-videos/raw/master/people-detection.mp4',
    posterUrl: 'https://image.pollinations.ai/prompt/Cyberpunk%20sports%20car%20driving%20on%20wet%20neon-lit%20highway%20at%20night%208k?width=720&height=1280&seed=60',
    tag: 'Reels 9:16'
  },
  {
    id: 'food',
    category: 'Culinary',
    icon: '🍕',
    title: 'Food Commercial',
    prompt: 'Mouth-watering artisanal pizza commercial featuring sizzling cheese pull, wood-fired oven flames, and macro close-ups.',
    checklist: [
      'Script Generated',
      'Storyboard Created',
      'Camera Plan Ready (Macro Slow Push)',
      'Voice Selected (Amber Smooth Voice)',
      'Music Selected (Acoustic Upbeat)'
    ],
    scenes: ['Dough Toss', 'Wood Oven', 'Cheese Pull', 'Final Plating'],
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    posterUrl: 'https://image.pollinations.ai/prompt/Close%20up%20of%20chef%20cooking%20in%20high%20end%20kitchen%20with%20fire%20flare%20photorealistic?width=720&height=1280&seed=50',
    tag: 'Reels 9:16'
  },
  {
    id: 'tech',
    category: 'Software',
    icon: '🤖',
    title: 'AI Technology',
    prompt: 'Futuristic AI software demo reel with holographic data nodes, glowing glass interface, and clean modern aesthetic.',
    checklist: [
      'Script Generated',
      'Storyboard Created',
      'Camera Plan Ready (FPV Flythrough)',
      'Voice Selected (Steffan Tech Voice)',
      'Music Selected (Ambient Tech Beat)'
    ],
    scenes: ['Prompt Input', 'Neural Process', 'Voice Synthesis', 'Exported Reel'],
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    posterUrl: 'https://image.pollinations.ai/prompt/Clean%20minimalist%20coding%20setup%20with%20ambient%20purple%20glow%20on%20desk?width=720&height=1280&seed=90',
    tag: 'Shorts 9:16'
  }
]

// Animated Product Showcase Section
function ProductShowcaseSection() {
  const [activePresetIndex, setActivePresetIndex] = useState(0)
  const [progressPercentage, setProgressPercentage] = useState(0)

  useEffect(() => {
    const duration = 5000 // Auto switch every 5s
    const interval = 50
    let stepCount = 0
    const maxSteps = duration / interval

    const timer = setInterval(() => {
      stepCount++
      setProgressPercentage((stepCount / maxSteps) * 100)

      if (stepCount >= maxSteps) {
        stepCount = 0
        setActivePresetIndex((prevIndex) => (prevIndex + 1) % SHOWCASE_PRESETS.length)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [activePresetIndex])

  const activePreset = SHOWCASE_PRESETS[activePresetIndex]

  return (
    <section className="px-6 py-16 max-w-6xl mx-auto scroll-mt-24 relative">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/25 rounded-full px-4 py-1.5 text-xs font-extrabold text-brand-light mb-3 shadow-glow">
          <span className="w-2 h-2 rounded-full bg-brand-light animate-ping" />
          <span>Interactive Product Showcase</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
          Prompt to Finished AI Video in Seconds
        </h2>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          See how Reelify's multi-step AI pipeline automatically generates scripts, plans camera shots, selects audio, and renders a 9:16 short video.
        </p>
      </div>

      {/* Preset Selector Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
        {SHOWCASE_PRESETS.map((preset, idx) => {
          const isActive = idx === activePresetIndex
          return (
            <button
              key={preset.id}
              onClick={() => {
                setActivePresetIndex(idx)
                setProgressPercentage(0)
              }}
              className={`relative overflow-hidden px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-300 flex items-center gap-2 border ${
                isActive
                  ? 'bg-brand/20 border-brand text-white shadow-glow scale-[1.02]'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white hover:border-white/15'
              }`}
            >
              <span>{preset.icon}</span>
              <span>{preset.title}</span>

              {/* Progress Bar Line */}
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-brand to-brand-glow transition-all duration-75"
                  style={{ width: `${progressPercentage}%` }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Responsive Horizontal / Vertical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Animated Workflow Step Cards (Cards 1, 2, 3) */}
        <div className="lg:col-span-7 flex flex-col gap-4 justify-between">
          
          {/* Card 1: Prompt */}
          <div className="card-glass p-5 border-white/[0.08] relative group hover:border-brand/30 transition-all shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-brand/20 border border-brand/40 text-brand-light flex items-center justify-center text-xs font-black">
                  1
                </span>
                <span className="text-xs font-extrabold text-white uppercase tracking-wider">Card 1: Prompt</span>
              </div>
              <span className="text-[10px] font-extrabold bg-white/[0.04] text-slate-400 px-2.5 py-0.5 rounded-full border border-white/[0.06]">
                {activePreset.category}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-200 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/[0.04] font-mono">
              "{activePreset.prompt}"
            </p>
          </div>

          {/* Connector 1 -> 2 */}
          <div className="flex justify-center -my-2 z-10">
            <div className="w-0.5 h-6 bg-gradient-to-b from-brand to-brand-glow animate-pulse" />
          </div>

          {/* Card 2: AI Creative Director */}
          <div className="card-glass p-5 border-white/[0.08] relative group hover:border-brand/30 transition-all shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-brand/20 border border-brand/40 text-brand-light flex items-center justify-center text-xs font-black">
                  2
                </span>
                <span className="text-xs font-extrabold text-white uppercase tracking-wider">Card 2: AI Creative Director</span>
              </div>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Active Engine
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
              {activePreset.checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.05] p-2 rounded-xl text-slate-200">
                  <span className="text-emerald-400 font-extrabold text-xs">✓</span>
                  <span className="text-[11px] font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connector 2 -> 3 */}
          <div className="flex justify-center -my-2 z-10">
            <div className="w-0.5 h-6 bg-gradient-to-b from-brand to-brand-glow animate-pulse" />
          </div>

          {/* Card 3: Storyboard */}
          <div className="card-glass p-5 border-white/[0.08] relative group hover:border-brand/30 transition-all shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-brand/20 border border-brand/40 text-brand-light flex items-center justify-center text-xs font-black">
                  3
                </span>
                <span className="text-xs font-extrabold text-white uppercase tracking-wider">Card 3: Storyboard</span>
              </div>
              <span className="text-[10px] font-extrabold text-brand-light bg-brand/10 border border-brand/30 px-2.5 py-0.5 rounded-full">
                4 Scenes Planned
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {activePreset.scenes.map((scene, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center bg-white/[0.02] border border-white/[0.05] p-3 rounded-xl text-center relative">
                  <span className="text-[9px] font-extrabold text-brand-light uppercase mb-0.5">Scene {idx + 1}</span>
                  <span className="text-xs font-bold text-white leading-tight">{scene}</span>
                  {idx < 3 && (
                    <span className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-600 text-xs font-bold z-10">➔</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Card 4 Video Generated Phone Preview */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full max-w-[310px] card-glass p-4 border-brand/30 rounded-3xl relative shadow-glow-strong flex flex-col gap-3 group">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-xs font-black">
                  4
                </span>
                <span className="text-xs font-extrabold text-white uppercase tracking-wider">Card 4: Video Generated</span>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Autoplay Reel
              </span>
            </div>

            {/* Vertical Smartphone Mockup */}
            <div className="aspect-[9/16] w-full rounded-2xl overflow-hidden bg-surface-0 border border-white/10 relative shadow-2xl flex items-center justify-center">
              <video
                key={activePreset.id}
                src={activePreset.videoUrl}
                poster={activePreset.posterUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Top Badge */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                <span className="bg-black/60 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-lg text-[9px] font-extrabold text-white tracking-widest uppercase">
                  {activePreset.tag}
                </span>
                <span className="bg-brand/80 backdrop-blur-md border border-brand/40 px-2.5 py-1 rounded-lg text-[9px] font-black text-white shadow-glow">
                  REELIFY AI
                </span>
              </div>

              {/* Bottom Caption HUD */}
              <div className="absolute bottom-4 left-3 right-3 bg-black/75 backdrop-blur-md border border-white/10 p-3 rounded-xl text-center text-xs font-bold text-white z-10 shadow-lg">
                <p className="text-[9px] text-amber-300 font-extrabold uppercase tracking-wider mb-0.5">💬 Generated AI Caption</p>
                <p className="text-[11px] font-medium text-slate-200 line-clamp-2">
                  "{activePreset.prompt.slice(0, 70)}..."
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

// Typing Effect for Step 1
function Step1TypingEffect() {
  const fullText = "A cinematic coffee advertisement for Instagram Reels."
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index))
        index++
      } else {
        setTimeout(() => {
          index = 0
          setDisplayedText('')
        }, 3000)
      }
    }, 60)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-black/50 p-3.5 rounded-xl border border-white/10 font-mono text-xs text-brand-light flex items-center gap-2 shadow-inner">
      <span className="text-slate-500 font-bold">❯</span>
      <span>{displayedText}</span>
      <span className="w-2 h-4 bg-brand-light animate-pulse inline-block" />
    </div>
  )
}

const PROMPT_ENGINEERING_CHIPS = [
  { icon: '👤', label: 'Subject', value: 'A professional barista' },
  { icon: '🎥', label: 'Camera', value: '35mm anamorphic slow dolly' },
  { icon: '💡', label: 'Lighting', value: 'Golden hour warm rim light' },
  { icon: '🎭', label: 'Mood', value: 'Luxury, premium, warm' },
  { icon: '🌊', label: 'Motion', value: 'Slow motion espresso pour' },
  { icon: '📱', label: 'Platform', value: 'Instagram Reels (9:16)' }
]

const DIRECTOR_CHECKLIST = [
  'Script Generated',
  'Storyboard Created',
  'Camera Plan Ready',
  'Voice Selected',
  'Music Selected',
  'Captions Added'
]

const RENDERING_STEPS = [
  { label: 'Analyzing Prompt' },
  { label: 'Searching Assets' },
  { label: 'Generating Voice' },
  { label: 'Rendering Video' },
  { label: 'Encoding MP4' },
]

const EXPORT_PLATFORMS = [
  { icon: '📸', name: 'Instagram Reels', format: '9:16 Vertical HD' },
  { icon: '🔴', name: 'YouTube Shorts', format: '9:16 60 FPS' },
  { icon: '🎵', name: 'TikTok', format: '9:16 High Bitrate' }
]

// Animated Vertical Timeline: How Reelify Works Section
function HowReelifyWorksSection() {
  return (
    <section className="px-6 py-20 max-w-5xl mx-auto relative scroll-mt-24">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/25 rounded-full px-4 py-1.5 text-xs font-extrabold text-brand-light mb-3 shadow-glow">
          <span className="text-xs">⚙️</span>
          <span>End-to-End Workflow</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
          How Reelify Works
        </h2>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          From one idea to a professionally generated short video in just a few intelligent steps.
        </p>
      </div>

      {/* Centered Vertical Timeline Container */}
      <div className="relative border-l-2 border-brand/40 ml-4 sm:ml-8 md:ml-12 pl-6 sm:pl-10 md:pl-12 flex flex-col gap-12">
        
        {/* STEP 1 */}
        <div className="relative group">
          {/* Circular Step Node */}
          <div className="absolute -left-[35px] sm:-left-[51px] md:-left-[59px] top-0 w-10 h-10 rounded-2xl bg-surface-1 border-2 border-brand text-brand-light font-black flex items-center justify-center text-sm shadow-glow group-hover:scale-110 transition-transform">
            1
          </div>

          <div className="card-glass p-6 border-white/[0.08] group-hover:border-brand/40 transition-all duration-300 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-white">Step 1: Start With Your Idea</h3>
              <span className="text-[10px] font-extrabold bg-brand/10 text-brand-light px-2.5 py-1 rounded-full border border-brand/30">
                Natural Language
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Users simply type a natural-language idea. Watch Reelify process your input:
            </p>
            <Step1TypingEffect />
          </div>
        </div>

        {/* STEP 2 */}
        <div className="relative group">
          <div className="absolute -left-[35px] sm:-left-[51px] md:-left-[59px] top-0 w-10 h-10 rounded-2xl bg-surface-1 border-2 border-brand text-brand-light font-black flex items-center justify-center text-sm shadow-glow group-hover:scale-110 transition-transform">
            2
          </div>

          <div className="card-glass p-6 border-white/[0.08] group-hover:border-brand/40 transition-all duration-300 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-white">Step 2: AI Prompt Engineering</h3>
              <span className="text-[10px] font-extrabold bg-brand/10 text-brand-light px-2.5 py-1 rounded-full border border-brand/30">
                Prompt Analyzer
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Reelify automatically transforms a simple prompt into a structured cinematic breakdown:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              {PROMPT_ENGINEERING_CHIPS.map((chip, idx) => (
                <div key={idx} className="bg-white/[0.02] border border-white/[0.06] p-2.5 rounded-xl flex flex-col gap-1 hover:border-brand/30 transition-all">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>{chip.icon}</span>
                    <span>{chip.label}</span>
                  </div>
                  <span className="text-xs font-bold text-white truncate">{chip.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STEP 3 */}
        <div className="relative group">
          <div className="absolute -left-[35px] sm:-left-[51px] md:-left-[59px] top-0 w-10 h-10 rounded-2xl bg-surface-1 border-2 border-brand text-brand-light font-black flex items-center justify-center text-sm shadow-glow group-hover:scale-110 transition-transform">
            3
          </div>

          <div className="card-glass p-6 border-white/[0.08] group-hover:border-brand/40 transition-all duration-300 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-white">Step 3: AI Creative Director</h3>
              <span className="text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Active Checklist
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our dual-engine director automatically plans your script, storyboards, voice tracks, and audio score:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 font-semibold text-xs">
              {DIRECTOR_CHECKLIST.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.06] p-2.5 rounded-xl text-slate-200">
                  <span className="text-emerald-400 font-extrabold text-xs">✓</span>
                  <span className="text-xs font-bold text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STEP 4 */}
        <div className="relative group">
          <div className="absolute -left-[35px] sm:-left-[51px] md:-left-[59px] top-0 w-10 h-10 rounded-2xl bg-surface-1 border-2 border-brand text-brand-light font-black flex items-center justify-center text-sm shadow-glow group-hover:scale-110 transition-transform">
            4
          </div>

          <div className="card-glass p-6 border-white/[0.08] group-hover:border-brand/40 transition-all duration-300 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-white">Step 4: AI Video Rendering</h3>
              <span className="text-[10px] font-extrabold bg-brand/10 text-brand-light px-2.5 py-1 rounded-full border border-brand/30">
                Rendering Monitor
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Professional rendering monitor tracks every milestone with automated progress bars:
            </p>

            <div className="space-y-2 pt-1">
              {RENDERING_STEPS.map((step, idx) => (
                <div key={idx} className="bg-black/30 border border-white/[0.05] p-2.5 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 text-[11px]">{step.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 sm:w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand to-emerald-400 w-full" />
                    </div>
                    <span className="text-[10px] font-black text-emerald-400">✓ Completed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STEP 5 */}
        <div className="relative group">
          <div className="absolute -left-[35px] sm:-left-[51px] md:-left-[59px] top-0 w-10 h-10 rounded-2xl bg-surface-1 border-2 border-brand text-brand-light font-black flex items-center justify-center text-sm shadow-glow group-hover:scale-110 transition-transform">
            5
          </div>

          <div className="card-glass p-6 border-white/[0.08] group-hover:border-brand/40 transition-all duration-300 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-white">Step 5: Export Anywhere</h3>
              <span className="text-[10px] font-extrabold bg-purple-500/10 text-purple-300 px-2.5 py-1 rounded-full border border-purple-500/30">
                Multi-Platform Distribution
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instantly export your final video in native 9:16 aspect ratios optimized for viral social media distribution:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {EXPORT_PLATFORMS.map((plat, idx) => (
                <div key={idx} className="bg-white/[0.02] border border-white/[0.06] hover:border-brand/40 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 transition-all duration-300 hover:scale-105 hover:bg-brand/10">
                  <span className="text-2xl">{plat.icon}</span>
                  <span className="text-xs font-black text-white">{plat.name}</span>
                  <span className="text-[10px] font-bold text-slate-400">{plat.format}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

// Why Reelify Section Component (Traditional vs Reelify AI Comparison & Metrics)
function WhyReelifySection({ onAuth }) {
  const navigate = useNavigate()
  const { isAuth } = useAuth()

  const traditionalSteps = [
    'Write Script',
    'Record Voice',
    'Search Stock Footage',
    'Edit Timeline',
    'Add Music',
    'Create Captions',
    'Render Video'
  ]

  const reelifySteps = [
    'Type Prompt',
    'AI Prompt Engineering',
    'AI Creative Director',
    'Storyboard',
    'Rendering',
    'Download'
  ]

  const stats = [
    { value: '95%', label: 'Time Saved', icon: '⏱️' },
    { value: '8×', label: 'Faster Workflow', icon: '⚡' },
    { value: '100%', label: 'AI Assisted', icon: '🤖' },
    { value: '1 Prompt', label: 'Everything Generated', icon: '✦' }
  ]

  return (
    <section className="px-6 py-20 max-w-6xl mx-auto scroll-mt-24 relative">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/25 rounded-full px-4 py-1.5 text-xs font-extrabold text-brand-light mb-3 shadow-glow">
          <span>⚡ Workflow Comparison</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
          Why Reelify?
        </h2>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Traditional editing takes hours. Reelify transforms one prompt into a professional short video within seconds.
        </p>
      </div>

      {/* Comparison Cards: Desktop Side-by-Side, Mobile Stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-16">
        
        {/* LEFT CARD: TRADITIONAL WORKFLOW (Red Accent) */}
        <div className="card-glass p-6 md:p-8 border-rose-500/25 bg-gradient-to-br from-rose-950/20 via-surface-1 to-surface-0 rounded-3xl relative flex flex-col justify-between shadow-xl group hover:border-rose-500/40 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-rose-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 font-extrabold text-lg">
                  ⏳
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">Traditional Video Creation</h3>
                  <span className="text-[10px] font-extrabold text-rose-400 uppercase tracking-wider">Manual & Time-Consuming</span>
                </div>
              </div>
              <span className="text-xs font-black text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20">
                2–4 Hours
              </span>
            </div>

            {/* Vertical Workflow List */}
            <div className="flex flex-col gap-2 mb-6">
              {traditionalSteps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-full bg-white/[0.02] border border-rose-500/15 p-3 rounded-xl flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold">{step}</span>
                    <span className="text-rose-400 font-mono text-[10px]">High Effort</span>
                  </div>
                  {idx < traditionalSteps.length - 1 && (
                    <span className="text-slate-600 text-xs py-0.5 font-bold">↓</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Effort Progress Indicator */}
          <div className="bg-black/40 border border-rose-500/20 p-4 rounded-2xl flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-extrabold text-slate-300">
              <span>Estimated Effort & Friction</span>
              <span className="text-rose-400">High (95% Manual)</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-rose-500 to-red-600 w-[95%]" />
            </div>
          </div>
        </div>

        {/* RIGHT CARD: REELIFY AI WORKFLOW (Purple Accent & Glow) */}
        <div className="card-glass p-6 md:p-8 border-brand/50 bg-gradient-to-br from-brand/20 via-purple-950/20 to-surface-0 rounded-3xl relative flex flex-col justify-between shadow-glow-strong group hover:border-brand transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand to-brand-glow flex items-center justify-center text-white font-black text-lg shadow-glow">
                  ✨
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Reelify AI</h3>
                  <span className="text-[10px] font-extrabold text-brand-light uppercase tracking-wider">Automated & Instant</span>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-300 bg-emerald-500/15 px-3 py-1.5 rounded-full border border-emerald-500/40 shadow-glow animate-pulse">
                ⚡ 30 Seconds
              </span>
            </div>

            {/* Vertical Workflow List */}
            <div className="flex flex-col gap-2 mb-6">
              {reelifySteps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-full bg-brand/10 border border-brand/30 p-3 rounded-xl flex items-center justify-between text-xs text-white shadow-sm">
                    <div className="flex items-center gap-2 font-bold">
                      <span className="text-emerald-400 font-extrabold text-xs">✓</span>
                      <span>{step}</span>
                    </div>
                    <span className="text-emerald-400 font-mono text-[10px] font-extrabold">Instant AI</span>
                  </div>
                  {idx < reelifySteps.length - 1 && (
                    <span className="text-brand-light text-xs py-0.5 font-bold">↓</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Effort Progress Indicator */}
          <div className="bg-brand/10 border border-brand/30 p-4 rounded-2xl flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-extrabold text-white">
              <span>Estimated Effort & Friction</span>
              <span className="text-emerald-300 font-black">Minimal (1-Click Prompt)</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand via-purple-400 to-emerald-400 w-[5%]" />
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM METRICS: 4 STATISTIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {stats.map((stat, idx) => (
          <div key={idx} className="card-glass p-5 border-white/[0.08] hover:border-brand/40 text-center rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 hover:scale-105 shadow-lg">
            <span className="text-2xl mb-1">{stat.icon}</span>
            <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-brand-light bg-clip-text text-transparent">
              {stat.value}
            </span>
            <span className="text-xs font-bold text-slate-400">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* BOTTOM CTA CARD */}
      <div className="card-glass p-8 md:p-12 border-brand/30 rounded-3xl text-center relative overflow-hidden shadow-glow-strong">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-900/30 rounded-full blur-3xl pointer-events-none" />

        <h3 className="text-2xl md:text-4xl font-black text-white mb-3 tracking-tight">
          Ready to Create Your First AI Video?
        </h3>
        <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto mb-8 leading-relaxed">
          Get started with Reelify today for free. Experience the power of 1-click video generation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate('/sandbox')}
            className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-extrabold text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 shadow-xl hover:scale-105 flex items-center gap-2"
          >
            <span>🧪 Try Sandbox</span>
            <span className="text-xs">→</span>
          </button>

          <button 
            onClick={isAuth ? () => navigate('/studio') : () => navigate('/login')}
            className="bg-brand hover:bg-brand-dark text-white font-extrabold text-sm px-8 py-3.5 rounded-2xl transition-all duration-300 shadow-glow hover:scale-105 flex items-center gap-2"
          >
            <span>✨ Login to Creative Studio</span>
            <span className="text-xs">→</span>
          </button>
        </div>
      </div>
    </section>
  )
}

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

  // Contact form state
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      toast.error('Please fill in all fields.')
      return
    }

    setIsSubmittingContact(true)
    let delivered = false

    // 1. Try sending to backend API (saves in DB & dispatches async email)
    try {
      await axios.post('/api/contact', {
        name: contactName.trim(),
        email: contactEmail.trim(),
        message: contactMessage.trim(),
      })
      delivered = true
    } catch (err) {
      console.warn('Backend endpoint unavailable, falling back to direct email service:', err)
    }

    // 2. Direct client-side dispatch to FormSubmit for johnnaman19@gmail.com
    if (!delivered) {
      try {
        await axios.post('https://formsubmit.co/ajax/johnnaman19@gmail.com', {
          name: contactName.trim(),
          email: contactEmail.trim(),
          message: contactMessage.trim(),
          _subject: `Reelify Contact Form: Message from ${contactName.trim()}`,
        }, {
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        })
        delivered = true
      } catch (clientEmailErr) {
        console.warn('FormSubmit direct dispatch notice:', clientEmailErr)
      }
    }

    if (delivered) {
      toast.success('Thank you! Your message has been sent directly to johnnaman19@gmail.com')
      setContactName('')
      setContactEmail('')
      setContactMessage('')
    } else {
      // 3. Ultimate fail-safe mailto link
      const mailtoUrl = `mailto:johnnaman19@gmail.com?subject=Reelify%20Contact%20Form:%20${encodeURIComponent(contactName)}&body=Name:%20${encodeURIComponent(contactName)}%0AEmail:%20${encodeURIComponent(contactEmail)}%0AMessage:%20${encodeURIComponent(contactMessage)}`
      window.open(mailtoUrl, '_blank')
      toast.success('Opening your mail client to send message to johnnaman19@gmail.com!')
      setContactName('')
      setContactEmail('')
      setContactMessage('')
    }
    setIsSubmittingContact(false)
  }

  // Scroll to sandbox
  const scrollToSandbox = () => {
    const sandboxElement = document.getElementById('sandbox-container')
    if (sandboxElement) {
      sandboxElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Handle Free Sandbox Trial (up to 2 times)
  const generateSandboxDemo = async () => {
    const currentCount = parseInt(localStorage.getItem('sandbox_generations_count') || '0', 10)
    
    if (currentCount >= 2) {
      toast.error('You have reached your limit of 2 free demo generations! Please sign up or log in to access the full Studio Generator AI.')
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

    // Increment trial count up to 2
    const newCount = currentCount + 1
    localStorage.setItem('sandbox_generations_count', newCount.toString())
    setUsedTrialCount(newCount)
    setSandboxPhase('done')
    toast.success(`Demo generated! (${newCount}/2 free generations used)`)
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

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button 
            onClick={() => navigate('/sandbox')}
            className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-extrabold text-sm px-6 py-3.5 rounded-2xl transition-all duration-300 shadow-xl hover:scale-105 flex items-center gap-2"
          >
            <span>🧪 Try Sandbox</span>
            <span className="text-xs">→</span>
          </button>

          <button 
            onClick={isAuth ? () => navigate('/studio') : () => navigate('/login')}
            className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-extrabold text-sm px-6 py-3.5 rounded-2xl transition-all duration-300 shadow-xl hover:scale-105 flex items-center gap-2"
          >
            <span>🔑 Login</span>
          </button>

          <button 
            onClick={isAuth ? () => navigate('/studio') : () => navigate('/login?tab=signup')}
            className="bg-brand hover:bg-brand-dark text-white font-extrabold text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 shadow-glow hover:scale-105 flex items-center gap-2"
          >
            <span>✨ Create Account</span>
            <span className="text-xs">→</span>
          </button>
        </div>
      </section>

      {/* ─── ANIMATED PRODUCT SHOWCASE & WORKFLOW DEMO ─── */}
      <ProductShowcaseSection />

      {/* ─── ANIMATED VERTICAL TIMELINE: HOW REELIFY WORKS ─── */}
      <HowReelifyWorksSection />

      {/* ─── WORKFLOW COMPARISON & STATS: WHY REELIFY? ─── */}
      <WhyReelifySection onAuth={onAuth} />

      {/* ─── INTERACTIVE SANDBOX: TRY WITH REELIFY ─── */}
      <section id="sandbox-container" className="px-6 mb-28 max-w-4xl mx-auto scroll-mt-24">
        <div className="card-glass p-8 md:p-10 border-brand/20 relative shadow-glow-strong">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/25 rounded-full px-4 py-1.5 text-xs font-bold text-brand-light mb-4 shadow-glow">
              ⚡ Try Reelify Demo ({Math.max(0, 2 - usedTrialCount)} / 2 Free Generations Left)
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              Free Generation Sandbox
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Select one of the 10 cinematic preset prompts below. Get up to 2 free demo generations before creating an account for full studio access.
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
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Have questions, feedback, or partnership ideas? Drop us a message.
          </p>
        </div>
        <div className="card-glass p-8">
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label className="section-label">Your Name</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Your Name"
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="section-label">Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="section-label">Message</label>
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Tell us what you're thinking..."
                rows={4}
                required
                className="input-field resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingContact}
              className="btn-primary w-full py-3 text-sm font-bold disabled:opacity-50"
            >
              {isSubmittingContact ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
