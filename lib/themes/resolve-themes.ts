import { MOMENT_THEMES, type MomentTheme } from "@/lib/themes/moment-themes";
import type { StoryThemeDisplay } from "@/types/themes";

const DB_SLUG_MAP: Record<string, string> = {
  carnaval: "princesa-carnaval",
  futebol: "heroi-futebol",
  amazonia: "explorador-amazonia",
  natal: "natal-magico",
  "festa-junina": "festa-junina",
  "saci-perere": "saci-perere",
};

export function mergeMomentThemesWithDb(
  dbThemes: StoryThemeDisplay[],
): MomentTheme[] {
  return MOMENT_THEMES.map((momentTheme) => {
    const dbSlug = DB_SLUG_MAP[momentTheme.slug] ?? momentTheme.slug;
    const dbTheme = dbThemes.find((t) => t.slug === dbSlug);

    if (!dbTheme) {
      return momentTheme;
    }

    return {
      ...momentTheme,
      id: dbTheme.id,
      title: momentTheme.title,
      description: momentTheme.description,
      image: dbTheme.image || momentTheme.image,
    };
  });
}

export function getMomentThemeById(
  themes: MomentTheme[],
  themeId: string,
): MomentTheme | undefined {
  return themes.find((t) => t.id === themeId || t.slug === themeId);
}
