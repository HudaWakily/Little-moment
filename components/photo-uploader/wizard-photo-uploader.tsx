"use client";

import { useCallback, useRef, useState } from "react";
import { Camera, ImageIcon, Loader2, Plus, Sparkles, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { uploadStoryPhotoAction } from "@/app/actions/upload";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type WizardPhoto = {
  id: string;
  file: File | null;
  preview: string | null;
  uploadedUrl: string | null;
  isUploading: boolean;
};

export const MAX_WIZARD_PHOTOS = 3;
export const MIN_WIZARD_PHOTOS = 1;

type WizardPhotoUploaderProps = {
  photos: WizardPhoto[];
  onChange: (photos: WizardPhoto[]) => void;
  disabled?: boolean;
};

function createEmptyPhoto(): WizardPhoto {
  return {
    id: crypto.randomUUID(),
    file: null,
    preview: null,
    uploadedUrl: null,
    isUploading: false,
  };
}

export function WizardPhotoUploader({
  photos,
  onChange,
  disabled = false,
}: WizardPhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const photosRef = useRef(photos);
  photosRef.current = photos;

  const setPhotos = useCallback(
    (updater: WizardPhoto[] | ((prev: WizardPhoto[]) => WizardPhoto[])) => {
      const next =
        typeof updater === "function" ? updater(photosRef.current) : updater;
      photosRef.current = next;
      onChange(next);
    },
    [onChange],
  );

  const uploadPhoto = useCallback(
    async (photoId: string, file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Escolha uma imagem (JPG, PNG ou HEIC).");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 10MB.");
        return;
      }

      const preview = URL.createObjectURL(file);
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photoId
            ? { ...p, file, preview, uploadedUrl: null, isUploading: true }
            : p,
        ),
      );

      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadStoryPhotoAction(formData);

      if (!result.success) {
        toast.error(result.error);
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === photoId
              ? { ...p, file, preview, uploadedUrl: null, isUploading: false }
              : p,
          ),
        );
        return;
      }

      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photoId
            ? { ...p, file, preview, uploadedUrl: result.url, isUploading: false }
            : p,
        ),
      );
    },
    [setPhotos],
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      if (disabled || photosRef.current.some((p) => p.isUploading)) return;

      const fileArray = Array.from(files);
      const remaining = MAX_WIZARD_PHOTOS - photosRef.current.length;

      if (remaining <= 0) {
        toast.error(`Você pode enviar no máximo ${MAX_WIZARD_PHOTOS} fotos.`);
        return;
      }

      const toAdd = fileArray.slice(0, remaining);
      const newEntries = toAdd.map(() => createEmptyPhoto());

      setPhotos((prev) => [...prev, ...newEntries]);

      for (let i = 0; i < toAdd.length; i++) {
        await uploadPhoto(newEntries[i].id, toAdd[i]);
      }
    },
    [disabled, setPhotos, uploadPhoto],
  );

  const removePhoto = (id: string) => {
    const photo = photosRef.current.find((p) => p.id === id);
    if (photo?.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(photo.preview);
    }
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const isUploading = photos.some((photo) => photo.isUploading);
  const canAddMore = photos.length < MAX_WIZARD_PHOTOS;
  const hasPhotos = photos.length > 0;

  if (hasPhotos) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {photos.map((photo, index) => (
            <div key={photo.id} className="relative">
              <div className="relative aspect-square overflow-hidden rounded-2xl border-4 border-primary/20 shadow-lg">
                {photo.preview ? (
                  <img
                    src={photo.preview}
                    alt={`Foto ${index + 1}`}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-secondary">
                    <Camera className="size-10 text-muted-foreground" />
                  </div>
                )}

                {photo.isUploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/75 backdrop-blur-sm">
                    <Loader2 className="size-8 animate-spin text-primary" />
                    <span className="text-xs font-medium">Enviando...</span>
                  </div>
                )}

                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 size-8 rounded-full shadow-md"
                  onClick={() => removePhoto(photo.id)}
                  disabled={photo.isUploading || disabled}
                  aria-label={`Remover foto ${index + 1}`}
                >
                  <X className="size-4" />
                </Button>

                <div className="absolute right-2 bottom-2 left-2 flex items-center justify-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                  {photo.isUploading ? (
                    <>
                      <Loader2 className="size-3 animate-spin text-primary" />
                      Enviando...
                    </>
                  ) : photo.uploadedUrl ? (
                    <>
                      <Sparkles className="size-3 text-primary" />
                      Pronta!
                    </>
                  ) : (
                    <span className="text-muted-foreground">Falhou — remova e tente de novo</span>
                  )}
                </div>
              </div>

              {index === 0 && (
                <span className="mt-2 block text-center text-xs font-medium text-primary">
                  Foto principal ⭐
                </span>
              )}
            </div>
          ))}

          {canAddMore && (
            <label
              className={cn(
                "flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border transition-colors",
                "hover:border-primary/50 hover:bg-secondary/50",
                (disabled || isUploading) && "pointer-events-none opacity-60",
              )}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                disabled={disabled || isUploading}
                onChange={(e) => {
                  if (e.target.files?.length) void handleFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              <Plus className="size-8 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Adicionar foto
              </span>
              <span className="text-xs text-muted-foreground">
                {photos.length}/{MAX_WIZARD_PHOTOS}
              </span>
            </label>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Envie de {MIN_WIZARD_PHOTOS} a {MAX_WIZARD_PHOTOS} fotos do rostinho do seu pequeno ✨
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-300 sm:p-12",
        isDragging
          ? "scale-[1.02] border-primary bg-primary/10"
          : "border-border hover:border-primary/50 hover:bg-secondary/50",
        (disabled || isUploading) && "pointer-events-none opacity-60",
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length) void handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          if (e.target.files?.length) void handleFiles(e.target.files);
          e.target.value = "";
        }}
        className="absolute inset-0 size-full cursor-pointer opacity-0"
        disabled={disabled || isUploading}
        aria-label="Enviar fotos da criança"
      />

      <div className="space-y-4">
        <div className="relative inline-flex">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary/10 sm:size-24">
            {isUploading ? (
              <Loader2 className="size-10 animate-spin text-primary sm:size-12" />
            ) : isDragging ? (
              <Upload className="size-10 animate-bounce text-primary sm:size-12" />
            ) : (
              <Camera className="size-10 text-primary sm:size-12" />
            )}
          </div>
          <div className="absolute -top-1 -right-1 flex size-8 animate-sparkle items-center justify-center rounded-full bg-carnival-yellow">
            <ImageIcon className="size-4 text-foreground" />
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-display text-lg font-bold sm:text-xl">
            {isDragging ? "Solte as fotos aqui!" : "Arraste as fotos do seu pequeno"}
          </h3>
          <p className="text-sm text-muted-foreground sm:text-base">
            ou clique para escolher do celular — até {MAX_WIZARD_PHOTOS} fotos
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Sparkles className="size-3 text-carnival-pink" />
            JPG, PNG ou HEIC
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="size-3 text-carnival-turquoise" />
            Até 10MB cada
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="size-3 text-carnival-green" />
            Rosto bem visível
          </span>
        </div>
      </div>
    </div>
  );
}

export function areWizardPhotosReady(photos: WizardPhoto[]): boolean {
  return (
    photos.length >= MIN_WIZARD_PHOTOS &&
    photos.length <= MAX_WIZARD_PHOTOS &&
    photos.every((p) => (p.uploadedUrl || p.file) && !p.isUploading)
  );
}
