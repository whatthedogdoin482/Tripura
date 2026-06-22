import { NextResponse } from 'next/server'
import type { ZodType } from 'zod'
import { rateLimit, getClientIp } from '@/lib/rateLimit'
import { logger } from '@/lib/log'

/**
 * Rate-Limit-Check für eine API-Route.
 * Gibt eine 429-Response zurück, wenn das Limit überschritten ist, sonst null.
 */
export function checkRateLimit(
  request: Request,
  scope: string,
  limit: number,
  windowMs: number,
): NextResponse | null {
  const ip = getClientIp(request)
  const result = rateLimit(`${scope}:${ip}`, limit, windowMs)
  if (!result.ok) {
    logger.warn(scope, 'rate limit exceeded', { ip, retryAfterSeconds: result.retryAfterSeconds })
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte versuche es später erneut.' },
      { status: 429, headers: { 'Retry-After': String(result.retryAfterSeconds) } },
    )
  }
  return null
}

/**
 * Request-Body lesen und mit Zod validieren.
 * Gibt entweder die geparsten Daten oder eine fertige 400-Response zurück.
 */
export async function parseBody<T>(
  request: Request,
  schema: ZodType<T>,
  scope: string,
): Promise<{ data: T; response?: never } | { data?: never; response: NextResponse }> {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return {
      response: NextResponse.json({ error: 'Ungültiger Request-Body (kein JSON).' }, { status: 400 }),
    }
  }

  const result = schema.safeParse(raw)
  if (!result.success) {
    const issue = result.error.issues[0]
    const message = issue ? `${issue.path.join('.') || 'body'}: ${issue.message}` : 'Validierung fehlgeschlagen.'
    logger.warn(scope, 'validation failed', { message })
    return { response: NextResponse.json({ error: message }, { status: 400 }) }
  }

  return { data: result.data }
}
