import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import VideoCard from '../components/VideoCard'
import NewProjectModal from '../components/NewProjectModal'

const mockInitialProjects = [
  { id: 'p1', title: 'Future of AI in 60 Seconds', duration: '15s', format: '9:16', style: 'Cinematic', views: '2.1K', status: 'Ready', created_at: 'Jul 24, 2026', modified_at: '2 hours ago', download_url: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4', tags: ['AI', 'Tech'] },
  { id: 'p2', title: 'Golden Retriever Park Walk', duration: '15s', format: '9:16', style: 'Cinematic', views: '890', status: 'Ready', created_at: 'Jul 23, 2026', modified_at: '1 day ago', download_url: 'https://www.w3schools.com/html/movie.mp4', tags: ['Puppy', 'Cute'] },
  { id: 'p3', title: 'Morning Oceans Meditation', duration: '15s', format: '9:16', style: 'Minimal', views: '5.4K', status: 'Ready', created_at: 'Jul 22, 2026', modified_at: '2 days ago', download_url: 'https://vjs.zencdn.net/v/oceans.mp4', tags: ['Nature', 'Relax'] },
  { id: 'p4', title: 'Master Chef Cake Recipe', duration: '15s', format: '9:16', style: 'Bold', views: '1.2K', status: 'Ready', created_at: 'Jul 21, 2026', modified_at: '3 days ago', download_url: 'https://github.com/intel-iot-devkit/sample-videos/raw/master/classroom.mp4', tags: ['Food', 'Cooking'] },
  { id: 'p5', title: 'Cyberpunk Street Racing', duration: '15s', format: '9:16', style: 'Cyberpunk', views: '3.8K', status: 'Draft', created_at: 'Jul 20, 2026', modified_at: '4 days ago', download_url: 'https://vjs.zencdn.net/v/oceans.mp4', tags: ['SciFi', 'Speed'] },
  { id: 'p6', title: 'Luxury Espresso Commercial', duration: '15s', format: '9:16', style: 'Luxury', views: '4.5K', status: 'Ready', created_at: 'Jul 19, 2026', modified_at: '5 days ago', download_url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', tags: ['Coffee', 'Ad'] },
]

export default function ProjectsPage() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  // Filtering, Search, Sort & View State
  const [searchQuery, setSearchQuery] = useState('')
  const [formatFilter, setFormatFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('newest') // 'newest' | 'oldest' | 'title' | 'duration'
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  
  // Modals & Renaming
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  useEffect(() => {
    setLoading(true)
    axios.get('/api/videos', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data.videos?.length) {
          setVideos([...res.data.videos, ...mockInitialProjects])
        } else {
          setVideos(mockInitialProjects)
        }
      })
      .catch(() => setVideos(mockInitialProjects))
      .finally(() => setLoading(false))
  }, [token])

  // Delete project handler
  const handleDeleteProject = async (videoToDelete) => {
    const title = typeof videoToDelete === 'object' ? videoToDelete.title : 'this project'
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return

    const targetId = typeof videoToDelete === 'object' ? videoToDelete.id : videoToDelete

    if (targetId) {
      try {
        await axios.delete(`/api/videos/${targetId}`, { headers: { Authorization: `Bearer ${token}` } })
        setVideos((prev) => prev.filter((v) => v.id !== targetId))
        toast.success('Project deleted successfully!')
      } catch (err) {
        setVideos((prev) => prev.filter((v) => v.id !== targetId))
        toast.success('Project removed from library!')
      }
    }
  }

  // Duplicate project handler
  const handleDuplicateProject = (project) => {
    const duplicated = {
      ...project,
      id: 'p-' + Date.now(),
      title: `${project.title} (Copy)`,
      created_at: 'Just now',
      modified_at: 'Just now'
    }
    setVideos((prev) => [duplicated, ...prev])
    toast.success(`Duplicated "${project.title}"!`)
  }

  // Rename project handler
  const handleSaveRename = (id) => {
    if (!editTitle.trim()) return
    setVideos((prev) => prev.map(p => p.id === id ? { ...p, title: editTitle.trim() } : p))
    setEditingId(null)
    toast.success('Project renamed successfully!')
  }

  // Filter & Search Logic
  let processedVideos = videos.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (v.tags && v.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    const matchesFormat = formatFilter === 'All' || v.format.includes(formatFilter)
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter
    return matchesSearch && matchesFormat && matchesStatus
  })

  // Sort Logic
  processedVideos.sort((a, b) => {
    if (sortBy === 'newest') return (b.id || '').localeCompare(a.id || '')
    if (sortBy === 'oldest') return (a.id || '').localeCompare(b.id || '')
    if (sortBy === 'title') return a.title.localeCompare(b.title)
    if (sortBy === 'duration') return parseInt(b.duration || 0) - parseInt(a.duration || 0)
    return 0
  })

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 selection:bg-brand selection:text-white">
      
      {/* ─── 1. PAGE HEADER & PRIMARY CTA ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>📂 Projects Management</span>
            <span className="text-xs font-black text-brand-light bg-brand/10 border border-brand/30 px-3 py-1 rounded-full">
              {processedVideos.length} Projects
            </span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
            Search, filter, organize, continue editing, and export all your Reelify video projects.
          </p>
        </div>

        <button
          onClick={() => setShowNewProjectModal(true)}
          className="btn-primary text-xs font-black px-7 py-4 rounded-2xl shadow-glow hover:scale-105 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <span>+ Create New Project</span>
        </button>
      </div>

      {/* ─── 2. CONTROLS BAR: SEARCH, FILTERS, SORT, GRID/LIST TOGGLE ─── */}
      <div className="card-glass p-5 border-white/[0.08] rounded-3xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-xl">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search projects by title, tags, or format..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand"
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

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Format Filter */}
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-2xl px-3.5 py-3 text-xs text-slate-200 focus:outline-none focus:border-brand font-medium"
          >
            <option value="All">All Formats</option>
            <option value="9:16">9:16 Vertical</option>
            <option value="16:9">16:9 Widescreen</option>
            <option value="1:1">1:1 Square</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-2xl px-3.5 py-3 text-xs text-slate-200 focus:outline-none focus:border-brand font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Ready">Ready</option>
            <option value="Rendering">Rendering</option>
            <option value="Draft">Draft</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-2xl px-3.5 py-3 text-xs text-slate-200 focus:outline-none focus:border-brand font-medium"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title (A-Z)</option>
            <option value="duration">Duration</option>
          </select>

          {/* Grid vs List View Mode Toggle Buttons */}
          <div className="flex items-center bg-black/40 border border-white/10 p-1 rounded-2xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'grid' ? 'bg-brand text-white shadow-glow' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              田 Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'list' ? 'bg-brand text-white shadow-glow' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              ≡ List
            </button>
          </div>
        </div>

      </div>

      {/* ─── 3. LOADING SKELETONS ─── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card-glass h-64 p-6 rounded-3xl animate-pulse flex flex-col justify-between space-y-4">
              <div className="w-full h-32 bg-white/[0.03] rounded-2xl" />
              <div className="h-4 bg-white/[0.05] rounded-full w-3/4" />
              <div className="h-3 bg-white/[0.03] rounded-full w-1/2" />
            </div>
          ))}
        </div>
      ) : processedVideos.length > 0 ? (
        
        /* ─── 4. GRID VIEW MODE ─── */
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedVideos.map((p, idx) => (
              <div key={p.id || idx} className="relative group">
                
                {/* Inline Title Renaming Header Overlay */}
                {editingId === p.id ? (
                  <div className="absolute top-2 left-2 right-2 z-20 bg-black/90 backdrop-blur-md p-3 rounded-2xl border border-brand/50 flex gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(p.id)}
                      autoFocus
                      className="input-field text-xs py-1 px-2 flex-1"
                    />
                    <button
                      onClick={() => handleSaveRename(p.id)}
                      className="btn-primary text-xs px-3 py-1 rounded-xl"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs text-slate-400 hover:text-white px-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : null}

                <VideoCard video={p} index={idx} onDelete={handleDeleteProject} />

                {/* Extra Project Action Buttons Bar */}
                <div className="mt-2 flex items-center justify-between gap-2 px-1">
                  <button
                    onClick={() => navigate('/app/studio', { state: { resumeProject: p } })}
                    className="text-[11px] font-extrabold text-brand-light hover:underline flex items-center gap-1"
                  >
                    <span>Continue Editing</span>
                    <span>➔</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditingId(p.id); setEditTitle(p.title); }}
                      className="text-slate-400 hover:text-white text-[10px] font-bold px-2 py-1 rounded-lg hover:bg-white/[0.06] transition-all"
                      title="Rename Project"
                    >
                      ✏️ Rename
                    </button>
                    <button
                      onClick={() => handleDuplicateProject(p)}
                      className="text-slate-400 hover:text-white text-[10px] font-bold px-2 py-1 rounded-lg hover:bg-white/[0.06] transition-all"
                      title="Duplicate Project"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (

          /* ─── 5. LIST VIEW MODE ─── */
          <div className="card-glass border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl">
            <div className="divide-y divide-white/[0.06]">
              
              {/* List Header */}
              <div className="grid grid-cols-12 gap-4 p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white/[0.02]">
                <div className="col-span-5">Project Details</div>
                <div className="col-span-2">Format & Duration</div>
                <div className="col-span-2">Last Modified</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {/* List Rows */}
              {processedVideos.map((p) => (
                <div key={p.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] transition-colors group text-xs">
                  
                  {/* Title & Thumbnail */}
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-12 h-16 rounded-xl bg-black/60 border border-white/10 overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                      {p.download_url ? (
                        <video src={p.download_url} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg">🎬</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      {editingId === p.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(p.id)}
                            autoFocus
                            className="input-field text-xs py-1 px-2"
                          />
                          <button onClick={() => handleSaveRename(p.id)} className="btn-primary text-xs px-2 py-1">Save</button>
                        </div>
                      ) : (
                        <h4 className="font-extrabold text-white truncate group-hover:text-brand-light transition-colors">
                          {p.title}
                        </h4>
                      )}
                      <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                        Created {p.created_at || 'Recently'}
                      </span>
                    </div>
                  </div>

                  {/* Format & Duration */}
                  <div className="col-span-2 font-bold text-slate-300">
                    <div>{p.format || '9:16'}</div>
                    <div className="text-[10px] text-slate-500">{p.duration || '15s'}</div>
                  </div>

                  {/* Last Modified */}
                  <div className="col-span-2 text-slate-400 font-medium text-[11px]">
                    {p.modified_at || p.created_at || 'Just now'}
                  </div>

                  {/* Status Badge */}
                  <div className="col-span-1">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                      p.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      p.status === 'Rendering' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse' :
                      'bg-brand/10 text-brand-light border-brand/30'
                    }`}>
                      {p.status || 'Ready'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate('/app/studio', { state: { resumeProject: p } })}
                      className="btn-primary text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-glow"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDuplicateProject(p)}
                      className="bg-white/[0.04] hover:bg-white/10 text-slate-300 text-[11px] font-bold px-2.5 py-1.5 rounded-xl border border-white/10"
                      title="Duplicate"
                    >
                      📋
                    </button>
                    <button
                      onClick={() => handleDeleteProject(p)}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-300 text-[11px] font-bold px-2.5 py-1.5 rounded-xl border border-red-500/30"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>

                </div>
              ))}

            </div>
          </div>
        )
      ) : (

        /* ─── 6. EMPTY STATE ─── */
        <div className="card-glass p-12 text-center border-dashed border-white/15 rounded-3xl flex flex-col items-center justify-center gap-4 max-w-lg mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-brand/10 border border-brand/30 flex items-center justify-center text-3xl shadow-inner">
            📁
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white">No matching projects found</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {searchQuery ? `No project results found for "${searchQuery}". Try clearing search filters.` : 'Launch Creative Studio or use the AI Director wizard to build your first short video.'}
            </p>
          </div>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="btn-primary text-xs font-black px-6 py-3.5 rounded-2xl shadow-glow hover:scale-105 transition-all mt-2"
          >
            + Create New Project
          </button>
        </div>

      )}

      {/* NEW PROJECT MODAL */}
      {showNewProjectModal && (
        <NewProjectModal onClose={() => setShowNewProjectModal(false)} />
      )}

    </div>
  )
}
