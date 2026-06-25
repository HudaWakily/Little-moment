"use server";

import { revalidatePath } from "next/cache";

import { generateStoryWithAI } from "@/lib/ai/generate-story";
import { MOMENT_THEMES } from "@/lib/themes/moment-themes";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { uploadUserFile } from "@/lib/supabase/storage";

export type CreateStoryState = {
  success: boolean;
  error?: string;
  storyId?: string;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const DB_SLUG_MAP: Record<string, string> = {
  carnaval: "princesa-carnaval",
  futebol: "heroi-futebol",
  amazonia: "explorador-amazonia",
  natal: "natal-magico",
  "festa-junina": "festa-junina",
  "saci-perere": "saci-perere",
};

async function resolveThemeId(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  themeId: string,
  themeSlug: string,
): Promise<string | null> {
  if (UUID_REGEX.test(themeId)) {
    return themeId;
  }

  const slugCandidates = [
    themeSlug,
    themeId,
    DB_SLUG_MAP[themeSlug],
    DB_SLUG_MAP[themeId],
  ].filter(Boolean);

  for (const slug of slugCandidates) {
    const { data } = await supabase
      .from("themes")
      .select("id")
      .eq("slug", slug)
      .eq("kind", "story")
      .maybeSingle();

    if (data && typeof (data as { id?: string }).id === "string") {
      return (data as { id: string }).id;
    }
  }

  return null;
}

function collectPhotoUrls(formData: FormData): string[] {
  const urls: string[] = [];

  for (let i = 0; i < 3; i++) {
    const url = String(formData.get(`photoUrl_${i}`) ?? "").trim();
    if (url) urls.push(url);
  }

  const primary = String(formData.get("photoUrl") ?? "").trim();
  if (primary && !urls.includes(primary)) {
    urls.unshift(primary);
  }

  return urls;
}

export async function createStoryAction(
  _prevState: CreateStoryState,
  formData: FormData,
): Promise<CreateStoryState> {
  const childName = String(formData.get("childName") ?? "").trim();
  const childAge = Number(formData.get("childAge"));
  const childGender = String(formData.get("childGender") ?? "").trim();
  const interests = String(formData.get("interests") ?? "").trim();
  const parentMessage = String(formData.get("parentMessage") ?? "").trim();
  const themeId = String(formData.get("themeId") ?? "").trim();
  const themeSlug = String(formData.get("themeSlug") ?? "").trim();

  if (!childName) {
    return { success: false, error: "Informe o nome da criança." };
  }

  if (!Number.isFinite(childAge) || childAge < 1 || childAge > 12) {
    return { success: false, error: "Selecione uma idade válida (1–12)." };
  }

  if (!themeId) {
    return { success: false, error: "Selecione um tema." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Faça login para criar seu Momentinho." };
  }

  let photoUrls = collectPhotoUrls(formData);

  if (!photoUrls.length) {
    const photoFile = formData.get("photo");
    if (photoFile instanceof File && photoFile.size > 0) {
      try {
        const uploaded = await uploadUserFile(
          supabase,
          "story-photos",
          user.id,
          photoFile,
          "story",
        );
        photoUrls = [uploaded.url];
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Falha ao enviar foto.",
        };
      }
    }
  }

  for (let i = 0; i < 3; i++) {
    const file = formData.get(`photo_${i}`);
    if (!(file instanceof File) || file.size === 0) continue;

    const existingUrl = String(formData.get(`photoUrl_${i}`) ?? "").trim();
    if (existingUrl) continue;

    try {
      const uploaded = await uploadUserFile(
        supabase,
        "story-photos",
        user.id,
        file,
        "story",
      );
      if (i < photoUrls.length) {
        photoUrls[i] = uploaded.url;
      } else {
        photoUrls.push(uploaded.url);
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Falha ao enviar foto.",
      };
    }
  }

  if (!photoUrls.length) {
    return { success: false, error: "Envie pelo menos uma foto da criança." };
  }

  const resolvedThemeId = await resolveThemeId(supabase, themeId, themeSlug);

  if (!resolvedThemeId) {
    return {
      success: false,
      error: "Tema não encontrado. Tente selecionar novamente.",
    };
  }

  const momentTheme =
    MOMENT_THEMES.find(
      (t) => t.id === themeId || t.slug === themeSlug || t.slug === themeId,
    ) ?? MOMENT_THEMES[0];

  const { data, error } = await supabase
    .from("story_books")
    .insert({
      user_id: user.id,
      child_name: childName,
      child_age: childAge,
      theme_id: resolvedThemeId,
      photo_url: photoUrls[0],
      status: "processing",
    } as never)
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  const storyId = (data as { id: string }).id;

  const aiResult = await generateStoryWithAI({
    storyId,
    theme: {
      slug: momentTheme.slug,
      title: momentTheme.title,
      storyPrompt: momentTheme.storyPrompt,
    },
    childName,
    childAge,
    gender: childGender,
    interests,
    parentMessage,
    photoUrls,
  });

  if (!aiResult.success) {
    await supabase
      .from("story_books")
      .update({ status: "failed" } as never)
      .eq("id", storyId);

    return {
      success: false,
      error: aiResult.error ?? "Não foi possível gerar a história.",
    };
  }

  revalidatePath("/criar");
  revalidatePath("/create/story");

  return { success: true, storyId };
}
