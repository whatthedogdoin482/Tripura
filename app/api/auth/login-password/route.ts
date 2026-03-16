import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { verifyPassword } from '@/lib/auth/password'
import { COOKIE_NAME, signSession } from '@/lib/auth/jwt'

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as { email?: string; password?: string }

    if (!email || !password) {
      return NextResponse.json({ error: 'E-Mail und Passwort sind erforderlich.' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const supabase = getAdminClient()

    const { data: user } = await supabase
      .from('users')
      .select('id, email, password_hash')
      .eq('email', normalizedEmail)
      .maybeSingle()

    // Always return generic error for bad credentials
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

    await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id)

    const sessionToken = signSession({ sub: user.id, email: normalizedEmail })
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
    console.error('login-password error', error)
    return NextResponse.json({ error: 'Unerwarteter Fehler bei der Anmeldung.' }, { status: 500 })
  }
}

