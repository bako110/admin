import { create } from 'zustand';

import type { UserPublic } from '../shared/api/types';

interface AuthState {
  accessToken: string | null;
  user: UserPublic | null;
  isAuthenticated: boolean;
  setSession: (accessToken: string, user: UserPublic) => void;
  clearSession: () => void;
}

const TOKEN_KEY = 'gotours-admin:token';
const USER_KEY = 'gotours-admin:user';

function readStoredUser(): UserPublic | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserPublic;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem(TOKEN_KEY),
  user: readStoredUser(),
  isAuthenticated: Boolean(localStorage.getItem(TOKEN_KEY)),
  setSession: (accessToken, user) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ accessToken, user, isAuthenticated: true });
  },
  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ accessToken: null, user: null, isAuthenticated: false });
  },
}));
