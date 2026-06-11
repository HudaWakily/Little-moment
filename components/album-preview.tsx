"use client"

import Image from "next/image"
import { BookOpen, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { AlbumPhoto } from "./album-photo-grid"
import { FALLBACK_ALBUM_THEMES } from "@/lib/themes/fallback"
import type { AlbumThemeDisplay } from "@/types/themes"
import { albumLayouts } from "./album-layout-selector"

interface AlbumPreviewProps {
  photos: AlbumPhoto[]
  title: string
  themeId: string | null
  themes?: AlbumThemeDisplay[]
  layoutId?: string
}

export function AlbumPreview({
  photos,
  title,
  themeId,
  themes = FALLBACK_ALBUM_THEMES,
  layoutId = "duo",
}: AlbumPreviewProps) {
  const [currentSpread, setCurrentSpread] = useState(0)
  
  const theme = themes.find((t) => t.id === themeId) || themes[0]
  const layout = albumLayouts.find((l) => l.id === layoutId) || albumLayouts[1]
  const photosPerSpread = layout.photosPerPage
  
  // Create page spreads based on layout
  const spreads: (AlbumPhoto | null)[][] = []
  for (let i = 0; i < photos.length; i += photosPerSpread) {
    const spread: (AlbumPhoto | null)[] = []
    for (let j = 0; j < photosPerSpread; j++) {
      spread.push(photos[i + j] || null)
    }
    spreads.push(spread)
  }
  
  const totalSpreads = Math.max(1, spreads.length)
  
  // Reset current spread when photos change
  useEffect(() => {
    if (currentSpread >= totalSpreads) {
      setCurrentSpread(Math.max(0, totalSpreads - 1))
    }
  }, [totalSpreads, currentSpread])
  
  const goToPrev = () => {
    setCurrentSpread((prev) => Math.max(0, prev - 1))
  }
  
  const goToNext = () => {
    setCurrentSpread((prev) => Math.min(totalSpreads - 1, prev + 1))
  }

  if (photos.length === 0) {
    return (
      <div className="rounded-2xl bg-secondary p-8 border border-border">
        <div className="flex flex-col items-center justify-center text-center gap-5 min-h-[280px]">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center animate-float">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-carnival-yellow flex items-center justify-center shadow-md">
              <Sparkles className="w-3 h-3 text-carnival-gold" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold font-display">
              Seu Album
            </h3>
            <p className="text-muted-foreground max-w-[240px]">
              Adicione fotos para ver a pre-visualizacao
            </p>
          </div>
        </div>
      </div>
    )
  }

  const currentSpreadData = spreads[currentSpread] || []

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Pagina {currentSpread + 1} de {totalSpreads}
        </span>
      </div>
      
      {/* Album Book */}
      <div className="relative">
        {/* Book shadow */}
        <div className="absolute inset-x-4 -bottom-3 h-8 bg-gradient-to-t from-muted/50 to-transparent rounded-b-3xl blur-xl" />
        
        {/* Book container */}
        <div className={cn(
          "relative rounded-2xl overflow-hidden shadow-xl",
          "bg-gradient-to-br p-1.5",
          theme.colors.primary
        )}>
          {/* Book spine effect */}
          {photosPerSpread >= 2 && (
            <div className="absolute left-1/2 top-0 bottom-0 w-3 -translate-x-1/2 bg-gradient-to-r from-black/10 via-black/5 to-black/10 z-10" />
          )}
          
          {/* Pages container */}
          <div className={cn(
            "bg-card rounded-xl overflow-hidden",
            photosPerSpread === 1 && "p-1",
            photosPerSpread === 2 && "grid grid-cols-2 gap-px",
            photosPerSpread === 4 && "grid grid-cols-2 gap-px",
            photosPerSpread === 6 && "grid grid-cols-3 gap-px"
          )}>
            {currentSpreadData.map((photo, idx) => (
              <div
                key={idx}
                className={cn(
                  "relative p-3 sm:p-4",
                  theme.colors.secondary,
                  photosPerSpread === 1 && "aspect-[4/5]",
                  photosPerSpread === 2 && "aspect-[3/4]",
                  photosPerSpread === 4 && "aspect-square",
                  photosPerSpread === 6 && "aspect-square"
                )}
              >
                {photo ? (
                  <div className="h-full flex flex-col">
                    {/* Photo frame */}
                    <div className="flex-1 relative rounded-lg overflow-hidden shadow-md ring-1 ring-black/5">
                      <Image
                        src={photo.preview}
                        alt={photo.caption || "Foto do album"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Caption */}
                    {photo.caption && (
                      <div className="mt-2">
                        <p className={cn(
                          "text-xs sm:text-sm line-clamp-2",
                          theme.colors.text,
                          "opacity-80"
                        )}>
                          {photo.caption}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center rounded-lg border-2 border-dashed border-border">
                    <span className="text-sm text-muted-foreground">Vazio</span>
                  </div>
                )}
                
                {/* Decorative corner elements based on theme */}
                {theme.pattern === "carnival" && idx === 0 && (
                  <div className="absolute bottom-2 left-2 flex gap-1 opacity-40">
                    <div className="w-1.5 h-1.5 rounded-full bg-carnival-pink" />
                    <div className="w-1.5 h-1.5 rounded-full bg-carnival-turquoise" />
                    <div className="w-1.5 h-1.5 rounded-full bg-carnival-yellow" />
                  </div>
                )}
                {theme.pattern === "nature" && (
                  <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-carnival-green/40" />
                )}
                {theme.pattern === "enchanted" && (
                  <svg className="absolute bottom-2 right-2 w-4 h-4 text-carnival-gold/50" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
                  </svg>
                )}
                {theme.pattern === "minimal" && (
                  <div className="absolute bottom-2 left-2 w-6 h-px bg-border" />
                )}
              </div>
            ))}
          </div>
          
          {/* Album Title on first spread */}
          {currentSpread === 0 && title && (
            <div className="absolute top-3 left-0 right-0 text-center pointer-events-none">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-card/90 backdrop-blur-sm rounded-full text-sm font-semibold shadow-sm">
                {title}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex items-center justify-between px-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPrev}
          disabled={currentSpread === 0}
          className="rounded-full"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Anterior</span>
        </Button>
        
        {/* Page indicators */}
        <div className="flex gap-2">
          {spreads.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSpread(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentSpread
                  ? "bg-primary scale-125"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Ir para pagina ${index + 1}`}
            />
          ))}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={goToNext}
          disabled={currentSpread === totalSpreads - 1}
          className="rounded-full"
        >
          <span className="hidden sm:inline">Proxima</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
      
      {/* Photo count indicator */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {photos.length} {photos.length === 1 ? "foto" : "fotos"} no album
        </p>
      </div>
    </div>
  )
}
