import jwt from 'jsonwebtoken'

const COOKIE_NAME = 'tripura_session'

export type SessionPayload = {
  sub: string
  email: string
}

const JWT_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days

function getSecret() {
  const secret = process.env.AUTH_JWT_SECRET
  if (!secret) {
    throw new Error('AUTH_JWT_SECRET is not set')
  }
  return secret
}

export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, getSecret(), { algorithm: 'HS256', expiresIn: JWT_TTL_SECONDS })
}

export function verifySession(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, getSecret()) as SessionPayload
  } catch {
    return null
  }
}

export { COOKIE_NAME }

