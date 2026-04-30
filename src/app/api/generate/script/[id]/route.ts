import { NextRequest, NextResponse } from 'next/server'
import type { ApiResponse, ReelJob } from '@/types'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!process.env.KV_REST_API_URL) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'KV not configured' },
        { status: 503 }
      )
    }
    const { getJob } = await import('@/lib/kv')
    const job = await getJob(id)
    if (!job) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Job not found' },
        { status: 404 }
      )
    }
    return NextResponse.json<ApiResponse<ReelJob>>({ success: true, data: job })
  } catch {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Failed to fetch job' },
      { status: 500 }
    )
  }
}