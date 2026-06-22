/**
 * Prompt-Builder: wandelt gespeicherte Survey-Antworten (trip_surveys.answers)
 * in einen deutschen System-Prompt für die Reiseplan-KI um.
 *
 * Reine Funktionen ohne Seiteneffekte – ohne AI-Key unit-testbar
 * (siehe scripts/test-prompt-builder.mjs).
 */

export interface SurveyQuestionnaireEntry {
  questionId: string
  question: string
  type: string
  value?: number | null
  liked?: string[]
  disliked?: string[]
}

export interface SurveyAnswers {
  source?: string
  destinations?: string[]
  regionSelections?: Record<string, string[]>
  startDate?: string | null
  endDate?: string | null
  travelers?: number
  travelExtras?: Record<string, string>
  questionnaire?: SurveyQuestionnaireEntry[]
  /** RouteQuestionnaireFlow: questionId → Choice */
  answers?: Record<string, string>
}

const TRAVEL_STYLE_LABELS: Record<string, string> = {
  adventure: 'Abenteuer & Action',
  relaxation: 'Entspannung & Wellness',
  cultural: 'Kultur & Geschichte',
  foodie: 'Kulinarik & Essen',
  nature: 'Natur & Wandern',
  urban: 'Stadt & Nachtleben',
}

const EXTRA_LABELS: Record<string, string> = {
  car: 'Mietwagen',
  card: 'Reise-Kreditkarte',
  esim: 'eSIM für mobile Daten',
  transfer: 'Flughafen-Transfer',
}

function formatDateRange(startDate?: string | null, endDate?: string | null): string | null {
  if (!startDate || !endDate) return null
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
  const days = Math.max(
    1,
    Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000),
  )
  return `${fmt(startDate)} bis ${fmt(endDate)} (${days} ${days === 1 ? 'Tag' : 'Tage'})`
}

function labelFor(value: string): string {
  return TRAVEL_STYLE_LABELS[value] ?? value
}

/** Baut die Nutzer-Präferenzen als Aufzählung (eine Zeile pro Erkenntnis). */
export function buildPreferenceLines(answers: SurveyAnswers): string[] {
  const lines: string[] = []

  if (answers.destinations?.length) {
    lines.push(`Reiseziele: ${answers.destinations.join(', ')}`)
  }

  if (answers.regionSelections) {
    for (const [country, cities] of Object.entries(answers.regionSelections)) {
      if (cities.length > 0) {
        lines.push(`Gewünschte Orte in ${country}: ${cities.join(', ')}`)
      }
    }
  }

  const dateRange = formatDateRange(answers.startDate, answers.endDate)
  if (dateRange) lines.push(`Reisezeitraum: ${dateRange}`)

  if (answers.travelers) {
    lines.push(`Anzahl Reisende: ${answers.travelers}`)
  }

  for (const entry of answers.questionnaire ?? []) {
    if (entry.type === 'scale' && entry.value != null) {
      lines.push(`${entry.question} – Antwort auf Skala: ${entry.value}`)
    } else {
      if (entry.liked?.length) {
        lines.push(`Mag: ${entry.liked.map(labelFor).join(', ')} (${entry.question})`)
      }
      if (entry.disliked?.length) {
        lines.push(`Mag nicht: ${entry.disliked.map(labelFor).join(', ')} (${entry.question})`)
      }
    }
  }

  // RouteQuestionnaireFlow-Antworten (questionId → gewählte Option)
  if (answers.answers) {
    for (const [questionId, choice] of Object.entries(answers.answers)) {
      lines.push(`Präferenz „${questionId}“: ${choice}`)
    }
  }

  const needed = Object.entries(answers.travelExtras ?? {})
    .filter(([, v]) => v === 'need')
    .map(([k]) => EXTRA_LABELS[k] ?? k)
  if (needed.length > 0) {
    lines.push(`Zusätzlich benötigt: ${needed.join(', ')}`)
  }

  return lines
}

/**
 * Baut den vollständigen deutschen System-Prompt für die Reiseplan-Generierung.
 */
export function buildSystemPrompt(answers: SurveyAnswers): string {
  const preferences = buildPreferenceLines(answers)

  const sections: string[] = [
    'Du bist Tripura, ein erfahrener deutschsprachiger Reiseplaner.',
    'Erstelle einen detaillierten, personalisierten Reiseplan auf Deutsch.',
    '',
    'Regeln:',
    '- Antworte ausschließlich auf Deutsch.',
    '- Strukturiere den Plan nach Tagen (Tag 1, Tag 2, …) mit Vormittag/Nachmittag/Abend.',
    '- Nenne zu jeder Aktivität eine kurze Begründung, warum sie zu den Vorlieben passt.',
    '- Gib realistische Zeitangaben und beachte Öffnungszeiten-Logik (keine Museen montags voraussetzen).',
    '- Schlage pro Tag mindestens ein Restaurant passend zu den kulinarischen Vorlieben vor.',
    '- Halte dich an das angegebene Budget, falls vorhanden, und schätze Kosten pro Tag.',
    '- Erfinde keine konkreten Preise für Flüge oder Hotels – markiere sie als Schätzung.',
  ]

  if (preferences.length > 0) {
    sections.push('', 'Vorlieben und Eckdaten des Nutzers:')
    sections.push(...preferences.map((line) => `- ${line}`))
  } else {
    sections.push('', 'Es liegen keine Fragebogen-Antworten vor – erstelle einen ausgewogenen Vorschlag und stelle höchstens drei Rückfragen.')
  }

  return sections.join('\n')
}
