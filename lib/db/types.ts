export interface DbUser {
  id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  travel_style: string | null
  language: string | null
  password_hash: string | null
  password_created_at: string | null
  last_login_at: string | null
  created_at: string
  updated_at: string
}

export type DbUserUpdate = Partial<
  Pick<DbUser, 'display_name' | 'avatar_url' | 'travel_style' | 'language' | 'password_hash' | 'password_created_at' | 'last_login_at'>
>

export interface LoginToken {
  id: string
  user_id: string
  token: string
  expires_at: string
  used: boolean
  created_at: string
}

export interface TripSurvey {
  id: string
  user_id: string
  trip_id: string | null
  answers: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string | null
  trip_id: string | null
  stripe_session_id: string | null
  amount_total: number | null
  currency: string | null
  status: 'pending' | 'paid' | 'failed'
  items: unknown | null
  created_at: string
  updated_at: string
}
