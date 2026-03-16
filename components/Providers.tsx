'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { AuthCallbackHandler } from '@/components/AuthCallbackHandler';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthCallbackHandler />
      {children}
    </AuthProvider>
  );
}
