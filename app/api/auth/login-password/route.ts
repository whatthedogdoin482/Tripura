import { NextResponse } from 'next/server'
import { z } from 'zod'
import { userRepo } from '@/lib/db/memory'
import { verifyPassword } from '@/lib/auth/password'
import { COOKIE_NAME, signSession } from '@/lib/auth/jwt'
import { checkRateLimit, parseBody } from '@/lib/api/guard'
import { logger } from '@/lib/log'

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email('Ungültige E-Mail-Adresse.'),
  password: z.string().min(1, 'Passwort ist erforderlich.'),
})

export async function POST(request: Request) {
  const limited = checkRateLimit(request, 'auth.login-password', 10, 15 * 60 * 1000)
  if (limited) return limited

  try {
    const parsed = await parseBody(request, bodySchema, 'auth.login-password')
    if (parsed.response) return parsed.response
    const { email: normalizedEmail, password } = parsed.data

    const user = userRepo.findByEmail(normalizedEmail)

    const genericError = NextResponse.json(
      { error: 'E-Mail oder Passwort ist falsch.' },
      { status: 400 },
    )

    if (!user || !user.password_hash) {
      return genericError
    }

    const ok = await verifyPassword(password, user.password_hash)
    if (!ok) {
      return genericError
    }

    userRepo.update(user.id, { last_login_at: new Date().toISOString() })

    const sessionToken = signSession({ sub: user.id, email: normalizedEmail })
    const response = NextResponse.json({ ok: true })
    const isProd = process.env.NODE_ENV === 'production'

    response.cookies.set(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      path: '/',
    })

    logger.info('auth.login-password', 'login successful', { userId: user.id })
    return response
  } catch (error) {
    logger.error('auth.login-password', 'unexpected error', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json({ error: 'Unerwarteter Fehler bei der Anmeldung.' }, { status: 500 })
  }
}
