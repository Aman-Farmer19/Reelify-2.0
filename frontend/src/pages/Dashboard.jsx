import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import VideoCard from '../components/VideoCard'
import NewProjectModal from '../components/NewProjectModal'
import AICreativeDirectorWizard from '../components/AICreativeDirectorWizard'

const mockVideos = [
  { id: 'v1', title: 'Future of AI in 60 Seconds', duration: '15s', format: '9:16', style: 'Cinematic', views: '2.1K', tags: ['AI', 'Tech'], created_at: 'Jul 24, 2026', status: 'Ready', download_url: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4' },
  { id: 'v2', title: 'Golden Retriever Puppy Park Walk', duration: '15s', format: '9:16', style: 'Cinematic', views: '890', tags: ['Puppy', 'Animal'], created_at: 'Jul 23, 2026', status: 'Ready', download_url: 'https://www.w3schools.com/html/movie.mp4' },
  { id: 'v3', title: 'Morning Oceans Meditation', duration: '15s', format: '9:16', style: 'Minimal', views: '5.4K', tags: ['Nature', 'Travel'], created_at: 'Jul 22, 2026', status: 'Ready', download_url: 'https://vjs.zencdn.net/v/oceans.mp4' },
  { id: 'v4', title: 'Master Chef Cake Recipe', duration: '15s', format: '9:16', style: 'Bold', views: '1.2K', tags: ['Food', 'Cooking'], created_at: 'Jul 21, 2026', status: 'Ready', download_url: 'https://github.com/intel-iot-devkit/sample-videos/raw/master/classroom.mp4' },
  { id: 'v5', title: 'Cyberpunk Neon Street Racing', duration: '15s', format: '9:16', style: 'Cyberpunk', views: '3.8K', tags: ['SciFi', 'Speed'], created_at: 'Jul 20, 2026', status: 'Ready', download_url: 'https://vjs.zencdn.net/v/oceans.mp4' },
  { id: 'v6', title: 'Luxury Espresso Coffee Commercial', duration: '15s', format: '9:16', style: 'Luxury', views: '4.5K', tags: ['Commercial', 'Coffee'], created_at: 'Jul 19, 2026', status: 'Ready', download_url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' },
]

const recentTemplatesUsed = [
  { id: 'rt1', title: 'Luxury Coffee Commercial', icon: '☕', style: 'Cinematic', category: 'Commercial', usedDate: '2 hours ago' },
  { id: 'rt2', title: 'Cyberpunk Tech Gadget', icon: '⚡', style: 'Cyberpunk', category: 'Product Showcase', usedDate: 'Yesterday' },
  { id: 'rt3', title: 'Travel Vlog Japan', icon: '⛩️', style: 'Vibrant', category: 'Travel & Lifestyle', usedDate: '3 days ago' },
  { id: 'rt4', title: 'Esports Gaming Montage', icon: '🎮', style: 'High-Energy', category: 'Gaming', usedDate: '4 days ago' },
]

const recentActivities = [
  { id: 1, action: 'Generated Luxury Coffee Commercial', time: '2 hours ago', icon: '✨', status: 'Completed' },
  { id: 2, action: 'Exported Travel Vlog Japan 1080p MP4', time: '5 hours ago', icon: '📥', status: 'Exported' },
  { id: 3, action: 'Updated Cyberpunk Tech Project Settings', time: '1 day ago', icon: '⚙️', status: 'Saved' },
  { id: 4, action: 'Created New Esports Montage Project', time: '2 days ago', icon: '📁', status: 'Created' },
]

export default function Dashboard() {
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const [videos, setVideos] = useState(mockVideos)
  const [searchQuery, setSearchQuery] = useState('')
  const [formatFilter, setFormatFilter] = useState('All')
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showWizardModal, setShowWizardModal] = useState(false)

  // Dynamic greeting based on current time
  const getGreetingTime = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  const userName = user?.name || user?.email?.split('@')[0] || 'Aman'

  useEffect(() => {
    // Fetch user videos from backend
    axios.get('/api/videos', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data.videos?.length) {
          setVideos([...res.data.videos, ...mockVideos])
        }
      })
      .catch(() => { })
  }, [token])

  const handleDeleteVideo = async (videoToDelete) => {
    const title = typeof videoToDelete === 'object' ? videoToDelete.title : 'this video'
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return

    const targetId = typeof videoToDelete === 'object' ? videoToDelete.id : videoToDelete

    if (targetId) {
      try {
        await axios.delete(`/api/videos/${targetId}`, { headers: { Authorization: `Bearer ${token}` } })
        setVideos((prev) => prev.filter((v) => v.id !== targetId))
        toast.success('Video deleted successfully!')
      } catch (err) {
        toast.error('Could not delete video')
      }
    } else {
      setVideos((prev) => prev.filter((v) => v !== videoToDelete && v.title !== title))
      toast.success('Video removed from projects!')
    }
  }

  const filteredVideos = videos.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.tags && v.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    const matchesFormat = formatFilter === 'All' || v.format.includes(formatFilter)
    return matchesSearch && matchesFormat
  })

  const lastProject = videos[0] || mockVideos[0]

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 selection:bg-brand selection:text-white">

      {/* ─── 1. TOP HEADER & PRIMARY CTAS ─── */}
      <div className="card-glass p-8 md:p-10 border-brand/30 rounded-3xl bg-gradient-to-br from-brand/20 via-purple-950/20 to-surface-0 relative overflow-hidden shadow-glow-strong">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {getGreetingTime()}, {userName} 👋
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
              Ready to create something amazing?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowWizardModal(true)}
              className="btn-primary text-xs font-black px-7 py-4 rounded-2xl shadow-glow hover:scale-105 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <span>✨ AI Director Wizard</span>
            </button>

            <button
              onClick={() => setShowNewProjectModal(true)}
              className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white text-xs font-extrabold px-6 py-4 rounded-2xl transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <span>+ New Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── 2. CONTINUE PROJECT CARD ─── */}
      {lastProject && (
        <div className="card-glass p-6 md:p-8 border-white/[0.08] rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:border-brand/30 transition-all duration-300 shadow-xl">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="w-20 h-28 rounded-2xl bg-black/60 border border-white/10 overflow-hidden flex-shrink-0 relative flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              {lastProject.download_url ? (
                <video src={lastProject.download_url} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">🎬</span>
              )}
              <span className="absolute bottom-1.5 right-1.5 text-[9px] font-black text-brand-light bg-black/80 px-1.5 py-0.5 rounded">
                9:16
              </span>
            </div>

            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full uppercase">
                  ● Active Project
                </span>
                <span className="text-xs text-slate-500 font-bold">• Last edited 2 hours ago</span>
              </div>

              <h3 className="text-lg md:text-xl font-black text-white truncate">
                {lastProject.title}
              </h3>

              {/* Progress Bar */}
              <div className="space-y-1.5 max-w-sm">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                  <span>Render Status</span>
                  <span className="text-emerald-400 font-black">100% Completed</span>
                </div>
                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-gradient-to-r from-brand to-emerald-400 w-full rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/app/studio', { state: { resumeProject: lastProject } })}
            className="btn-primary text-xs font-black px-7 py-4 rounded-2xl shadow-glow hover:scale-105 transition-all w-full md:w-auto flex items-center justify-center gap-2 flex-shrink-0"
          >
            <span>Continue Project</span>
            <span className="text-xs">➔</span>
          </button>
        </div>
      )}

      {/* ─── 3. QUICK STATS (4 CARDS) ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Projects', value: '12 Active', icon: '📂', color: 'from-brand/20 to-purple-900/20' },
          { label: 'Videos Generated', value: '48 Reels', icon: '⚡', color: 'from-blue-500/20 to-cyan-500/20' },
          { label: 'Credits Remaining', value: '950 / 1000', icon: '💎', color: 'from-amber-500/20 to-orange-500/20' },
          { label: 'Storage Used', value: '4.2 GB / 20 GB', icon: '💾', color: 'from-emerald-500/20 to-teal-500/20' },
        ].map((s) => (
          <div key={s.label} className="card-glass p-6 border-white/[0.06] rounded-3xl relative overflow-hidden group hover:border-brand/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-slate-400">{s.label}</span>
              <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-base shadow-inner group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
            </div>
            <p className="text-2xl font-black text-white tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ─── 4. RECENT PROJECTS GRID ─── */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">Recent Projects</h2>
            <p className="text-xs text-slate-400">View and manage your recent AI video projects.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/[0.03] border border-white/[0.08] rounded-2xl pl-8 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🔍</span>
            </div>

            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand"
            >
              <option value="All">All Formats</option>
              <option value="9:16">9:16 Vertical</option>
              <option value="16:9">16:9 Landscape</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.slice(0, 6).map((v, i) => (
            <VideoCard key={v.id || i} video={v} index={i} onDelete={handleDeleteVideo} />
          ))}
        </div>
      </div>

      {/* ─── 5. RECENT TEMPLATES USED ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <span>🎨 Recent Templates Used</span>
          </h2>
          <button
            onClick={() => navigate('/app/templates')}
            className="text-xs text-brand-light font-extrabold hover:underline"
          >
            Explore Gallery ➔
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentTemplatesUsed.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => navigate('/app/templates')}
              className="card-glass p-5 border-white/[0.06] hover:border-brand/40 rounded-2xl flex flex-col justify-between gap-3 group transition-all cursor-pointer hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                  {tpl.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-extrabold text-white truncate group-hover:text-brand-light transition-colors">{tpl.title}</h4>
                  <span className="text-[9px] font-extrabold text-brand-light">{tpl.style}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/[0.04] pt-2">
                <span>{tpl.category}</span>
                <span className="text-slate-500">{tpl.usedDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 6. RECENT ACTIVITY TIMELINE ─── */}
      <div className="card-glass p-8 border-white/[0.08] rounded-3xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>🕒 Recent Activity Timeline</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time log of your project management activities and video exports.</p>
          </div>
          <span className="text-[10px] font-extrabold text-brand-light bg-brand/10 border border-brand/30 px-3 py-1 rounded-full">
            Activity Log
          </span>
        </div>

        <div className="space-y-4">
          {recentActivities.map((act) => (
            <div key={act.id} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.04] hover:border-brand/20 p-4 rounded-2xl transition-all duration-200">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/30 text-brand-light font-extrabold flex items-center justify-center text-sm shadow-inner">
                  {act.icon}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white">{act.action}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold">{act.time}</span>
                </div>
              </div>

              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                {act.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* NEW PROJECT MODAL */}
      {showNewProjectModal && (
        <NewProjectModal onClose={() => setShowNewProjectModal(false)} />
      )}

      {/* AI CREATIVE DIRECTOR WIZARD */}
      {showWizardModal && (
        <AICreativeDirectorWizard onClose={() => setShowWizardModal(false)} />
      )}

    </div>
  )
}
