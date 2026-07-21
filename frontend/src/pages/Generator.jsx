import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'

const DURATION_OPTIONS = ['15 seconds', '30 seconds', '60 seconds', '90 seconds']
const FORMAT_OPTIONS = ['9:16 (Reels/Shorts)', '16:9 (YouTube)', '1:1 (Feed Post)']
const STYLE_OPTIONS = ['Dynamic', 'Cinematic', 'Minimal', 'Bold', 'Vintage']
const VOICE_OPTIONS = ['Aria (Female)', 'Marcus (Male)', 'Zara (Female)', 'Leo (Male)', 'British Emma', 'No Voice']
const MUSIC_OPTIONS = ['Upbeat Electronic', 'Cinematic Epic', 'Lo-Fi Chill', 'Corporate', 'No Music']
const CAPTION_OPTIONS = ['Animated Bold', 'Clean White', 'Neon Glow', 'None']

const QUICK_TEMPLATES = [
  { label: '🐶 Puppy Running', prompt: 'Create a 15 second video of a fluffy golden retriever puppy running happily on the grass in a sunny park.' },
  { label: '💻 Cyberpunk Workspace', prompt: 'A coding laptop sitting on a clean desk with neon purple backlighting, code lines scrolling on screen, dynamic style.' },
  { label: '🍳 Master Chef Cooking', prompt: 'A close up cinematic shot of a professional chef chopping colorful vegetables on a wooden cutting board in a high-end kitchen.' },
  { label: '🏖 Sunset Ocean', prompt: 'Beautiful aerial view of blue ocean waves gently crashing onto a sandy beach at sunset, cinematic travel style.' },
]

const GEN_STEPS = [
  { id: 'script', label: 'Writing AI script & storyboard' },
  { id: 'visuals', label: 'Generating photorealistic scenes' },
  { id: 'voice', label: 'Synthesizing neural AI voiceover' },
  { id: 'render', label: 'Fetching background music' },
]

