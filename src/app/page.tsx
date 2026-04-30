import Link from 'next/link'
import { Sidebar } from '@/components/layout/Sidebar'

const PHASES = [
  { num: 1, label: 'Script generation', status: 'active',   desc: 'AI writes your reel script — hook, body, CTA, hashtags.' },
  { num: 2, label: 'Video assembly',    status: 'upcoming', desc: 'Voiceover + stock images + captions → downloadable MP4.' },
  { num: 3, label: 'Scheduling',        status: 'upcoming', desc: 'Dashboard, series mode, batch creation, Vercel Cron.' },
  { num: 4, label: 'Auto-posting',      status: 'upcoming', desc: 'YouTube, TikTok & Instagram — fully hands-off.' },
]

const STATS = [
  { label: 'Current phase',     value: '1 / 4' },
  { label: 'APIs connected',    value: '1'     },
  { label: 'Reels generated',   value: '0'     },
  { label: 'Videos published',  value: '0'     },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="ml-56 flex-1 px-8 py-10 max-w-5xl" style={{ background: 'var(--c-bg)' }}>

        {/* Hero */}
        <div className="mb-10">
          <p className="text-xs font-display font-medium tracking-widest mb-3" style={{ color: 'var(--c-accent)' }}>
            FACELESSREELS · PERSONAL AUTOPILOT
          </p>
          <h1 className="font-display font-bold text-4xl leading-tight mb-3 text-gradient">
            Your content.<br />Zero face time.
          </h1>
          <p className="text-base leading-relaxed max-w-lg" style={{ color: 'var(--c-muted)' }}>
            AI generates scripts, records voiceovers, assembles videos, and posts to your channels — while you do literally anything else.
          </p>
          <Link href="/builder" className="btn-primary mt-6 inline-flex">
            ✦ Start building a reel
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {STATS.map(({ label, value }) => (
            <div key={label} className="card p-4">
              <p className="text-xs font-display tracking-widest mb-1" style={{ color: 'var(--c-muted)' }}>{label.toUpperCase()}</p>
              <p className="font-display font-bold text-2xl" style={{ color: 'var(--c-text)' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Phases */}
        <div>
          <p className="text-xs font-display font-medium tracking-widest mb-4" style={{ color: 'var(--c-muted)' }}>BUILD ROADMAP</p>
          <div className="flex flex-col gap-3">
            {PHASES.map(({ num, label, status, desc }) => (
              <div key={num} className={`card card-hover p-5 flex items-center gap-5 transition-all ${status === 'active' ? 'glow-accent' : ''}`}
                style={{ borderColor: status === 'active' ? 'rgba(79,110,247,0.4)' : 'var(--c-border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold shrink-0"
                  style={{
                    background: status === 'active' ? 'var(--c-accent)' : 'rgba(255,255,255,0.06)',
                    color:      status === 'active' ? '#fff' : 'var(--c-muted)',
                  }}>
                  {num}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-display font-semibold" style={{ color: 'var(--c-text)' }}>{label}</h3>
                    <span className="tag text-xs px-2 py-0.5" style={{
                      color:       status === 'active' ? 'var(--c-accent)' : 'var(--c-muted)',
                      borderColor: status === 'active' ? 'rgba(79,110,247,0.3)' : 'var(--c-border)',
                      background:  status === 'active' ? 'rgba(79,110,247,0.1)' : 'transparent',
                    }}>
                      {status === 'active' ? '● Active' : '○ Upcoming'}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--c-muted)' }}>{desc}</p>
                </div>
                {status === 'active' && (
                  <Link href="/builder" className="btn-ghost shrink-0">
                    Open →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
