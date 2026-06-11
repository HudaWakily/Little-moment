import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function uploadUserFile(
  supabase: SupabaseClient<Database>,
  bucket: string,
  userId: string,
  file: File,
  folder: string,
): Promise<{ url: string; path: string }> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image must be 10MB or smaller.");
  }

  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return { url: data.publicUrl, path };
}
