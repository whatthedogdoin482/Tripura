import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase client for use in Client Components (browser).
 * Nur aufrufen, wenn NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY gesetzt sind.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
