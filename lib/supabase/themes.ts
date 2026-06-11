import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  FALLBACK_ALBUM_THEMES,
  FALLBACK_STORY_THEMES,
} from "@/lib/themes/fallback";
import type {
  AlbumThemeDisplay,
  AlbumThemeMetadata,
  DbTheme,
  StoryThemeDisplay,
  StoryThemeMetadata,
  ThemeKind,
} from "@/types/themes";

type ThemeRow = {
  id: string;
  slug: string;
  kind: string;
  title: string;
  description: string;
  image_url: string | null;
  metadata: Record<string, unknown>;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

function mapRow(row: ThemeRow): DbTheme {
  return {
    id: row.id,
    slug: row.slug,
    kind: row.kind as ThemeKind,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    metadata: row.metadata as DbTheme["metadata"],
    sortOrder: row.sort_order,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

export function mapStoryTheme(theme: DbTheme): StoryThemeDisplay {
  const meta = theme.metadata as StoryThemeMetadata;
  return {
    id: theme.id,
    slug: theme.slug,
    title: theme.title,
    description: theme.description,
    color: meta.color ?? "from-primary/80 to-primary",
    iconKey: meta.iconKey ?? "sparkles",
    emoji: meta.emoji ?? "✨",
    image: theme.imageUrl ?? "/images/princess-carnival.jpg",
  };
}

export function mapAlbumTheme(theme: DbTheme): AlbumThemeDisplay {
  const meta = theme.metadata as AlbumThemeMetadata;
  return {
    id: theme.id,
    slug: theme.slug,
    name: theme.title,
    description: theme.description,
    colors: meta.colors ?? FALLBACK_ALBUM_THEMES[0].colors,
    pattern: meta.pattern ?? "minimal",
  };
}

export async function fetchThemesByKind(kind: ThemeKind): Promise<DbTheme[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("themes")
      .select("*")
      .eq("kind", kind)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data?.length) {
      return [];
    }

    return (data as ThemeRow[]).map(mapRow);
  } catch {
    return [];
  }
}

export async function getStoryThemes(): Promise<StoryThemeDisplay[]> {
  const rows = await fetchThemesByKind("story");
  if (!rows.length) {
    return FALLBACK_STORY_THEMES;
  }
  return rows.map(mapStoryTheme);
}

export async function getAlbumThemes(): Promise<AlbumThemeDisplay[]> {
  const rows = await fetchThemesByKind("album");
  if (!rows.length) {
    return FALLBACK_ALBUM_THEMES;
  }
  return rows.map(mapAlbumTheme);
}

export async function getStoryThemeById(
  themeId: string,
): Promise<StoryThemeDisplay | undefined> {
  const themes = await getStoryThemes();
  return themes.find((theme) => theme.id === themeId || theme.slug === themeId);
}

export async function getAlbumThemeById(
  themeId: string,
): Promise<AlbumThemeDisplay | undefined> {
  const themes = await getAlbumThemes();
  return themes.find((theme) => theme.id === themeId || theme.slug === themeId);
}
