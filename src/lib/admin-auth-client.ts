"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { useAdminAuthStore } from "@/store/admin-auth-store";

export function useAdminAuth() {
  const router = useRouter();
  const { isAuthenticated, isLoading, accessToken, userEmail, setSession, clearSession } =
    useAdminAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token && session.user.email) {
        setSession(session.access_token, session.user.email);
      } else {
        clearSession();
        router.replace("/admin/login");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token && session.user.email) {
        setSession(session.access_token, session.user.email);
      } else {
        clearSession();
        router.replace("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, setSession, clearSession]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    clearSession();
    router.replace("/admin/login");
  }, [clearSession, router]);

  return { isAuthenticated, isLoading, accessToken, userEmail, logout };
}

export function useAdminFetch() {
  const { accessToken } = useAdminAuthStore();

  const adminFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers);
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return fetch(url, { ...options, headers });
    },
    [accessToken]
  );

  return { adminFetch };
}
