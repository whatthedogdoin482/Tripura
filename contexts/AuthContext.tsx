'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'tripura-auth';
const PROFILE_IMAGE_KEY = 'tripura-profile-image';

export interface AuthUser {
  displayName: string;
  profileImageUrl: string | null;
}

interface AuthContextValue {
  isLoggedIn: boolean;
  user: AuthUser | null;
  login: (displayName?: string) => void;
  logout: () => void;
  setProfileImage: (url: string | null) => void;
}

const defaultUser: AuthUser = {
  displayName: 'John Doe',
  profileImageUrl: null,
};

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStoredAuth(): { isLoggedIn: boolean; user: AuthUser | null } {
  if (typeof window === 'undefined') return { isLoggedIn: false, user: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const imageUrl = localStorage.getItem(PROFILE_IMAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.isLoggedIn) {
        return {
          isLoggedIn: true,
          user: {
            displayName: data.displayName ?? defaultUser.displayName,
            profileImageUrl: imageUrl || null,
          },
        };
      }
    }
  } catch (_) {}
  return { isLoggedIn: false, user: null };
}

function imageUrlFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PROFILE_IMAGE_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ isLoggedIn: boolean; user: AuthUser | null }>(() => loadStoredAuth());

  useEffect(() => {
    const stored = loadStoredAuth();
    setState(stored);
  }, []);

  const login = useCallback((displayName?: string) => {
    const user: AuthUser = {
      displayName: displayName ?? defaultUser.displayName,
      profileImageUrl: imageUrlFromStorage(),
    };
    setState({ isLoggedIn: true, user });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isLoggedIn: true, displayName: user.displayName }));
    } catch (_) {}
  }, []);

  const logout = useCallback(() => {
    setState({ isLoggedIn: false, user: null });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  }, []);

  const setProfileImage = useCallback((url: string | null) => {
    try {
      if (url) localStorage.setItem(PROFILE_IMAGE_KEY, url);
      else localStorage.removeItem(PROFILE_IMAGE_KEY);
    } catch (_) {}
    setState((prev) => {
      if (!prev.user) return prev;
      return { ...prev, user: { ...prev.user, profileImageUrl: url } };
    });
  }, []);

  const value: AuthContextValue = {
    isLoggedIn: state.isLoggedIn,
    user: state.user,
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
