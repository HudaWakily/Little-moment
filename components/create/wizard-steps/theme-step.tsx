"use client";

import { ThemeSelector } from "@/components/theme-selector";
import type { MomentTheme } from "@/lib/themes/moment-themes";

type ThemeStepProps = {
  themes: MomentTheme[];
  selectedTheme: string | null;
  onSelectTheme: (themeId: string) => void;
};

export function ThemeStep({
  themes,
  selectedTheme,
  onSelectTheme,
}: ThemeStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold sm:text-2xl">
          Escolha o tema da aventura 🎨
        </h2>
        <p className="mt-2 text-muted-foreground">
          Cada tema funciona para história ilustrada e álbum de fotos
        </p>
      </div>

      <ThemeSelector
        themes={themes}
        selectedTheme={selectedTheme}
        onSelectTheme={onSelectTheme}
        columns={3}
      />
    </div>
  );
}
