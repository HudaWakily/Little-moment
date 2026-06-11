"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Image from "next/image"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Upload, X, GripVertical, ImagePlus, Camera, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { uploadAlbumPhotoAction } from "@/app/actions/upload"
import { cn } from "@/lib/utils"

export interface AlbumPhoto {
  id: string
  file: File
  preview: string
  caption: string
  uploadedUrl?: string | null
  isUploading?: boolean
}

interface SortablePhotoProps {
  photo: AlbumPhoto
  index: number
  onRemove: (id: string) => void
  onCaptionChange: (id: string, caption: string) => void
}

function SortablePhoto({ photo, index, onRemove, onCaptionChange }: SortablePhotoProps) {
  const [isEditingCaption, setIsEditingCaption] = useState(false)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group rounded-2xl overflow-hidden",
        "bg-secondary",
        "border border-border shadow-sm",
        "transition-all duration-300 ease-out",
        isDragging && "z-50 shadow-2xl shadow-primary/20 scale-105 rotate-2"
      )}
    >
      {/* Photo number badge */}
      <div className="absolute top-3 left-3 z-20 w-7 h-7 rounded-full bg-card/90 backdrop-blur-sm shadow-sm flex items-center justify-center">
        <span className="text-xs font-semibold text-primary">{index + 1}</span>
      </div>

      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className={cn(
          "absolute top-3 left-1/2 -translate-x-1/2 z-20",
          "px-3 py-1.5 bg-card/90 backdrop-blur-sm rounded-full shadow-sm",
          "opacity-0 group-hover:opacity-100 transition-all duration-200",
          "cursor-grab active:cursor-grabbing hover:bg-card"
        )}
        aria-label="Arrastar para reordenar"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(photo.id)}
        className={cn(
          "absolute top-3 right-3 z-20",
          "w-8 h-8 rounded-full",
          "bg-card/90 backdrop-blur-sm shadow-sm",
          "flex items-center justify-center",
          "hover:bg-destructive/10 hover:scale-110 transition-all duration-200",
          "group/remove"
        )}
        aria-label="Remover foto"
      >
        <X className="w-4 h-4 text-muted-foreground group-hover/remove:text-destructive" />
      </button>

      {/* Photo */}
      <div className="aspect-square relative m-2 rounded-xl overflow-hidden shadow-inner">
        <Image
          src={photo.preview}
          alt={photo.caption || "Foto do album"}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {photo.isUploading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/70 backdrop-blur-sm">
            <Loader2 className="size-6 animate-spin text-primary" />
            <span className="text-xs font-medium">Uploading...</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Caption */}
      <div className="px-3 pb-3 pt-1">
        {isEditingCaption ? (
          <Input
            value={photo.caption}
            onChange={(e) => onCaptionChange(photo.id, e.target.value)}
            onBlur={() => setIsEditingCaption(false)}
            onKeyDown={(e) => e.key === "Enter" && setIsEditingCaption(false)}
            placeholder="Escreva uma legenda..."
            className="text-sm h-9 rounded-lg border-border focus:border-primary focus:ring-primary/20 bg-card/80"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditingCaption(true)}
            className={cn(
              "w-full text-left flex items-center gap-2 py-1.5 px-2 rounded-lg",
              "text-sm transition-colors duration-200",
              photo.caption 
                ? "text-foreground bg-secondary/50" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <span className="truncate">
              {photo.caption || "Adicionar legenda..."}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}

interface AlbumPhotoGridProps {
  photos: AlbumPhoto[]
  onPhotosChange: (photos: AlbumPhoto[]) => void
  minPhotos?: number
  maxPhotos?: number
}

export function AlbumPhotoGrid({
  photos,
  onPhotosChange,
  minPhotos = 8,
  maxPhotos = 20,
}: AlbumPhotoGridProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isBatchUploading, setIsBatchUploading] = useState(false)
  const photosRef = useRef(photos)

  useEffect(() => {
    photosRef.current = photos
  }, [photos])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        const oldIndex = photos.findIndex((p) => p.id === active.id)
        const newIndex = photos.findIndex((p) => p.id === over.id)
        onPhotosChange(arrayMove(photos, oldIndex, newIndex))
      }
    },
    [photos, onPhotosChange]
  )

  const uploadPhoto = useCallback(
    async (photo: AlbumPhoto) => {
      const formData = new FormData()
      formData.append("file", photo.file)

      const result = await uploadAlbumPhotoAction(formData)

      onPhotosChange(
        photosRef.current.map((item) => {
          if (item.id !== photo.id) return item

          if (!result.success) {
            toast.error(result.error)
            return { ...item, isUploading: false, uploadedUrl: null }
          }

          return {
            ...item,
            isUploading: false,
            uploadedUrl: result.url,
          }
        }),
      )
    },
    [onPhotosChange],
  )

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files) return

      const remainingSlots = maxPhotos - photosRef.current.length
      const filesToAdd = Array.from(files).slice(0, remainingSlots)

      if (!filesToAdd.length) return

      const newPhotos: AlbumPhoto[] = filesToAdd.map((file, index) => ({
        id: `photo-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 9)}`,
        file,
        preview: URL.createObjectURL(file),
        caption: "",
        uploadedUrl: null,
        isUploading: true,
      }))

      onPhotosChange([...photosRef.current, ...newPhotos])
      setIsBatchUploading(true)

      await Promise.all(newPhotos.map((photo) => uploadPhoto(photo)))

      setIsBatchUploading(false)
      toast.success(
        newPhotos.length === 1
          ? "Photo uploaded!"
          : `${newPhotos.length} photos uploaded!`,
      )
    },
    [maxPhotos, onPhotosChange, uploadPhoto],
  )

  const handleRemove = useCallback(
    (id: string) => {
      const photo = photos.find((p) => p.id === id)
      if (photo) {
        URL.revokeObjectURL(photo.preview)
      }
      onPhotosChange(photos.filter((p) => p.id !== id))
    },
    [photos, onPhotosChange]
  )

  const handleCaptionChange = useCallback(
    (id: string, caption: string) => {
      onPhotosChange(
        photos.map((p) => (p.id === id ? { ...p, caption } : p))
      )
    },
    [photos, onPhotosChange]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect]
  )

  const canAddMore = photos.length < maxPhotos
  const progressPercent = (photos.length / maxPhotos) * 100
  const hasMinimum = photos.length >= minPhotos

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300",
          "bg-secondary/50",
          isDragOver
            ? "border-primary bg-primary/10 scale-[1.01] shadow-lg shadow-primary/10"
            : "border-border hover:border-primary/50 hover:shadow-md",
          (!canAddMore || isBatchUploading) && "pointer-events-none opacity-50"
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={!canAddMore}
        />
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              {isBatchUploading ? (
                <Loader2 className="h-9 w-9 animate-spin text-primary" />
              ) : (
                <Camera className="h-9 w-9 text-primary" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-card shadow-md flex items-center justify-center">
              <Upload className="w-4 h-4 text-primary" />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-xl font-semibold">
              {isBatchUploading ? "Uploading photos..." : "Drag your special photos"}
            </p>
            <p className="text-muted-foreground">
              ou clique para escolher do seu dispositivo
            </p>
          </div>
          
          <div className="flex items-center gap-3 px-5 py-2.5 bg-card rounded-full shadow-sm">
            <span className="text-sm font-medium">
              {photos.length} de {maxPhotos} fotos
            </span>
            {photos.length < minPhotos && (
              <span className="text-xs text-muted-foreground">
                (minimo {minPhotos})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {photos.length > 0 && (
        <div className="space-y-3 px-1">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">
              {hasMinimum ? "Pronto para criar!" : "Continue adicionando..."}
            </span>
            <span className="font-semibold">
              {photos.length}/{maxPhotos}
            </span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-700 ease-out rounded-full",
                hasMinimum
                  ? "bg-carnival-green"
                  : "bg-primary"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {!hasMinimum && (
            <p className="text-sm text-muted-foreground text-center">
              Adicione mais {minPhotos - photos.length} foto(s) para criar seu album
            </p>
          )}
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <SortablePhoto
                  key={photo.id}
                  photo={photo}
                  index={index}
                  onRemove={handleRemove}
                  onCaptionChange={handleCaptionChange}
                />
              ))}
              
              {/* Add More Card */}
              {canAddMore && (
                <label
                  className={cn(
                    "aspect-square rounded-2xl",
                    "border-2 border-dashed border-border",
                    "bg-secondary/50",
                    "flex flex-col items-center justify-center gap-3 cursor-pointer",
                    "hover:border-primary/50 hover:bg-secondary hover:shadow-md",
                    "transition-all duration-300 group"
                  )}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors duration-200">
                    <ImagePlus className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                    Adicionar mais
                  </span>
                </label>
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
