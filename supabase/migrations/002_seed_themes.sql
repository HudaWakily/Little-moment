insert into public.themes (slug, kind, title, description, image_url, metadata, sort_order)
values
  ('princesa-carnaval', 'story', 'Princesa do Carnaval', 'Uma aventura mágica pelos desfiles mais coloridos do Brasil', '/images/princess-carnival.jpg', '{"color":"from-pink-400 to-pink-600","iconKey":"crown","emoji":"👑"}', 1),
  ('heroi-futebol', 'story', 'Herói do Futebol', 'Conquiste a Copa dos Sonhos com muita garra e talento', '/images/soccer-hero.jpg', '{"color":"from-green-500 to-green-700","iconKey":"flame","emoji":"⚽"}', 2),
  ('iara-sereia', 'story', 'Iara Sereia', 'Explore os rios encantados da floresta amazônica', '/images/iara-mermaid.jpg', '{"color":"from-cyan-400 to-teal-600","iconKey":"waves","emoji":"🧜‍♀️"}', 3),
  ('saci-perere', 'story', 'Saci-Pererê', 'Travessuras e aventuras pelo folclore brasileiro', '/images/saci-perere.jpg', '{"color":"from-red-500 to-red-700","iconKey":"sparkles","emoji":"🔥"}', 4),
  ('explorador-amazonia', 'story', 'Explorador da Amazônia', 'Descubra os segredos da maior floresta do mundo', '/images/amazon-explorer.jpg', '{"color":"from-emerald-500 to-green-700","iconKey":"tree","emoji":"🌿"}', 5),
  ('anjo-guardiao', 'story', 'Anjo Guardião', 'Uma jornada celestial de amor e proteção', '/images/angel-guardian.jpg', '{"color":"from-sky-400 to-blue-500","iconKey":"bird","emoji":"👼"}', 6),
  ('festa-junina', 'story', 'Festa Junina', 'Quadrilha, fogueira e muita alegria caipira', '/images/festa-junina.jpg', '{"color":"from-amber-400 to-orange-500","iconKey":"music","emoji":"🎉"}', 7),
  ('super-heroi', 'story', 'Super-Herói Brasileiro', 'Poderes especiais para proteger o Brasil', '/images/super-hero.jpg', '{"color":"from-yellow-400 to-green-600","iconKey":"shield","emoji":"🦸"}', 8)
on conflict (slug) do nothing;

insert into public.themes (slug, kind, title, description, image_url, metadata, sort_order)
values
  ('baby-minimal', 'album', 'Ternura', 'Suave e delicado', null, '{"colors":{"primary":"from-pink-100 via-pink-50 to-pink-100","secondary":"bg-pink-50/80","accent":"bg-carnival-pink","text":"text-carnival-pink"},"pattern":"minimal"}', 1),
  ('boho-chic', 'album', 'Aconchego', 'Tons quentes', null, '{"colors":{"primary":"from-amber-100 via-orange-50 to-amber-100","secondary":"bg-amber-50/80","accent":"bg-carnival-gold","text":"text-carnival-gold"},"pattern":"boho"}', 2),
  ('carnival-suave', 'album', 'Alegria', 'Colorido e vibrante', null, '{"colors":{"primary":"from-pink-100 via-pink-50 to-cyan-100","secondary":"bg-pink-50/80","accent":"bg-carnival-turquoise","text":"text-carnival-turquoise"},"pattern":"carnival"}', 3),
  ('natureza', 'album', 'Serenidade', 'Verde e tranquilo', null, '{"colors":{"primary":"from-emerald-100 via-green-50 to-teal-100","secondary":"bg-emerald-50/80","accent":"bg-carnival-green","text":"text-carnival-green"},"pattern":"nature"}', 4),
  ('encantado', 'album', 'Magia', 'Encantado', null, '{"colors":{"primary":"from-violet-100 via-purple-50 to-pink-100","secondary":"bg-violet-50/80","accent":"bg-carnival-coral","text":"text-carnival-coral"},"pattern":"enchanted"}', 5),
  ('classico-elegante', 'album', 'Elegância', 'Sofisticado', null, '{"colors":{"primary":"from-stone-100 via-neutral-50 to-stone-100","secondary":"bg-stone-50/80","accent":"bg-stone-400","text":"text-stone-600"},"pattern":"classic"}', 6)
on conflict (slug) do nothing;
