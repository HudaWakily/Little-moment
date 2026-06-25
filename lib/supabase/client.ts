import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/types";

export function createSupabaseBrowserClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
