import React, { useState } from 'react'

const WEEKLY_DATA = [
  { day: 'Mon', count: 4, height: '40%' },
  { day: 'Tue', count: 7, height: '70%' },
  { day: 'Wed', count: 5, height: '50%' },
  { day: 'Thu', count: 12, height: '95%' },
  { day: 'Fri', count: 9, height: '80%' },
  { day: 'Sat', count: 6, height: '60%' },
  { day: 'Sun', count: 5, height: '50%' },
]

const MONTHLY_GROWTH = [
  { month: 'Jan', views: '2.1K', val: 20 },
  { month: 'Feb', views: '4.5K', val: 35 },
  { month: 'Mar', views: '8.2K', val: 55 },
  { month: 'Apr', views: '12.4K', val: 70 },
  { month: 'May', views: '18.9K', val: 85 },
  { month: 'Jun', views: '24.8K', val: 100 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d') // '7d' | '30d' | '90d'

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 selection:bg-brand selection:text-white">
      
      {/* ─── 1. PAGE HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>📊 Analytics & Insights</span>
            <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              Live Engine Metrics
            </span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
            Track video generation output, rendering speed, credits consumption, and audience engagement trends.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center bg-black/40 border border-white/10 p-1 rounded-2xl self-start sm:self-auto">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                timeRange === range ? 'bg-brand text-white shadow-glow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* ─── 2. TOP METRICS CARDS GRID ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Videos Generated */}
        <div className="card-glass border-white/[0.08] hover:border-brand/40 p-5 rounded-3xl space-y-2 transition-all duration-300 shadow-xl group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Videos Generated</span>
            <span className="text-base">🎬</span>
          </div>
          <div className="text-2xl font-black text-white">48 Reels</div>
          <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
            <span>↑ 24%</span>
            <span className="text-slate-500 font-normal">vs last week</span>
          </div>
        </div>

        {/* Card 2: Average Render Time */}
        <div className="card-glass border-white/[0.08] hover:border-brand/40 p-5 rounded-3xl space-y-2 transition-all duration-300 shadow-xl group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Render Time</span>
            <span className="text-base">⚡</span>
          </div>
          <div className="text-2xl font-black text-white">2.4 sec</div>
          <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
            <span>↓ 15%</span>
            <span className="text-slate-500 font-normal">faster pipeline</span>
          </div>
        </div>

        {/* Card 3: Credits Used */}
        <div className="card-glass border-white/[0.08] hover:border-brand/40 p-5 rounded-3xl space-y-2 transition-all duration-300 shadow-xl group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Credits Used</span>
            <span className="text-base">💎</span>
          </div>
          <div className="text-2xl font-black text-brand-light">950 / 1000</div>
          <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-brand rounded-full w-[95%]" />
          </div>
        </div>

        {/* Card 4: Storage Used */}
        <div className="card-glass border-white/[0.08] hover:border-brand/40 p-5 rounded-3xl space-y-2 transition-all duration-300 shadow-xl group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Storage Used</span>
            <span className="text-base">💾</span>
          </div>
          <div className="text-2xl font-black text-white">4.2 / 20 GB</div>
          <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-purple-500 rounded-full w-[21%]" />
          </div>
        </div>

        {/* Card 5: Most Used Template */}
        <div className="card-glass border-white/[0.08] hover:border-brand/40 p-5 rounded-3xl space-y-2 transition-all duration-300 shadow-xl group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Template</span>
            <span className="text-base">☕</span>
          </div>
          <div className="text-sm font-black text-white truncate">Luxury Coffee Ad</div>
          <div className="text-[11px] font-extrabold text-brand-light">
            18 Video Exports
          </div>
        </div>

      </div>

      {/* ─── 3. CHARTS GRID (WEEKLY ACTIVITY & MONTHLY GROWTH) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Activity Bar Chart */}
        <div className="card-glass p-6 rounded-3xl border-white/[0.08] space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div>
              <h3 className="text-base font-black text-white">📅 Weekly Video Creations</h3>
              <p className="text-xs text-slate-400">Total videos generated per day</p>
            </div>
            <span className="text-xs font-black text-brand-light bg-brand/20 border border-brand/40 px-3 py-1 rounded-full">
              48 Total
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-4 border-b border-white/10">
            {WEEKLY_DATA.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-black text-brand-light opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.count}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-brand/40 via-purple-500 to-brand-light rounded-t-xl group-hover:brightness-125 transition-all duration-300 shadow-glow"
                  style={{ height: d.height }}
                />
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-white transition-colors">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Audience Views Growth Line Trend Chart */}
        <div className="card-glass p-6 rounded-3xl border-white/[0.08] space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div>
              <h3 className="text-base font-black text-white">📈 Monthly Views Growth</h3>
              <p className="text-xs text-slate-400">Cumulative video views across platforms</p>
            </div>
            <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              24.8K Views
            </span>
          </div>

          {/* Line Trend Visualizer */}
          <div className="h-48 flex items-end justify-between gap-4 pt-6 px-4 border-b border-white/10">
            {MONTHLY_GROWTH.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-black text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {m.views}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-emerald-500/20 via-teal-500/50 to-emerald-400 rounded-t-xl group-hover:brightness-125 transition-all duration-300 shadow-glow"
                  style={{ height: `${m.val}%` }}
                />
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-white transition-colors">
                  {m.month}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ─── 4. ASPECT RATIO & VISUAL STYLE BREAKDOWN GRID ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Aspect Ratio Distribution */}
        <div className="card-glass p-6 rounded-3xl border-white/[0.08] space-y-4 shadow-2xl">
          <h3 className="text-base font-black text-white border-b border-white/[0.08] pb-3">
            📐 Aspect Ratio Distribution
          </h3>
          <div className="space-y-3">
            {[
              { label: '9:16 Vertical Reels / TikTok', pct: '75%', color: 'bg-brand' },
              { label: '16:9 Widescreen YouTube', pct: '15%', color: 'bg-purple-500' },
              { label: '1:1 Square Feed Posts', pct: '10%', color: 'bg-indigo-500' },
            ].map((ratio) => (
              <div key={ratio.label} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>{ratio.label}</span>
                  <span className="text-white font-extrabold">{ratio.pct}</span>
                </div>
                <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/10">
                  <div className={`h-full ${ratio.color} rounded-full`} style={{ width: ratio.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Director Style Distribution */}
        <div className="card-glass p-6 rounded-3xl border-white/[0.08] space-y-4 shadow-2xl">
          <h3 className="text-base font-black text-white border-b border-white/[0.08] pb-3">
            🎨 Visual Style Preference
          </h3>
          <div className="space-y-3">
            {[
              { label: '🎬 Cinematic 8K', pct: '40%', color: 'bg-emerald-500' },
              { label: '💎 Luxury Gold Rim Light', pct: '25%', color: 'bg-amber-500' },
              { label: '✨ Aesthetic Minimal', pct: '20%', color: 'bg-pink-500' },
              { label: '🌸 Anime / Cyberpunk', pct: '15%', color: 'bg-blue-500' },
            ].map((st) => (
              <div key={st.label} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>{st.label}</span>
                  <span className="text-white font-extrabold">{st.pct}</span>
                </div>
                <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/10">
                  <div className={`h-full ${st.color} rounded-full`} style={{ width: st.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
