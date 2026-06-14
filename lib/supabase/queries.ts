import { createClient } from "@supabase/supabase-js";
import { DbTheme, ThemeKind } from "@/types/themes";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get all active themes of a specific kind (story or album)
 */
export async function getThemes(kind?: ThemeKind): Promise<DbTheme[]> {
  let query = supabase.from("themes").select("*").eq("is_active", true);

  if (kind) {
    query = query.eq("kind", kind);
  }

  query = query.order("sort_order", { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching themes:", error);
    throw error;
  }

  return (data || []).map((theme: any) => ({
    id: theme.id,
    slug: theme.slug,
    kind: theme.kind,
    title: theme.title,
    description: theme.description,
    imageUrl: theme.image_url,
    metadata: theme.metadata,
    sortOrder: theme.sort_order,
    isActive: theme.is_active,
    createdAt: theme.created_at,
  }));
}

/**
 * Get a single theme by slug
 */
export async function getThemeBySlug(slug: string): Promise<DbTheme | null> {
  const { data, error } = await supabase
    .from("themes")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    console.error("Error fetching theme:", error);
    throw error;
  }

  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    kind: data.kind,
    title: data.title,
    description: data.description,
    imageUrl: data.image_url,
    metadata: data.metadata,
    sortOrder: data.sort_order,
    isActive: data.is_active,
    createdAt: data.created_at,
  };
}

/**
 * Create a new story book
 */
export async function createBook(
  userId: string,
  data: {
    themeId: string;
    title: string;
    description?: string;
    coverImageUrl?: string;
    storyType?: "linear" | "interactive" | "timeline";
  }
) {
  const { data: book, error } = await supabase
    .from("books")
    .insert({
      user_id: userId,
      theme_id: data.themeId,
      title: data.title,
      description: data.description || null,
      cover_image_url: data.coverImageUrl || null,
      story_type: data.storyType || "linear",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating book:", error);
    throw error;
  }

  return {
    id: book.id,
    userId: book.user_id,
    themeId: book.theme_id,
    title: book.title,
    description: book.description,
    coverImageUrl: book.cover_image_url,
    isPublished: book.is_published,
    storyType: book.story_type,
    createdAt: book.created_at,
    updatedAt: book.updated_at,
  };
}

/**
 * Create a new photo album
 */
export async function createAlbum(
  userId: string,
  data: {
    themeId: string;
    title: string;
    description?: string;
    coverPhotoUrl?: string;
    isPublic?: boolean;
  }
) {
  const { data: album, error } = await supabase
    .from("albums")
    .insert({
      user_id: userId,
      theme_id: data.themeId,
      title: data.title,
      description: data.description || null,
      cover_photo_url: data.coverPhotoUrl || null,
      is_public: data.isPublic || false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating album:", error);
    throw error;
  }

  return {
    id: album.id,
    userId: album.user_id,
    themeId: album.theme_id,
    title: album.title,
    description: album.description,
    coverPhotoUrl: album.cover_photo_url,
    isPublic: album.is_public,
    createdAt: album.created_at,
    updatedAt: album.updated_at,
  };
}

/**
 * Upload a photo to an album
 */
export async function uploadPhoto(
  albumId: string,
  data: {
    photoUrl: string;
    caption?: string;
    sortOrder?: number;
  }
) {
  const { data: photo, error } = await supabase
    .from("album_photos")
    .insert({
      album_id: albumId,
      photo_url: data.photoUrl,
      caption: data.caption || null,
      sort_order: data.sortOrder || 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }

  return {
    id: photo.id,
    albumId: photo.album_id,
    photoUrl: photo.photo_url,
    caption: photo.caption,
    sortOrder: photo.sort_order,
    createdAt: photo.created_at,
  };
}

/**
 * Get all books for a user
 */
export async function getUserBooks(userId: string) {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user books:", error);
    throw error;
  }

  return data || [];
}

/**
 * Get all albums for a user
 */
export async function getUserAlbums(userId: string) {
  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user albums:", error);
    throw error;
  }

  return data || [];
}

/**
 * Get all photos in an album
 */
export async function getAlbumPhotos(albumId: string) {
  const { data, error } = await supabase
    .from("album_photos")
    .select("*")
    .eq("album_id", albumId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching album photos:", error);
    throw error;
  }

  return data || [];
}
