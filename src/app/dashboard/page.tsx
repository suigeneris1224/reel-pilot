'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sidebar } from '@/components/layout/Sidebar'
import { formatRelativeTime, formatDuration, NICHE_EMOJIS, NICHE_LABELS, TONE_LABELS } from '@/lib/utils'
import type { ReelJob } from '@/types'

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  idle:              { label: 'Draft',       color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
  generating_script: { label: 'Scripting',   color: '#fbbf24', bg: 'rgba(251,191,36,0.1)'  },
  complete:          { label: 'Complete',    color: '#34d399', bg: 'rgba(52,211,153,0.1)'   },
  error:             { label: 'Error',       color: '#f87171', bg: 'rgba(248,113,113,0.1)'  },
}

function JobRow({ job }: { job: ReelJob }) {
  const st = STATUS_STYLES[job.status] ?? STATUS_STYLES.idle
  const totalWords = job.script?.segments.reduce((n, s) => n + s.text.split(' ').length, 0) ?? 0

  return (
    <div className="card card-hover p-5 flex items-center gap-5">
      {/* Niche icon */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--c-border)' }}>
        {NICHE_EMOJIS[job.config.niche]}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold truncate" style={{ color: 'var(--c-text)' }}>
          {job.script?.title ?? job.config.topic}
        </p>
        <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--c-muted)' }}>
          <span>{NICHE_LABELS[job.config.niche]}</span>
          <span>·</span>
          <span>{TONE_LABELS[job.config.tone]}</span>
          <span>·</span>
          <span>{formatDuration(job.config.duration)}</span>
          {totalWords > 0 && <><span>·</span><span>{totalWords} words</span></>}
        </div>
      </div>

      {/* Status */}
      <span className="px-3 py-1 rounded-lg text-xs font-display font-medium shrink-0"
        style={{ background: st.bg, color: st.color }}>
        {st.label}
      </span>

      {/* Time */}
      <span className="text-xs shrink-0" style={{ color: 'var(--c-muted)' }}>
        {formatRelativeTime(job.createdAt)}
      </span>
    </div>
  )
}

export default function DashboardPage() {
  const [jobs,    setJobs]    = useState<ReelJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In Phase 1 without KV configured, we show empty state gracefully
    setLoading(false)
  }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="ml-56 flex-1 min-h-screen" style={{ background: 'var(--c-bg)' }}>

        {/* Top bar */}
        <div className="px-8 py-5 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--c-border)' }}>
          <div>
            <h1 className="font-display font-bold text-xl" style={{ color: 'var(--c-text)' }}>Dashboard</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--c-muted)' }}>Reel history &amp; queue</p>
          </div>
          <Link href="/builder" className="btn-primary">
            ✦ New reel
          </Link>
        </div>

        <div className="px-8 py-8 max-w-4xl">

          {/* Phase notice */}
          <div className="rounded-xl px-5 py-4 mb-8 flex items-start gap-4"
            style={{ background: 'rgba(79,110,247,0.08)', border: '1px solid rgba(79,110,247,0.2)' }}>
            <span style={{ fontSize: 20 }}>◫</span>
            <div>
              <p className="font-display font-semibold text-sm mb-1" style={{ color: 'var(--c-accent)' }}>
                Full dashboard arrives in Phase 3
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                Scheduling queue, series mode, batch creation, and Vercel Cron automation are coming in Phase 3.
                For now, scripts you generate in the builder are tracked here once Vercel KV is connected.
              </p>
            </div>
          </div>

          {/* Job list */}
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1,2,3].map((i) => (
                <div key={i} className="card p-5 flex items-center gap-5">
                  <div className="shimmer w-10 h-10 rounded-xl" />
                  <div className="flex-1">
                    <div className="shimmer h-4 w-48 rounded mb-2" />
                    <div className="shimmer h-3 w-32 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <EmptyDashboard />
          ) : (
            <div className="flex flex-col gap-3">
              {jobs.map((job) => <JobRow key={job.id} job={job} />)}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--c-border)' }}>
        <span style={{ fontSize: 28, color: 'var(--c-muted)' }}>◫</span>
      </div>
      <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--c-text)' }}>
        No reels yet
      </h3>
      <p className="text-sm max-w-xs leading-relaxed mb-6" style={{ color: 'var(--c-muted)' }}>
        Generate your first reel in the builder. Once Vercel KV is connected, your history will appear here.
      </p>
      <Link href="/builder" className="btn-primary">
        ✦ Build your first reel
      </Link>
    </div>
  )
}
