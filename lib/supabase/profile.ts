import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { Database, UserProfile, UserProfileRow } from "@/types";

function getFullNameFromUser(user: User) {
  if (typeof user.user_metadata === "object" && user.user_metadata !== null) {
    if (typeof (user.user_metadata as { full_name?: unknown }).full_name === "string") {
      return (user.user_metadata as { full_name?: string }).full_name;
    }
  }

  if (user.email) {
    return user.email.split("@")[0];
  }

  return "Usuário";
}

function getAvatarUrlFromUser(user: User) {
  if (typeof user.user_metadata === "object" && user.user_metadata !== null) {
    if (typeof (user.user_metadata as { avatar_url?: unknown }).avatar_url === "string") {
      return (user.user_metadata as { avatar_url: string }).avatar_url;
    }
  }

  return null;
}

export function mapUserProfileRow(row: UserProfileRow): UserProfile {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    avatarUrl: row.avatar_url ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? null,
  };
}

export async function getUserProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, full_name, email, avatar_url, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapUserProfileRow(data as UserProfileRow);
}

export async function ensureUserProfile(
  supabase: SupabaseClient<Database>,
  user: User,
): Promise<UserProfile | null> {
  if (!user.id || !user.email) {
    return null;
  }

  const existingProfile = await getUserProfile(supabase, user.id);
  if (existingProfile) {
    return existingProfile;
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .insert({
      id: user.id,
      email: user.email,
      full_name: getFullNameFromUser(user),
      avatar_url: getAvatarUrlFromUser(user),
    } as never)
    .select("id, full_name, email, avatar_url, created_at, updated_at")
    .single();

  if (error) {
    throw error;
  }

  return data as UserProfile;
}
