import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY

if (!apiKey) {
  // For development we just log; in production you may want to throw instead.
  console.warn('RESEND_API_KEY is not set')
}

const resend = apiKey ? new Resend(apiKey) : null

export async function sendDevEmail(params: {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  from?: string
}) {
  if (!resend) {
    throw new Error('Resend client not initialised – set RESEND_API_KEY in .env.local')
  }

  // Use Resend’s default verified sender by default.
  // You can change this to your own verified domain in the Resend dashboard.
  const from = params.from ?? 'onboarding@resend.dev'

  return resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html,
  })
}

