'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Entfernt Supabase Auth-Callback-Parameter aus der URL (?code=, ?error=)
 * und verhindert 500/Fehler-Anzeige durch abgelaufene Links.
 */
export function AuthCallbackHandler() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const hasCode = params.has('code');
    const hasError = params.has('error') || params.has('error_code');
    if (!hasCode && !hasError) return;

    const cleanUrl = window.location.pathname || '/';
    window.history.replaceState({}, '', cleanUrl);
    router.replace(cleanUrl, { scroll: false });
  }, [router]);

  return null;
}
