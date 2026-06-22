import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { COOKIE_NAME, signSession } from '@/lib/auth/jwt'
import { checkRateLimit } from '@/lib/api/guard'
import { logger } from '@/lib/log'

export async function GET(request: Request) {
  const limited = checkRateLimit(request, 'auth.callback', 30, 15 * 60 * 1000)
  if (limited) return limited

  const url = new URL(request.url)
  const token = url.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=missing_token', url.origin))
  }

  const supabase = getAdminClient()

  const { data: loginToken, error } = await supabase
    .from('login_tokens')
    .select('id, user_id, expires_at, used')
    .eq('token', token)
    .maybeSingle()

  if (error || !loginToken) {
    return NextResponse.redirect(new URL('/login?error=link_invalid', url.origin))
  }

  const now = new Date()
  const expiresAt = new Date(loginToken.expires_at as string)

  if (loginToken.used || expiresAt < now) {
    return NextResponse.redirect(new URL('/login?error=link_expired', url.origin))
  }

  // Mark token as used
  await supabase.from('login_tokens').update({ used: true }).eq('id', loginToken.id)

  // Fetch user
  const { data: user } = await supabase
    .from('users')
    .select('id, email, display_name, avatar_url')
    .eq('id', loginToken.user_id)
    .maybeSingle()

  if (!user) {
    return NextResponse.redirect(new URL('/login?error=user_missing', url.origin))
  }

  const sessionToken = signSession({
    sub: user.id,
    email: user.email,
  })

  logger.info('auth.callback', 'magic link login successful', { userId: user.id })

  const response = NextResponse.redirect(new URL('/', url.origin))
  const isProd = process.env.NODE_ENV === 'production'

  response.cookies.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/',
  })

  return response
}

