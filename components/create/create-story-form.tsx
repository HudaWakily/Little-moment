"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { createStoryAction, type CreateStoryState } from "@/app/actions/stories";
import { AgeSelector } from "@/components/age-selector";
import {
  StoryPhotoUploader,
  type StoryPhotoValue,
} from "@/components/photo-uploader/story-photo-uploader";
import { ThemeSelector } from "@/components/theme-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StoryThemeDisplay } from "@/types/themes";

const initialState: CreateStoryState = { success: false };

type CreateStoryFormProps = {
  themes: StoryThemeDisplay[];
};

export function CreateStoryForm({ themes }: CreateStoryFormProps) {
  const [state, formAction, isPending] = useActionState(createStoryAction, initialState);
  const [photo, setPhoto] = useState<StoryPhotoValue>({
    file: null,
    preview: null,
    uploadedUrl: null,
    isUploading: false,
  });
  const [childName, setChildName] = useState("");
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(
    themes[0]?.id ?? null,
  );
  const [isComplete, setIsComplete] = useState(false);

  const selectedThemeData = themes.find((theme) => theme.id === selectedTheme);

  const isPhotoReady =
    Boolean(photo.uploadedUrl || photo.file) && !photo.isUploading;
  const isFormValid =
    isPhotoReady && childName.trim() && selectedAge && selectedTheme;

  useEffect(() => {
    if (state.success) {
      setIsComplete(true);
      toast.success("Your magical story is being created!");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.set("childName", childName.trim());
    formData.set("childAge", String(selectedAge));
    formData.set("themeId", selectedTheme ?? "");

    if (photo.uploadedUrl) {
      formData.set("photoUrl", photo.uploadedUrl);
    }

    if (photo.file) {
      formData.set("photo", photo.file);
    }

    formAction(formData);
  };

  const resetForm = () => {
    setIsComplete(false);
    setPhoto({ file: null, preview: null, uploadedUrl: null, isUploading: false });
    setChildName("");
    setSelectedAge(null);
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
            Your magical book is on its way! 🎉
          </h1>

          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            The story of{" "}
            <span className="font-semibold text-primary">{childName}</span> as{" "}
            <span className="font-semibold text-primary">{selectedThemeData?.title}</span>{" "}
            is being prepared.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="rounded-full bg-primary px-8 hover:bg-primary/90">
              <BookOpen className="mr-2 size-5" />
              View My Book
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="rounded-full px-8"
              onClick={resetForm}
            >
              <Sparkles className="mr-2 size-5" />
              Create Another Book
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>

        <div className="mb-12 text-center sm:mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
            <Sparkles className="size-4" />
            <span className="text-sm font-medium">Create your Little Moment</span>
          </div>
          <h1 className="mb-4 text-balance font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Let&apos;s create your child&apos;s story!
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Fill in the details below and let the magic happen ✨
          </p>
        </div>

        <div className="space-y-12 sm:space-y-16">
          <div className="space-y-6">
            <StepHeader
              number={1}
              badgeClass="bg-carnival-pink/20 text-carnival-pink"
              title="Child's photo"
            />
            <StoryPhotoUploader
              value={photo}
              onChange={setPhoto}
              disabled={isPending}
            />
          </div>

          <div className="space-y-6">
            <StepHeader
              number={2}
              badgeClass="bg-carnival-turquoise/20 text-carnival-turquoise"
              title="Child's name"
            />
            <div className="max-w-md">
              <Input
                type="text"
                placeholder="Enter your child's name..."
                value={childName}
                onChange={(event) => setChildName(event.target.value)}
                disabled={isPending}
                className="h-14 rounded-xl border-2 border-border px-5 text-lg focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-6">
            <StepHeader
              number={3}
              badgeClass="bg-carnival-yellow/20 text-carnival-gold"
              title="Child's age"
            />
            <AgeSelector selectedAge={selectedAge} onSelectAge={setSelectedAge} />
          </div>

          <div className="space-y-6">
            <StepHeader
              number={4}
              badgeClass="bg-carnival-green/20 text-carnival-green"
              title="Choose a theme"
            />
            <ThemeSelector
              themes={themes}
              selectedTheme={selectedTheme}
              onSelectTheme={setSelectedTheme}
            />
          </div>

          <div className="pt-8 text-center">
            <Button
              type="submit"
              size="lg"
              disabled={!isFormValid || isPending}
              className="rounded-full bg-primary px-10 py-7 text-lg font-semibold shadow-lg shadow-primary/25"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Creating your story...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 size-5" />
                  Generate My Magical Book
                  <Sparkles className="ml-2 size-5" />
                </>
              )}
            </Button>

            {!isFormValid && (
              <p className="mt-4 text-sm text-muted-foreground">
                Complete all fields and wait for the photo upload to finish.
              </p>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}

function StepHeader({
  number,
  badgeClass,
  title,
}: {
  number: number;
  badgeClass: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex size-10 items-center justify-center rounded-full ${badgeClass}`}>
        <span className="font-bold">{number}</span>
      </div>
      <h2 className="font-display text-xl font-bold sm:text-2xl">{title}</h2>
    </div>
  );
}
