'use client'

import { cn, NICHE_LABELS, NICHE_EMOJIS } from '@/lib/utils'
import type { Niche } from '@/types'

const NICHES = Object.keys(NICHE_LABELS) as Niche[]

interface NicheSelectorProps {
  value:    Niche
  onChange: (niche: Niche) => void
  disabled?: boolean
}

export function NicheSelector({ value, onChange, disabled }: NicheSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {NICHES.map((niche) => {
        const active = value === niche
        return (
          <button
            key={niche}
            type="button"
            disabled={disabled}
            onClick={() => onChange(niche)}
            className={cn(
              'flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-center transition-all duration-150',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            style={{
              background:   active ? 'rgba(79,110,247,0.15)' : 'rgba(255,255,255,0.03)',
              borderColor:  active ? 'rgba(79,110,247,0.5)'  : 'var(--c-border)',
              boxShadow:    active ? '0 0 12px rgba(79,110,247,0.2)' : 'none',
            }}>
            <span style={{ fontSize: 18 }}>{NICHE_EMOJIS[niche]}</span>
            <span className="text-xs font-display font-medium tracking-wide"
              style={{ color: active ? '#fff' : 'var(--c-muted)' }}>
              {NICHE_LABELS[niche]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
