"use client";

import { BookOpen, Loader2, Sparkles, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ChildInfo } from "@/components/create/wizard-steps/child-info-step";
import type { WizardPhoto } from "@/components/photo-uploader/wizard-photo-uploader";
import type { MomentTheme } from "@/lib/themes/moment-themes";

type GenerateStepProps = {
  photos: WizardPhoto[];
  childInfo: ChildInfo;
  theme: MomentTheme | undefined;
  isPending: boolean;
  onGenerate: () => void;
};

export function GenerateStep({
  photos,
  childInfo,
  theme,
  isPending,
  onGenerate,
}: GenerateStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-display text-xl font-bold sm:text-2xl">
          Tudo pronto para a magia! ✨
        </h2>
        <p className="mt-2 text-muted-foreground">
          Revise os detalhes e gere uma história de 8 a 12 páginas
        </p>
      </div>

      <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
        <div
          className={`h-2 bg-gradient-to-r ${theme?.color ?? "from-primary to-primary/70"}`}
        />
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-wrap gap-4">
            {photos.slice(0, 3).map((photo, i) =>
              photo.preview ? (
                <div
                  key={photo.id}
                  className="size-16 overflow-hidden rounded-xl border-2 border-primary/20 sm:size-20"
                >
                  <img
                    src={photo.preview}
                    alt={`Foto ${i + 1}`}
                    className="size-full object-cover"
                  />
                </div>
              ) : null,
            )}
            <div className="flex-1 min-w-[180px]">
              <p className="font-display text-lg font-bold">{childInfo.name}</p>
              <p className="text-sm text-muted-foreground">
                {childInfo.age} anos
                {theme ? ` · Tema ${theme.title}` : ""}
              </p>
              {childInfo.interests && (
                <p className="mt-1 text-sm">
                  <span className="text-muted-foreground">Interesses: </span>
                  {childInfo.interests}
                </p>
              )}
            </div>
          </div>

          {theme && (
            <div className="rounded-xl bg-secondary/50 p-4">
              <p className="text-sm font-medium">
                {theme.emoji} {theme.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{theme.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          type="button"
          size="lg"
          disabled={isPending}
          onClick={onGenerate}
          className="rounded-full bg-primary px-10 py-7 text-lg font-semibold shadow-lg shadow-primary/25"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-5 animate-spin" />
              Criando sua história mágica...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 size-5" />
              Gerar Meu Momentinho
              <Sparkles className="ml-2 size-5" />
            </>
          )}
        </Button>

        <p className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="size-4" />
          História ilustrada com 8 a 12 páginas personalizadas
        </p>
      </div>
    </div>
  );
}
