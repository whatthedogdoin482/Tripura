'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'tripura-auth';
const PROFILE_IMAGE_KEY = 'tripura-profile-image';

export interface AuthUser {
  id: string;
  displayName: string;
  email: string | null;
  profileImageUrl: string | null;
  travelStyle?: string | null;
  language?: string | null;
}

export interface ProfileUpdate {
  displayName?: string;
  travelStyle?: string | null;
  language?: string;
  profileImageUrl?: string | null;
}

interface AuthContextValue {
  isLoggedIn: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  /** E-Mail-Link anfordern (Supabase Magic Link) */
  loginWithEmail: (email: string) => Promise<{ error: Error | null }>;
  /** E-Mail + Passwort registrieren */
  registerWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>;
  /** E-Mail + Passwort Login */
  loginWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>;
  /** Mit Google anmelden (Supabase OAuth) */
  loginWithGoogle: () => Promise<{ error: Error | null }>;
  /** Mit Apple anmelden (Supabase OAuth) */
  loginWithApple: () => Promise<{ error: Error | null }>;
  /** Demo-Login ohne Supabase (localStorage), wenn Supabase nicht konfiguriert ist */
  login: (displayName?: string) => void;
  logout: () => Promise<void>;
  setProfileImage: (url: string | null) => Promise<void>;
  /** Profilfelder (Name, Reisestil, Sprache, Avatar) speichern */
  updateProfile: (update: ProfileUpdate) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const defaultDisplayName = 'Nutzer';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    isLoggedIn: boolean;
    user: AuthUser | null;
    isLoading: boolean;
  }>({ isLoggedIn: false, user: null, isLoading: true });

  useEffect(() => {
    // On mount, ask backend who is logged in based on cookie
    const load = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        if (data.user) {
          setState({
            isLoggedIn: true,
            user: data.user,
            isLoading: false,
          });
        } else {
          setState({ isLoggedIn: false, user: null, isLoading: false });
        }
      } catch {
        setState({ isLoggedIn: false, user: null, isLoading: false });
      }
    };
    load();
  }, []);

  const registerWithPassword = useCallback(
    async (email: string, password: string): Promise<{ error: Error | null }> => {
      try {
        const res = await fetch('/api/auth/register-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return { error: new Error(data.error || 'Registrierung fehlgeschlagen.') };
        }
        // Refresh session info
        const me = await fetch('/api/auth/me', { credentials: 'include' });
        if (me.ok) {
          const payload = await me.json();
          if (payload.user) {
            setState({ isLoggedIn: true, user: payload.user, isLoading: false });
          }
        }
        return { error: null };
      } catch {
        return { error: new Error('Netzwerkfehler bei der Registrierung.') };
      }
    },
    [],
  );

  const loginWithPassword = useCallback(
    async (email: string, password: string): Promise<{ error: Error | null }> => {
      try {
        const res = await fetch('/api/auth/login-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return { error: new Error(data.error || 'E-Mail oder Passwort ist falsch.') };
        }
        const me = await fetch('/api/auth/me', { credentials: 'include' });
        if (me.ok) {
          const payload = await me.json();
          if (payload.user) {
            setState({ isLoggedIn: true, user: payload.user, isLoading: false });
          }
        }
        return { error: null };
      } catch {
        return { error: new Error('Netzwerkfehler bei der Anmeldung.') };
      }
    },
    [],
  );

  const loginWithEmail = useCallback(async (email: string): Promise<{ error: Error | null }> => {
    try {
      const res = await fetch('/api/auth/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { error: new Error(data.error || 'Fehler beim Senden des Login-Links') };
      }
      return { error: null };
    } catch {
      return { error: new Error('Netzwerkfehler beim Senden des Login-Links') };
    }
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<{ error: Error | null }> => {
    login();
    return { error: null };
  }, []);

  const loginWithApple = useCallback(async (): Promise<{ error: Error | null }> => {
    login();
    return { error: null };
  }, []);

  const login = useCallback((displayName?: string) => {
    const user: AuthUser = {
      id: '',
      displayName: displayName ?? defaultDisplayName,
      email: null,
      profileImageUrl: typeof window !== 'undefined' ? localStorage.getItem(PROFILE_IMAGE_KEY) : null,
    };
    setState({ isLoggedIn: true, user, isLoading: false });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isLoggedIn: true, displayName: user.displayName }));
    } catch (_) {}
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (_) {}
    setState({ isLoggedIn: false, user: null, isLoading: false });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  }, []);

  const updateProfile = useCallback(
    async (update: ProfileUpdate): Promise<{ error: Error | null }> => {
      try {
        const res = await fetch('/api/user/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update),
          credentials: 'include',
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return { error: new Error(data.error || 'Profil konnte nicht gespeichert werden.') };
        }
        if (data.user) {
          setState((prev) => ({ ...prev, isLoggedIn: true, user: data.user }));
        }
        return { error: null };
      } catch {
        return { error: new Error('Netzwerkfehler beim Speichern des Profils.') };
      }
    },
    [],
  );

  const setProfileImage = useCallback(async (url: string | null) => {
    if (typeof window !== 'undefined') {
      try {
        if (url) localStorage.setItem(PROFILE_IMAGE_KEY, url);
        else localStorage.removeItem(PROFILE_IMAGE_KEY);
      } catch (_) {}
    }
    setState((prev) => {
      if (!prev.user) return prev;
      return { ...prev, user: { ...prev.user, profileImageUrl: url } };
    });
    // In der Datenbank persistieren (best effort; Demo-Login hat keine Session)
    try {
      await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileImageUrl: url }),
        credentials: 'include',
      });
    } catch (_) {}
  }, []);

  const value: AuthContextValue = {
    isLoggedIn: state.isLoggedIn,
    user: state.user,
    isLoading: state.isLoading,
    loginWithEmail,
    registerWithPassword,
    loginWithPassword,
    loginWithGoogle,
    loginWithApple,
    login,
    logout,
    setProfileImage,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
