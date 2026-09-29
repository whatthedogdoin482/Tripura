import type { DbUser, DbUserUpdate, LoginToken, Order, TripSurvey } from './types'

/**
 * Dev-Speicher im Server-Prozess (kein Supabase).
 * Daten gehen beim Neustart von `npm run dev` verloren.
 */

const users = new Map<string, DbUser>()
const usersByEmail = new Map<string, string>()
const loginTokens = new Map<string, LoginToken>()
const loginTokensByValue = new Map<string, string>()
const surveys: TripSurvey[] = []
const orders = new Map<string, Order>()

const now = () => new Date().toISOString()

function touchUser(user: DbUser, patch: DbUserUpdate): DbUser {
  const updated: DbUser = { ...user, ...patch, updated_at: now() }
  users.set(user.id, updated)
  return updated
}

export const userRepo = {
  findByEmail(email: string): DbUser | null {
    const id = usersByEmail.get(email)
    return id ? users.get(id) ?? null : null
  },

  findById(id: string): DbUser | null {
    return users.get(id) ?? null
  },

  upsertByEmail(email: string): DbUser {
    const existing = userRepo.findByEmail(email)
    if (existing) return existing
    const ts = now()
    const user: DbUser = {
      id: crypto.randomUUID(),
      email,
      display_name: null,
      avatar_url: null,
      travel_style: null,
      language: 'de',
      password_hash: null,
      password_created_at: null,
      last_login_at: null,
      created_at: ts,
      updated_at: ts,
    }
    users.set(user.id, user)
    usersByEmail.set(email, user.id)
    return user
  },

  createWithPassword(email: string, passwordHash: string): DbUser {
    const ts = now()
    const user: DbUser = {
      id: crypto.randomUUID(),
      email,
      display_name: null,
      avatar_url: null,
      travel_style: null,
      language: 'de',
      password_hash: passwordHash,
      password_created_at: ts,
      last_login_at: ts,
      created_at: ts,
      updated_at: ts,
    }
    users.set(user.id, user)
    usersByEmail.set(email, user.id)
    return user
  },

  update(id: string, patch: DbUserUpdate): DbUser | null {
    const user = users.get(id)
    if (!user) return null
    return touchUser(user, patch)
  },
}

export const loginTokenRepo = {
  create(userId: string, token: string, expiresAt: string): LoginToken {
    const row: LoginToken = {
      id: crypto.randomUUID(),
      user_id: userId,
      token,
      expires_at: expiresAt,
      used: false,
      created_at: now(),
    }
    loginTokens.set(row.id, row)
    loginTokensByValue.set(token, row.id)
    return row
  },

  findByToken(token: string): LoginToken | null {
    const id = loginTokensByValue.get(token)
    return id ? loginTokens.get(id) ?? null : null
  },

  markUsed(id: string): void {
    const row = loginTokens.get(id)
    if (row) loginTokens.set(id, { ...row, used: true })
  },
}

export const surveyRepo = {
  insert(userId: string, answers: Record<string, unknown>, tripId?: string | null): TripSurvey {
    const ts = now()
    const row: TripSurvey = {
      id: crypto.randomUUID(),
      user_id: userId,
      trip_id: tripId ?? null,
      answers,
      created_at: ts,
      updated_at: ts,
    }
    surveys.push(row)
    return row
  },

  latestForUser(userId: string): TripSurvey | null {
    for (let i = surveys.length - 1; i >= 0; i--) {
      if (surveys[i].user_id === userId) return surveys[i]
    }
    return null
  },
}

export const orderRepo = {
  create(input: {
    user_id: string | null
    trip_id: string | null
    amount_total: number | null
    currency: string
    status: Order['status']
    items: unknown | null
    stripe_session_id?: string | null
  }): Order {
    const ts = now()
    const row: Order = {
      id: crypto.randomUUID(),
      user_id: input.user_id,
      trip_id: input.trip_id,
      stripe_session_id: input.stripe_session_id ?? null,
      amount_total: input.amount_total,
      currency: input.currency,
      status: input.status,
      items: input.items,
      created_at: ts,
      updated_at: ts,
    }
    orders.set(row.id, row)
    return row
  },

  update(id: string, patch: Partial<Omit<Order, 'id' | 'created_at'>>): Order | null {
    const row = orders.get(id)
    if (!row) return null
    const updated = { ...row, ...patch, updated_at: now() }
    orders.set(id, updated)
    return updated
  },

  findByStripeSessionId(sessionId: string): Order | null {
    for (const order of Array.from(orders.values())) {
      if (order.stripe_session_id === sessionId) return order
    }
    return null
  },
}
