"use client";

import Image from "next/image";
import { Loader2, Sparkles } from "lucide-react";

import { getThemeIcon } from "@/lib/themes/icon-map";
import { cn } from "@/lib/utils";
import type { StoryThemeDisplay } from "@/types/themes";

export { FALLBACK_STORY_THEMES as storyThemes } from "@/lib/themes/fallback";

type ThemeSelectorProps = {
  themes: StoryThemeDisplay[];
  selectedTheme: string | null;
  onSelectTheme: (themeId: string) => void;
  isLoading?: boolean;
};

export function ThemeSelector({
  themes,
  selectedTheme,
  onSelectTheme,
  isLoading = false,
}: ThemeSelectorProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/30">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading themes...</p>
        </div>
      </div>
    );
  }

  if (!themes.length) {
    return (
      <p className="rounded-xl border border-border bg-secondary/50 p-6 text-center text-sm text-muted-foreground">
        No themes available right now. Please try again later.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      {themes.map((theme) => {
        const IconComponent = getThemeIcon(theme.iconKey);
        const isSelected = selectedTheme === theme.id;

        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onSelectTheme(theme.id)}
            className={cn(
              "group relative overflow-hidden rounded-2xl text-left transition-all duration-300",
              "hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              isSelected && "scale-[1.02] shadow-xl ring-4 ring-primary ring-offset-2",
            )}
          >
            <Image
              src={theme.image}
              alt={theme.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />

            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br transition-opacity duration-300",
                theme.color,
                isSelected ? "opacity-60" : "opacity-50 group-hover:opacity-60",
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            <div className="relative z-10 flex min-h-[180px] flex-col p-5 text-primary-foreground sm:p-6">
              <div className="mb-3 flex items-start justify-between">
                <span className="text-3xl sm:text-4xl">{theme.emoji}</span>
                <IconComponent
                  className={cn(
                    "size-6 opacity-70 transition-transform duration-300 sm:size-7",
                    "group-hover:scale-110",
                    isSelected && "scale-110",
                  )}
                />
              </div>

              <h3 className="mb-2 font-display text-base font-bold leading-tight sm:text-lg">
                {theme.title}
              </h3>

              <p className="flex-1 text-xs leading-relaxed text-primary-foreground/80 sm:text-sm">
                {theme.description}
              </p>

              {isSelected && (
                <div className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-full bg-primary-foreground">
                  <Sparkles className="size-4 text-primary" />
                </div>
              )}
            </div>

            <div
              className={cn(
                "absolute inset-0 rounded-2xl border-2 transition-colors duration-300",
                isSelected
                  ? "border-primary-foreground/30"
                  : "border-transparent group-hover:border-primary-foreground/20",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
