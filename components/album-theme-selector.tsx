"use client";

import { Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AlbumPattern, AlbumThemeDisplay } from "@/types/themes";

export { FALLBACK_ALBUM_THEMES as albumThemes } from "@/lib/themes/fallback";

type AlbumThemeSelectorProps = {
  themes: AlbumThemeDisplay[];
  selectedTheme: string | null;
  onSelect: (themeId: string) => void;
  isLoading?: boolean;
};

function PatternOverlay({ pattern }: { pattern: AlbumPattern }) {
  switch (pattern) {
    case "minimal":
      return (
        <div className="absolute top-3 right-3 size-8 rounded-full border-2 border-pink-200" />
      );
    case "boho":
      return (
        <>
          <div className="absolute top-2 right-4 size-3 rounded-full bg-amber-300" />
          <div className="absolute top-5 right-2 size-2 rounded-full bg-orange-300" />
        </>
      );
    case "carnival":
      return (
        <div className="absolute top-3 right-3 flex gap-1">
          <div className="size-2 rounded-full bg-pink-300" />
          <div className="size-2 rounded-full bg-cyan-300" />
          <div className="size-2 rounded-full bg-yellow-300" />
        </div>
      );
    case "nature":
      return (
        <div className="absolute top-3 right-3 flex gap-0.5">
          <div className="h-4 w-1 rounded-full bg-emerald-300" />
          <div className="h-6 w-1 rounded-full bg-green-400" />
          <div className="h-3 w-1 rounded-full bg-teal-300" />
        </div>
      );
    case "enchanted":
      return (
        <svg
          className="absolute top-3 right-3 size-5 text-amber-300"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
        </svg>
      );
    case "classic":
      return <div className="absolute top-3 right-3 h-0.5 w-8 rounded-full bg-stone-300" />;
    default:
      return null;
  }
}

export function AlbumThemeSelector({
  themes,
  selectedTheme,
  onSelect,
  isLoading = false,
}: AlbumThemeSelectorProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/30">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading themes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {themes.map((theme) => {
        const isSelected = selectedTheme === theme.id;

        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onSelect(theme.id)}
            className={cn(
              "relative overflow-hidden rounded-2xl transition-all duration-300 ease-out",
              "border-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
              "hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl",
              isSelected
                ? "scale-[1.02] border-primary shadow-lg shadow-primary/20"
                : "border-border shadow-md hover:border-primary/30",
            )}
          >
            <div
              className={cn(
                "relative flex aspect-[4/3] flex-col justify-between bg-gradient-to-br p-4",
                theme.colors.primary,
              )}
            >
              <div className="absolute inset-0 opacity-30">
                <PatternOverlay pattern={theme.pattern} />
              </div>

              <div className="relative z-10 flex gap-2">
                <div
                  className={cn(
                    "h-10 w-8 rounded-sm border border-white/50 shadow-sm",
                    theme.colors.secondary,
                  )}
                />
                <div
                  className={cn(
                    "h-10 w-8 rounded-sm border border-white/50 shadow-sm",
                    theme.colors.secondary,
                  )}
                />
              </div>

              <div className="relative z-10 flex gap-1.5">
                <div className={cn("size-3 rounded-full shadow-sm", theme.colors.accent)} />
                <div className={cn("size-3 rounded-full opacity-60 shadow-sm", theme.colors.accent)} />
              </div>
            </div>

            <div className="bg-card p-4">
              <h4 className={cn("text-base font-semibold", theme.colors.text)}>{theme.name}</h4>
              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                {theme.description}
              </p>
            </div>

            {isSelected && (
              <div className="absolute top-3 left-3 flex size-7 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
                <Check className="size-4 text-primary-foreground" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
