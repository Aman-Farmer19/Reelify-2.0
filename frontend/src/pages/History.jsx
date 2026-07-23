import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'

const mockHistoryData = [
  {
    id: 'mock-1',
    title: 'Future of AI in 60 Seconds',
    prompt: 'AI revolution in technology and short form content creation',
    duration: '15s',
    format: '9:16',
    style: 'Cinematic',
    status: 'Completed',
    created_at: 'July 23, 2026 at 11:45 AM',
    download_url: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4'
  },
  {
    id: 'mock-2',
    title: 'Golden Retriever Puppy Park Walk',
    prompt: 'Puppy running in sunny green garden with boy',
    duration: '15s',
    format: '9:16',
    style: 'Cinematic',
    status: 'Completed',
    created_at: 'July 23, 2026 at 10:15 AM',
    download_url: 'https://www.w3schools.com/html/movie.mp4'
  },
  {
    id: 'mock-3',
    title: 'Morning Oceans Meditation',
    prompt: 'Sunset over calm beach ocean waves',
    duration: '15s',
    format: '9:16',
    style: 'Minimal',
    status: 'Completed',
    created_at: 'July 22, 2026 at 06:30 PM',
    download_url: 'https://vjs.zencdn.net/v/oceans.mp4'
  },
  {
    id: 'mock-4',
    title: 'Master Chef Cake Recipe',
    prompt: 'Baking delicious chocolate cake in modern kitchen',
    duration: '15s',
    format: '9:16',
    style: 'Bold',
    status: 'Completed',
    created_at: 'July 22, 2026 at 02:10 PM',
    download_url: 'https://github.com/intel-iot-devkit/sample-videos/raw/master/classroom.mp4'
  },
  {
    id: 'mock-5',
    title: 'Sprint Workout Motivation',
    prompt: 'Athlete running fast on outdoor track',
    duration: '15s',
    format: '9:16',
    style: 'Dynamic',
    status: 'Completed',
    created_at: 'July 21, 2026 at 09:20 AM',
    download_url: 'https://github.com/intel-iot-devkit/sample-videos/raw/master/people-detection.mp4'
  }
]

