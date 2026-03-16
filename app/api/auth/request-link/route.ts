import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { sendDevEmail } from '@/lib/email/resend'

const TOKEN_TTL_MINUTES = 15

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string }

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'E-Mail ist erforderlich' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const supabase = getAdminClient()

    // Upsert user
    const { data: user, error: userError } = await supabase
      .from('users')
      .upsert({ email: normalizedEmail }, { onConflict: 'email' })
      .select('id, email')
      .single()

    if (userError || !user) {
      console.error('Upsert user failed', userError)
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
      console.error('Insert login token failed', tokenError)
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

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('request-link error', error)
    return NextResponse.json({ error: 'Unerwarteter Fehler' }, { status: 500 })
  }
}

