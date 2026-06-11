import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminClient } from '@/lib/supabase/admin'
import { sendDevEmail } from '@/lib/email/resend'
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
    const supabase = getAdminClient()

    // Upsert user
    const { data: user, error: userError } = await supabase
      .from('users')
      .upsert({ email: normalizedEmail }, { onConflict: 'email' })
      .select('id, email')
      .single()

    if (userError || !user) {
      logger.error('auth.request-link', 'upsert user failed', { error: userError?.message })
      return NextResponse.json({ error: 'Fehler beim Anlegen des Nutzers' }, { status: 500 })
    }

    // Create login token
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000).toISOString()

    const { error: tokenError } = await supabase.from('login_tokens').insert({
      user_id: user.id,
      token,
      expires_at: expiresAt,
    })

    if (tokenError) {
      logger.error('auth.request-link', 'insert login token failed', { error: tokenError.message })
      return NextResponse.json({ error: 'Fehler beim Erzeugen des Login-Links' }, { status: 500 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const loginUrl = new URL('/api/auth/callback', baseUrl)
    loginUrl.searchParams.set('token', token)

    // Send email via Resend
    await sendDevEmail({
      to: normalizedEmail,
      subject: 'Dein Tripura Login-Link',
      text: `Klicke auf diesen Link, um dich bei Tripura anzumelden (gültig für ${TOKEN_TTL_MINUTES} Minuten):\n\n${loginUrl.toString()}\n\nWenn du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.`,
      html: `<p>Klicke auf diesen Link, um dich bei <strong>Tripura</strong> anzumelden (gültig für ${TOKEN_TTL_MINUTES} Minuten):</p>
<p><a href="${loginUrl.toString()}">${loginUrl.toString()}</a></p>
<p>Wenn du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.</p>`,
    })

    logger.info('auth.request-link', 'login link sent', { userId: user.id })
    return NextResponse.json({ ok: true })
  } catch (error) {
    logger.error('auth.request-link', 'unexpected error', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json({ error: 'Unerwarteter Fehler' }, { status: 500 })
  }
}

