import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import VideoCard from '../components/VideoCard'

const stats = [
  { label: 'Videos Generated', value: '12' },
  { label: 'Total Views', value: '48K' },
  { label: 'Engagements', value: '3.2K' },
  { label: 'Success Rate', value: '94%' },
]

const mockVideos = [
  { title: 'Future of AI in 60 Seconds', duration: '58s', format: '9:16', views: '2.1K', tags: ['AI', 'Tech'] },
  { title: 'Sustainable Living Tips', duration: '45s', format: '9:16', views: '890', tags: ['Lifestyle'] },
  { title: 'Top 5 Productivity Hacks', duration: '52s', format: '9:16', views: '5.4K', tags: ['Growth'] },
  { title: 'How Blockchain Works', duration: '60s', format: '9:16', views: '1.2K', tags: ['Tech', 'Crypto'] },
  { title: 'Morning Routine 2025', duration: '30s', format: '9:16', views: '3.7K', tags: ['Health'] },
  { title: 'Python in 60 Seconds', duration: '60s', format: '16:9', views: '9.1K', tags: ['Code', 'Dev'] },
]

export default function Dashboard() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [videos, setVideos] = useState(mockVideos)

  useEffect(() => {
    // Fetch user videos from backend
    axios.get('/api/videos', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => { if (res.data.videos?.length) setVideos(res.data.videos) })
      .catch(() => {})
  }, [token])

  return (
    <div className="flex min-h-[calc(100vh-57px)]">
      <Sidebar />
      <main className="flex-1 p-7 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Your Dashboard</h1>
            <p className="text-sm text-slate-400 mt-0.5">Manage and track all your AI-generated videos</p>
          </div>
          <button onClick={() => navigate('/generate')} className="btn-primary text-sm px-4 py-2 rounded-xl">
            + New Video
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="card p-4">
              <p className="text-2xl font-bold text-white mb-1">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Videos */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Recent videos</h2>
          <button className="text-xs text-brand-light hover:underline">View all</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v, i) => (
            <VideoCard key={i} video={v} index={i} />
          ))}
        </div>
      </main>
    </div>
  )
}
