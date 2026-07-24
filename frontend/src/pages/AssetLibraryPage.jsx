import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const MOCK_ASSETS = [
  {
    id: 'asset-1',
    name: 'Espresso_Hero_Shot_1080p.mp4',
    type: 'video',
    category: 'Videos',
    folder: '⚡ AI Generated',
    size: '14.2 MB',
    dimensions: '1080x1920 HD',
    duration: '15s',
    created_at: 'Jul 24, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
    url: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    prompt: 'Cinematic close-up of steaming luxury espresso, golden hour lighting.'
  },
  {
    id: 'asset-2',
    name: 'Golden_Retriever_Park.jpg',
    type: 'image',
    category: 'Images',
    folder: '📸 Raw Uploads',
    size: '3.8 MB',
    dimensions: '1080x1920 HD',
    duration: 'N/A',
    created_at: 'Jul 23, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&auto=format&fit=crop&q=80',
    prompt: 'Fluffy golden retriever puppy playing in sunny green grass.'
  },
  {
    id: 'asset-3',
    name: 'Cinematic_Epic_Strings.mp3',
    type: 'audio',
    category: 'Audio',
    folder: '🎵 Audio Tracks',
    size: '4.5 MB',
    dimensions: '320 kbps',
    duration: '60s',
    created_at: 'Jul 22, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    prompt: 'Orchestral cinematic string section with epic build and bass drop.'
  },
  {
    id: 'asset-4',
    name: 'Cyberpunk_City_Render.png',
    type: 'ai_asset',
    category: 'AI Assets',
    folder: '⚡ AI Generated',
    size: '8.1 MB',
    dimensions: '1080x1920 HD',
    duration: 'N/A',
    created_at: 'Jul 21, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop&q=80',
    prompt: 'Cyberpunk neon street raining at night with purple reflections.'
  },
  {
    id: 'asset-5',
    name: 'Reelify_Watermark_Logo.png',
    type: 'image',
    category: 'Images',
    folder: '🎨 Logos & Overlays',
    size: '1.2 MB',
    dimensions: '512x512 PNG',
    duration: 'N/A',
    created_at: 'Jul 20, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&auto=format&fit=crop&q=80',
    prompt: 'Clean transparent logo badge watermark overlay.'
  },
  {
    id: 'asset-6',
    name: 'LoFi_Chill_Beats.mp3',
    type: 'audio',
    category: 'Audio',
    folder: '🎵 Audio Tracks',
    size: '3.2 MB',
    dimensions: '256 kbps',
    duration: '45s',
    created_at: 'Jul 19, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    prompt: 'Relaxed lo-fi hip hop beat with cozy vinyl crackle atmosphere.'
  }
]

const FOLDERS = ['All Assets', '⚡ AI Generated', '📸 Raw Uploads', '🎵 Audio Tracks', '🎨 Logos & Overlays']

