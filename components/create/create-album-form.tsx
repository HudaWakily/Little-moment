"use client";

import { useActionState, useEffect, useState } from "react";
import {
  BookOpen,
  Camera,
  CheckCircle2,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { createAlbumAction, type CreateAlbumState } from "@/app/actions/albums";
import { AlbumLayoutSelector } from "@/components/album-layout-selector";
import { AlbumPreview } from "@/components/album-preview";
import { AlbumThemeSelector } from "@/components/album-theme-selector";
import { AlbumTypeSelector } from "@/components/album-type-selector";
import {
  AlbumPhotoUploader,
  type AlbumPhoto,
} from "@/components/photo-uploader/album-photo-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AlbumThemeDisplay } from "@/types/themes";

const initialState: CreateAlbumState = { success: false };

type CreateAlbumFormProps = {
  themes: AlbumThemeDisplay[];
};

export function CreateAlbumForm({ themes }: CreateAlbumFormProps) {
  const [state, formAction, isPending] = useActionState(createAlbumAction, initialState);
  const [photos, setPhotos] = useState<AlbumPhoto[]>([]);
  const [albumTitle, setAlbumTitle] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(
    themes[0]?.id ?? null,
  );
  const [selectedLayout, setSelectedLayout] = useState("duo");
  const [isComplete, setIsComplete] = useState(false);

  const isUploadingPhotos = photos.some((photo) => photo.isUploading);
  const allPhotosUploaded =
    photos.length >= 8 &&
    photos.every((photo) => photo.uploadedUrl && !photo.isUploading);

  const canSubmit =
    allPhotosUploaded &&
    albumTitle.trim() &&
    selectedType &&
    selectedTheme &&
    !isUploadingPhotos;

  useEffect(() => {
    if (state.success) {
      setIsComplete(true);
      toast.success("Your album is being created!");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.set("albumTitle", albumTitle.trim());
    formData.set("albumType", selectedType ?? "");
    formData.set("themeId", selectedTheme ?? "");
    formData.set("layoutId", selectedLayout);

    const photoPayload = photos.map((photo, index) => ({
      url: photo.uploadedUrl ?? undefined,
      caption: photo.caption,
      sortOrder: index,
      ...(!photo.uploadedUrl ? { fileIndex: index } : {}),
    }));

    formData.set("photos", JSON.stringify(photoPayload));

    photos.forEach((photo, index) => {
      if (!photo.uploadedUrl) {
        formData.set(`photo_${index}`, photo.file);
      }
    });

    formAction(formData);
  };

  const resetForm = () => {
    photos.forEach((photo) => {
      if (photo.preview.startsWith("blob:")) {
        URL.revokeObjectURL(photo.preview);
      }
    });
    setPhotos([]);
    setAlbumTitle("");
    setSelectedType(null);
    setSelectedTheme(themes[0]?.id ?? null);
    setSelectedLayout("duo");
    setIsComplete(false);
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
            Your album is ready!
          </h1>

          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            &quot;{albumTitle}&quot; was saved successfully with {photos.length} photos.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="rounded-full bg-primary px-8 hover:bg-primary/90">
              <BookOpen className="mr-2 size-5" />
              Download PDF
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="rounded-full px-8"
              onClick={resetForm}
            >
              <Sparkles className="mr-2 size-5" />
              Create Another Album
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <form onSubmit={handleSubmit} className="mx-auto max-w-7xl">
          <div className="mb-12 text-center sm:mb-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
              <Camera className="size-4" />
              <span className="text-sm font-medium">Photo Album</span>
            </div>
            <h1 className="mb-4 text-balance font-display text-3xl font-bold sm:text-4xl md:text-5xl">
              Create your memory album!
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Turn your favorite moments into a beautiful album to keep forever
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
            <div className="space-y-12 sm:space-y-16 lg:col-span-3">
              <FieldSection step={1} label="Album name">
                <Input
                  value={albumTitle}
                  onChange={(event) => setAlbumTitle(event.target.value)}
                  placeholder="e.g. My Baby's First Month..."
                  disabled={isPending}
                  className="h-14 max-w-md rounded-xl border-2 border-border px-5 text-lg focus:border-primary"
                />
              </FieldSection>

              <FieldSection step={2} label="Album type">
                <AlbumTypeSelector
                  selectedType={selectedType}
                  onSelect={setSelectedType}
                />
              </FieldSection>

              <FieldSection step={3} label="Your photos">
                <p className="text-muted-foreground">
                  Drag, reorder, and add a caption to each photo (8–20 photos).
                </p>
                <AlbumPhotoUploader
                  photos={photos}
                  onPhotosChange={setPhotos}
                  minPhotos={8}
                  maxPhotos={20}
                />
              </FieldSection>

              <FieldSection step={4} label="Photos per page">
                <AlbumLayoutSelector
                  selectedLayout={selectedLayout}
                  onSelect={setSelectedLayout}
                />
              </FieldSection>

              <FieldSection step={5} label="Choose a theme">
                <AlbumThemeSelector
                  themes={themes}
                  selectedTheme={selectedTheme}
                  onSelect={setSelectedTheme}
                />
              </FieldSection>

              <div className="pt-8 text-center">
                <Button
                  type="submit"
                  size="lg"
                  disabled={!canSubmit || isPending}
                  className="rounded-full bg-primary px-10 py-7 text-lg font-semibold shadow-lg shadow-primary/25"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 size-5 animate-spin" />
                      Creating your album...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 size-5" />
                      Generate My Album
                      <Sparkles className="ml-2 size-5" />
                    </>
                  )}
                </Button>

                {!canSubmit && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    {!albumTitle.trim() && "Add an album name. "}
                    {!selectedType && "Choose an album type. "}
                    {photos.length < 8 && `Add ${8 - photos.length} more photo(s). `}
                    {isUploadingPhotos && "Wait for uploads to finish. "}
                    {photos.length >= 8 &&
                      !allPhotosUploaded &&
                      !isUploadingPhotos &&
                      "Some photos failed to upload — try again."}
                  </p>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-28">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-lg sm:p-6">
                  <h3 className="mb-4 text-center font-display text-lg font-semibold">
                    Preview
                  </h3>
                  <AlbumPreview
                    photos={photos}
                    title={albumTitle}
                    themeId={selectedTheme}
                    themes={themes}
                    layoutId={selectedLayout}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>

      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="mx-4 max-w-sm rounded-2xl border border-border bg-card p-10 text-center shadow-2xl">
            <Loader2 className="mx-auto mb-6 size-10 animate-spin text-primary" />
            <h3 className="mb-2 font-display text-xl font-semibold">Creating Your Album</h3>
            <p className="text-muted-foreground">Arranging your photos with care...</p>
          </div>
        </div>
      )}
    </>
  );
}

function FieldSection({
  step,
  label,
  children,
}: {
  step: number;
  label: string;
  children: React.ReactNode;
}) {
  const colors = [
    "bg-carnival-pink/20 text-carnival-pink",
    "bg-carnival-turquoise/20 text-carnival-turquoise",
    "bg-carnival-yellow/20 text-carnival-gold",
    "bg-carnival-green/20 text-carnival-green",
    "bg-carnival-coral/20 text-carnival-coral",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div
          className={`flex size-10 items-center justify-center rounded-full ${colors[step - 1]}`}
        >
          <span className="font-bold">{step}</span>
        </div>
        <h2 className="font-display text-xl font-bold sm:text-2xl">{label}</h2>
      </div>
      {children}
    </div>
  );
}
