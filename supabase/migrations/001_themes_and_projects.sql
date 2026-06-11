-- Themes catalog (story books + photo albums)
create table if not exists public.themes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  kind text not null check (kind in ('story', 'album')),
  title text not null,
  description text not null default '',
  image_url text,
  metadata jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists themes_kind_active_idx on public.themes (kind, is_active, sort_order);

alter table public.themes enable row level security;

create policy "Themes are readable by everyone"
  on public.themes for select
  using (is_active = true);

-- Story projects
create table if not exists public.story_books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  child_name text not null,
  child_age int not null,
  theme_id uuid not null references public.themes (id),
  photo_url text not null,
  status text not null default 'draft' check (status in ('draft', 'processing', 'ready', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.story_books enable row level security;

create policy "Users manage own story books"
  on public.story_books for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Albums (extend if albums table exists from prior setup)
create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  album_type text not null,
  theme_id uuid not null references public.themes (id),
  layout_id text not null default 'duo',
  status text not null default 'draft' check (status in ('draft', 'processing', 'ready', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.albums enable row level security;

create policy "Users manage own albums"
  on public.albums for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.album_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums (id) on delete cascade,
  image_url text not null,
  caption text default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.album_photos enable row level security;

create policy "Users manage photos on own albums"
  on public.album_photos for all
  using (
    exists (
      select 1 from public.albums a
      where a.id = album_id and a.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.albums a
      where a.id = album_id and a.user_id = auth.uid()
    )
  );

-- Storage buckets (run in Supabase dashboard if SQL storage API unavailable)
-- insert into storage.buckets (id, name, public) values ('story-photos', 'story-photos', true);
-- insert into storage.buckets (id, name, public) values ('album-photos', 'album-photos', true);
