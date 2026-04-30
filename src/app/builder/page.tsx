'use client'

import { useState } from 'react'
import { NicheSelector }              from '@/components/ui/NicheSelector'
import { ToneSelector, DurationSelector } from '@/components/ui/ToneDuration'
import { ScriptPreview }              from '@/components/ui/ScriptPreview'
import { ScriptSkeleton }             from '@/components/ui/Skeleton'
import { Sidebar }                    from '@/components/layout/Sidebar'
import type { Niche, Tone, Duration, ReelConfig, ReelJob, ReelScript } from '@/types'

const DEFAULT_CONFIG: ReelConfig = {
  topic:    '',
  niche:    'history',
  tone:     'cinematic',
  duration: 30,
}

type Step = 'config' | 'generating' | 'preview'

export default function BuilderPage() {
  const [config,   setConfig]   = useState<ReelConfig>(DEFAULT_CONFIG)
  const [step,     setStep]     = useState<Step>('config')
  const [job,      setJob]      = useState<ReelJob | null>(null)
  const [error,    setError]    = useState<string | null>(null)

  const updateConfig = <K extends keyof ReelConfig>(key: K, val: ReelConfig[K]) =>
    setConfig((prev) => ({ ...prev, [key]: val }))

  const editSegment = (segmentId: string, text: string) => {
    if (!job?.script) return
    setJob((prev) => {
      if (!prev?.script) return prev
      return {
        ...prev,
        script: {
          ...prev.script,
          segments: prev.script.segments.map((s) =>
            s.id === segmentId ? { ...s, text } : s
          ),
        },
      }
    })
  }

  const generate = async () => {
    if (!config.topic.trim()) return
    setStep('generating')
    setError(null)

    try {
      const res  = await fetch('/api/generate/script', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(config),
      })
      const json = await res.json()

      if (!json.success) throw new Error(json.error || 'Generation failed')

      setJob(json.data)
      setStep('preview')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStep('config')
    }
  }

  const reset = () => {
    setStep('config')
    setJob(null)
    setError(null)
    setConfig(DEFAULT_CONFIG)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main content */}
      <main className="ml-56 flex-1 min-h-screen" style={{ background: 'var(--c-bg)' }}>

        {/* Top bar */}
        <div className="px-8 py-5 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--c-border)', backdropFilter: 'blur(12px)' }}>
          <div>
            <h1 className="font-display font-bold text-xl" style={{ color: 'var(--c-text)' }}>
              Reel Builder
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--c-muted)' }}>
              Topic → Script → Video
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Step indicators */}
            {(['config', 'generating', 'preview'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-display font-bold transition-all"
                  style={{
                    background: step === s ? 'var(--c-accent)' :
                                (step === 'preview' && s === 'config') ? 'rgba(79,110,247,0.3)' :
                                'rgba(255,255,255,0.08)',
                    color:      step === s ? '#fff' : 'var(--c-muted)',
                  }}>
                  {i + 1}
                </div>
                {i < 2 && <div className="w-8 h-px" style={{ background: 'var(--c-border)' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-[1fr_1fr] gap-8">

            {/* ── LEFT: Config panel ─────────────────────────────── */}
            <div className="flex flex-col gap-6">

              {/* Topic */}
              <div className="card p-6">
                <label className="block text-xs font-display font-medium tracking-widest mb-3" style={{ color: 'var(--c-muted)' }}>
                  TOPIC
                </label>
                <textarea
                  className="input-base resize-none"
                  rows={3}
                  placeholder="e.g. The mysterious disappearance of the Roanoke Colony and what really happened..."
                  value={config.topic}
                  onChange={(e) => updateConfig('topic', e.target.value)}
                  disabled={step === 'generating'}
                />
                <p className="text-xs mt-2" style={{ color: 'var(--c-muted)' }}>
                  Be specific — better topics produce sharper scripts
                </p>
              </div>

              {/* Niche */}
              <div className="card p-6">
                <label className="block text-xs font-display font-medium tracking-widest mb-3" style={{ color: 'var(--c-muted)' }}>
                  NICHE
                </label>
                <NicheSelector
                  value={config.niche}
                  onChange={(n) => updateConfig('niche', n)}
                  disabled={step === 'generating'}
                />
              </div>

              {/* Tone */}
              <div className="card p-6">
                <label className="block text-xs font-display font-medium tracking-widest mb-3" style={{ color: 'var(--c-muted)' }}>
                  TONE
                </label>
                <ToneSelector
                  value={config.tone}
                  onChange={(t) => updateConfig('tone', t)}
                  disabled={step === 'generating'}
                />
              </div>

              {/* Duration */}
              <div className="card p-6">
                <label className="block text-xs font-display font-medium tracking-widest mb-3" style={{ color: 'var(--c-muted)' }}>
                  DURATION
                </label>
                <DurationSelector
                  value={config.duration}
                  onChange={(d) => updateConfig('duration', d)}
                  disabled={step === 'generating'}
                />
                <p className="text-xs mt-3" style={{ color: 'var(--c-muted)' }}>
                  15–30s = best for TikTok · 45–60s = better for YouTube Shorts
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171' }}>
                  {error}
                </div>
              )}

              {/* Generate button */}
              <button
                className="btn-primary justify-center py-4 text-base"
                onClick={generate}
                disabled={!config.topic.trim() || step === 'generating'}>
                {step === 'generating'
                  ? <><Spinner /> Generating script…</>
                  : step === 'preview'
                  ? '↺ Regenerate script'
                  : '✦ Generate script'}
              </button>
            </div>

            {/* ── RIGHT: Output panel ────────────────────────────── */}
            <div className="flex flex-col">
              {step === 'generating' && (
                <div className="flex flex-col gap-4">
                  <GeneratingIndicator />
                  <ScriptSkeleton />
                </div>
              )}

              {step === 'config' && !job && (
                <EmptyState />
              )}

              {step === 'preview' && job?.script && (
                <ScriptPreview
                  script={job.script}
                  onEdit={editSegment}
                  onReset={reset}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity=".25" strokeWidth="2"/>
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function GeneratingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{ background: 'rgba(79,110,247,0.08)', border: '1px solid rgba(79,110,247,0.2)' }}>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--c-accent)', animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
      <p className="text-sm" style={{ color: 'var(--c-accent)' }}>
        Claude is writing your script…
      </p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'rgba(79,110,247,0.1)', border: '1px solid rgba(79,110,247,0.2)' }}>
        <span style={{ fontSize: 28 }}>✦</span>
      </div>
      <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--c-text)' }}>
        Your script will appear here
      </h3>
      <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--c-muted)' }}>
        Fill in your topic, pick a niche and tone, then hit Generate. Claude will write a fully structured reel script in seconds.
      </p>
      <div className="mt-6 flex flex-col gap-2 text-xs" style={{ color: 'var(--c-muted)' }}>
        <p>✦ Hook · body segments · CTA</p>
        <p>✦ Hashtags + description included</p>
        <p>✦ Image keywords for Phase 2</p>
      </div>
    </div>
  )
}
