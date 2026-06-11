"use client";

import { useCallback, useState } from "react";
import { Camera, ImageIcon, Loader2, Sparkles, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { uploadStoryPhotoAction } from "@/app/actions/upload";
import { Button } from "@/components/ui/button";

export type StoryPhotoValue = {
  file: File | null;
  preview: string | null;
  uploadedUrl: string | null;
  isUploading: boolean;
};

type StoryPhotoUploaderProps = {
  value: StoryPhotoValue;
  onChange: (value: StoryPhotoValue) => void;
  disabled?: boolean;
};

export function StoryPhotoUploader({
  value,
  onChange,
  disabled = false,
}: StoryPhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please choose an image file (JPG, PNG, or HEIC).");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image must be 10MB or smaller.");
        return;
      }

      const preview = URL.createObjectURL(file);
      onChange({ file, preview, uploadedUrl: null, isUploading: true });
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadStoryPhotoAction(formData);

      setIsUploading(false);

      if (!result.success) {
        toast.error(result.error);
        onChange({ file, preview, uploadedUrl: null, isUploading: false });
        return;
      }

      onChange({ file, preview, uploadedUrl: result.url, isUploading: false });
      toast.success("Photo uploaded successfully!");
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      if (disabled || isUploading) return;

      const file = event.dataTransfer.files[0];
      if (file) void processFile(file);
    },
    [disabled, isUploading, processFile],
  );

  const handleFileInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) void processFile(file);
      event.target.value = "";
    },
    [processFile],
  );

  const removePhoto = () => {
    if (value.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(value.preview);
    }
    onChange({ file: null, preview: null, uploadedUrl: null, isUploading: false });
  };

  if (value.preview) {
    return (
      <div className="relative">
        <div className="relative mx-auto aspect-square max-w-sm overflow-hidden rounded-3xl border-4 border-primary/20 shadow-2xl">
          <img
            src={value.preview}
            alt="Child photo preview"
            className="size-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />

          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/70 backdrop-blur-sm">
              <Loader2 className="size-10 animate-spin text-primary" />
              <p className="text-sm font-medium text-foreground">Uploading photo...</p>
            </div>
          )}

          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-3 right-3 rounded-full shadow-lg"
            onClick={removePhoto}
            disabled={isUploading || disabled}
            aria-label="Remove photo"
          >
            <X className="size-4" />
          </Button>

          <div className="absolute right-3 bottom-3 left-3 flex items-center justify-center gap-2 rounded-full bg-background/90 px-4 py-2 backdrop-blur-sm">
            {isUploading ? (
              <>
                <Loader2 className="size-4 animate-spin text-primary" />
                <span className="text-sm font-medium">Uploading...</span>
              </>
            ) : value.uploadedUrl ? (
              <>
                <Sparkles className="size-4 text-primary" />
                <span className="text-sm font-medium">Photo ready!</span>
              </>
            ) : (
              <span className="text-sm font-medium text-muted-foreground">
                Upload failed — remove and try again
              </span>
            )}
          </div>
        </div>

        <div className="absolute -top-2 -right-2 flex size-8 animate-float items-center justify-center rounded-full bg-carnival-yellow">
          <span className="text-lg">⭐</span>
        </div>
        <div
          className="absolute -bottom-2 -left-2 flex size-8 animate-float items-center justify-center rounded-full bg-carnival-turquoise"
          style={{ animationDelay: "0.5s" }}
        >
          <span className="text-lg">✨</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-300 sm:p-12 ${
        isDragging
          ? "scale-[1.02] border-primary bg-primary/10"
          : "border-border hover:border-primary/50 hover:bg-secondary/50"
      } ${disabled || isUploading ? "pointer-events-none opacity-60" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="absolute inset-0 size-full cursor-pointer opacity-0"
        disabled={disabled || isUploading}
        aria-label="Upload child photo"
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
            {isUploading
              ? "Uploading your photo..."
              : isDragging
                ? "Drop the photo here!"
                : "Drag your child's photo here"}
          </h3>
          <p className="text-sm text-muted-foreground sm:text-base">
            or click to choose from your device
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Sparkles className="size-3 text-carnival-pink" />
            JPG, PNG or HEIC
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="size-3 text-carnival-turquoise" />
            Up to 10MB
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="size-3 text-carnival-green" />
            Face clearly visible
          </span>
        </div>
      </div>
    </div>
  );
}
