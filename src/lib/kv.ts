import { kv } from '@vercel/kv'
import type { ReelJob, JobStatus } from '@/types'

const JOB_PREFIX = 'job:'
const JOB_LIST_KEY = 'jobs:all'
const JOB_TTL = 60 * 60 * 24 * 7 // 7 days

export async function createJob(job: ReelJob): Promise<void> {
  await kv.set(`${JOB_PREFIX}${job.id}`, job, { ex: JOB_TTL })
  await kv.lpush(JOB_LIST_KEY, job.id)
  await kv.ltrim(JOB_LIST_KEY, 0, 99) // keep last 100 jobs
}

export async function getJob(id: string): Promise<ReelJob | null> {
  return kv.get<ReelJob>(`${JOB_PREFIX}${id}`)
}

export async function updateJob(id: string, patch: Partial<ReelJob>): Promise<void> {
  const existing = await getJob(id)
  if (!existing) throw new Error(`Job ${id} not found`)
  const updated: ReelJob = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  await kv.set(`${JOB_PREFIX}${id}`, updated, { ex: JOB_TTL })
}

export async function setJobStatus(id: string, status: JobStatus, error?: string): Promise<void> {
  await updateJob(id, { status, ...(error ? { error } : {}) })
}

export async function listJobs(limit = 20): Promise<ReelJob[]> {
  const ids = await kv.lrange<string>(JOB_LIST_KEY, 0, limit - 1)
  if (!ids || ids.length === 0) return []
  const jobs = await Promise.all(ids.map((id) => getJob(id)))
  return jobs.filter((j): j is ReelJob => j !== null)
}
