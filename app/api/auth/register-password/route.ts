import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminClient } from '@/lib/supabase/admin'
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

    const supabase = getAdminClient()

    const { data: existing } = await supabase
      .from('users')
      .select('id, email, password_hash')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (existing?.password_hash) {
      return NextResponse.json({ error: 'Für diese E-Mail existiert bereits ein Passwort-Konto.' }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)
    const now = new Date().toISOString()

    let userId = existing?.id

    if (existing) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ password_hash: passwordHash, password_created_at: now, last_login_at: now })
        .eq('id', existing.id)
      if (updateError) {
        logger.error('auth.register-password', 'update error', { error: updateError.message })
        return NextResponse.json({ error: 'Registrierung fehlgeschlagen.' }, { status: 500 })
      }
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from('users')
        .insert({
          email: normalizedEmail,
          password_hash: passwordHash,
          password_created_at: now,
          last_login_at: now,
        })
        .select('id')
        .single()
      if (insertError || !inserted) {
        logger.error('auth.register-password', 'insert error', { error: insertError?.message })
        return NextResponse.json({ error: 'Registrierung fehlgeschlagen.' }, { status: 500 })
      }
      userId = inserted.id
    }

    if (!userId) {
      return NextResponse.json({ error: 'Registrierung fehlgeschlagen.' }, { status: 500 })
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

