// ── Reel job status ───────────────────────────────────────────────────────────
export type JobStatus =
  | 'idle'
  | 'generating_script'
  | 'generating_voice'
  | 'fetching_images'
  | 'assembling_video'
  | 'uploading'
  | 'complete'
  | 'error'

// ── Niche / content category ──────────────────────────────────────────────────
export type Niche =
  | 'motivation'
  | 'history'
  | 'mystery'
  | 'science'
  | 'finance'
  | 'philosophy'
  | 'horror'
  | 'travel'
  | 'food'
  | 'technology'

// ── Tone of voice ─────────────────────────────────────────────────────────────
export type Tone =
  | 'cinematic'
  | 'educational'
  | 'dramatic'
  | 'conversational'
  | 'suspenseful'
  | 'inspiring'

// ── Reel duration ─────────────────────────────────────────────────────────────
export type Duration = 15 | 30 | 45 | 60

// ── A single script segment ───────────────────────────────────────────────────
export interface ScriptSegment {
  id:       string
  type:     'hook' | 'body' | 'cta'
  text:     string
  duration: number        // seconds
  keywords: string[]      // for Pexels image search (Phase 2)
}

// ── The full generated script ─────────────────────────────────────────────────
export interface ReelScript {
  title:       string
  description: string     // YouTube/TikTok description
  hashtags:    string[]
  segments:    ScriptSegment[]
  totalDuration: number
}

// ── Reel builder form state ───────────────────────────────────────────────────
export interface ReelConfig {
  topic:    string
  niche:    Niche
  tone:     Tone
  duration: Duration
  voiceId?: string        // ElevenLabs voice ID (Phase 2)
}

// ── A full reel job stored in KV ──────────────────────────────────────────────
export interface ReelJob {
  id:          string
  createdAt:   string
  updatedAt:   string
  status:      JobStatus
  config:      ReelConfig
  script?:     ReelScript
  audioUrl?:   string     // Phase 2
  videoUrl?:   string     // Phase 2
  error?:      string
  scheduledAt?: string    // Phase 3
  publishedAt?: string    // Phase 4
  platforms?:  string[]   // Phase 4
}

// ── API response shapes ───────────────────────────────────────────────────────
export interface ApiSuccess<T> {
  success: true
  data:    T
}

export interface ApiError {
  success: false
  error:   string
  code?:   string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
