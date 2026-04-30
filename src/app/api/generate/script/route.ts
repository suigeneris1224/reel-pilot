import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { buildScriptPrompt, parseScriptResponse } from '@/lib/prompts'
import type { ApiResponse, ReelJob, ReelScript } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const RequestSchema = z.object({
  topic:    z.string().min(3).max(200),
  niche:    z.enum(['motivation','history','mystery','science','finance','philosophy','horror','travel','food','technology']),
  tone:     z.enum(['cinematic','educational','dramatic','conversational','suspenseful','inspiring']),
  duration: z.union([z.literal(15), z.literal(30), z.literal(45), z.literal(60)]),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const config = RequestSchema.parse(body)

    const prompt = buildScriptPrompt(config)

    const message = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 1500,
      messages:   [{ role: 'user', content: prompt }],
    })

    const rawText = message.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('')

    const script: ReelScript = parseScriptResponse(rawText, config)

    const job: ReelJob = {
      id:        uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status:    'idle',
      config,
      script,
    }

    // Persist to KV if configured, otherwise skip gracefully
    if (process.env.KV_REST_API_URL) {
      const { createJob } = await import('@/lib/kv')
      await createJob(job)
    }

    return NextResponse.json<ApiResponse<ReelJob>>({
      success: true,
      data:    job,
    })
  } catch (err) {
    console.error('[/api/generate/script]', err)

    if (err instanceof z.ZodError) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Invalid request', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Script generation failed', code: 'GENERATION_ERROR' },
      { status: 500 }
    )
  }
}
