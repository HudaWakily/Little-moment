"use client"

import { useState, useCallback } from "react"
import { Upload, X, Camera, Sparkles, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PhotoUploadProps {
  onPhotoChange: (file: File | null, preview: string | null) => void
  preview: string | null
}

export function PhotoUpload({ onPhotoChange, preview }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [])

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onPhotoChange(file, result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    onPhotoChange(null, null)
  }

  if (preview) {
    return (
      <div className="relative">
        <div className="relative aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/20">
          {/* Photo preview */}
          <img
            src={preview}
            alt="Foto da criança"
            className="w-full h-full object-cover"
          />
          
          {/* Overlay with sparkle effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
          
          {/* Remove button */}
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-3 right-3 rounded-full shadow-lg"
            onClick={removePhoto}
            aria-label="Remover foto"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Success indicator */}
          <div className="absolute bottom-3 left-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Foto perfeita!</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-carnival-yellow rounded-full flex items-center justify-center animate-float">
          <span className="text-lg">⭐</span>
        </div>
        <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-carnival-turquoise rounded-full flex items-center justify-center animate-float" style={{ animationDelay: "0.5s" }}>
          <span className="text-lg">✨</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative border-3 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 ${
        isDragging
          ? "border-primary bg-primary/10 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-secondary/50"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Upload foto"
      />

      <div className="space-y-4">
        {/* Icon */}
        <div className="relative inline-flex">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            {isDragging ? (
              <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-primary animate-bounce" />
            ) : (
              <Camera className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
            )}
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-carnival-yellow rounded-full flex items-center justify-center animate-sparkle">
            <ImageIcon className="w-4 h-4 text-foreground" />
          </div>
        </div>

        {/* Text */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold font-display text-foreground mb-2">
            {isDragging ? "Solte a foto aqui!" : "Arraste a foto do seu filho"}
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            ou clique para selecionar do seu dispositivo
          </p>
        </div>

        {/* Helper text */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-carnival-pink" />
            JPG, PNG ou HEIC
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-carnival-turquoise" />
            Até 10MB
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-carnival-green" />
            Rosto bem visível
          </span>
        </div>
      </div>
    </div>
  )
}
