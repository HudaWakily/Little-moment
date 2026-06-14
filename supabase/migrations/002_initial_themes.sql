-- Initial Themes Data for Little Moment
-- 8-10 themes with mix of Story and Album themes

-- STORY THEMES (5 themes)
INSERT INTO themes (slug, kind, title, description, metadata, sort_order, is_active) VALUES
(
  'adventure-story',
  'story',
  'Adventure',
  'Epic quests and thrilling journeys',
  '{"color": "#FF6B35", "iconKey": "adventure", "emoji": "🗺️"}'::jsonb,
  1,
  true
),
(
  'mystery-story',
  'story',
  'Mystery',
  'Secrets, puzzles, and hidden truths',
  '{"color": "#5B4E8C", "iconKey": "mystery", "emoji": "🔍"}'::jsonb,
  2,
  true
),
(
  'love-story',
  'story',
  'Romance',
  'Tales of love and connection',
  '{"color": "#E91E63", "iconKey": "heart", "emoji": "💕"}'::jsonb,
  3,
  true
),
(
  'fantasy-story',
  'story',
  'Fantasy',
  'Magical worlds and enchanted adventures',
  '{"color": "#9C27B0", "iconKey": "magic", "emoji": "✨"}'::jsonb,
  4,
  true
),
(
  'journal-story',
  'story',
  'Journal',
  'Personal memories and reflections',
  '{"color": "#8D6E63", "iconKey": "journal", "emoji": "📔"}'::jsonb,
  5,
  true
);

-- ALBUM THEMES (5 themes)
INSERT INTO themes (slug, kind, title, description, metadata, sort_order, is_active) VALUES
(
  'minimal-album',
  'album',
  'Minimal',
  'Clean and elegant aesthetic',
  '{"colors": {"primary": "#FFFFFF", "secondary": "#F5F5F5", "accent": "#000000", "text": "#333333"}, "pattern": "minimal"}'::jsonb,
  6,
  true
),
(
  'boho-album',
  'album',
  'Boho Chic',
  'Warm, earthy, and free-spirited',
  '{"colors": {"primary": "#D4A574", "secondary": "#E8DCC8", "accent": "#8B7355", "text": "#3E2723"}, "pattern": "boho"}'::jsonb,
  7,
  true
),
(
  'carnival-album',
  'album',
  'Carnival',
  'Vibrant and playful celebration',
  '{"colors": {"primary": "#FF6B9D", "secondary": "#FFC745", "accent": "#00D9FF", "text": "#FFFFFF"}, "pattern": "carnival"}'::jsonb,
  8,
  true
),
(
  'nature-album',
  'album',
  'Nature',
  'Organic and green aesthetic',
  '{"colors": {"primary": "#2D5016", "secondary": "#90BE6D", "accent": "#9DC183", "text": "#FFFFFF"}, "pattern": "nature"}'::jsonb,
  9,
  true
),
(
  'enchanted-album',
  'album',
  'Enchanted',
  'Magical and dreamlike atmosphere',
  '{"colors": {"primary": "#6A4C93", "secondary": "#C77DFF", "accent": "#E0AAFF", "text": "#FFFFFF"}, "pattern": "enchanted"}'::jsonb,
  10,
  true
);

-- Optional: View to easily see all themes organized by kind
CREATE OR REPLACE VIEW themes_by_kind AS
SELECT 
  kind,
  COUNT(*) as theme_count,
  array_agg(title ORDER BY sort_order) as titles
FROM themes
WHERE is_active = true
GROUP BY kind;
