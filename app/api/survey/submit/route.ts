import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth/session'
import { getAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit, parseBody } from '@/lib/api/guard'
import { logger } from '@/lib/log'

const bodySchema = z.object({
  answers: z
    .record(z.string(), z.unknown())
    .refine((a) => JSON.stringify(a).length <= 200_000, 'answers ist zu groß.'),
  tripId: z.string().uuid().optional(),
})

/**
 * POST /api/survey/submit
 * Speichert Fragebogen-Antworten als JSON in trip_surveys.
 * Body: { answers: object, tripId?: string }
 */
export async function POST(request: Request) {
  const limited = checkRateLimit(request, 'survey.submit', 20, 60 * 60 * 1000)
  if (limited) return limited

  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })
  }

  const parsed = await parseBody(request, bodySchema, 'survey.submit')
  if (parsed.response) return parsed.response
  const { answers, tripId } = parsed.data

  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('trip_surveys')
    .insert({
      user_id: session.sub,
      trip_id: tripId ?? null,
      answers,
    })
    .select('id, created_at')
    .single()

  if (error) {
    logger.error('survey.submit', 'insert failed', { error: error.message })
    return NextResponse.json({ error: 'Antworten konnten nicht gespeichert werden.' }, { status: 500 })
  }

  logger.info('survey.submit', 'survey stored', { userId: session.sub, surveyId: data.id })
  return NextResponse.json({ ok: true, survey: data })
}

/** GET /api/survey/submit – letzte gespeicherte Antworten des Nutzers */
export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })
  }

  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('trip_surveys')
    .select('id, trip_id, answers, created_at')
    .eq('user_id', session.sub)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    logger.error('survey.submit', 'load failed', { error: error.message })
    return NextResponse.json({ error: 'Antworten konnten nicht geladen werden.' }, { status: 500 })
  }

  return NextResponse.json({ survey: data })
}
