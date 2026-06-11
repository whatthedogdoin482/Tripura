/**
 * Einfacher In-Memory-Rate-Limiter (Sliding Window).
 * Reicht für Dev/Single-Instance; für Produktion später z.B. Upstash Redis.
 */

interface Bucket {
  timestamps: number[]
}

const buckets = new Map<string, Bucket>()

// Speicher regelmäßig aufräumen, damit die Map nicht unbegrenzt wächst
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000
let lastCleanup = Date.now()

function cleanup(windowMs: number) {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now
  buckets.forEach((bucket, key) => {
    bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs)
    if (bucket.timestamps.length === 0) buckets.delete(key)
  })
}

export interface RateLimitResult {
  ok: boolean
  remaining: number
  retryAfterSeconds: number
}

/**
 * @param key      Eindeutiger Schlüssel, z.B. `${route}:${ip}`
 * @param limit    Max. Anfragen pro Fenster
 * @param windowMs Fensterlänge in Millisekunden
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  cleanup(windowMs)
  const now = Date.now()
  const bucket = buckets.get(key) ?? { timestamps: [] }
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs)

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0]
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((oldest + windowMs - now) / 1000),
    }
  }

  bucket.timestamps.push(now)
  buckets.set(key, bucket)
  return { ok: true, remaining: limit - bucket.timestamps.length, retryAfterSeconds: 0 }
}

/** Client-IP aus Request-Headern lesen (hinter Proxy: x-forwarded-for). */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}
