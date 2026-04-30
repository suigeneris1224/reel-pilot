import type { ReelConfig, ReelScript, ScriptSegment } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export function buildScriptPrompt(config: ReelConfig): string {
  const segmentCount = config.duration <= 30 ? 3 : 5

  return `You are an expert faceless video scriptwriter. Create a compelling ${config.duration}-second ${config.niche} reel script.

Topic: "${config.topic}"
Tone: ${config.tone}
Total duration: ${config.duration} seconds
Niche: ${config.niche}

CRITICAL RULES:
- Hook must grab attention in the FIRST 3 seconds
- Every sentence must earn its place — no filler
- Write for AUDIO: short punchy sentences, natural pauses
- Body: ${segmentCount - 2} segments of ~${Math.floor((config.duration - 8) / (segmentCount - 2))} seconds each
- CTA: clear single action (follow, like, comment with one word)

Respond ONLY with valid JSON matching this exact schema:
{
  "title": "string (YouTube/TikTok title, max 70 chars, no hashtags)",
  "description": "string (2-3 sentence description for social platforms)",
  "hashtags": ["string"] (8-12 relevant hashtags without #),
  "segments": [
    {
      "type": "hook" | "body" | "cta",
      "text": "string (the spoken words)",
      "duration": number (seconds),
      "keywords": ["string"] (2-4 visual keywords for stock image search)
    }
  ]
}

Ensure total segment durations sum to exactly ${config.duration} seconds.
First segment must be type "hook". Last segment must be type "cta".`
}

export function parseScriptResponse(raw: string, config: ReelConfig): ReelScript {
  const cleaned = raw
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim()

  const parsed = JSON.parse(cleaned)

  const segments: ScriptSegment[] = parsed.segments.map((s: Omit<ScriptSegment, 'id'>) => ({
    ...s,
    id: uuidv4(),
  }))

  const totalDuration = segments.reduce((sum, s) => sum + s.duration, 0)

  return {
    title:         parsed.title,
    description:   parsed.description,
    hashtags:      parsed.hashtags,
    segments,
    totalDuration,
  }
}
