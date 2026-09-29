import { NextResponse } from 'next/server'
import { z } from 'zod'
import { loginTokenRepo, userRepo } from '@/lib/db/memory'
import { checkRateLimit, parseBody } from '@/lib/api/guard'
import { logger } from '@/lib/log'

const TOKEN_TTL_MINUTES = 15

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email('Ungültige E-Mail-Adresse.'),
})

export async function POST(request: Request) {
  const limited = checkRateLimit(request, 'auth.request-link', 5, 15 * 60 * 1000)
  if (limited) return limited

  try {
    const parsed = await parseBody(request, bodySchema, 'auth.request-link')
    if (parsed.response) return parsed.response

    const normalizedEmail = parsed.data.email
    const user = userRepo.upsertByEmail(normalizedEmail)

    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000).toISOString()

    loginTokenRepo.create(user.id, token, expiresAt)

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const loginUrl = new URL('/api/auth/callback', baseUrl)
    loginUrl.searchParams.set('token', token)

    logger.info('auth.request-link', 'magic link created (no email provider)', {
      userId: user.id,
      loginUrl: loginUrl.toString(),
    })

    const isProd = process.env.NODE_ENV === 'production'
    if (isProd) {
      return NextResponse.json(
        { error: 'Magic-Link per E-Mail ist derzeit nicht eingerichtet. Bitte Passwort-Login nutzen.' },
        { status: 503 },
      )
    }

    return NextResponse.json({
      ok: true,
      message: 'Kein E-Mail-Dienst aktiv – Link nur für lokale Entwicklung.',
      devLoginUrl: loginUrl.toString(),
    })
  } catch (error) {
    logger.error('auth.request-link', 'unexpected error', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json({ error: 'Unerwarteter Fehler' }, { status: 500 })
  }
}
