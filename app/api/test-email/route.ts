import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sendDevEmail } from '@/lib/email/resend'
import { SAMPLE_TEMPLATES } from '@/lib/email/templates'
import { checkRateLimit, parseBody } from '@/lib/api/guard'
import { logger } from '@/lib/log'

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email('Ungültige E-Mail-Adresse.'),
  template: z.enum(['booking', 'tripplan', 'reminder']),
})

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

/** POST /api/test-email – Beispiel-Template an eine E-Mail senden (Resend) */
export async function POST(request: Request) {
  const limited = checkRateLimit(request, 'test-email', 5, 15 * 60 * 1000)
  if (limited) return limited

  const parsed = await parseBody(request, bodySchema, 'test-email')
  if (parsed.response) return parsed.response
  const { email, template: key } = parsed.data

  const template = SAMPLE_TEMPLATES[key]()

  try {
    await sendDevEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
    logger.info('test-email', 'template sent', { template: key })
    return NextResponse.json({ ok: true, message: `Template „${key}“ an ${email} gesendet.` })
  } catch (error) {
    logger.error('test-email', 'send failed', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json({ error: 'E-Mail konnte nicht gesendet werden.' }, { status: 500 })
  }
}