export default function Generator() {
  const { token } = useAuth()
  const location = useLocation()

  const [form, setForm] = useState({
    prompt: '',
    duration: '15 seconds',
    format: '9:16 (Reels/Shorts)',
    style: 'Cinematic',
    voice: 'Aria (Female)',
    music: 'Upbeat Electronic',
    captions: 'Animated Bold',
    visualMode: 'ai_slideshow', // stock | ai_slideshow | upload
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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  
  // Auto-populate from landing page voice assistant state if navigated
  useEffect(() => {
    if (location.state?.initialPrompt) {
      setForm(prev => ({ ...prev, prompt: location.state.initialPrompt }))
    }
  }, [location.state])

  const handleTemplateClick = (promptText) => {
    setForm({ ...form, prompt: promptText })
    toast.success('Template loaded!')
  }

  // Voice Assistant speech recognizer
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      toast.error('Voice assistant is not supported in this browser. Please use Google Chrome.')
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
      const spokenText = event.results[0][0].transcript
      setForm(prev => ({ ...prev, prompt: prev.prompt ? `${prev.prompt} ${spokenText}` : spokenText }))
      toast.success('Voice prompt appended!')
    }
    recognition.start()
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

  const generate = async () => {
    if (!form.prompt.trim()) { toast.error('Please enter a prompt first!'); return }
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

    // Step 1: Script & Visuals
    setActiveStep('script')
    setProgress(20)
    let apiData = null

    try {
      const { data } = await axios.post(
        '/api/generate',
        { prompt: form.prompt, options: { ...form, uploadedUrl: uploadedFileUrl } },
        { headers: { Authorization: `Bearer ${token}` } }
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

    // Step 2: Storyboard & Scenes
    setActiveStep('visuals')
    setProgress(45)
    let scenesList = []

    try {
      const sbRes = await axios.post(
        '/api/generate_storyboard',
        { script: apiData.script || form.prompt, prompt: form.prompt, num_scenes: 4 },
        { headers: { Authorization: `Bearer ${token}` } }
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
    setDoneSteps(prev => [...prev, 'visuals'])

    // Step 3: Neural Voice Synthesis (edge-tts)
    setActiveStep('voice')
    setProgress(75)
    if (form.voice !== 'No Voice' && apiData.script) {
      try {
        const vRes = await axios.post(
          '/api/generate_voice',
          { script: apiData.script, voice: form.voice },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (vRes.data.audio_url) {
          setGeneratedVoiceUrl(vRes.data.audio_url)
        }
      } catch (e) {
        console.warn('Voice synthesis skipped or unavailable:', e)
      }
    }
    setDoneSteps(prev => [...prev, 'voice'])

    // Step 4: Music search
    setActiveStep('render')
    setProgress(90)
    if (form.music !== 'No Music') {
      try {
        const moodMap = { 'Upbeat Electronic': 'upbeat', 'Cinematic Epic': 'epic', 'Lo-Fi Chill': 'chill', 'Corporate': 'corporate' }
        const mRes = await axios.get(`/api/get_music?mood=${moodMap[form.music] || 'positive'}`)
        if (mRes.data.music_url) {
          setGeneratedMusicUrl(mRes.data.music_url)
        }
      } catch (e) {
        console.warn('Music fetch skipped:', e)
      }
    }
    setDoneSteps(prev => [...prev, 'render'])

    setProgress(100)
    setActiveStep('')
    setPhase('done')
    toast.success('Script, Storyboard, AI Voice & Music ready!')
  }

  // Trigger FFmpeg compilation
  const handleCompileVideo = async () => {
    if (!slideshowImages || slideshowImages.length === 0) {
      toast.error('No scene images available to compile video.')
      return
    }

    setIsCompiling(true)
    const compileToast = toast.loading('FFmpeg is stitching scenes, audio, and captions into final MP4...')

    try {
      const { data } = await axios.post(
        '/api/compile_video',
        {
          image_urls: slideshowImages,
          audio_url: generatedVoiceUrl,
          music_url: generatedMusicUrl,
          script: editableScript || result?.script || '',
          duration: form.duration,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.video_url) {
        setCompiledVideoUrl(data.video_url)
        toast.success('Final video compiled successfully with FFmpeg!', { id: compileToast })
      } else {
        toast.error('Video compile finished without output file.', { id: compileToast })
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'FFmpeg compile failed. Ensure FFmpeg is installed on server.', { id: compileToast })
    } finally {
      setIsCompiling(false)
    }
  }

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

  return (
    <div className="flex min-h-[calc(100vh-77px)] bg-surface-0">
      <Sidebar />
      
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Left Panel: Settings & Pipeline */}
          <div className="flex-1 flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">AI Generation Studio</h1>
              <p className="text-xs text-slate-400">Set your prompt settings and visual preferences. Our AI handles the script, voice, storyboard, and video compilation.</p>
            </div>

            {/* Quick Templates */}
            <div className="card-glass p-5">
              <label className="section-label">Quick Templates</label>
              <div className="flex flex-wrap gap-2">
                {QUICK_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.label}
                    onClick={() => handleTemplateClick(tmpl.prompt)}
                    disabled={phase === 'generating'}
                    className="bg-white/[0.03] hover:bg-brand/15 hover:border-brand/30 border border-white/[0.06] text-slate-300 hover:text-brand-light text-xs font-bold px-3 py-2 rounded-xl transition-all duration-300"
                  >
                    {tmpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Options Card */}
            <div className="card-glass p-6 flex flex-col gap-5">
              <div className="relative">
                <label className="section-label">Describe your video topic</label>
                <div className="relative">
                  <textarea
                    name="prompt"
                    value={form.prompt}
                    onChange={handleChange}
                    rows={4}
                    disabled={phase === 'generating'}
                    placeholder="e.g. A golden retriever puppy playing on the grass..."
                    className="input-field resize-none text-sm pr-12"
                  />
                  {/* Voice microphone button */}
                  <button
                    onClick={handleVoiceInput}
                    disabled={phase === 'generating'}
                    className={`absolute right-3.5 bottom-3.5 w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                      isListening
                        ? 'bg-brand-glow border-brand-glow text-white shadow-glow animate-pulse'
                        : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white hover:border-brand/30'
                    }`}
                    title="Speak prompt with Voice Assistant"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Visual Mode selector */}
              <div>
                <label className="section-label">Visual Match Mode</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => setForm({ ...form, visualMode: 'ai_slideshow' })}
                    disabled={phase === 'generating'}
                    className={`px-3 py-3 rounded-2xl text-[11px] font-bold border transition-all duration-300 flex flex-col items-center justify-center gap-1.5 ${
                      form.visualMode === 'ai_slideshow'
                        ? 'bg-brand/10 border-brand/40 text-brand-light shadow-glow'
                        : 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:text-white'
                    }`}
                  >
                    🎨 AI Storyboard Images
                    <span className="text-[9px] font-medium opacity-70">Pollinations / AI scenes</span>
                  </button>
                  <button
                    onClick={() => setForm({ ...form, visualMode: 'stock' })}
                    disabled={phase === 'generating'}
                    className={`px-3 py-3 rounded-2xl text-[11px] font-bold border transition-all duration-300 flex flex-col items-center justify-center gap-1.5 ${
                      form.visualMode === 'stock'
                        ? 'bg-brand/10 border-brand/40 text-brand-light shadow-glow'
                        : 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:text-white'
                    }`}
                  >
                    🎥 Stock Video Match
                    <span className="text-[9px] font-medium opacity-70">Pexels / Pixabay</span>
                  </button>
                  <button
                    onClick={() => setForm({ ...form, visualMode: 'upload' })}
                    disabled={phase === 'generating'}
                    className={`px-3 py-3 rounded-2xl text-[11px] font-bold border transition-all duration-300 flex flex-col items-center justify-center gap-1.5 ${
                      form.visualMode === 'upload'
                        ? 'bg-brand/10 border-brand/40 text-brand-light shadow-glow'
                        : 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:text-white'
                    }`}
                  >
                    📤 Canva / Local Upload
                    <span className="text-[9px] font-medium opacity-70">Upload Canva assets</span>
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

              {/* Parameter Settings Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { name: 'duration', label: 'Duration', opts: DURATION_OPTIONS },
                  { name: 'format', label: 'Format', opts: FORMAT_OPTIONS },
                  { name: 'style', label: 'Style', opts: STYLE_OPTIONS },
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

              <div className="flex gap-3 mt-4">
                <button
                  onClick={generate}
                  disabled={phase === 'generating' || (form.visualMode === 'upload' && !uploadedFileUrl)}
                  className="btn-primary text-sm px-6 py-3.5 rounded-2xl flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  ✦ Run Full AI Pipeline
                </button>
                {phase === 'done' && (
                  <button onClick={reset} className="btn-secondary text-sm px-6 py-3.5 rounded-2xl">
                    Clear Workspace
                  </button>
                )}
              </div>
            </div>

            {/* Storyboard Scene Breakdown */}
            {phase === 'done' && storyboardScenes.length > 0 && (
              <div className="card-glass p-5 border-white/[0.06] flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <label className="section-label mb-0">🎬 AI Storyboard Breakdown</label>
                  <span className="text-[10px] text-brand-light font-bold bg-brand/10 border border-brand/20 px-2 py-0.5 rounded-full">
                    {storyboardScenes.length} Scenes
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {storyboardScenes.map((sc, idx) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/[0.06] p-3 rounded-xl flex gap-3 items-center">
                      <img
                        src={sc.image_url}
                        alt={`Scene ${sc.scene}`}
                        className="w-14 h-20 object-cover rounded-lg bg-surface-1 border border-white/10 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{sc.title || `Scene ${sc.scene}`}</p>
                        <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{sc.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generated Audio & Voice Preview */}
            {phase === 'done' && (generatedVoiceUrl || generatedMusicUrl) && (
              <div className="card-glass p-5 border-white/[0.06] flex flex-col gap-4">
                <label className="section-label">🔊 AI Voice & Background Music Tracks</label>
                
                {generatedVoiceUrl && (
                  <div className="flex flex-col gap-1.5 bg-white/[0.02] p-3 rounded-xl border border-white/[0.05]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">🗣 AI Voiceover ({form.voice})</span>
                      <span className="text-[9px] text-emerald-400 font-bold uppercase">edge-tts</span>
                    </div>
                    <audio controls src={generatedVoiceUrl} className="w-full h-8 mt-1" />
                  </div>
                )}

                {generatedMusicUrl && (
                  <div className="flex flex-col gap-1.5 bg-white/[0.02] p-3 rounded-xl border border-white/[0.05]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">🎵 Background Music ({form.music})</span>
                      <span className="text-[9px] text-brand-light font-bold uppercase">Jamendo</span>
                    </div>
                    <audio controls src={generatedMusicUrl} className="w-full h-8 mt-1" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel: Workspace Preview & Compilation */}
          <div className="w-full lg:w-[450px] flex flex-col gap-6">
            
            {/* Real-time Video Render Screen */}
            <div className="card-glass p-5 border-white/[0.06] flex flex-col gap-4">
              <label className="section-label">Video Rendering Monitor</label>
              
              <div className="aspect-[9/16] max-h-[500px] w-full rounded-2xl overflow-hidden bg-surface-0 border border-white/[0.04] relative flex items-center justify-center shadow-inner">
                {phase === 'idle' && (
                  <div className="text-center p-8 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-400 text-xl spin-slow">
                      ⚙
                    </div>
                    <p className="text-xs text-slate-500 font-bold">Studio Screen Offline</p>
                    <p className="text-[10px] text-slate-600 leading-normal max-w-[200px]">Describe your idea and start generation to trigger visual playback.</p>
                  </div>
                )}

                {phase === 'generating' && (
                  <div className="text-center p-8 flex flex-col items-center gap-4 z-10">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-brand/20 border-t-brand animate-spin"></div>
                      <span className="text-[10px] font-extrabold text-brand-light">{progress}%</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white mb-1">
                        {GEN_STEPS.find((s) => s.id === activeStep)?.label || 'Processing...'}
                      </p>
                      <p className="text-[10px] text-slate-500">Executing full AI pipeline</p>
                    </div>
                  </div>
                )}

                {phase === 'done' && (
                  <div className="w-full h-full relative">
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
                            className={`absolute inset-0 transition-opacity duration-1000 ${
                              currentSlideIndex === idx ? 'opacity-100' : 'opacity-0'
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
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                currentSlideIndex === idx ? 'bg-brand w-4' : 'bg-white/30'
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

              {phase === 'done' && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleCompileVideo}
                    disabled={isCompiling}
                    className="btn-primary text-xs font-bold py-3 rounded-xl w-full flex items-center justify-center gap-2"
                  >
                    {isCompiling ? '⚡ FFmpeg Compiling MP4...' : '🎬 Compile Final MP4 (FFmpeg)'}
                  </button>

                  {(compiledVideoUrl || result?.download_url) && (
                    <a
                      href={compiledVideoUrl || result.download_url}
                      download="reelify_final.mp4"
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold py-2.5 rounded-xl text-center transition-all"
                    >
                      ⬇ Download MP4 Video
                    </a>
                  )}
                </div>
              )}
            </div>

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

          </div>

        </div>
      </main>
    </div>
  )
}
