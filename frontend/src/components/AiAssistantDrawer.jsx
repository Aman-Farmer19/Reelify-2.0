import React, { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useAiAssistant } from '../context/AiAssistantContext'
import { useAuth } from '../context/AuthContext'

const suggestionChips = [
  'A cinematic coffee advertisement',
  'A motivational gym reel',
  'A luxury car commercial',
  'A travel vlog in Japan',
  'An AI tech breakthrough reel',
]

const aiCategories = [
  '🎬 Viral Reels', '📺 YouTube Shorts', '🛍 Product Ads', '🍔 Food Videos',
  '🏋 Fitness Videos', '🎮 Gaming Clips', '🎵 Music Videos', '📚 Educational Shorts',
  '✈️ Travel Vlogs', '📜 Documentaries'
]

const aiTools = {
  cameraAngles: [
    { label: '🎥 Drone Overhead', text: 'Cinematic 8K aerial drone shot from high above' },
    { label: '🔍 Macro Close-Up', text: 'Extreme macro close-up with shallow depth of field' },
    { label: '🏎️ Tracking Shot', text: 'Dynamic high-speed tracking shot following motion' },
    { label: '📐 Low Angle', text: 'Powerful low-angle dramatic view highlighting scale' },
  ],
  lighting: [
    { label: '🌅 Golden Hour', text: 'Warm volumetric golden hour sunlight streaming in' },
    { label: '🌆 Neon Rim Light', text: 'Cyberpunk neon rim lighting with deep purple accents' },
    { label: '💡 Studio Softbox', text: 'Professional studio softbox key lighting with soft shadows' },
  ],
  styles: [
    { label: '🔥 Viral TikTok Hook', text: 'High-energy fast cuts, bold contrast, viral pacing' },
    { label: '✨ Aesthetic Minimal', text: 'Clean minimalist framing, muted pastel color palette' },
    { label: '🎬 Hollywood Commercial', text: '8k anamorphic lens flare, filmic color grade, luxury feel' },
  ],
  negativePrompt: 'blurry, low resolution, distorted faces, text overlay, pixelated, noise, watermarks'
}

