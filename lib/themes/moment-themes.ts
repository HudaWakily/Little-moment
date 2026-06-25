import type { StoryThemeDisplay } from "@/types/themes";

export type MomentTheme = StoryThemeDisplay & {
  storyPrompt: string;
  albumPrompt: string;
  accentClass: string;
};

export const MOMENT_THEME_SLUGS = [
  "carnaval",
  "futebol",
  "amazonia",
  "natal",
  "festa-junina",
  "saci-perere",
] as const;

export type MomentThemeSlug = (typeof MOMENT_THEME_SLUGS)[number];

export const MOMENT_THEMES: MomentTheme[] = [
  {
    id: "carnaval",
    slug: "carnaval",
    title: "Carnaval",
    description: "Desfiles coloridos, confetes e alegria brasileira",
    color: "from-pink-400 via-fuchsia-500 to-pink-600",
    iconKey: "crown",
    emoji: "🎭",
    image: "",
    accentClass: "bg-carnival-pink",
    storyPrompt: `Crie uma história infantil ilustrada de 8 a 12 páginas sobre {childName}, {childAge} anos, no universo do Carnaval brasileiro.
Inclua desfile, fantasias brilhantes, música e samba no pé.
Valores: alegria, amizade e respeito à cultura.
Gênero: {gender}. Interesses: {interests}.
Mensagem especial dos pais: {parentMessage}.`,
    albumPrompt:
      "Estilo álbum festivo: cores vibrantes, confetes, fitas, rosa e turquesa.",
  },
  {
    id: "futebol",
    slug: "futebol",
    title: "Futebol",
    description: "Gols, troféus e a emoção da Copa dos Sonhos",
    color: "from-green-500 via-emerald-500 to-green-700",
    iconKey: "flame",
    emoji: "⚽",
    image: "",
    accentClass: "bg-carnival-green",
    storyPrompt: `Crie uma história infantil ilustrada de 8 a 12 páginas sobre {childName}, {childAge} anos, como herói do futebol brasileiro.
Inclua treinos, amigos de time, gol decisivo e comemoração.
Valores: esforço, fair play e trabalho em equipe.
Gênero: {gender}. Interesses: {interests}.
Mensagem especial dos pais: {parentMessage}.`,
    albumPrompt:
      "Estilo esportivo: verde, branco, troféus, campo e energia de estádio.",
  },
  {
    id: "amazonia",
    slug: "amazonia",
    title: "Amazônia",
    description: "Floresta encantada, rios e animais da natureza",
    color: "from-emerald-500 via-teal-500 to-green-800",
    iconKey: "tree",
    emoji: "🌿",
    image: "",
    accentClass: "bg-carnival-green",
    storyPrompt: `Crie uma história infantil ilustrada de 8 a 12 páginas sobre {childName}, {childAge} anos, explorando a Amazônia.
Inclua rios, animais da floresta, plantas mágicas e cuidado com a natureza.
Valores: curiosidade, respeito ao meio ambiente e coragem.
Gênero: {gender}. Interesses: {interests}.
Mensagem especial dos pais: {parentMessage}.`,
    albumPrompt:
      "Estilo natureza: verdes profundos, folhas, rios e tons terrosos.",
  },
  {
    id: "natal",
    slug: "natal",
    title: "Natal",
    description: "Magia natalina, presentes e calor de família",
    color: "from-red-500 via-rose-500 to-green-600",
    iconKey: "gift",
    emoji: "🎄",
    image: "",
    accentClass: "bg-carnival-coral",
    storyPrompt: `Crie uma história infantil ilustrada de 8 a 12 páginas sobre {childName}, {childAge} anos, em uma aventura de Natal.
Inclua decorações, presentes, neve ou calor tropical, e reencontro familiar.
Valores: generosidade, amor e gratidão.
Gênero: {gender}. Interesses: {interests}.
Mensagem especial dos pais: {parentMessage}.`,
    albumPrompt:
      "Estilo natalino: vermelho, verde, dourado, estrelas e luzes suaves.",
  },
  {
    id: "festa-junina",
    slug: "festa-junina",
    title: "Festa Junina",
    description: "Quadrilha, fogueira e alegria caipira",
    color: "from-amber-400 via-orange-500 to-red-500",
    iconKey: "music",
    emoji: "🎉",
    image: "",
    accentClass: "bg-carnival-gold",
    storyPrompt: `Crie uma história infantil ilustrada de 8 a 12 páginas sobre {childName}, {childAge} anos, na Festa Junina.
Inclua quadrilha, fogueira, comidas típicas e tradições do interior.
Valores: comunidade, tradição e diversão.
Gênero: {gender}. Interesses: {interests}.
Mensagem especial dos pais: {parentMessage}.`,
    albumPrompt:
      "Estilo junino: xadrez, bandeirinhas, amarelo, laranja e vermelho.",
  },
  {
    id: "saci-perere",
    slug: "saci-perere",
    title: "Saci-Pererê",
    description: "Travessuras e magia do folclore brasileiro",
    color: "from-red-600 via-orange-600 to-amber-500",
    iconKey: "sparkles",
    emoji: "🔥",
    image: "",
    accentClass: "bg-carnival-coral",
    storyPrompt: `Crie uma história infantil ilustrada de 8 a 12 páginas sobre {childName}, {childAge} anos, com o Saci-Pererê e o folclore brasileiro.
Inclua travessuras divertidas, pipa, mato e lições sobre bondade.
Valores: imaginação, respeito às tradições e humor.
Gênero: {gender}. Interesses: {interests}.
Mensagem especial dos pais: {parentMessage}.`,
    albumPrompt:
      "Estilo folclórico: vermelho, laranja, pipa, mato e texturas rústicas.",
  },
];

export type StoryPromptContext = {
  childName: string;
  childAge: number;
  gender?: string;
  interests?: string;
  parentMessage?: string;
};

export function buildStoryPrompt(
  theme: MomentTheme,
  ctx: StoryPromptContext,
): string {
  const genderLabels: Record<string, string> = {
    menino: "menino",
    menina: "menina",
    outro: "criança",
  };

  return theme.storyPrompt
    .replaceAll("{childName}", ctx.childName)
    .replaceAll("{childAge}", String(ctx.childAge))
    .replaceAll(
      "{gender}",
      ctx.gender ? (genderLabels[ctx.gender] ?? ctx.gender) : "criança",
    )
    .replaceAll("{interests}", ctx.interests?.trim() || "brincadeiras e descobertas")
    .replaceAll("{parentMessage}", ctx.parentMessage?.trim() || "com muito amor");
}
