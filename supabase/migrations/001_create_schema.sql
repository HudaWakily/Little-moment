-- Little Moment - Supabase Database Schema
-- Create tables for stories (books) and photo albums with themes

-- 1. THEMES TABLE (shared for story and album)
CREATE TABLE IF NOT EXISTS themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('story', 'album')),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  metadata JSONB NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. BOOKS TABLE (Story Books)
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  story_type TEXT DEFAULT 'linear' CHECK (story_type IN ('linear', 'interactive', 'timeline')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ALBUMS TABLE (Photo Albums)
CREATE TABLE IF NOT EXISTS albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_photo_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ALBUM_PHOTOS TABLE (Photos with captions)
CREATE TABLE IF NOT EXISTS album_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_themes_kind ON themes(kind);
CREATE INDEX IF NOT EXISTS idx_themes_slug ON themes(slug);
CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
CREATE INDEX IF NOT EXISTS idx_books_theme_id ON books(theme_id);
CREATE INDEX IF NOT EXISTS idx_albums_user_id ON albums(user_id);
CREATE INDEX IF NOT EXISTS idx_albums_theme_id ON albums(theme_id);
CREATE INDEX IF NOT EXISTS idx_album_photos_album_id ON album_photos(album_id);

-- COMMENTS for documentation
COMMENT ON TABLE themes IS 'Shared themes for both story books and photo albums';
COMMENT ON TABLE books IS 'Story books created by users';
COMMENT ON TABLE albums IS 'Photo albums created by users';
COMMENT ON TABLE album_photos IS 'Individual photos within albums with captions';

-- ROW LEVEL SECURITY (RLS) Policies
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

-- Books: Users can only see their own books, but anyone can see published ones
CREATE POLICY "Users can view own books" ON books
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create books" ON books
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own books" ON books
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own books" ON books
  FOR DELETE USING (user_id = auth.uid());

-- Albums: Similar to books but with is_public flag
CREATE POLICY "Users can view own albums" ON albums
  FOR SELECT USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can create albums" ON albums
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own albums" ON albums
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own albums" ON albums
  FOR DELETE USING (user_id = auth.uid());

-- Album Photos: Can view if album is accessible
CREATE POLICY "Can view photos of accessible albums" ON album_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM albums
      WHERE albums.id = album_photos.album_id
      AND (albums.user_id = auth.uid() OR albums.is_public = true)
    )
  );

CREATE POLICY "Can add photos to own albums" ON album_photos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM albums
      WHERE albums.id = album_photos.album_id
      AND albums.user_id = auth.uid()
    )
  );

-- Themes: Everyone can view active themes
CREATE POLICY "Anyone can view active themes" ON themes
  FOR SELECT USING (is_active = true);
