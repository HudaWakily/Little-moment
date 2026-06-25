"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { createStoryAction, type CreateStoryState } from "@/app/actions/stories";
import { WizardStepper } from "@/components/create/wizard-stepper";
import {
  ChildInfoStep,
  isChildInfoValid,
  type ChildInfo,
} from "@/components/create/wizard-steps/child-info-step";
import { GenerateStep } from "@/components/create/wizard-steps/generate-step";
import { PhotosStep } from "@/components/create/wizard-steps/photos-step";
import { ThemeStep } from "@/components/create/wizard-steps/theme-step";
import {
  areWizardPhotosReady,
  type WizardPhoto,
} from "@/components/photo-uploader/wizard-photo-uploader";
import { Button } from "@/components/ui/button";
import { getMomentThemeById } from "@/lib/themes/resolve-themes";
import type { MomentTheme } from "@/lib/themes/moment-themes";

const initialState: CreateStoryState = { success: false };

const INITIAL_CHILD_INFO: ChildInfo = {
  name: "",
  age: null,
  gender: "",
  interests: "",
  parentMessage: "",
};

type CreateWizardProps = {
  themes: MomentTheme[];
};

export function CreateWizard({ themes }: CreateWizardProps) {
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState<WizardPhoto[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(
    themes[0]?.id ?? null,
  );
  const [childInfo, setChildInfo] = useState<ChildInfo>(INITIAL_CHILD_INFO);
  const [isComplete, setIsComplete] = useState(false);

  const [state, formAction, isPending] = useActionState(
    createStoryAction,
    initialState,
  );

  const selectedThemeData = useMemo(
    () => getMomentThemeById(themes, selectedTheme ?? ""),
    [themes, selectedTheme],
  );

  const canProceed = useMemo(() => {
    switch (step) {
      case 1:
        return areWizardPhotosReady(photos);
      case 2:
        return Boolean(selectedTheme);
      case 3:
        return isChildInfoValid(childInfo);
      default:
        return true;
    }
  }, [step, photos, selectedTheme, childInfo]);

  useEffect(() => {
    if (state.success) {
      setIsComplete(true);
      toast.success("Seu Momentinho mágico está sendo criado! 🎉");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleGenerate = () => {
    const formData = new FormData();
    formData.set("childName", childInfo.name.trim());
    formData.set("childAge", String(childInfo.age));
    formData.set("childGender", childInfo.gender);
    formData.set("interests", childInfo.interests.trim());
    formData.set("parentMessage", childInfo.parentMessage.trim());
    formData.set("themeId", selectedTheme ?? "");
    formData.set("themeSlug", selectedThemeData?.slug ?? "");

    photos.forEach((photo, index) => {
      if (photo.uploadedUrl) {
        formData.set(`photoUrl_${index}`, photo.uploadedUrl);
      }
      if (photo.file) {
        formData.set(`photo_${index}`, photo.file);
      }
    });

    if (photos[0]?.uploadedUrl) {
      formData.set("photoUrl", photos[0].uploadedUrl);
    }
    if (photos[0]?.file) {
      formData.set("photo", photos[0].file);
    }

    formAction(formData);
  };

  const resetWizard = () => {
    setIsComplete(false);
    setStep(1);
    setPhotos([]);
    setChildInfo(INITIAL_CHILD_INFO);
    setSelectedTheme(themes[0]?.id ?? null);
  };

  if (isComplete) {
    return (
      <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="relative mb-8 inline-flex">
            <div className="flex size-24 animate-float items-center justify-center rounded-full bg-carnival-green/20">
              <CheckCircle2 className="size-12 text-carnival-green" />
            </div>
          </div>

          <h1 className="mb-6 text-balance font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Seu livro mágico está a caminho! 🎉
          </h1>

          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            A história de{" "}
            <span className="font-semibold text-primary">{childInfo.name}</span> no
            tema{" "}
            <span className="font-semibold text-primary">
              {selectedThemeData?.title}
            </span>{" "}
            está sendo preparada com muito carinho.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="rounded-full bg-primary px-8 hover:bg-primary/90"
            >
              <BookOpen className="mr-2 size-5" />
              Ver Meu Livro
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="rounded-full px-8"
              onClick={resetWizard}
            >
              <Sparkles className="mr-2 size-5" />
              Criar Outro Momentinho
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar ao início
        </Link>

        <header className="mb-8 text-center sm:mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
            <Sparkles className="size-4" />
            <span className="text-sm font-medium">Criar seu Momentinho</span>
          </div>
          <h1 className="mb-3 text-balance font-display text-3xl font-bold sm:text-4xl">
            Vamos criar uma história mágica ✨
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground sm:text-lg">
            Siga os passos e deixe a magia acontecer
          </p>
        </header>

        <WizardStepper currentStep={step} className="mb-10" />

        <div
          key={step}
          className="min-h-[280px] animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {step === 1 && (
            <PhotosStep
              photos={photos}
              onChange={setPhotos}
              disabled={isPending}
            />
          )}
          {step === 2 && (
            <ThemeStep
              themes={themes}
              selectedTheme={selectedTheme}
              onSelectTheme={setSelectedTheme}
            />
          )}
          {step === 3 && (
            <ChildInfoStep
              value={childInfo}
              onChange={setChildInfo}
              disabled={isPending}
            />
          )}
          {step === 4 && (
            <GenerateStep
              photos={photos}
              childInfo={childInfo}
              theme={selectedThemeData}
              isPending={isPending}
              onGenerate={handleGenerate}
            />
          )}
        </div>

        {step < 4 && (
          <footer className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              disabled={step === 1 || isPending}
              onClick={() => setStep((s) => s - 1)}
            >
              Voltar
            </Button>
            <Button
              type="button"
              className="rounded-full px-8"
              disabled={!canProceed || isPending}
              onClick={() => setStep((s) => s + 1)}
            >
              Continuar
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </footer>
        )}

        {step === 4 && (
          <footer className="mt-6 text-center">
            <Button
              type="button"
              variant="ghost"
              className="rounded-full text-muted-foreground"
              disabled={isPending}
              onClick={() => setStep(3)}
            >
              <ArrowLeft className="mr-2 size-4" />
              Editar informações
            </Button>
          </footer>
        )}
      </div>
    </section>
  );
}
