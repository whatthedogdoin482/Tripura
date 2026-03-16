import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { hashPassword } from '@/lib/auth/password'
import { COOKIE_NAME, signSession } from '@/lib/auth/jwt'

function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Passwort muss mindestens 8 Zeichen lang sein.'
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Passwort muss mindestens einen Buchstaben und eine Zahl enthalten.'
  }
  return null
}

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as { email?: string; password?: string }

    if (!email || !password) {
      return NextResponse.json({ error: 'E-Mail und Passwort sind erforderlich.' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const passwordError = validatePassword(password)
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 })
    }

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
        console.error('register-password update error', updateError)
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
        console.error('register-password insert error', insertError)
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

    return response
  } catch (error) {
    console.error('register-password error', error)
    return NextResponse.json({ error: 'Unerwarteter Fehler bei der Registrierung.' }, { status: 500 })
  }
}

