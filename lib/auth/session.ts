import { cookies } from 'next/headers'
import { COOKIE_NAME, verifySession, type SessionPayload } from '@/lib/auth/jwt'

/**
 * Liest die aktuelle Session aus dem `tripura_session`-Cookie (Server-only).
 * Gibt null zurück, wenn kein gültiges JWT vorhanden ist.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifySession(token)
}