export default function AssetLibraryPage() {
  const navigate = useNavigate()
  const [assets, setAssets] = useState(MOCK_ASSETS)
  const [activeCategory, setActiveCategory] = useState('All') // 'All' | 'Images' | 'Videos' | 'Audio' | 'AI Assets'
  const [activeFolder, setActiveFolder] = useState('All Assets')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadName, setUploadName] = useState('')

  // Filter Assets Logic
  const filteredAssets = assets.filter((ast) => {
    const matchesCategory = activeCategory === 'All' || ast.category === activeCategory
    const matchesFolder = activeFolder === 'All Assets' || ast.folder === activeFolder
    const matchesSearch = ast.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (ast.prompt && ast.prompt.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesFolder && matchesSearch
  })

  // Handle Asset Upload
  const handleUploadSubmit = (e) => {
    e.preventDefault()
    if (!uploadName.trim()) return

    const newAsset = {
      id: 'asset-' + Date.now(),
      name: uploadName.trim().endsWith('.mp4') ? uploadName.trim() : `${uploadName.trim()}.jpg`,
      type: 'image',
      category: 'Images',
      folder: '📸 Raw Uploads',
      size: '2.4 MB',
      dimensions: '1080x1920 HD',
      duration: 'N/A',
      created_at: 'Just now',
      thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
      url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80',
      prompt: 'Custom user uploaded media asset.'
    }

    setAssets([newAsset, ...assets])
    setUploadName('')
    setShowUploadModal(false)
    toast.success('Asset uploaded successfully!')
  }

  // Insert asset into studio
  const handleInsertIntoStudio = (asset) => {
    localStorage.setItem('reelify_inserted_asset', JSON.stringify(asset))
    toast.success(`Inserted "${asset.name}" into Studio!`)
    navigate('/app/studio')
  }

  // Delete asset
  const handleDeleteAsset = (id) => {
    setAssets(assets.filter(a => a.id !== id))
    if (selectedAsset?.id === id) setSelectedAsset(null)
    toast.success('Asset removed from library.')
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 selection:bg-brand selection:text-white">
      
      {/* HEADER & UPLOAD BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>🖼️ Asset Library</span>
            <span className="text-xs font-black text-brand-light bg-brand/10 border border-brand/30 px-3 py-1 rounded-full">
              {filteredAssets.length} Items
            </span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
            Store, organize, preview, and drag images, videos, audio tracks, and AI assets into Creative Studio.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary text-xs font-black px-7 py-4 rounded-2xl shadow-glow hover:scale-105 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <span>📤 Upload Asset</span>
        </button>
      </div>

      {/* CATEGORY TABS & SEARCH CONTROL BAR */}
      <div className="card-glass p-5 border-white/[0.08] rounded-3xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-xl">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {['All', 'Images', 'Videos', 'Audio', 'AI Assets'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-brand text-white shadow-glow'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {cat === 'Images' && '🖼️ '}
              {cat === 'Videos' && '🎬 '}
              {cat === 'Audio' && '🎵 '}
              {cat === 'AI Assets' && '✨ '}
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <input
            type="text"
            placeholder="Search by filename or prompt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

      </div>

      {/* FOLDERS SYSTEM & GRID CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Folders Navigation */}
        <div className="card-glass p-4 rounded-3xl border-white/[0.08] space-y-3 lg:col-span-1 h-fit">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-2">
            Folders & Directories
          </span>
          <div className="flex flex-col gap-1">
            {FOLDERS.map((fld) => (
              <button
                key={fld}
                onClick={() => setActiveFolder(fld)}
                className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-between ${
                  activeFolder === fld
                    ? 'bg-brand/20 border border-brand/40 text-brand-light shadow-glow'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>{fld}</span>
                <span className="text-[10px] opacity-60">
                  {assets.filter(a => fld === 'All Assets' || a.folder === fld).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Assets Grid */}
        <div className="lg:col-span-3">
          {filteredAssets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {filteredAssets.map((ast) => (
                <div
                  key={ast.id}
                  onClick={() => setSelectedAsset(ast)}
                  className="card-glass border-white/[0.06] hover:border-brand/40 rounded-3xl p-3.5 space-y-3 transition-all duration-300 group hover:-translate-y-1 shadow-xl cursor-pointer relative"
                >
                  {/* Thumbnail Container */}
                  <div className="aspect-video w-full rounded-2xl bg-black border border-white/10 relative overflow-hidden flex items-center justify-center">
                    {ast.type === 'video' ? (
                      <video src={ast.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <img src={ast.thumbnail} alt={ast.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <span className="absolute top-2 left-2 text-[9px] font-black text-brand-light bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 uppercase">
                      {ast.category}
                    </span>
                  </div>

                  {/* Asset Details */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-white truncate group-hover:text-brand-light transition-colors">
                      {ast.name}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                      <span>{ast.dimensions}</span>
                      <span>{ast.size}</span>
                    </div>
                  </div>

                  {/* Quick Action Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleInsertIntoStudio(ast); }}
                    className="w-full bg-brand/15 hover:bg-brand text-brand-light hover:text-white text-xs font-black py-2 rounded-xl transition-all shadow-glow flex items-center justify-center gap-1"
                  >
                    <span>✨ Insert into Studio</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="card-glass p-12 text-center border-dashed border-white/15 rounded-3xl flex flex-col items-center justify-center gap-3">
              <span className="text-3xl">🖼️</span>
              <p className="text-sm font-black text-white">No assets found in this directory</p>
              <p className="text-xs text-slate-400">Try uploading new media files or selecting a different category tab.</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary text-xs font-black px-6 py-3 rounded-2xl shadow-glow mt-2"
              >
                + Upload Asset
              </button>
            </div>
          )}
        </div>

      </div>

      {/* FULL ASSET PREVIEW MODAL */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in">
          <div className="card-glass border-brand/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-glow-strong relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-brand-light bg-brand/20 border border-brand/40 px-2.5 py-0.5 rounded-md">
                  {selectedAsset.category}
                </span>
                <h3 className="text-sm font-black text-white truncate max-w-[240px]">{selectedAsset.name}</h3>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-slate-400 hover:text-white text-sm font-bold w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Media Player */}
            <div className="aspect-video w-full rounded-2xl bg-black border border-white/10 overflow-hidden relative flex items-center justify-center">
              {selectedAsset.type === 'video' ? (
                <video src={selectedAsset.url} controls autoPlay className="w-full h-full object-contain" />
              ) : selectedAsset.type === 'audio' ? (
                <audio src={selectedAsset.url} controls className="w-full px-6" />
              ) : (
                <img src={selectedAsset.thumbnail} alt={selectedAsset.name} className="w-full h-full object-contain" />
              )}
            </div>

            {/* Technical Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white/[0.02] border border-white/[0.08] p-3.5 rounded-2xl text-xs">
              <div>
                <span className="text-[9px] font-black text-slate-500 uppercase block">Format</span>
                <span className="text-white font-extrabold">{selectedAsset.type.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-500 uppercase block">Size</span>
                <span className="text-white font-extrabold">{selectedAsset.size}</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-500 uppercase block">Dimensions</span>
                <span className="text-white font-extrabold">{selectedAsset.dimensions}</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-500 uppercase block">Created</span>
                <span className="text-white font-extrabold">{selectedAsset.created_at}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleInsertIntoStudio(selectedAsset)}
                className="btn-primary flex-1 text-xs font-black py-3 rounded-2xl shadow-glow"
              >
                ✨ Insert into Studio
              </button>
              <button
                onClick={() => handleDeleteAsset(selectedAsset.id)}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-bold px-4 py-3 rounded-2xl border border-red-500/30"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD ASSET MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 select-none animate-fade-in">
          <form onSubmit={handleUploadSubmit} className="card-glass border-brand/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-glow-strong">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-black text-white">📤 Upload New Media Asset</h3>
              <button type="button" onClick={() => setShowUploadModal(false)} className="text-slate-400 text-sm">✕</button>
            </div>

            {/* Drag & Drop Zone */}
            <div className="border-2 border-dashed border-brand/40 bg-brand/5 p-8 rounded-2xl text-center space-y-2">
              <span className="text-3xl">📁</span>
              <p className="text-xs font-extrabold text-white">Drag & drop video, image, or audio files here</p>
              <p className="text-[10px] text-slate-400">Supports MP4, PNG, JPG, MP3 (Max 100MB)</p>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Asset Name</label>
              <input
                type="text"
                placeholder="e.g. Hero_Video_Shot_1080p.mp4"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                className="input-field text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowUploadModal(false)} className="text-xs text-slate-400 font-bold px-4 py-2">Cancel</button>
              <button type="submit" className="btn-primary text-xs font-black px-6 py-2.5 rounded-xl shadow-glow">Upload Now</button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}
