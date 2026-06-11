/**
 * HTML-E-Mail-Templates (Buchung, Reiseplan, Erinnerung).
 * E-Mail-sicher gebaut: Tabellen-Layout + Inline-Styles, kein externes CSS.
 * Testbar über die Seite /test-email (Vorschau + Versand via Resend).
 */

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

const BRAND = {
  navy: '#1B262C',
  blue: '#3282B8',
  lightBlue: '#BBE1FA',
  gradient: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #a855f7 100%)',
}

/** Gemeinsamer Rahmen für alle Mails (Header mit Gradient, Footer). */
function layout(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f6fb;font-family:Inter,'Segoe UI',system-ui,-apple-system,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f6fb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:${BRAND.gradient};background-color:${BRAND.blue};padding:28px 32px;">
              <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:0.5px;">Tripura</p>
              <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.85);">Dein KI-Reiseplaner</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background-color:#f8fafc;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                Diese E-Mail wurde von Tripura gesendet. Wenn du sie nicht erwartet hast, kannst du sie ignorieren.<br />
                © ${new Date().getFullYear()} Tripura · <a href="#" style="color:${BRAND.blue};text-decoration:none;">Impressum</a> · <a href="#" style="color:${BRAND.blue};text-decoration:none;">Datenschutz</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function pill(label: string): string {
  return `<span style="display:inline-block;padding:6px 14px;border-radius:999px;background-color:#eff6ff;color:#1d4ed8;font-size:13px;font-weight:600;">${label}</span>`
}

// ── 1. Buchungsbestätigung ──────────────────────────────────────

export interface BookingItem {
  label: string
  price: number
}

export interface BookingConfirmationParams {
  name: string
  destination: string
  startDate?: string
  endDate?: string
  items: BookingItem[]
  totalEuro: number
  orderId?: string
}