export default function History() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [historyItems, setHistoryItems] = useState(mockHistoryData)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVideo, setSelectedVideo] = useState(null)

  useEffect(() => {
    // Fetch video history from backend
    axios.get('/api/videos', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data.videos?.length) {
          const apiFormatted = res.data.videos.map((v) => ({
            ...v,
            created_at: v.created_at || new Date().toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          }))
          setHistoryItems([...apiFormatted, ...mockHistoryData])
        }
      })
      .catch(() => {})
  }, [token])

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.title}" from your history logs?`)) return

    if (item.id && !item.id.toString().startsWith('mock-')) {
      try {
        await axios.delete(`/api/videos/${item.id}`, { headers: { Authorization: `Bearer ${token}` } })
        setHistoryItems((prev) => prev.filter((v) => v.id !== item.id))
        toast.success('Video record deleted successfully!')
      } catch (err) {
        toast.error('Could not delete video record')
      }
    } else {
      setHistoryItems((prev) => prev.filter((v) => v.id !== item.id && v.title !== item.title))
      toast.success('History log removed!')
    }
  }

  const filteredHistory = historyItems.filter((item) => {
    const q = searchQuery.toLowerCase()
    return (
      item.title.toLowerCase().includes(q) ||
      (item.prompt && item.prompt.toLowerCase().includes(q)) ||
      item.created_at.toLowerCase().includes(q) ||
      (item.style && item.style.toLowerCase().includes(q))
    )
  })

  return (
    <div className="flex min-h-[calc(100vh-77px)] bg-surface-0">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/25 rounded-full px-3 py-1 text-xs font-bold text-brand-light mb-2">
                📜 Chronological Activity Logs
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Generation History</h1>
              <p className="text-xs text-slate-400">
                Track all previously generated videos, timestamps, date logs, and export details.
              </p>
            </div>
            <button
              onClick={() => navigate('/generate')}
              className="btn-primary text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-glow self-start md:self-auto"
            >
              + Generate New Video
            </button>
          </div>

          {/* Activity Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-glass p-5 border-white/[0.05]">
              <p className="text-2xl font-extrabold text-white mb-1 tracking-tight">{historyItems.length}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Videos Logged</p>
            </div>
            <div className="card-glass p-5 border-white/[0.05]">
              <p className="text-2xl font-extrabold text-brand-light mb-1 tracking-tight">
                {historyItems.length * 15}s
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Render Time</p>
            </div>
            <div className="card-glass p-5 border-white/[0.05]">
              <p className="text-xs font-bold text-slate-200 mb-1 truncate">
                {historyItems[0]?.created_at || 'Today'}
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last Activity Date</p>
            </div>
            <div className="card-glass p-5 border-white/[0.05]">
              <p className="text-2xl font-extrabold text-emerald-400 mb-1 tracking-tight">100%</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pipeline Health</p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-4 flex items-center gap-3">
            <span className="text-slate-500 text-xs pl-2">🔍</span>
            <input
              type="text"
              placeholder="Search history by title, date (e.g. July 23), or style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 py-2.5 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-brand"
            />
            <span className="text-xs text-slate-500 font-semibold pr-2 whitespace-nowrap">
              {filteredHistory.length} logs found
            </span>
          </div>

          {/* History Log Table / List */}
          <div className="card-glass p-6 border-white/[0.06] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h2 className="text-xs font-extrabold text-white uppercase tracking-wider">Previous Work & Timestamps</h2>
              <span className="text-[10px] text-slate-500 font-semibold">Ordered by newest first</span>
            </div>

            {filteredHistory.length > 0 ? (
              <div className="flex flex-col gap-3">
                {filteredHistory.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-brand/30 p-4 rounded-2xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left Info: Title & Timestamp */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand-light font-extrabold text-xs flex-shrink-0 mt-0.5">
                        🎬
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-sm font-extrabold text-white truncate">{item.title}</p>
                          <span className="text-[9px] font-extrabold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase">
                            {item.status || 'Completed'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mb-1.5">{item.prompt || 'AI Generated Short Reel'}</p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-semibold flex-wrap">
                          <span className="text-brand-light flex items-center gap-1">
                            🕒 <span>{item.created_at}</span>
                          </span>
                          <span>•</span>
                          <span>Format: {item.format || '9:16'}</span>
                          <span>•</span>
                          <span>Style: {item.style || 'Cinematic'}</span>
                          <span>•</span>
                          <span>Duration: {item.duration || '15s'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
                      {item.download_url && (
                        <button
                          onClick={() => setSelectedVideo(item)}
                          className="bg-white/[0.04] hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
                        >
                          ▶ Preview
                        </button>
                      )}

                      {item.download_url && (
                        <a
                          href={item.download_url}
                          download="reelify_history_video.mp4"
                          target="_blank"
                          rel="noreferrer"
                          className="bg-brand/15 hover:bg-brand/30 border border-brand/30 text-brand-light text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
                        >
                          📥 Download
                        </a>
                      )}

                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-300 text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
                        title="Delete record from history"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500">
                No matching history logs found. Try altering your search text.
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Video Preview Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-surface-1 border border-white/10 p-5 rounded-3xl max-w-sm w-full relative flex flex-col gap-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-white truncate max-w-[200px]">{selectedVideo.title}</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-slate-400 hover:text-white text-sm p-1"
              >
                ✕
              </button>
            </div>
            <div className="aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-white/10">
              <video
                src={selectedVideo.download_url}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>{selectedVideo.created_at}</span>
              <a
                href={selectedVideo.download_url}
                download
                className="text-brand-light font-bold hover:underline"
              >
                Download MP4 ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
