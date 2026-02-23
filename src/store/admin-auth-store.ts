"use client";

import { create } from "zustand";

interface AdminAuthState {
  accessToken: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (token: string, email: string) => void;
  clearSession: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  accessToken: null,
  userEmail: null,
  isAuthenticated: false,
  isLoading: true,

  setSession: (token, email) =>
    set({
      accessToken: token,
      userEmail: email,
      isAuthenticated: true,
      isLoading: false,
    }),

  clearSession: () =>
    set({
      accessToken: null,
      userEmail: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  setLoading: (loading) => set({ isLoading: loading }),
}));
