/**
 * Mini-Unit-Test für lib/ai/promptBuilder.ts – läuft ohne AI-Key.
 * Ausführen: npx tsx scripts/test-prompt-builder.ts
 */
import { buildSystemPrompt, buildPreferenceLines, type SurveyAnswers } from '../lib/ai/promptBuilder'

let failures = 0

function assert(condition: boolean, name: string) {
  if (condition) {
    console.log(`  ✓ ${name}`)
  } else {
    failures++
    console.error(`  ✗ ${name}`)
  }
}

console.log('promptBuilder Tests')

// 1) Leere Antworten → Fallback-Hinweis
const emptyPrompt = buildSystemPrompt({})
assert(emptyPrompt.includes('Du bist Tripura'), 'enthält Rollenbeschreibung')
assert(emptyPrompt.includes('keine Fragebogen-Antworten'), 'leere Antworten → Fallback-Hinweis')
assert(emptyPrompt.includes('ausschließlich auf Deutsch'), 'deutsche Sprachregel vorhanden')

// 2) Volle Antworten aus PlanningSection
const full: SurveyAnswers = {
  source: 'planning_section',
  destinations: ['Spanien', 'Barcelona'],
  regionSelections: { Spanien: ['Sevilla', 'Granada'] },
  startDate: '2026-07-01',
  endDate: '2026-07-08',
  travelers: 2,
  travelExtras: { car: 'need', esim: 'need', card: 'later', transfer: 'no' },
  questionnaire: [
    {
      questionId: 'travel_style',
      question: 'Wie möchtest du reisen?',
      type: 'swipe',
      liked: ['foodie', 'cultural'],
      disliked: ['urban'],
    },
    { questionId: 'pace', question: 'Wie schnell soll dein Reisetempo sein?', type: 'scale', value: 4 },
  ],
}
const lines = buildPreferenceLines(full)
assert(lines.some((l) => l.includes('Spanien, Barcelona')), 'Ziele in Präferenzzeilen')
assert(lines.some((l) => l.includes('Sevilla, Granada')), 'Regionsauswahl in Präferenzzeilen')
assert(lines.some((l) => l.includes('7 Tage')), 'Reisedauer berechnet (7 Tage)')
assert(lines.some((l) => l.includes('Kulinarik & Essen')), 'liked-Werte werden übersetzt')
assert(lines.some((l) => l.startsWith('Mag nicht:') && l.includes('Stadt & Nachtleben')), 'disliked-Werte werden übersetzt')
assert(lines.some((l) => l.includes('Skala: 4')), 'Skalenwert enthalten')
assert(lines.some((l) => l.includes('Mietwagen') && l.includes('eSIM')), 'nur „need“-Extras gelistet')
assert(!lines.some((l) => l.includes('Reise-Kreditkarte')), '„later“-Extras nicht gelistet')

const fullPrompt = buildSystemPrompt(full)
assert(fullPrompt.includes('- Reiseziele: Spanien, Barcelona'), 'Prompt enthält Präferenzen als Liste')
assert(!fullPrompt.includes('keine Fragebogen-Antworten'), 'kein Fallback-Hinweis bei vollen Antworten')

// 3) RouteQuestionnaireFlow-Format
const routeAnswers: SurveyAnswers = { source: 'route_questionnaire', answers: { beach_or_mountain: 'beach' } }
assert(
  buildSystemPrompt(routeAnswers).includes('„beach_or_mountain“: beach'),
  'Route-Questionnaire-Antworten enthalten',
)

if (failures > 0) {
  console.error(`\n${failures} Test(s) fehlgeschlagen`)
  process.exit(1)
}
console.log('\nAlle Tests bestanden.')
