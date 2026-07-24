import React, { useState } from 'react'
import toast from 'react-hot-toast'

const INITIAL_SCENES = [
  {
    id: 'sc-1',
    sceneNumber: 1,
    title: 'Scene 1: Hero Introduction',
    duration: '3.5s',
    cameraAngle: '📹 35mm Dolly Push-In',
    lighting: '💡 Golden Hour Volumetric Light',
    voiceover: 'In a world of constant motion, true luxury demands stillness.',
    musicTrack: '🎵 Cinematic Strings',
    transition: '✨ Cross Dissolve',
    gradient: 'from-purple-600/40 via-indigo-900/60 to-black',
    imagePlaceholder: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
    prompt: 'Cinematic close-up shot of steaming luxury espresso coffee in a porcelain cup, golden hour rim lighting.'
  },
  {
    id: 'sc-2',
    sceneNumber: 2,
    title: 'Scene 2: Action Tracking',
    duration: '4.0s',
    cameraAngle: '📹 Orbital Tracking Shot',
    lighting: '💡 Neon Rim Key Light',
    voiceover: 'Crafted with precision, perfected by intelligent neural design.',
    musicTrack: '🎵 Epic Bass Drop',
    transition: '⚡ Hard Cut',
    gradient: 'from-pink-600/40 via-purple-900/60 to-black',
    imagePlaceholder: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    prompt: 'Dynamic orbital camera movement following slow-motion coffee bean pour into dark metallic grinder.'
  },
  {
    id: 'sc-3',
    sceneNumber: 3,
    title: 'Scene 3: Lens Close-Up',
    duration: '3.0s',
    cameraAngle: '📹 100mm Macro Close-Up',
    lighting: '💡 Softbox Studio Key Light',
    voiceover: 'Every detail engineered for unforgettable visual impact.',
    musicTrack: '🎵 Ambient Synth Pad',
    transition: '🌊 Zoom Blur Fade',
    gradient: 'from-blue-600/40 via-cyan-900/60 to-black',
    imagePlaceholder: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
    prompt: 'Extreme macro close-up of rich golden crema forming over dark roasted espresso shot.'
  },
  {
    id: 'sc-4',
    sceneNumber: 4,
    title: 'Scene 4: Final Reveal & Call to Action',
    duration: '4.5s',
    cameraAngle: '📹 Crane Up / Orbit Reveal',
    lighting: '💡 Atmospheric Cyberpunk Glow',
    voiceover: 'Reelify. Transform one idea into a viral masterpiece.',
    musicTrack: '🎵 Full Orchestra Peak',
    transition: '✨ Fade to Black',
    gradient: 'from-emerald-600/40 via-teal-900/60 to-black',
    imagePlaceholder: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop&q=80',
    prompt: 'Wide cinematic reveal shot of elegant finished coffee cup on dark marble counter with glowing brand logo.'
  }
]

