import React, { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'

const MOCK_NOTIFICATIONS = [
  {
    id: 'n-1',
    title: 'Rendering Complete',
    message: 'Your 9:16 video "Future of AI in 60s" has finished rendering and is ready for export.',
    type: 'rendering',
    icon: '🎬',
    time: '2 mins ago',
    unread: true
  },
  {
    id: 'n-2',
    title: 'Credits Running Low',
    message: 'You have 50 credits remaining for this billing cycle. Upgrade to PRO for unlimited renders.',
    type: 'credits',
    icon: '⚠️',
    time: '1 hour ago',
    unread: true
  },
  {
    id: 'n-3',
    title: 'Project Exported',
    message: '1080p HD MP4 export for "Golden Retriever Park" downloaded successfully.',
    type: 'export',
    icon: '📦',
    time: '3 hours ago',
    unread: true
  },
  {
    id: 'n-4',
    title: 'New Template Available',
    message: 'The new "Cyberpunk Street Racing" 8K visual template is now live in Creative Studio.',
    type: 'template',
    icon: '✨',
    time: '1 day ago',
    unread: false
  },
  {
    id: 'n-5',
    title: 'AI Prompt Suggestion',
    message: 'Try adding "slow dolly push" to your prompt to improve camera tracking smoothness by 40%.',
    type: 'ai',
    icon: '💡',
    time: '2 days ago',
    unread: false
  }
]

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [filter, setFilter] = useState('all') // 'all' | 'unread' | 'read'
  const dropdownRef = useRef(null)

  // Unread Count
  const unreadCount = notifications.filter(n => n.unread).length

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filtered Notifications
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return n.unread
    if (filter === 'read') return !n.unread
    return true
  })

  // Mark single as read
  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n))
  }

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })))
    toast.success('All notifications marked as read!')
  }

  // Clear all notifications
  const handleClearAll = () => {
    setNotifications([])
    toast.success('Notification center cleared!')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* BELL TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-2xl bg-white/[0.04] hover:bg-brand/20 border border-white/10 hover:border-brand/40 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-glow"
        title="Notification Center"
      >
        <span className="text-base">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand text-white font-black text-[10px] flex items-center justify-center shadow-glow border border-surface-0 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN POPOVER PANEL */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 card-glass border-brand/40 rounded-3xl p-4 shadow-glow-strong z-50 space-y-4 animate-fade-in select-none">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">Notification Center</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-black text-brand-light bg-brand/20 border border-brand/40 px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px]">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-brand-light hover:underline font-bold"
                >
                  Mark read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-slate-400 hover:text-red-400 font-bold"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-black/40 border border-white/10 p-1 rounded-2xl text-xs font-bold text-slate-400">
            {['all', 'unread', 'read'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-1.5 rounded-xl transition-all capitalize ${
                  filter === f ? 'bg-brand text-white shadow-glow' : 'hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Notifications Stream */}
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1 scrollbar-none">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id)}
                  className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex gap-3 ${
                    n.unread
                      ? 'bg-brand/10 border-brand/30 text-white'
                      : 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-sm flex-shrink-0">
                    {n.icon}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-white truncate">{n.title}</h4>
                      <span className="text-[9px] text-slate-500 font-semibold">{n.time}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed line-clamp-2">{n.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 font-bold">
                No notifications in this filter.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  )
}
