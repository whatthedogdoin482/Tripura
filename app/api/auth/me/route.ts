import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME, verifySession } from '@/lib/auth/jwt'
import { getAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) {
    return NextResponse.json({ user: null })
  }

  const payload = verifySession(token)
  if (!payload) {
    return NextResponse.json({ user: null })
  }

  const supabase = getAdminClient()
  const { data: user } = await supabase
    .from('users')
    .select('id, email, display_name, avatar_url, created_at, travel_style, language')
    .eq('id', payload.sub)
    .maybeSingle()

  if (!user) {
    return NextResponse.json({ user: null })
  }

  return NextResponse.json({
    user: {
      id: user.id,
      displayName: user.display_name ?? user.email?.split('@')[0] ?? 'Nutzer',
      email: user.email,
      profileImageUrl: user.avatar_url,
      createdAt: user.created_at,
      travelStyle: user.travel_style ?? null,
      language: user.language ?? 'de',
    },
  })
}

