/**
 * Typen für die Supabase-Tabelle `public.profiles` (Login/Profil-Daten).
 * Entspricht der Migration in supabase/migrations/20250316000000_create_profiles.sql
 */
export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'> & {
  created_at?: string;
  updated_at?: string;
};

export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>;
