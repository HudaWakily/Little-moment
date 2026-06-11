"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { uploadUserFile } from "@/lib/supabase/storage";

export type UploadResult =
  | { success: true; url: string; path: string }
  | { success: false; error: string };

async function getAuthenticatedUserId() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase, userId: null as string | null };
  }

  return { supabase, userId: user.id };
}

export async function uploadStoryPhotoAction(
  formData: FormData,
): Promise<UploadResult> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "No photo was provided." };
  }

  const { supabase, userId } = await getAuthenticatedUserId();

  if (!userId) {
    return { success: false, error: "You must be signed in to upload photos." };
  }

  try {
    const { url, path } = await uploadUserFile(
      supabase,
      "story-photos",
      userId,
      file,
      "story",
    );
    return { success: true, url, path };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed.",
    };
  }
}

export async function uploadAlbumPhotoAction(
  formData: FormData,
): Promise<UploadResult> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "No photo was provided." };
  }

  const { supabase, userId } = await getAuthenticatedUserId();

  if (!userId) {
    return { success: false, error: "You must be signed in to upload photos." };
  }

  try {
    const { url, path } = await uploadUserFile(
      supabase,
      "album-photos",
      userId,
      file,
      "album",
    );
    return { success: true, url, path };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed.",
    };
  }
}
