import {
  Bird,
  Crown,
  Flame,
  Music,
  Shield,
  Sparkles,
  TreePine,
  Waves,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  crown: Crown,
  flame: Flame,
  waves: Waves,
  sparkles: Sparkles,
  tree: TreePine,
  bird: Bird,
  music: Music,
  shield: Shield,
};

export function getThemeIcon(iconKey: string): LucideIcon {
  return ICON_MAP[iconKey] ?? Sparkles;
}
