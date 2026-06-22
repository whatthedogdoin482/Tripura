import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth/session'
import { getAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit, parseBody } from '@/lib/api/guard'
import { logger } from '@/lib/log'

const TRAVEL_STYLES = ['adventure', 'relaxation', 'cultural', 'foodie', 'nature', 'urban'] as const
const LANGUAGES = ['de', 'en'] as const

const patchSchema = z
  .object({
    displayName: z.string().trim().min(1, 'Anzeigename darf nicht leer sein.').max(80, 'Anzeigename ist zu lang.').optional(),
    travelStyle: z.enum(TRAVEL_STYLES).nullable().optional(),
    language: z.enum(LANGUAGES).optional(),
    // Data-URLs können groß werden – auf ~500 KB begrenzen
    profileImageUrl: z.string().max(500_000, 'Bild ist zu groß (max. ~500 KB).').nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, 'Keine gültigen Felder zum Aktualisieren.')

function toApiUser(user: {
  id: string
  email: string | null
  display_name: string | null
  avatar_url: string | null
  travel_style: string | null
  language: string | null
}) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name ?? user.email?.split('@')[0] ?? 'Nutzer',
    profileImageUrl: user.avatar_url,
    travelStyle: user.travel_style,
    language: user.language ?? 'de',
  }
}

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })
  }

  const supabase = getAdminClient()
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, display_name, avatar_url, travel_style, language')
    .eq('id', session.sub)
    .maybeSingle()

  if (error || !user) {
    return NextResponse.json({ error: 'Profil nicht gefunden.' }, { status: 404 })
  }

  return NextResponse.json({ user: toApiUser(user) })
}

export async function PATCH(request: Request) {
  const limited = checkRateLimit(request, 'user.profile', 30, 60 * 60 * 1000)
  if (limited) return limited

  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })
  }

  const parsed = await parseBody(request, patchSchema, 'user.profile')
  if (parsed.response) return parsed.response
  const body = parsed.data

  const update: Record<string, string | null> = {}
  if (body.displayName !== undefined) update.display_name = body.displayName
  if (body.travelStyle !== undefined) update.travel_style = body.travelStyle
  if (body.language !== undefined) update.language = body.language
  if (body.profileImageUrl !== undefined) update.avatar_url = body.profileImageUrl

  const supabase = getAdminClient()
  const { data: user, error } = await supabase
    .from('users')
    .update(update)
    .eq('id', session.sub)
    .select('id, email, display_name, avatar_url, travel_style, language')
    .single()

  if (error || !user) {
    logger.error('user.profile', 'PATCH failed', { error: error?.message })
    return NextResponse.json({ error: 'Profil konnte nicht gespeichert werden.' }, { status: 500 })
  }

  logger.info('user.profile', 'profile updated', { userId: session.sub, fields: Object.keys(update) })
  return NextResponse.json({ user: toApiUser(user) })
}
