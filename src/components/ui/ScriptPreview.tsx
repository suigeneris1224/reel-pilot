'use client'

import { useState } from 'react'
import { cn, formatDuration } from '@/lib/utils'
import type { ReelScript, ScriptSegment } from '@/types'

interface ScriptPreviewProps {
  script:   ReelScript
  onEdit:   (segmentId: string, text: string) => void
  onReset:  () => void
}

const SEGMENT_STYLES: Record<string, { label: string; color: string; bg: string; border: string }> = {
  hook: { label: 'Hook',   color: '#f472b6', bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.25)' },
  body: { label: 'Body',   color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.25)'  },
  cta:  { label: 'CTA',    color: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.25)'  },
}

function SegmentCard({ segment, onEdit }: { segment: ScriptSegment; onEdit: (text: string) => void }) {
  const [editing, setEditing]   = useState(false)
  const [draft,   setDraft]     = useState(segment.text)
  const style = SEGMENT_STYLES[segment.type]

  const save = () => { onEdit(draft); setEditing(false) }
  const cancel = () => { setDraft(segment.text); setEditing(false) }

  return (
    <div className="rounded-xl p-4 transition-all duration-200"
      style={{ background: style.bg, border: `1px solid ${style.border}` }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-display font-semibold tracking-wider"
            style={{ background: `${style.color}20`, color: style.color }}>
            {style.label}
          </span>
          <span className="text-xs" style={{ color: 'var(--c-muted)' }}>
            {formatDuration(segment.duration)}
          </span>
        </div>
        <button onClick={() => setEditing(!editing)}
          className="text-xs px-2.5 py-1 rounded-lg transition-colors"
          style={{ color: 'var(--c-muted)', border: '1px solid var(--c-border)' }}>
          {editing ? 'cancel' : 'edit'}
        </button>
      </div>

      {/* Text */}
      {editing ? (
        <div>
          <textarea
            className="input-base resize-none text-sm leading-relaxed"
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button onClick={save}   className="btn-primary py-1.5 px-4 text-sm">Save</button>
            <button onClick={cancel} className="btn-ghost py-1.5 px-4 text-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <p className="text-sm leading-relaxed" style={{ color: 'var(--c-text)' }}>
          {segment.text}
        </p>
      )}

      {/* Keywords */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {segment.keywords.map((kw) => (
          <span key={kw} className="tag">{kw}</span>
        ))}
      </div>
    </div>
  )
}

export function ScriptPreview({ script, onEdit, onReset }: ScriptPreviewProps) {
  const [copied, setCopied] = useState(false)

  const copyScript = () => {
    const text = script.segments.map((s) => s.text).join('\n\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Title & meta */}
      <div className="card p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-display font-medium tracking-widest mb-1.5" style={{ color: 'var(--c-muted)' }}>TITLE</p>
            <h2 className="font-display font-bold text-lg" style={{ color: 'var(--c-text)' }}>{script.title}</h2>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--c-muted)' }}>{script.description}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs" style={{ color: 'var(--c-muted)' }}>Total</p>
            <p className="font-display font-bold text-2xl" style={{ color: 'var(--c-accent)' }}>
              {formatDuration(script.totalDuration)}
            </p>
          </div>
        </div>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {script.hashtags.map((tag) => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      </div>

      {/* Segments */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-display font-medium tracking-widest" style={{ color: 'var(--c-muted)' }}>SCRIPT SEGMENTS</p>
        {script.segments.map((seg) => (
          <SegmentCard
            key={seg.id}
            segment={seg}
            onEdit={(text) => onEdit(seg.id, text)}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={copyScript} className="btn-ghost flex-1 justify-center">
          {copied ? '✓ Copied' : '⎘ Copy script'}
        </button>
        <button onClick={onReset} className="btn-ghost flex-1 justify-center">
          ↺ Regenerate
        </button>
        <button
          className="btn-primary flex-1 justify-center opacity-50 cursor-not-allowed"
          disabled
          title="Available in Phase 2">
          Generate video →
        </button>
      </div>

      <p className="text-center text-xs" style={{ color: 'var(--c-muted)' }}>
        Video generation arrives in Phase 2 · Voiceover + images + assembly
      </p>
    </div>
  )
}
