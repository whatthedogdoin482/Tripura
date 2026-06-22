/**
 * Client-Helper: Fragebogen-Antworten an /api/survey/submit senden.
 * Best effort – wirft nicht, wenn der Nutzer nicht angemeldet ist.
 */
export async function submitSurvey(
  answers: Record<string, unknown>,
  tripId?: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/survey/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, tripId }),
      credentials: 'include',
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      return { ok: false, error: data.error ?? `HTTP ${res.status}` }
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Netzwerkfehler' }
  }
}
