"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { uploadUserFile } from "@/lib/supabase/storage";

export type CreateStoryState = {
  success: boolean;
  error?: string;
  storyId?: string;
};

export async function createStoryAction(
  _prevState: CreateStoryState,
  formData: FormData,
): Promise<CreateStoryState> {
  const childName = String(formData.get("childName") ?? "").trim();
  const childAge = Number(formData.get("childAge"));
  const themeId = String(formData.get("themeId") ?? "").trim();
  const photoUrlFromClient = String(formData.get("photoUrl") ?? "").trim();
  const photoFile = formData.get("photo");

  if (!childName) {
    return { success: false, error: "Child name is required." };
  }

  if (!Number.isFinite(childAge) || childAge < 1 || childAge > 12) {
    return { success: false, error: "Please select a valid age (1–12)." };
  }

  if (!themeId) {
    return { success: false, error: "Please select a theme." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in to create a story." };
  }

  let photoUrl = photoUrlFromClient;

  if (!photoUrl && photoFile instanceof File && photoFile.size > 0) {
    try {
      const uploaded = await uploadUserFile(
        supabase,
        "story-photos",
        user.id,
        photoFile,
        "story",
      );
      photoUrl = uploaded.url;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to upload photo.",
      };
    }
  }

  if (!photoUrl) {
    return { success: false, error: "Please upload a photo of the child." };
  }

  const { data, error } = await supabase
    .from("story_books")
    .insert({
      user_id: user.id,
      child_name: childName,
      child_age: childAge,
      theme_id: themeId,
      photo_url: photoUrl,
      status: "processing",
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/create/story");

  return { success: true, storyId: data.id };
}
