"use server";

import { revalidatePath } from "next/cache";

import { ensureUserProfile } from "@/lib/supabase/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function finalizeAuthSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { ok: false as const, error: "Sessão não encontrada. Tente entrar novamente." };
  }

  try {
    await ensureUserProfile(supabase, user);
  } catch {
    // Profile creation should not block auth.
  }

  revalidatePath("/", "layout");
  revalidatePath("/create/story");
  revalidatePath("/criar");

  return { ok: true as const };
}
