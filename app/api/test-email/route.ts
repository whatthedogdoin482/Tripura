import { NextResponse } from 'next/server'
import { SAMPLE_TEMPLATES } from '@/lib/email/templates'

/** GET /api/test-email?template=booking – HTML-Vorschau eines Templates */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const key = url.searchParams.get('template') ?? 'booking'
  const builder = SAMPLE_TEMPLATES[key as keyof typeof SAMPLE_TEMPLATES]
  if (!builder) {
    return NextResponse.json({ error: 'Unbekanntes Template.' }, { status: 400 })
  }
  const template = builder()
  return new NextResponse(template.html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

/** POST – Versand deaktiviert (kein E-Mail-Anbieter) */
export async function POST() {
  return NextResponse.json(
    { error: 'E-Mail-Versand ist nicht eingerichtet. Nutze die HTML-Vorschau (GET).' },
    { status: 501 },
  )
}
