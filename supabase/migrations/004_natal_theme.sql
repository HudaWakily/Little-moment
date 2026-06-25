-- Natal theme for story wizard
insert into public.themes (slug, kind, title, description, image_url, metadata, sort_order)
values
  (
    'natal-magico',
    'story',
    'Natal Mágico',
    'Magia natalina, presentes e calor de família',
    null,
    '{"color":"from-red-500 via-rose-500 to-green-600","iconKey":"gift","emoji":"🎄"}',
    9
  ),
  (
    'natal-album',
    'album',
    'Natal',
    'Estilo natalino festivo',
    null,
    '{"colors":{"primary":"from-red-100 via-rose-50 to-green-100","secondary":"bg-red-50/80","accent":"bg-carnival-coral","text":"text-carnival-coral"},"pattern":"enchanted"}',
    7
  )
on conflict (slug) do nothing;
