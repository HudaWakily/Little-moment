import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureUserProfile } from "@/lib/supabase/profile";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") ?? "/";
  const safeRedirect = redirectTo.startsWith("/") ? redirectTo : "/";

  if (!code) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", "auth_callback_failed");
    loginUrl.searchParams.set("redirectTo", safeRedirect);
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", "auth_callback_failed");
    loginUrl.searchParams.set("redirectTo", safeRedirect);
    return NextResponse.redirect(loginUrl);
  }

  if (data?.user) {
    try {
      await ensureUserProfile(supabase, data.user);
    } catch {
      // If profile creation fails, continue redirecting so auth flow isn't blocked.
    }
  }

  return NextResponse.redirect(`${origin}${safeRedirect}`);
}
