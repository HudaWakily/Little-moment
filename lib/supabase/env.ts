export function normalizeSupabaseUrl(url: string | undefined) {
  if (!url) return undefined;

  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

export function getSupabaseEnv() {
  const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return { supabaseUrl, supabaseAnonKey };
}
