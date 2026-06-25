"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { mapUserProfileRow } from "@/lib/supabase/profile";
import type { UserProfile, UserProfileRow } from "@/types";

export type UseUserResult = {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  reloadUser: () => Promise<void>;
};

export function useUser(): UseUserResult {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        return;
      }

      const { data: userProfile, error: profileError } = await supabase
        .from("user_profiles")
        .select("id, full_name, email, avatar_url, created_at, updated_at")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (userProfile) {
        setProfile(mapUserProfileRow(userProfile as UserProfileRow));
      } else {
        setProfile(null);
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Erro ao carregar dados de autenticação.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await loadUser();
        } else {
          setProfile(null);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [loadUser, supabase]);

  const signOut = useCallback(async () => {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      throw signOutError;
    }
    setUser(null);
    setProfile(null);
  }, [supabase]);

  const requestPasswordReset = useCallback(
    async (email: string) => {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      );

      if (resetError) {
        throw resetError;
      }
    },
    [supabase],
  );

  return {
    user,
    profile,
    isLoading,
    error,
    signOut,
    requestPasswordReset,
    reloadUser: loadUser,
  };
}
