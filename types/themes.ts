export type ThemeKind = "story" | "album";

export type AlbumPattern =
  | "minimal"
  | "boho"
  | "carnival"
  | "nature"
  | "enchanted"
  | "classic";

export interface StoryThemeMetadata {
  color: string;
  iconKey: string;
  emoji: string;
}

export interface AlbumThemeMetadata {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
  pattern: AlbumPattern;
}

export interface DbTheme {
  id: string;
  slug: string;
  kind: ThemeKind;
  title: string;
  description: string;
  imageUrl: string | null;
  metadata: StoryThemeMetadata | AlbumThemeMetadata;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface StoryThemeDisplay {
  id: string;
  slug: string;
  title: string;
  description: string;
  color: string;
  iconKey: string;
  emoji: string;
  image: string;
}

export interface AlbumThemeDisplay {
  id: string;
  slug: string;
  name: string;
  description: string;
  colors: AlbumThemeMetadata["colors"];
  pattern: AlbumPattern;
}
