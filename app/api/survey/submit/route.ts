import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth/session'
import { surveyRepo } from '@/lib/db/memory'
import { checkRateLimit, parseBody } from '@/lib/api/guard'
import { logger } from '@/lib/log'

const bodySchema = z.object({
  answers: z
    .record(z.string(), z.unknown())
    .refine((a) => JSON.stringify(a).length <= 200_000, 'answers ist zu groß.'),
  tripId: z.string().uuid().optional(),
})

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

  const data = surveyRepo.insert(session.sub, answers, tripId ?? null)

  logger.info('survey.submit', 'survey stored', { userId: session.sub, surveyId: data.id })
  return NextResponse.json({ ok: true, survey: { id: data.id, created_at: data.created_at } })
}

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })
  }

  const data = surveyRepo.latestForUser(session.sub)

  return NextResponse.json({
    survey: data
      ? { id: data.id, trip_id: data.trip_id, answers: data.answers, created_at: data.created_at }
      : null,
  })
}