// Modern Vertical Storyboard Panel Component
function StoryboardPanel({ initialScenes, onInsertToStudio, onCopy }) {
  const [scenes, setScenes] = useState(initialScenes || [])
  const [editingId, setEditingId] = useState(null)
  const [editPromptText, setEditPromptText] = useState('')

  // Reorder up/down
  const moveScene = (index, direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= scenes.length) return
    const updated = [...scenes]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    const renumbered = updated.map((sc, i) => ({ ...sc, sceneNumber: i + 1 }))
    setScenes(renumbered)
    toast.success('Scene order updated!')
  }

  // Duplicate scene
  const handleDuplicate = (scene) => {
    const newScene = {
      ...scene,
      id: 'scene-' + Date.now() + Math.random().toString(36).substr(2, 4),
      sceneNumber: scenes.length + 1,
      title: `${scene.title} (Copy)`
    }
    setScenes([...scenes, newScene])
    toast.success('Scene duplicated!')
  }

  // Delete scene
  const handleDelete = (id) => {
    if (scenes.length <= 1) {
      toast.error('Storyboard must have at least 1 scene.')
      return
    }
    const updated = scenes.filter(sc => sc.id !== id).map((sc, i) => ({ ...sc, sceneNumber: i + 1 }))
    setScenes(updated)
    toast.success('Scene deleted.')
  }

  // Regenerate scene prompt
  const handleRegenerateScene = (id) => {
    const updated = scenes.map(sc => {
      if (sc.id === id) {
        return {
          ...sc,
          prompt: `${sc.prompt} Enhanced with volumetric rim lighting, camera tracking depth, and 8k photorealistic resolution.`
        }
      }
      return sc
    })
    setScenes(updated)
    toast.success('Scene regenerated!')
  }

  // Start inline editing
  const startEditing = (sc) => {
    setEditingId(sc.id)
    setEditPromptText(sc.prompt)
  }

  // Save inline edit
  const saveEdit = (id) => {
    const updated = scenes.map(sc => {
      if (sc.id === id) {
        return { ...sc, prompt: editPromptText }
      }
      return sc
    })
    setScenes(updated)
    setEditingId(null)
    toast.success('Scene updated!')
  }

  // Compile full storyboard text for studio insertion
  const getCompiledStoryboardText = () => {
    return scenes.map(sc => `[Scene ${sc.sceneNumber}: ${sc.title}] (${sc.duration}) - ${sc.prompt} | Camera: ${sc.cameraMovement} | Lighting: ${sc.lighting}`).join('\n\n')
  }

  return (
    <div className="w-full bg-surface-0 border border-brand/40 rounded-2xl p-4 shadow-glow flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-brand-light">🎞️ Multi-Scene Storyboard</span>
          <span className="text-[10px] font-bold bg-brand/20 text-brand-light px-2 py-0.5 rounded-full">
            {scenes.length} Scenes
          </span>
        </div>
        <button
          onClick={() => onInsertToStudio(getCompiledStoryboardText())}
          className="text-xs font-bold bg-brand hover:bg-brand-dark text-white px-3 py-1.5 rounded-xl shadow-glow transition-all"
        >
          ✨ Insert Storyboard into Studio
        </button>
      </div>

      {/* Vertical Scenes List */}
      <div className="flex flex-col gap-3.5">
        {scenes.map((scene, idx) => (
          <div
            key={scene.id}
            className="bg-white/[0.03] border border-white/[0.08] hover:border-brand/40 rounded-2xl p-3.5 flex flex-col gap-3 transition-all duration-200 group shadow-lg"
          >
            {/* Header: Scene #, Title, Duration, Reorder Controls */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-brand/30 border border-brand/50 text-brand-light font-black text-xs flex items-center justify-center">
                  0{scene.sceneNumber}
                </span>
                <span className="text-xs font-extrabold text-white">{scene.title}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.08]">
                  ⏱️ {scene.duration}
                </span>
                {/* Drag-and-Drop Reorder Buttons */}
                <div className="flex items-center gap-0.5 bg-black/40 rounded-lg p-0.5 border border-white/10">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveScene(idx, -1)}
                    className="text-slate-400 hover:text-white disabled:opacity-30 text-[10px] px-1"
                    title="Move Scene Up"
                  >
                    ▲
                  </button>
                  <span className="text-[9px] text-slate-500 font-bold px-0.5">⋮⋮</span>
                  <button
                    disabled={idx === scenes.length - 1}
                    onClick={() => moveScene(idx, 1)}
                    className="text-slate-400 hover:text-white disabled:opacity-30 text-[10px] px-1"
                    title="Move Scene Down"
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail Placeholder */}
            <div className={`w-full h-24 rounded-xl bg-gradient-to-br ${scene.thumbnailGradient || 'from-purple-600/40 to-indigo-900/60'} border border-white/10 relative overflow-hidden flex items-center justify-center shadow-inner`}>
              <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]"></div>
              <div className="relative z-10 flex flex-col items-center gap-1 text-center p-2">
                <span className="text-xl">🎬</span>
                <span className="text-[10px] font-bold text-white/90 drop-shadow">
                  Thumbnail Placeholder — Scene {scene.sceneNumber}
                </span>
              </div>
            </div>

            {/* Scene Prompt & Metadata Grid */}
            <div className="flex flex-col gap-2 bg-black/40 p-3 rounded-xl border border-white/[0.06]">
              {editingId === scene.id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editPromptText}
                    onChange={(e) => setEditPromptText(e.target.value)}
                    className="input-field text-xs h-20 p-2 font-mono"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdit(scene.id)}
                      className="text-xs font-bold bg-brand text-white px-3 py-1 rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-200 font-mono italic leading-relaxed">
                  "{scene.prompt}"
                </p>
              )}

              <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-white/[0.06] text-[10px]">
                <span className="text-slate-400 font-medium truncate" title={scene.cameraMovement}>
                  {scene.cameraMovement}
                </span>
                <span className="text-slate-400 font-medium truncate" title={scene.lighting}>
                  {scene.lighting}
                </span>
                <span className="text-brand-light font-medium truncate" title={scene.emotion}>
                  {scene.emotion}
                </span>
              </div>
            </div>

            {/* Action Buttons: Edit, Duplicate, Delete, Regenerate Scene */}
            <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-white/[0.06]">
              <button
                onClick={() => startEditing(scene)}
                className="bg-white/[0.04] hover:bg-white/10 text-slate-300 text-[10px] font-bold py-1.5 rounded-lg border border-white/[0.08] transition-all text-center"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDuplicate(scene)}
                className="bg-white/[0.04] hover:bg-white/10 text-slate-300 text-[10px] font-bold py-1.5 rounded-xl border border-white/[0.08] transition-all text-center"
              >
                📋 Duplicate
              </button>
              <button
                onClick={() => handleDelete(scene.id)}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[10px] font-bold py-1.5 rounded-xl border border-rose-500/20 transition-all text-center"
              >
                🗑️ Delete
              </button>
              <button
                onClick={() => handleRegenerateScene(scene.id)}
                className="bg-brand/15 hover:bg-brand/30 text-brand-light text-[10px] font-bold py-1.5 rounded-xl border border-brand/30 transition-all text-center"
              >
                🔄 Regenerate Scene
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Professional Filmmaking Shot List Component
function ShotListPanel({ initialShots, onInsertToStudio }) {
  const [shots, setShots] = useState(initialShots || [])
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  // AI Recommendation Engine for Lens, Angle, and Lighting combinations
  const handleAiRecommend = (id) => {
    const angles = ['Low Angle (30°)', 'Dutch Angle (15°)', 'Eye Level (0°)', 'High Overhead (75°)', 'Worm’s Eye View']
    const lenses = ['35mm Anamorphic T1.5', '50mm Cine Prime T1.2', '85mm Portrait Cine', '24mm Ultra-Wide Prime', '100mm Macro Cine T2.8']
    const movements = ['Dolly Push-In (Smooth)', 'Fast Whip Pan', 'Gimbal Tracking Orbit', 'Pedestal Crane Up', 'Handheld Dynamic Tracking']
    const lightings = ['Volumetric Rim Key Light', 'Golden Hour Sunset Glow', 'Cyberpunk Neon Rim', 'High Contrast Film Noir', 'Studio Softbox Diffused']
    const transitions = ['Hard Cut', 'Cross Dissolve', 'Zoom Blur', 'Match Cut', 'Wipe Left']

    const randomAngle = angles[Math.floor(Math.random() * angles.length)]
    const randomLens = lenses[Math.floor(Math.random() * lenses.length)]
    const randomMovement = movements[Math.floor(Math.random() * movements.length)]
    const randomLighting = lightings[Math.floor(Math.random() * lightings.length)]
    const randomTransition = transitions[Math.floor(Math.random() * transitions.length)]

    const updated = shots.map(sh => {
      if (sh.id === id) {
        return {
          ...sh,
          cameraAngle: randomAngle,
          lens: randomLens,
          movement: randomMovement,
          lighting: randomLighting,
          transition: randomTransition,
          notes: `🤖 AI Recommended: Paired ${randomLens} with ${randomMovement} & ${randomLighting}.`
        }
      }
      return sh
    })
    setShots(updated)
    toast.success('AI recommendations applied to shot!')
  }

  // Edit Shot
  const startEditing = (shot) => {
    setEditingId(shot.id)
    setEditForm({ ...shot })
  }

  const saveEdit = (id) => {
    const updated = shots.map(sh => (sh.id === id ? { ...editForm } : sh))
    setShots(updated)
    setEditingId(null)
    toast.success('Shot parameters updated!')
  }

  // Duplicate Shot
  const handleDuplicate = (shot) => {
    const newShot = {
      ...shot,
      id: 'shot-' + Date.now() + Math.random().toString(36).substr(2, 4),
      shotNumber: shots.length + 1
    }
    setShots([...shots, newShot])
    toast.success('Shot duplicated!')
  }

  // Delete Shot
  const handleDelete = (id) => {
    if (shots.length <= 1) {
      toast.error('Shot list must have at least 1 shot.')
      return
    }
    const updated = shots.filter(sh => sh.id !== id).map((sh, i) => ({ ...sh, shotNumber: i + 1 }))
    setShots(updated)
    toast.success('Shot deleted.')
  }

  const getCompiledShotListText = () => {
    return shots.map(sh => `[SHOT #${sh.shotNumber}: ${sh.shotType}] (${sh.duration}) | Lens: ${sh.lens} | Angle: ${sh.cameraAngle} | Movement: ${sh.movement} | Lighting: ${sh.lighting} | Transition: ${sh.transition}`).join('\n')
  }

  return (
    <div className="w-full bg-surface-0 border border-brand/40 rounded-2xl p-4 shadow-glow flex flex-col gap-4 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-brand-light uppercase tracking-wider">🎥 Technical Shot List</span>
          <span className="text-[10px] font-bold bg-brand/20 text-brand-light px-2 py-0.5 rounded-full">
            {shots.length} Shots
          </span>
        </div>
        <button
          onClick={() => onInsertToStudio(getCompiledShotListText())}
          className="text-xs font-bold bg-brand hover:bg-brand-dark text-white px-3 py-1.5 rounded-xl shadow-glow transition-all"
        >
          ✨ Insert Shot List
        </button>
      </div>

      {/* Shot Items List */}
      <div className="flex flex-col gap-3">
        {shots.map((shot) => (
          <div
            key={shot.id}
            className="bg-white/[0.03] border border-white/[0.08] hover:border-brand/40 rounded-2xl p-3.5 flex flex-col gap-3 transition-all duration-200 group shadow-lg"
          >
            {/* Shot Header: Number, Shot Type, Duration */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-brand-light bg-brand/20 border border-brand/40 px-2 py-0.5 rounded-md">
                  SHOT #{shot.shotNumber < 10 ? `0${shot.shotNumber}` : shot.shotNumber}
                </span>
                <span className="text-xs font-extrabold text-white">{shot.shotType}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-300 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.08]">
                ⏱️ {shot.duration}
              </span>
            </div>

            {/* Editing Form vs Display Grid */}
            {editingId === shot.id ? (
              <div className="flex flex-col gap-2 bg-black/50 p-3 rounded-xl border border-white/10 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Shot Type</label>
                    <input
                      type="text"
                      value={editForm.shotType || ''}
                      onChange={(e) => setEditForm({ ...editForm, shotType: e.target.value })}
                      className="input-field text-xs py-1 px-2"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Camera Angle</label>
                    <input
                      type="text"
                      value={editForm.cameraAngle || ''}
                      onChange={(e) => setEditForm({ ...editForm, cameraAngle: e.target.value })}
                      className="input-field text-xs py-1 px-2"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Lens</label>
                    <input
                      type="text"
                      value={editForm.lens || ''}
                      onChange={(e) => setEditForm({ ...editForm, lens: e.target.value })}
                      className="input-field text-xs py-1 px-2"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Movement</label>
                    <input
                      type="text"
                      value={editForm.movement || ''}
                      onChange={(e) => setEditForm({ ...editForm, movement: e.target.value })}
                      className="input-field text-xs py-1 px-2"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Lighting</label>
                    <input
                      type="text"
                      value={editForm.lighting || ''}
                      onChange={(e) => setEditForm({ ...editForm, lighting: e.target.value })}
                      className="input-field text-xs py-1 px-2"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Transition</label>
                    <input
                      type="text"
                      value={editForm.transition || ''}
                      onChange={(e) => setEditForm({ ...editForm, transition: e.target.value })}
                      className="input-field text-xs py-1 px-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveEdit(shot.id)}
                    className="text-xs font-bold bg-brand text-white px-3 py-1 rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 bg-black/40 p-3 rounded-xl border border-white/[0.06] text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Angle</span>
                  <span className="text-slate-200 font-medium">{shot.cameraAngle}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Lens</span>
                  <span className="text-brand-light font-medium">{shot.lens}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Movement</span>
                  <span className="text-slate-200 font-medium">{shot.movement}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Lighting</span>
                  <span className="text-slate-200 font-medium">{shot.lighting}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Transition</span>
                  <span className="text-slate-300 font-medium">{shot.transition}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Duration</span>
                  <span className="text-brand-light font-medium">{shot.duration}</span>
                </div>
                {shot.notes && (
                  <div className="col-span-2 pt-1 border-t border-white/[0.06] text-[10px] text-slate-400 italic">
                    {shot.notes}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons: Edit, AI Recommend, Duplicate, Delete */}
            <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-white/[0.06]">
              <button
                onClick={() => startEditing(shot)}
                className="bg-white/[0.04] hover:bg-white/10 text-slate-300 text-[10px] font-bold py-1.5 rounded-lg border border-white/[0.08] transition-all text-center"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleAiRecommend(shot.id)}
                className="bg-brand/20 hover:bg-brand text-brand-light hover:text-white text-[10px] font-bold py-1.5 rounded-lg border border-brand/40 transition-all text-center shadow-glow"
              >
                🤖 AI Rec.
              </button>
              <button
                onClick={() => handleDuplicate(shot)}
                className="bg-white/[0.04] hover:bg-white/10 text-slate-300 text-[10px] font-bold py-1.5 rounded-lg border border-white/[0.08] transition-all text-center"
              >
                📋 Duplicate
              </button>
              <button
                onClick={() => handleDelete(shot.id)}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[10px] font-bold py-1.5 rounded-lg border border-rose-500/20 transition-all text-center"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AiAssistantDrawer() {
  const { isAuth } = useAuth()
  const {
    isOpen,
    openAssistant,
    closeAssistant,
    messages,
    promptHistory,
    isTyping,
    handleUserMessage,
    handleOptionSelect,
    insertPromptIntoStudio,
    resetConversation,
    deleteHistoryPrompt,
  } = useAiAssistant()

  const [inputVal, setInputVal] = useState('')
  const [activeTab, setActiveTab] = useState('chat') // 'chat' | 'history' | 'tools'
  const messagesEndRef = useRef(null)

  // ESC key listener to close drawer & focus management
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeAssistant()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeAssistant])

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, isOpen, activeTab])

  // Strictly hide AI Assistant FAB & Drawer for unauthenticated guest users (After all hooks!)
  if (!isAuth) return null

  const onSubmitInput = (e) => {
    e.preventDefault()
    if (!inputVal.trim()) return
    handleUserMessage(inputVal)
    setInputVal('')
  }

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  // Full-Featured Prompt History Manager Component
  function PromptHistoryManager({ historyList, onInsertToStudio, onCopyText, onDeleteItem, onDuplicateItem }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [sortOrder, setSortOrder] = useState('newest') // 'newest' | 'oldest' | 'duration'
    const [filterPlatform, setFilterPlatform] = useState('all') // 'all' | '9:16' | '16:9' | '1:1'

    // Filter & Search logic
    let filtered = historyList.filter(item => {
      const textMatch = (item.prompt + ' ' + (item.topic || '') + ' ' + (item.type || '')).toLowerCase().includes(searchTerm.toLowerCase())
      if (!textMatch) return false

      if (filterPlatform !== 'all') {
        const plat = (item.platform || '').toLowerCase()
        if (filterPlatform === '9:16' && !plat.includes('9:16') && !plat.includes('reels') && !plat.includes('shorts')) return false
        if (filterPlatform === '16:9' && !plat.includes('16:9') && !plat.includes('youtube')) return false
        if (filterPlatform === '1:1' && !plat.includes('1:1') && !plat.includes('post')) return false
      }
      return true
    })

    // Sort logic
    if (sortOrder === 'oldest') {
      filtered = [...filtered].reverse()
    } else if (sortOrder === 'duration') {
      filtered = [...filtered].sort((a, b) => parseInt(b.duration || 0) - parseInt(a.duration || 0))
    }

    return (
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search prompt history..."
            className="input-field text-xs py-2 px-3 pl-8"
          />
          <span className="absolute left-2.5 top-2.5 text-slate-500 text-xs">🔍</span>
        </div>

        {/* Filter Tabs & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-surface-0/60 p-2 rounded-xl border border-white/[0.06] text-xs">
          {/* Filter Pills */}
          <div className="flex gap-1">
            {[
              { id: 'all', label: 'All' },
              { id: '9:16', label: '9:16 Reels' },
              { id: '16:9', label: '16:9 YouTube' },
              { id: '1:1', label: '1:1 Feed' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterPlatform(f.id)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all ${filterPlatform === f.id
                  ? 'bg-brand text-white shadow-glow'
                  : 'text-slate-400 hover:text-white bg-white/[0.03]'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
            <span>Sort:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-black/40 border border-white/10 text-white rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="duration">By Duration</option>
            </select>
          </div>
        </div>

        {/* History Items Count */}
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span>Showing {filtered.length} of {historyList.length} prompts</span>
        </div>

        {/* History Cards List */}
        <div className="flex flex-col gap-3">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white/[0.03] border border-white/[0.08] hover:border-brand/40 p-4 rounded-2xl flex flex-col gap-3 transition-all duration-200 shadow-lg group"
              >
                {/* Header: Date, Topic/Type */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">{item.type || item.topic || 'Cinematic Reel'}</span>
                    <span className="text-[9px] font-bold bg-brand/20 text-brand-light px-2 py-0.5 rounded-full border border-brand/30">
                      {item.style || 'Cinematic'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">📅 {item.timestamp}</span>
                </div>

                {/* Thumbnail Placeholder */}
                <div className="w-full h-20 rounded-xl bg-gradient-to-br from-brand/30 via-purple-950/60 to-surface-0 border border-white/10 relative overflow-hidden flex items-center justify-center shadow-inner">
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
                  <div className="relative z-10 flex items-center gap-2 text-white">
                    <span className="text-lg">🎬</span>
                    <div className="text-[10px] font-bold text-slate-200">
                      <div>{item.platform || 'TikTok / Instagram Reels (9:16)'}</div>
                      <div className="text-[9px] text-brand-light">⏱️ {item.duration || '15 sec'}</div>
                    </div>
                  </div>
                </div>

                {/* Prompt Text */}
                <div className="bg-black/50 p-3 rounded-xl border border-white/10 text-xs text-slate-200 font-mono italic leading-relaxed">
                  "{item.prompt}"
                </div>

                {/* Badges: Platform & Duration */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-white/[0.06] pt-2">
                  <span>📱 {item.platform || '9:16 Vertical'}</span>
                  <span>⏱️ {item.duration || '15 sec'}</span>
                </div>

                {/* 4 Action Buttons: Reuse, Duplicate, Copy, Delete */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  <button
                    onClick={() => onInsertToStudio(item.prompt, item.style)}
                    className="bg-brand hover:bg-brand-dark text-white text-[10px] font-extrabold py-1.5 rounded-xl shadow-glow transition-all text-center flex items-center justify-center gap-1"
                  >
                    <span>✨ Reuse</span>
                  </button>
                  <button
                    onClick={() => onDuplicateItem(item)}
                    className="bg-white/[0.04] hover:bg-white/10 text-slate-300 text-[10px] font-bold py-1.5 rounded-xl border border-white/[0.08] transition-all text-center"
                  >
                    📋 Duplicate
                  </button>
                  <button
                    onClick={() => onCopyText(item.prompt)}
                    className="bg-white/[0.04] hover:bg-white/10 text-slate-300 text-[10px] font-bold py-1.5 rounded-xl border border-white/[0.08] transition-all text-center"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[10px] font-bold py-1.5 rounded-xl border border-rose-500/20 transition-all text-center"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs font-medium">
              No matching prompts found in history. Try adjusting your search filter or generate a new prompt in chat!
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Single Floating Action Button (FAB) at Bottom-Right Corner */}
      {!isOpen && (
        <button
          onClick={openAssistant}
          title="AI Assistant"
          aria-label="AI Assistant"
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-brand via-purple-600 to-brand-glow text-white px-5 py-3.5 rounded-full shadow-glow border border-white/25 hover:shadow-glow-strong hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 backdrop-blur-xl group cursor-pointer"
        >
          <span className="text-base animate-pulse">✨</span>
          <span className="text-xs font-extrabold tracking-wide text-white">
            AI Assistant
          </span>
        </button>
      )}

      {/* Slide-over Drawer Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Background Dimmed Overlay (25% opacity + backdrop blur) */}
          <div
            className="fixed inset-0 bg-black/25 backdrop-blur-sm transition-opacity duration-250 ease-in-out"
            onClick={closeAssistant}
          />

          {/* Right Slide-Over Panel */}
          <div
            role="dialog"
            aria-label="Reelify AI Assistant Drawer"
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[380px] md:w-[420px] bg-surface-1/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-250 ease-in-out animate-slide-in-right"
          >
            {/* Header */}
            <div className="p-4 md:p-5 border-b border-white/[0.08] flex items-center justify-between bg-surface-0/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand to-brand-glow flex items-center justify-center text-white text-base font-bold shadow-glow">
                  ✨
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-white leading-tight">Reelify AI Assistant</h2>
                  <p className="text-[11px] text-slate-400">Describe your idea for an optimized prompt</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={resetConversation}
                  className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 rounded-lg hover:bg-white/[0.05] transition-all"
                  title="Start New Chat"
                >
                  🔄 Clear
                </button>
                <button
                  onClick={closeAssistant}
                  className="text-slate-400 hover:text-white text-sm font-bold w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center transition-all hover:bg-white/10"
                  title="Close Drawer (ESC)"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Tab Selector */}
            <div className="flex border-b border-white/[0.06] bg-surface-0/40 p-1.5 text-xs font-bold text-slate-400">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-1.5 rounded-xl transition-all ${activeTab === 'chat' ? 'bg-brand text-white shadow-glow' : 'hover:text-white'
                  }`}
              >
                💬 Copilot Chat
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 ${activeTab === 'history' ? 'bg-brand text-white shadow-glow' : 'hover:text-white'
                  }`}
              >
                <span>📜 Session History</span>
                {promptHistory.length > 0 && (
                  <span className="bg-white/20 text-white text-[9px] px-1.5 py-0.2 rounded-full">
                    {promptHistory.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={`flex-1 py-1.5 rounded-xl transition-all ${activeTab === 'tools' ? 'bg-brand text-white shadow-glow' : 'hover:text-white'
                  }`}
              >
                🛠️ AI Tools
              </button>
            </div>

            {/* TAB 1: Chat Panel */}
            {activeTab === 'chat' && (
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                  >
                    {/* Message Bubble */}
                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user'
                        ? 'bg-brand text-white font-medium rounded-tr-none shadow-glow'
                        : 'bg-brand/10 border border-brand/20 text-slate-200 rounded-tl-none'
                        }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>

                    {/* Welcome Screen Chips */}
                    {msg.showWelcomeChips && (
                      <div className="flex flex-col gap-3 mt-2 w-full">
                        {/* Category Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {aiCategories.map((cat) => (
                            <span
                              key={cat}
                              className="text-[10px] font-semibold bg-white/[0.03] border border-white/[0.06] text-slate-300 px-2.5 py-1 rounded-full"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>

                        {/* Clickable Suggestion Chips */}
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                          Click a suggestion to begin:
                        </span>
                        <div className="flex flex-col gap-1.5">
                          {suggestionChips.map((chip) => (
                            <button
                              key={chip}
                              onClick={() => handleUserMessage(chip)}
                              className="text-left text-xs font-semibold bg-white/[0.03] hover:bg-brand/20 border border-white/[0.08] hover:border-brand/40 text-slate-200 hover:text-brand-light p-2.5 rounded-xl transition-all duration-200 flex items-center justify-between group"
                            >
                              <span>💡 "{chip}"</span>
                              <span className="text-brand-light opacity-0 group-hover:opacity-100 transition-opacity">
                                ➔
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Question Option Buttons */}
                    {msg.options && (
                      <div className="flex flex-wrap gap-1.5 mt-1 max-w-[90%]">
                        {msg.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleOptionSelect(msg.questionType, opt)}
                            className="text-xs font-bold bg-brand/20 hover:bg-brand border border-brand/40 hover:border-brand text-brand-light hover:text-white px-3 py-1.5 rounded-xl transition-all shadow-glow"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Generated Prompt Card & Storyboard Panel */}
                    {msg.promptCard && (
                      <div className="w-full flex flex-col gap-4 mt-2">
                        {/* Prompt Card */}
                        <div className="w-full bg-surface-0 border border-brand/40 rounded-2xl p-4 shadow-glow flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-brand-light uppercase tracking-wider">
                              ✨ Generated Prompt
                            </span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-brand/20 text-brand-light">
                              {msg.promptCard.style} • {msg.promptCard.duration}
                            </span>
                          </div>

                          <div className="bg-black/50 p-3 rounded-xl border border-white/10 text-xs text-slate-200 font-mono leading-relaxed italic">
                            "{msg.promptCard.prompt}"
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 pt-1 border-t border-white/10">
                            <button
                              onClick={() => insertPromptIntoStudio(msg.promptCard.prompt, msg.promptCard.style)}
                              className="bg-brand hover:bg-brand-dark text-white text-xs font-extrabold py-2.5 px-4 rounded-xl shadow-glow transition-all flex items-center justify-center gap-1.5 w-full"
                            >
                              <span>✨ Insert into Prompt Editor</span>
                            </button>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleCopyText(msg.promptCard.prompt)}
                                className="flex-1 bg-white/[0.04] hover:bg-white/10 text-slate-300 text-xs font-bold py-2 rounded-xl border border-white/10 transition-all text-center"
                              >
                                📋 Copy
                              </button>
                              <button
                                onClick={() => handleUserMessage(`Regenerate ${msg.promptCard.type || 'prompt'}`)}
                                className="flex-1 bg-white/[0.04] hover:bg-white/10 text-slate-300 text-xs font-bold py-2 rounded-xl border border-white/10 transition-all text-center"
                              >
                                🔄 Regenerate
                              </button>
                              <button
                                onClick={() => handleUserMessage(`Improve prompt for ${msg.promptCard.type || 'video'} with more details`)}
                                className="flex-1 bg-brand/15 hover:bg-brand/30 text-brand-light text-xs font-bold py-2 rounded-xl border border-brand/30 transition-all text-center"
                              >
                                ⚡ Improve
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Automatic Storyboard Panel */}
                        {msg.promptCard.storyboard && (
                          <StoryboardPanel
                            initialScenes={msg.promptCard.storyboard}
                            onInsertToStudio={(storyboardText) => insertPromptIntoStudio(storyboardText, msg.promptCard.style)}
                            onCopy={(text) => handleCopyText(text)}
                          />
                        )}

                        {/* Technical Shot List Panel */}
                        {msg.promptCard.shotList && (
                          <ShotListPanel
                            initialShots={msg.promptCard.shotList}
                            onInsertToStudio={(shotListText) => insertPromptIntoStudio(shotListText, msg.promptCard.style)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Animation */}
                {isTyping && (
                  <div className="flex items-center gap-2 bg-brand/10 border border-brand/20 p-3 rounded-2xl w-fit text-xs text-brand-light font-semibold">
                    <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                    <span>Reelify AI is thinking & writing prompt...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* TAB 2: Prompt History */}
            {activeTab === 'history' && (
              <PromptHistoryManager
                historyList={promptHistory}
                onInsertToStudio={(prompt, style) => insertPromptIntoStudio(prompt, style)}
                onCopyText={(text) => handleCopyText(text)}
                onDeleteItem={(id) => deleteHistoryPrompt(id)}
                onDuplicateItem={(item) => {
                  const dup = {
                    ...item,
                    id: 'gen-' + Date.now(),
                    timestamp: new Date().toLocaleString() + ' (Copy)'
                  }
                  insertPromptIntoStudio(dup.prompt, dup.style)
                }}
              />
            )}

            {/* TAB 3: Additional AI Tools */}
            {activeTab === 'tools' && (
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-xs font-extrabold text-white">Cinematic Prompt Modifiers</span>
                  <span className="text-[10px] text-slate-500">Click to append to Studio</span>
                </div>

                {/* Camera Angles */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-extrabold text-brand-light">📷 Camera Angles</label>
                  <div className="grid grid-cols-2 gap-2">
                    {aiTools.cameraAngles.map((c) => (
                      <button
                        key={c.label}
                        onClick={() => {
                          insertPromptIntoStudio(c.text)
                        }}
                        className="text-left bg-white/[0.03] hover:bg-brand/15 border border-white/[0.06] p-2.5 rounded-xl transition-all"
                      >
                        <p className="text-xs font-bold text-white mb-0.5">{c.label}</p>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{c.text}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lighting Suggestions */}
                <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06]">
                  <label className="text-[11px] font-extrabold text-brand-light">💡 Lighting & Atmosphere</label>
                  <div className="grid grid-cols-1 gap-2">
                    {aiTools.lighting.map((l) => (
                      <button
                        key={l.label}
                        onClick={() => {
                          insertPromptIntoStudio(l.text)
                        }}
                        className="text-left bg-white/[0.03] hover:bg-brand/15 border border-white/[0.06] p-2.5 rounded-xl transition-all flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-white mb-0.5">{l.label}</p>
                          <p className="text-[10px] text-slate-400">{l.text}</p>
                        </div>
                        <span className="text-brand-light text-xs font-bold">+ Add</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Negative Prompt */}
                <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06]">
                  <label className="text-[11px] font-extrabold text-rose-400">🚫 Negative Prompt Safeguard</label>
                  <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-xs text-rose-200">
                    <p className="mb-2 font-mono text-[11px]">{aiTools.negativePrompt}</p>
                    <button
                      onClick={() => handleCopyText(aiTools.negativePrompt)}
                      className="bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 text-xs font-bold py-1 px-3 rounded-lg transition-all"
                    >
                      Copy Negative Keywords
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Input Bar (Only visible in Chat Tab) */}
            {activeTab === 'chat' && (
              <div className="border-t border-white/[0.08] bg-surface-0/80 p-3 space-y-3">
                {/* ChatGPT + Cursor AI Quick Actions Bar */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { label: '✨ Improve Prompt', prompt: 'Enhance my video prompt with 35mm camera, lighting, and 8k detail.' },
                    { label: '📝 Script Rewrite', prompt: 'Rewrite my video script for viral retention and Hook-Value-CTA structure.' },
                    { label: '🎬 Storyboard Gen', prompt: 'Generate a 4-scene visual shot list for my video concept.' },
                    { label: '💬 Captions', prompt: 'Create bold animated captions for Instagram Reels and Shorts.' },
                    { label: '🎯 Viral Hooks', prompt: 'Give me 3 viral opening hooks for this video idea.' },
                    { label: '📢 CTA Ideas', prompt: 'Suggest 3 high-converting calls-to-action for this commercial.' },
                  ].map((act) => (
                    <button
                      key={act.label}
                      type="button"
                      onClick={() => handleUserMessage(act.prompt)}
                      className="bg-white/[0.03] hover:bg-brand/20 border border-white/[0.08] hover:border-brand/40 text-slate-300 hover:text-white text-[10px] font-extrabold px-2.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={onSubmitInput} className="flex gap-2">
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Ask Reelify Copilot or type a prompt..."
                    className="input-field text-xs flex-1 py-2.5 rounded-xl bg-black/40 border-white/10"
                  />
                  <button
                    type="submit"
                    disabled={!inputVal.trim() || isTyping}
                    className="btn-primary text-xs font-bold px-4 py-2.5 rounded-xl disabled:opacity-50 flex-shrink-0"
                  >
                    ✨ Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
