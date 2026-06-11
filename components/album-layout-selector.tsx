"use client"

import { Check, LayoutGrid, Grid2X2, Square, Columns2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AlbumLayout {
  id: string
  name: string
  photosPerPage: number
  icon: React.ElementType
  description: string
}

export const albumLayouts: AlbumLayout[] = [
  {
    id: "single",
    name: "Uma Foto",
    photosPerPage: 1,
    icon: Square,
    description: "Destaque para cada momento",
  },
  {
    id: "duo",
    name: "Duas Fotos",
    photosPerPage: 2,
    icon: Columns2,
    description: "Lado a lado em harmonia",
  },
  {
    id: "quad",
    name: "Quatro Fotos",
    photosPerPage: 4,
    icon: Grid2X2,
    description: "Mosaico de memorias",
  },
  {
    id: "collage",
    name: "Colagem",
    photosPerPage: 6,
    icon: LayoutGrid,
    description: "Album completo",
  },
]

interface AlbumLayoutSelectorProps {
  selectedLayout: string
  onSelect: (layoutId: string) => void
}

export function AlbumLayoutSelector({
  selectedLayout,
  onSelect,
}: AlbumLayoutSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {albumLayouts.map((layout) => {
        const isSelected = selectedLayout === layout.id
        const Icon = layout.icon
        
        return (
          <button
            key={layout.id}
            onClick={() => onSelect(layout.id)}
            className={cn(
              "relative flex flex-col items-center p-4 rounded-2xl transition-all duration-300",
              "border-2 focus:outline-none focus:ring-2 focus:ring-primary/30",
              "hover:scale-[1.02] hover:-translate-y-0.5",
              isSelected
                ? "border-primary bg-secondary shadow-md shadow-primary/10"
                : "border-border bg-card hover:border-primary/30 hover:bg-secondary/50"
            )}
          >
            {/* Icon */}
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors",
              isSelected
                ? "bg-primary/20 text-primary"
                : "bg-secondary text-muted-foreground"
            )}>
              <Icon className="w-6 h-6" />
            </div>
            
            {/* Layout preview mini-grid */}
            <div className="w-10 h-8 mb-2 flex flex-wrap gap-0.5 justify-center items-center">
              {Array.from({ length: layout.photosPerPage }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-sm transition-colors",
                    isSelected ? "bg-primary" : "bg-muted-foreground/30",
                    layout.photosPerPage === 1 && "w-8 h-6",
                    layout.photosPerPage === 2 && "w-4 h-6",
                    layout.photosPerPage === 4 && "w-4 h-3",
                    layout.photosPerPage === 6 && "w-3 h-2"
                  )}
                />
              ))}
            </div>
            
            {/* Text */}
            <span className={cn(
              "text-sm font-medium transition-colors",
              isSelected ? "text-foreground" : "text-muted-foreground"
            )}>
              {layout.name}
            </span>
            <span className="text-xs text-muted-foreground text-center mt-0.5">
              {layout.description}
            </span>
            
            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
