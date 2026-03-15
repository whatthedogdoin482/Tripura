'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/supabase/types';

const STORAGE_KEY = 'tripura-auth';
const PROFILE_IMAGE_KEY = 'tripura-profile-image';

export interface AuthUser {
  id: string;
  displayName: string;
  email: string | null;
  profileImageUrl: string | null;
}

interface AuthContextValue {
  isLoggedIn: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  /** E-Mail-Link anfordern (Supabase Magic Link) */
  loginWithEmail: (email: string) => Promise<{ error: Error | null }>;
  /** Mit Google anmelden (Supabase OAuth) */
  loginWithGoogle: () => Promise<{ error: Error | null }>;
  /** Mit Apple anmelden (Supabase OAuth) */
  loginWithApple: () => Promise<{ error: Error | null }>;
  /** Demo-Login ohne Supabase (localStorage), wenn Supabase nicht konfiguriert ist */
  login: (displayName?: string) => void;
  logout: () => Promise<void>;
  setProfileImage: (url: string | null) => Promise<void>;
}

const defaultDisplayName = 'Nutzer';

function profileToAuthUser(p: Profile | null): AuthUser | null {
  if (!p) return null;
  return {
    id: p.id,
    displayName: p.display_name ?? defaultDisplayName,
    email: p.email ?? null,
    profileImageUrl: p.avatar_url ?? null,
  };
}

function hasSupabaseConfig(): boolean {
  return typeof window !== 'undefined' &&
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    isLoggedIn: boolean;
    user: AuthUser | null;
    isLoading: boolean;
  }>({ isLoggedIn: false, user: null, isLoading: true });

  const fetchProfile = useCallback(async (userId: string): Promise<AuthUser | null> => {
    if (!hasSupabaseConfig()) return null;
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('id, email, display_name, avatar_url, created_at, updated_at')
      .eq('id', userId)
      .single();
    return profileToAuthUser(data as Profile | null);
  }, []);

  const syncSession = useCallback(async () => {
    if (!hasSupabaseConfig()) {
      setState({ isLoggedIn: false, user: null, isLoading: false });
      return;
    }
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setState({ isLoggedIn: false, user: null, isLoading: false });
      return;
    }
    const user = await fetchProfile(session.user.id);
    setState({
      isLoggedIn: true,
      user: user ?? {
        id: session.user.id,
        displayName: session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? defaultDisplayName,
        email: session.user.email ?? null,
        profileImageUrl: session.user.user_metadata?.avatar_url ?? null,
      },
      isLoading: false,
    });
  }, [fetchProfile]);

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const imageUrl = localStorage.getItem(PROFILE_IMAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          if (data.isLoggedIn) {
            setState({
              isLoggedIn: true,
              user: {
                id: '',
                displayName: data.displayName ?? defaultDisplayName,
                email: null,
                profileImageUrl: imageUrl || null,
              },
              isLoading: false,
            });
            return;
          }
        }
      } catch (_) {}
      setState({ isLoggedIn: false, user: null, isLoading: false });
      return;
    }

    syncSession();

    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id).then((user) => {
          setState({
            isLoggedIn: true,
            user: user ?? {
              id: session.user.id,
              displayName: session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? defaultDisplayName,
              email: session.user.email ?? null,
              profileImageUrl: session.user.user_metadata?.avatar_url ?? null,
            },
            isLoading: false,
          });
        });
      } else {
        setState({ isLoggedIn: false, user: null, isLoading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, [syncSession, fetchProfile]);

  const loginWithEmail = useCallback(async (email: string): Promise<{ error: Error | null }> => {
    if (!hasSupabaseConfig()) {
      login(email.split('@')[0]);
      return { error: null };
    }
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined },
    });
    return { error: error ?? null };
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<{ error: Error | null }> => {
    if (!hasSupabaseConfig()) {
      login();
      return { error: null };
    }
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined },
    });
    return { error: error ?? null };
  }, []);

  const loginWithApple = useCallback(async (): Promise<{ error: Error | null }> => {
    if (!hasSupabaseConfig()) {
      login();
      return { error: null };
    }
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined },
    });
    return { error: error ?? null };
  }, []);

  const login = useCallback((displayName?: string) => {
    if (hasSupabaseConfig()) return;
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
    if (hasSupabaseConfig()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setState({ isLoggedIn: false, user: null, isLoading: false });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  }, []);

  const setProfileImage = useCallback(async (url: string | null) => {
    const uid = state.user?.id;
    if (hasSupabaseConfig() && uid) {
      const supabase = createClient();
      await supabase.from('profiles').update({ avatar_url: url, updated_at: new Date().toISOString() }).eq('id', uid);
    } else if (typeof window !== 'undefined') {
      try {
        if (url) localStorage.setItem(PROFILE_IMAGE_KEY, url);
        else localStorage.removeItem(PROFILE_IMAGE_KEY);
      } catch (_) {}
    }
    setState((prev) => {
      if (!prev.user) return prev;
      return { ...prev, user: { ...prev.user, profileImageUrl: url } };
    });
  }, [state.user?.id]);

  const value: AuthContextValue = {
    isLoggedIn: state.isLoggedIn,
    user: state.user,
    isLoading: state.isLoading,
    loginWithEmail,
    loginWithGoogle,
    loginWithApple,
    login,
    logout,
    setProfileImage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
