'use client'

import { cn, TONE_LABELS } from '@/lib/utils'
import type { Tone, Duration } from '@/types'

// ── Tone Selector ─────────────────────────────────────────────────────────────
const TONES = Object.keys(TONE_LABELS) as Tone[]

const TONE_COLORS: Record<Tone, string> = {
  cinematic:     '#a78bfa',
  educational:   '#34d399',
  dramatic:      '#f87171',
  conversational:'#60a5fa',
  suspenseful:   '#fbbf24',
  inspiring:     '#f472b6',
}

interface ToneSelectorProps {
  value:    Tone
  onChange: (tone: Tone) => void
  disabled?: boolean
}

export function ToneSelector({ value, onChange, disabled }: ToneSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TONES.map((tone) => {
        const active = value === tone
        const color  = TONE_COLORS[tone]
        return (
          <button
            key={tone}
            type="button"
            disabled={disabled}
            onClick={() => onChange(tone)}
            className={cn('px-4 py-2 rounded-xl border text-sm font-display font-medium tracking-wide transition-all duration-150', disabled && 'opacity-50 cursor-not-allowed')}
            style={{
              background:  active ? `${color}18` : 'rgba(255,255,255,0.03)',
              borderColor: active ? `${color}60` : 'var(--c-border)',
              color:       active ? color : 'var(--c-muted)',
            }}>
            {TONE_LABELS[tone]}
          </button>
        )
      })}
    </div>
  )
}

// ── Duration Selector ─────────────────────────────────────────────────────────
const DURATIONS: Duration[] = [15, 30, 45, 60]

interface DurationSelectorProps {
  value:    Duration
  onChange: (d: Duration) => void
  disabled?: boolean
}

export function DurationSelector({ value, onChange, disabled }: DurationSelectorProps) {
  return (
    <div className="flex gap-2">
      {DURATIONS.map((d) => {
        const active = value === d
        return (
          <button
            key={d}
            type="button"
            disabled={disabled}
            onClick={() => onChange(d)}
            className={cn('flex-1 py-3 rounded-xl border text-sm font-display font-semibold transition-all duration-150', disabled && 'opacity-50 cursor-not-allowed')}
            style={{
              background:  active ? 'rgba(79,110,247,0.15)' : 'rgba(255,255,255,0.03)',
              borderColor: active ? 'rgba(79,110,247,0.5)'  : 'var(--c-border)',
              color:       active ? '#fff' : 'var(--c-muted)',
            }}>
            {d}s
          </button>
        )
      })}
    </div>
  )
}
