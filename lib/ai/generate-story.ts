"use server";

import { buildStoryPrompt, type MomentTheme } from "@/lib/themes/moment-themes";

export type GenerateStoryInput = {
  storyId: string;
  theme: Pick<MomentTheme, "slug" | "title" | "storyPrompt">;
  childName: string;
  childAge: number;
  gender?: string;
  interests?: string;
  parentMessage?: string;
  photoUrls: string[];
};

export type GenerateStoryResult = {
  success: boolean;
  error?: string;
  pageCount?: number;
};

/**
 * Generates an 8–12 page illustrated story via AI.
 * Wire your provider (OpenAI, etc.) here when ready.
 */
export async function generateStoryWithAI(
  input: GenerateStoryInput,
): Promise<GenerateStoryResult> {
  const prompt = buildStoryPrompt(
    {
      id: input.theme.slug,
      slug: input.theme.slug,
      title: input.theme.title,
      description: "",
      color: "",
      iconKey: "sparkles",
      emoji: "✨",
      image: "",
      accentClass: "",
      storyPrompt: input.theme.storyPrompt,
      albumPrompt: "",
    },
    {
      childName: input.childName,
      childAge: input.childAge,
      gender: input.gender,
      interests: input.interests,
      parentMessage: input.parentMessage,
    },
  );

  // TODO: Replace with real AI provider call
  console.info("[generateStoryWithAI]", {
    storyId: input.storyId,
    theme: input.theme.slug,
    photoCount: input.photoUrls.length,
    promptPreview: prompt.slice(0, 200),
  });

  return { success: true, pageCount: 10 };
}
