export type Theme = "light" | "dark" | "system";

export interface UserProfileRow {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface Book {
  id: string;
  userId: string;
  title: string;
  childName: string;
  theme: Theme;
  coverImageUrl?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface Album {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  coverImageUrl?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface AlbumPhoto {
  id: string;
  albumId: string;
  imageUrl: string;
  caption?: string | null;
  takenAt?: string | null;
  createdAt: string;
}

export interface ThemeRow {
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
}

export interface StoryBookRow {
  id: string;
  user_id: string;
  child_name: string;
  child_age: number;
  theme_id: string;
  photo_url: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AlbumRow {
  id: string;
  user_id: string;
  title: string;
  album_type: string;
  theme_id: string;
  layout_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AlbumPhotoRow {
  id: string;
  album_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

type SupabaseTable<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
};

export interface Database {
  public: {
    Tables: {
      user_profiles: SupabaseTable<
        UserProfileRow,
        Omit<UserProfileRow, "id" | "created_at" | "updated_at"> & { id?: string },
        Partial<Omit<UserProfileRow, "id" | "created_at">>
      >;
      books: SupabaseTable<
        Book,
        Omit<Book, "id" | "createdAt" | "updatedAt"> & { id?: string },
        Partial<Omit<Book, "id" | "createdAt">>
      >;
      album_photos: SupabaseTable<
        AlbumPhotoRow,
        Omit<AlbumPhotoRow, "id" | "created_at"> & { id?: string },
        Partial<Omit<AlbumPhotoRow, "id" | "created_at">>
      >;
      themes: SupabaseTable<
        ThemeRow,
        Omit<ThemeRow, "id" | "created_at"> & { id?: string },
        Partial<Omit<ThemeRow, "id" | "created_at">>
      >;
      story_books: SupabaseTable<
        StoryBookRow,
        Omit<StoryBookRow, "id" | "created_at" | "updated_at"> & { id?: string },
        Partial<Omit<StoryBookRow, "id" | "created_at">>
      >;
      albums: SupabaseTable<
        AlbumRow,
        Omit<AlbumRow, "id" | "created_at" | "updated_at"> & { id?: string },
        Partial<Omit<AlbumRow, "id" | "created_at">>
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
