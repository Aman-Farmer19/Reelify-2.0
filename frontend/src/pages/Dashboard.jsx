import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import VideoCard from '../components/VideoCard'

const stats = [
  { label: 'Videos Generated', value: '12', color: 'from-brand to-brand-glow' },
  { label: 'Total Views', value: '4.8K', color: 'from-blue-500/20 to-cyan-500/20' },
  { label: 'Engagements', value: '1.2K', color: 'from-purple-500/20 to-pink-500/20' },
  { label: 'Success Rate', value: '98%', color: 'from-teal-500/20 to-emerald-500/20' },
]

const mockVideos = [
  { title: 'Future of AI in 60 Seconds', duration: '15s', format: '9:16', style: 'Cinematic', views: '2.1K', tags: ['AI', 'Tech'], download_url: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4' },
  { title: 'Golden Retriever Puppy Park Walk', duration: '15s', format: '9:16', style: 'Cinematic', views: '890', tags: ['Puppy', 'Animal'], download_url: 'https://www.w3schools.com/html/movie.mp4' },
  { title: 'Morning Oceans Meditation', duration: '15s', format: '9:16', style: 'Minimal', views: '5.4K', tags: ['Nature', 'Travel'], download_url: 'https://vjs.zencdn.net/v/oceans.mp4' },
  { title: 'Master Chef Cake Recipe', duration: '15s', format: '9:16', style: 'Bold', views: '1.2K', tags: ['Food', 'Cooking'], download_url: 'https://github.com/intel-iot-devkit/sample-videos/raw/master/classroom.mp4' },
  { title: 'Sprint Workout Motivation', duration: '15s', format: '9:16', style: 'Dynamic', views: '3.7K', tags: ['Fitness', 'Gym'], download_url: 'https://github.com/intel-iot-devkit/sample-videos/raw/master/people-detection.mp4' },
  { title: 'HTML Video Player Demo', duration: '15s', format: '16:9', style: 'Vintage', views: '9.1K', tags: ['Code', 'Dev'], download_url: 'https://www.w3schools.com/html/movie.mp4' },
]

export default function Dashboard() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [videos, setVideos] = useState(mockVideos)
  const [searchQuery, setSearchQuery] = useState('')
  const [formatFilter, setFormatFilter] = useState('All')
  
  const [contactMessages, setContactMessages] = useState([])

  useEffect(() => {
    // Fetch user videos from backend
    axios.get('/api/videos', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => { 
        if (res.data.videos?.length) {
          // Merge local mock videos with newly generated database videos
          setVideos([...res.data.videos, ...mockVideos])
        }
      })
      .catch(() => {})

    // Fetch contact form messages from backend
    axios.get('/api/contact/messages', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data.messages) {
          setContactMessages(res.data.messages)
        }
      })
      .catch(() => {})
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
      // Delete mock item from component state
      setVideos((prev) => prev.filter((v) => v !== videoToDelete && v.title !== title))
      toast.success('Video removed from history!')
    }
  }

  const handleDeleteMessage = async (msgId) => {
    try {
      await axios.delete(`/api/contact/messages/${msgId}`, { headers: { Authorization: `Bearer ${token}` } })
      setContactMessages((prev) => prev.filter((m) => m.id !== msgId))
      toast.success('Message removed')
    } catch (err) {
      toast.error('Could not delete message')
    }
  }

  // Filter video items based on inputs
  const filteredVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (v.tags && v.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    const matchesFormat = formatFilter === 'All' || v.format.includes(formatFilter)
    return matchesSearch && matchesFormat
  })

  return (
    <div className="flex min-h-[calc(100vh-77px)] bg-surface-0">
      <Sidebar />
      
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Your Dashboard</h1>
              <p className="text-xs text-slate-400">Monitor engagement, browse generations, and manage exported short reels.</p>
            </div>
            <button 
              onClick={() => navigate('/generate')} 
              className="btn-primary text-xs font-bold px-5 py-3 rounded-2xl shadow-glow self-start"
            >
              + Create New Video
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="card-glass p-5 border-white/[0.05] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-12 h-12 bg-brand/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                <p className="text-2xl font-extrabold text-white mb-1 tracking-tight">{s.value}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-5">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-xs">🔍</span>
              <input
                type="text"
                placeholder="Search videos by title or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.07] rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-brand"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Format:</span>
              <select
                value={formatFilter}
                onChange={(e) => setFormatFilter(e.target.value)}
                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-brand"
              >
                <option value="All">All Formats</option>
                <option value="9:16">9:16 (Shorts/Reels)</option>
                <option value="16:9">16:9 (Landscape)</option>
              </select>
            </div>
          </div>

          {/* Grid list */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recent Generations</h2>
              <span className="text-xs text-slate-500 font-semibold">{filteredVideos.length} items found</span>
            </div>

            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((v, i) => (
                  <VideoCard key={v.id || i} video={v} index={i} onDelete={handleDeleteVideo} />
                ))}
              </div>
            ) : (
              <div className="card-glass p-12 text-center border-dashed border-white/10 flex flex-col items-center gap-3">
                <span className="text-2xl">📁</span>
                <p className="text-xs text-slate-500 font-bold">No videos found</p>
                <p className="text-[10px] text-slate-600 max-w-[220px] leading-normal mx-auto">Try altering your search text or format filter, or create a new video from scratch.</p>
              </div>
            )}
          </div>

          {/* Received Contact Messages Inbox */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>✉️ Received Contact Messages</span>
                <span className="text-[10px] text-brand-light font-bold bg-brand/10 border border-brand/30 px-2 py-0.5 rounded-full">
                  {contactMessages.length} Messages
                </span>
              </h2>
            </div>

            {contactMessages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contactMessages.map((msg) => (
                  <div key={msg.id} className="card-glass p-5 border-white/[0.06] flex flex-col gap-2 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-extrabold text-white">{msg.name}</p>
                        <p className="text-[10px] text-brand-light font-semibold">{msg.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-500 font-semibold">{msg.created_at}</span>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="text-slate-500 hover:text-rose-400 text-xs p-1"
                          title="Delete message"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 bg-white/[0.02] p-3 rounded-xl border border-white/[0.04] mt-1 leading-relaxed">
                      "{msg.message}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-glass p-6 text-center border-dashed border-white/10 text-xs text-slate-500">
                No contact form submissions yet. When visitors fill out "Get in Touch", their messages will appear here.
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
