import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

export function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export const NICHE_LABELS: Record<string, string> = {
  motivation:  'Motivation',
  history:     'History',
  mystery:     'Mystery',
  science:     'Science',
  finance:     'Finance',
  philosophy:  'Philosophy',
  horror:      'Horror',
  travel:      'Travel',
  food:        'Food',
  technology:  'Technology',
}

export const TONE_LABELS: Record<string, string> = {
  cinematic:     'Cinematic',
  educational:   'Educational',
  dramatic:      'Dramatic',
  conversational:'Conversational',
  suspenseful:   'Suspenseful',
  inspiring:     'Inspiring',
}

export const NICHE_EMOJIS: Record<string, string> = {
  motivation:  '⚡',
  history:     '🏛',
  mystery:     '🔍',
  science:     '🔬',
  finance:     '📈',
  philosophy:  '🧠',
  horror:      '👁',
  travel:      '✈',
  food:        '🍜',
  technology:  '💻',
}
