import { NextResponse } from 'next/server'
import { z } from 'zod'
import { userRepo } from '@/lib/db/memory'
import { hashPassword } from '@/lib/auth/password'
import { COOKIE_NAME, signSession } from '@/lib/auth/jwt'
import { checkRateLimit, parseBody } from '@/lib/api/guard'
import { logger } from '@/lib/log'

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email('Ungültige E-Mail-Adresse.'),
  password: z
    .string()
    .min(8, 'Passwort muss mindestens 8 Zeichen lang sein.')
    .regex(/[A-Za-z]/, 'Passwort muss mindestens einen Buchstaben enthalten.')
    .regex(/[0-9]/, 'Passwort muss mindestens eine Zahl enthalten.'),
})

export async function POST(request: Request) {
  const limited = checkRateLimit(request, 'auth.register-password', 5, 60 * 60 * 1000)
  if (limited) return limited

  try {
    const parsed = await parseBody(request, bodySchema, 'auth.register-password')
    if (parsed.response) return parsed.response
    const { email: normalizedEmail, password } = parsed.data

    const existing = userRepo.findByEmail(normalizedEmail)

    if (existing?.password_hash) {
      return NextResponse.json({ error: 'Für diese E-Mail existiert bereits ein Passwort-Konto.' }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)
    const ts = new Date().toISOString()

    let userId: string
    if (existing) {
      const updated = userRepo.update(existing.id, {
        password_hash: passwordHash,
        password_created_at: ts,
        last_login_at: ts,
      })
      if (!updated) {
        return NextResponse.json({ error: 'Registrierung fehlgeschlagen.' }, { status: 500 })
      }
      userId = updated.id
    } else {
      const inserted = userRepo.createWithPassword(normalizedEmail, passwordHash)
      userId = inserted.id
    }

    const sessionToken = signSession({ sub: userId, email: normalizedEmail })
    const response = NextResponse.json({ ok: true })
    const isProd = process.env.NODE_ENV === 'production'

    response.cookies.set(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      path: '/',
    })

    logger.info('auth.register-password', 'user registered', { userId })
    return response
  } catch (error) {
    logger.error('auth.register-password', 'unexpected error', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json({ error: 'Unerwarteter Fehler bei der Registrierung.' }, { status: 500 })
  }
}