export default function InteractiveStoryboardTimeline({ onUpdateStoryboard }) {
  const [scenes, setScenes] = useState(INITIAL_SCENES)
  const [selectedScene, setSelectedScene] = useState(INITIAL_SCENES[0])
  const [editingField, setEditingField] = useState(null)

  // Reorder scene left/right
  const handleMoveScene = (index, direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= scenes.length) return
    const updated = [...scenes]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    const renumbered = updated.map((sc, i) => ({ ...sc, sceneNumber: i + 1 }))
    setScenes(renumbered)
    if (onUpdateStoryboard) onUpdateStoryboard(renumbered)
    toast.success('Scene order updated!')
  }

  // Duplicate scene
  const handleDuplicateScene = (scene) => {
    const newScene = {
      ...scene,
      id: 'sc-' + Date.now(),
      sceneNumber: scenes.length + 1,
      title: `${scene.title} (Copy)`
    }
    const updated = [...scenes, newScene]
    setScenes(updated)
    if (onUpdateStoryboard) onUpdateStoryboard(updated)
    toast.success('Scene duplicated!')
  }

  // Delete scene
  const handleDeleteScene = (id) => {
    if (scenes.length <= 1) {
      toast.error('Storyboard must have at least 1 scene.')
      return
    }
    const updated = scenes.filter(sc => sc.id !== id).map((sc, i) => ({ ...sc, sceneNumber: i + 1 }))
    setScenes(updated)
    if (selectedScene?.id === id) setSelectedScene(updated[0])
    if (onUpdateStoryboard) onUpdateStoryboard(updated)
    toast.success('Scene deleted!')
  }

  // Add new blank scene
  const handleAddNewScene = () => {
    const newScene = {
      id: 'sc-' + Date.now(),
      sceneNumber: scenes.length + 1,
      title: `Scene ${scenes.length + 1}: Custom Shot`,
      duration: '3.0s',
      cameraAngle: '📹 35mm Cine Prime',
      lighting: '💡 Volumetric Rim Light',
      voiceover: 'Enter custom voiceover narration text for this scene...',
      musicTrack: '🎵 Ambient Track',
      transition: '✨ Cross Dissolve',
      gradient: 'from-purple-600/40 via-brand/60 to-black',
      imagePlaceholder: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
      prompt: 'New cinematic scene shot description...'
    }
    const updated = [...scenes, newScene]
    setScenes(updated)
    setSelectedScene(newScene)
    if (onUpdateStoryboard) onUpdateStoryboard(updated)
    toast.success('Added new scene to timeline!')
  }

  // Save edits to selected scene
  const handleUpdateSelectedScene = (field, val) => {
    const updatedScene = { ...selectedScene, [field]: val }
    setSelectedScene(updatedScene)
    const updatedList = scenes.map(sc => sc.id === updatedScene.id ? updatedScene : sc)
    setScenes(updatedList)
    if (onUpdateStoryboard) onUpdateStoryboard(updatedList)
  }

  return (
    <div className="card-glass border-white/[0.08] rounded-3xl p-6 space-y-6 shadow-2xl">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2.5">
            <span>🎞️ Interactive Storyboard Timeline</span>
            <span className="text-xs font-black text-brand-light bg-brand/20 border border-brand/40 px-3 py-0.5 rounded-full">
              {scenes.length} Scenes Total
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Drag, reorder, edit camera angles, duration, voiceover narration, and transitions before rendering.
          </p>
        </div>

        <button
          onClick={handleAddNewScene}
          className="btn-primary text-xs font-black px-5 py-2.5 rounded-xl shadow-glow flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>+ Add Scene</span>
        </button>
      </div>

      {/* Horizontal Storyboard Timeline Bar */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
        {scenes.map((sc, idx) => (
          <div
            key={sc.id}
            onClick={() => setSelectedScene(sc)}
            className={`w-64 flex-shrink-0 card-glass p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-3 cursor-pointer group hover:-translate-y-1 relative ${
              selectedScene?.id === sc.id
                ? 'border-brand bg-brand/15 shadow-glow scale-[1.02]'
                : 'border-white/[0.06] bg-white/[0.02] hover:border-brand/40'
            }`}
          >
            {/* Top Scene # Header & Duration Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-brand-light bg-brand/20 border border-brand/40 px-2.5 py-0.5 rounded-md">
                Scene 0{sc.sceneNumber}
              </span>

              <span className="text-[10px] font-bold text-slate-300 bg-black/60 border border-white/10 px-2 py-0.5 rounded-md">
                ⏱️ {sc.duration}
              </span>
            </div>

            {/* AI Image / Thumbnail Placeholder */}
            <div className="aspect-video w-full rounded-xl bg-black border border-white/10 relative overflow-hidden group-hover:border-brand/40 transition-colors">
              <img
                src={sc.imagePlaceholder}
                alt={sc.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute bottom-2 left-2 text-[10px] font-extrabold text-white truncate max-w-[180px]">
                {sc.cameraAngle}
              </span>
            </div>

            {/* Voice-over snippet */}
            <p className="text-[11px] text-slate-300 italic line-clamp-2 leading-relaxed bg-black/40 p-2 rounded-xl border border-white/[0.04]">
              "{sc.voiceover}"
            </p>

            {/* Action Bar (Reorder, Duplicate, Delete) */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[10px]">
              <div className="flex items-center gap-1">
                <button
                  disabled={idx === 0}
                  onClick={(e) => { e.stopPropagation(); handleMoveScene(idx, -1); }}
                  className="text-slate-400 hover:text-white disabled:opacity-30 px-1 py-0.5 bg-black/40 rounded border border-white/10"
                  title="Move Left"
                >
                  ◀
                </button>
                <button
                  disabled={idx === scenes.length - 1}
                  onClick={(e) => { e.stopPropagation(); handleMoveScene(idx, 1); }}
                  className="text-slate-400 hover:text-white disabled:opacity-30 px-1 py-0.5 bg-black/40 rounded border border-white/10"
                  title="Move Right"
                >
                  ▶
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => { e.stopPropagation(); handleDuplicateScene(sc); }}
                  className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/[0.04] border border-white/10"
                  title="Duplicate Scene"
                >
                  📋
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteScene(sc.id); }}
                  className="text-red-400 hover:text-red-300 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20"
                  title="Delete Scene"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Side Detail Inspector Panel for Selected Scene */}
      {selectedScene && (
        <div className="bg-white/[0.02] border border-brand/30 p-6 rounded-3xl space-y-4 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-brand-light bg-brand/20 border border-brand/40 px-2.5 py-0.5 rounded-md">
                Editing Scene 0{selectedScene.sceneNumber}
              </span>
              <h3 className="text-sm font-black text-white">{selectedScene.title}</h3>
            </div>
            <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              Live Storyboard Inspector
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Left Column: Voiceover & Prompt Edit */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  🎙️ Voice-Over Narration Text
                </label>
                <textarea
                  value={selectedScene.voiceover}
                  onChange={(e) => handleUpdateSelectedScene('voiceover', e.target.value)}
                  rows={2}
                  className="input-field text-xs resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  ✍️ AI Shot Visual Description Prompt
                </label>
                <textarea
                  value={selectedScene.prompt}
                  onChange={(e) => handleUpdateSelectedScene('prompt', e.target.value)}
                  rows={2}
                  className="input-field text-xs resize-none font-mono"
                />
              </div>
            </div>

            {/* Right Column: Camera, Duration, Music & Transition */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  📹 Camera Angle
                </label>
                <input
                  type="text"
                  value={selectedScene.cameraAngle}
                  onChange={(e) => handleUpdateSelectedScene('cameraAngle', e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  ⏱️ Duration
                </label>
                <input
                  type="text"
                  value={selectedScene.duration}
                  onChange={(e) => handleUpdateSelectedScene('duration', e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  🎵 Background Music
                </label>
                <input
                  type="text"
                  value={selectedScene.musicTrack}
                  onChange={(e) => handleUpdateSelectedScene('musicTrack', e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  ✨ Transition Type
                </label>
                <input
                  type="text"
                  value={selectedScene.transition}
                  onChange={(e) => handleUpdateSelectedScene('transition', e.target.value)}
                  className="input-field text-xs"
                />
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
