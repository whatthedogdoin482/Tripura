/**
 * Typen für die Supabase-Tabellen (Custom-Auth-Schema).
 * Entspricht supabase/migrations/20260611000000_core_schema.sql
 */

export interface DbUser {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  travel_style: string | null;
  language: string | null;
  password_hash: string | null;
  password_created_at: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export type DbUserUpdate = Partial<
  Pick<DbUser, 'display_name' | 'avatar_url' | 'travel_style' | 'language'>
>;

export interface LoginToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}

export interface Trip {
  id: string;
  user_id: string;
  name: string | null;
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
  plan: unknown | null;
  status: 'planning' | 'upcoming' | 'active' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface TripSurvey {
  id: string;
  user_id: string;
  trip_id: string | null;
  answers: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  trip_id: string | null;
  stripe_session_id: string | null;
  amount_total: number | null;
  currency: string | null;
  status: 'pending' | 'paid' | 'failed';
  items: unknown | null;
  created_at: string;
  updated_at: string;
}

export interface CreditCardRow {
  id: string;
  name: string;
  issuer: string | null;
  image_url: string | null;
  benefits: string[] | null;
  foreign_transaction_fee: number | null;
  rewards_rate: string | null;
  annual_fee: number | null;
  recommended_for: string[] | null;
  apply_url: string | null;
  created_at: string;
}

/** @deprecated Altes Supabase-Auth-Profil – nur noch für Übergangscode. */
export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
