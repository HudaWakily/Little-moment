"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { uploadUserFile } from "@/lib/supabase/storage";
import type { Database } from "@/types";

export type CreateAlbumState = {
  success: boolean;
  error?: string;
  albumId?: string;
};

type AlbumPhotoPayload = {
  url?: string;
  caption: string;
  sortOrder: number;
  fileIndex?: number;
};

export async function createAlbumAction(
  _prevState: CreateAlbumState,
  formData: FormData,
): Promise<CreateAlbumState> {
  const title = String(formData.get("albumTitle") ?? "").trim();
  const albumType = String(formData.get("albumType") ?? "").trim();
  const themeId = String(formData.get("themeId") ?? "").trim();
  const layoutId = String(formData.get("layoutId") ?? "duo").trim();
  const photosJson = String(formData.get("photos") ?? "[]");

  if (!title) {
    return { success: false, error: "Album title is required." };
  }

  if (!albumType) {
    return { success: false, error: "Please select an album type." };
  }

  if (!themeId) {
    return { success: false, error: "Please select a theme." };
  }

  let photosPayload: AlbumPhotoPayload[];

  try {
    photosPayload = JSON.parse(photosJson) as AlbumPhotoPayload[];
  } catch {
    return { success: false, error: "Invalid photo data." };
  }

  if (photosPayload.length < 8) {
    return { success: false, error: "Add at least 8 photos to create an album." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in to create an album." };
  }

  const uploadedPhotos: { image_url: string; caption: string; sort_order: number }[] =
    [];

  for (const photo of photosPayload) {
    let imageUrl = photo.url ?? "";

    if (!imageUrl && typeof photo.fileIndex === "number") {
      const file = formData.get(`photo_${photo.fileIndex}`);

      if (file instanceof File && file.size > 0) {
        try {
          const uploaded = await uploadUserFile(
            supabase,
            "album-photos",
            user.id,
            file,
            "album",
          );
          imageUrl = uploaded.url;
        } catch (error) {
          return {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to upload one or more photos.",
          };
        }
      }
    }

    if (!imageUrl) {
      return { success: false, error: "Each photo must be uploaded successfully." };
    }

    uploadedPhotos.push({
      image_url: imageUrl,
      caption: photo.caption,
      sort_order: photo.sortOrder,
    });
  }

  const { data: album, error: albumError } = await supabase
    .from("albums")
    .insert(({
      user_id: user.id,
      title,
      album_type: albumType,
      theme_id: themeId,
      layout_id: layoutId,
      status: "processing",
    }) as any)
    .select("id")
    .single();

  if (albumError || !album) {
    return { success: false, error: albumError?.message ?? "Failed to create album." };
  }

  const albumId = (album as any).id;

  const { error: photosError } = await supabase.from("album_photos").insert(
    (uploadedPhotos.map((photo) => ({
      album_id: albumId,
      image_url: photo.image_url,
      caption: photo.caption,
      sort_order: photo.sort_order,
    })) as any),
  );

  if (photosError) {
    return { success: false, error: photosError.message };
  }

  revalidatePath("/create/album");

  return { success: true, albumId: albumId };
}