export function bookingConfirmationEmail(params: BookingConfirmationParams): EmailTemplate {
  const dates =
    params.startDate && params.endDate ? `${params.startDate} – ${params.endDate}` : null

  const rows = params.items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155;">${item.label}</td>
          <td align="right" style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;font-weight:600;color:#0f172a;white-space:nowrap;">${item.price.toFixed(2)} €</td>
        </tr>`,
    )
    .join('')

  const html = layout(
    'Buchungsbestätigung',
    `
    <h1 style="margin:0 0 8px;font-size:24px;color:${BRAND.navy};">Buchung bestätigt 🎉</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
      Hallo ${params.name}, deine Buchung für <strong>${params.destination}</strong> ist bestätigt.
      ${dates ? `Reisezeitraum: <strong>${dates}</strong>.` : ''}
    </p>
    ${params.orderId ? `<p style="margin:0 0 20px;">${pill(`Buchungsnummer: ${params.orderId}`)}</p>` : ''}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      ${rows}
      <tr>
        <td style="padding:14px 0 0;font-size:15px;font-weight:700;color:${BRAND.navy};">Gesamt</td>
        <td align="right" style="padding:14px 0 0;font-size:18px;font-weight:800;color:${BRAND.navy};">${params.totalEuro.toFixed(2)} €</td>
      </tr>
    </table>
    <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;">Alle Details findest du jederzeit in deinem Tripura-Profil.</p>
  `,
  )

  const text = [
    `Hallo ${params.name},`,
    ``,
    `deine Buchung für ${params.destination} ist bestätigt.`,
    dates ? `Reisezeitraum: ${dates}` : '',
    params.orderId ? `Buchungsnummer: ${params.orderId}` : '',
    ``,
    ...params.items.map((i) => `- ${i.label}: ${i.price.toFixed(2)} €`),
    ``,
    `Gesamt: ${params.totalEuro.toFixed(2)} €`,
  ]
    .filter(Boolean)
    .join('\n')

  return { subject: `Deine Buchung für ${params.destination} ist bestätigt`, html, text }
}

// ── 2. Reiseplan ────────────────────────────────────────────────

export interface TripPlanDay {
  title: string
  activities: string[]
}

export interface TripPlanParams {
  name: string
  destination: string
  days: TripPlanDay[]
}

export function tripPlanEmail(params: TripPlanParams): EmailTemplate {
  const daysHtml = params.days
    .map(
      (day, i) => `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;border:1px solid #e2e8f0;border-radius:16px;">
        <tr>
          <td style="padding:16px 20px;">
            <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:${BRAND.blue};">Tag ${i + 1}: ${day.title}</p>
            ${day.activities
              .map(
                (a) =>
                  `<p style="margin:0 0 6px;font-size:14px;color:#475569;line-height:1.5;">• ${a}</p>`,
              )
              .join('')}
          </td>
        </tr>
      </table>`,
    )
    .join('')

  const html = layout(
    'Dein Reiseplan',
    `
    <h1 style="margin:0 0 8px;font-size:24px;color:${BRAND.navy};">Dein Reiseplan für ${params.destination} ✈️</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
      Hallo ${params.name}, hier ist dein personalisierter Reiseplan – erstellt nach deinen Vorlieben.
    </p>
    ${daysHtml}
    <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;">Du kannst den Plan jederzeit in der App anpassen.</p>
  `,
  )

  const text = [
    `Hallo ${params.name},`,
    ``,
    `dein Reiseplan für ${params.destination}:`,
    ``,
    ...params.days.flatMap((day, i) => [
      `Tag ${i + 1}: ${day.title}`,
      ...day.activities.map((a) => `  - ${a}`),
      ``,
    ]),
  ].join('\n')

  return { subject: `Dein Reiseplan für ${params.destination}`, html, text }
}

// ── 3. Erinnerung ───────────────────────────────────────────────

export type ReminderType = 'checkin' | 'departure'

export interface ReminderParams {
  name: string
  type: ReminderType
  destination: string
  date: string
}

export function reminderEmail(params: ReminderParams): EmailTemplate {
  const isCheckin = params.type === 'checkin'
  const title = isCheckin ? 'Zeit für den Check-in ✅' : 'Bald geht es los 🧳'
  const message = isCheckin
    ? `der Check-in für deinen Flug nach <strong>${params.destination}</strong> ist jetzt möglich. Abflug: <strong>${params.date}</strong>.`
    : `deine Reise nach <strong>${params.destination}</strong> startet am <strong>${params.date}</strong>. Zeit, die Koffer zu packen!`

  const checklist = isCheckin
    ? ['Online einchecken und Bordkarte speichern', 'Sitzplatz prüfen', 'Gepäckbestimmungen checken']
    : ['Reisepass / Ausweis griffbereit', 'Reiseapotheke einpacken', 'eSIM / Roaming aktivieren', 'Wettervorhersage prüfen']

  const html = layout(
    title,
    `
    <h1 style="margin:0 0 8px;font-size:24px;color:${BRAND.navy};">${title}</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
      Hallo ${params.name}, ${message}
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:16px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:${BRAND.blue};">Deine Checkliste</p>
          ${checklist
            .map(
              (item) =>
                `<p style="margin:0 0 6px;font-size:14px;color:#475569;line-height:1.5;">☐ ${item}</p>`,
            )
            .join('')}
        </td>
      </tr>
    </table>
    <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;">Gute Reise wünscht dir dein Tripura-Team!</p>
  `,
  )

  const text = [
    `Hallo ${params.name},`,
    ``,
    isCheckin
      ? `der Check-in für deinen Flug nach ${params.destination} ist jetzt möglich. Abflug: ${params.date}.`
      : `deine Reise nach ${params.destination} startet am ${params.date}. Zeit, die Koffer zu packen!`,
    ``,
    `Checkliste:`,
    ...checklist.map((c) => `- ${c}`),
  ].join('\n')

  return {
    subject: isCheckin
      ? `Check-in möglich: Dein Flug nach ${params.destination}`
      : `Erinnerung: Deine Reise nach ${params.destination} am ${params.date}`,
    html,
    text,
  }
}

// ── Beispieldaten für die Vorschau auf /test-email ──────────────

export const SAMPLE_TEMPLATES = {
  booking: () =>
    bookingConfirmationEmail({
      name: 'Alex',
      destination: 'Barcelona',
      startDate: '01.07.2026',
      endDate: '08.07.2026',
      items: [
        { label: 'Hinflug FRA → BCN', price: 89 },
        { label: 'Rückflug BCN → FRA', price: 76 },
        { label: 'eSIM Europa 10 GB', price: 19 },
      ],
      totalEuro: 184,
      orderId: 'TRP-2026-0042',
    }),
  tripplan: () =>
    tripPlanEmail({
      name: 'Alex',
      destination: 'Barcelona',
      days: [
        { title: 'Ankunft & Gotisches Viertel', activities: ['Check-in im Hotel', 'Spaziergang durch das Barri Gòtic', 'Abendessen: Tapas in El Born'] },
        { title: 'Gaudí-Tag', activities: ['Sagrada Família (9:00, Tickets vorab)', 'Park Güell am Nachmittag', 'Sonnenuntergang am Bunkers del Carmel'] },
        { title: 'Strand & Abschied', activities: ['Vormittag an der Barceloneta', 'Paella am Hafen', 'Rückflug am Abend'] },
      ],
    }),
  reminder: () =>
    reminderEmail({
      name: 'Alex',
      type: 'checkin',
      destination: 'Barcelona',
      date: '01.07.2026, 10:25 Uhr',
    }),
} as const

export type SampleTemplateKey = keyof typeof SAMPLE_TEMPLATES
