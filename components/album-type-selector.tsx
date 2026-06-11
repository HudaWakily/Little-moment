"use client"

import { Baby, Calendar, Cake, Heart, Star, Camera, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AlbumType {
  id: string
  name: string
  description: string
  icon: React.ElementType
  color: string
}

export const albumTypes: AlbumType[] = [
  {
    id: "primeiro-mes",
    name: "Primeiro Mes",
    description: "Os 30 primeiros dias",
    icon: Baby,
    color: "from-carnival-pink to-pink-400",
  },
  {
    id: "3-meses",
    name: "3 Meses",
    description: "Trimestre de descobertas",
    icon: Heart,
    color: "from-pink-400 to-carnival-coral",
  },
  {
    id: "6-meses",
    name: "6 Meses",
    description: "Momentos magicos",
    icon: Star,
    color: "from-carnival-yellow to-carnival-gold",
  },
  {
    id: "primeiro-ano",
    name: "Primeiro Ano",
    description: "365 dias especiais",
    icon: Calendar,
    color: "from-carnival-turquoise to-cyan-400",
  },
  {
    id: "aniversario",
    name: "Aniversario",
    description: "Festa e celebracao",
    icon: Cake,
    color: "from-violet-400 to-purple-400",
  },
  {
    id: "momentos-especiais",
    name: "Momentos Especiais",
    description: "Memorias unicas",
    icon: Camera,
    color: "from-carnival-green to-teal-400",
  },
]

interface AlbumTypeSelectorProps {
  selectedType: string | null
  onSelect: (typeId: string) => void
}

export function AlbumTypeSelector({
  selectedType,
  onSelect,
}: AlbumTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {albumTypes.map((type) => {
        const isSelected = selectedType === type.id
        const IconComponent = type.icon
        
        return (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={cn(
              "relative p-5 rounded-2xl transition-all duration-300 ease-out",
              "border-2 text-left",
              "hover:scale-[1.03] hover:-translate-y-1 hover:shadow-lg",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
              isSelected
                ? "border-primary bg-secondary shadow-lg shadow-primary/10"
                : "border-border bg-card hover:border-primary/30"
            )}
          >
            {/* Icon with gradient */}
            <div className={cn(
              "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-md transition-transform duration-300",
              type.color,
              isSelected && "scale-110"
            )}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            
            <h4 className={cn(
              "font-semibold text-base mb-1 transition-colors",
              isSelected ? "text-foreground" : "text-foreground"
            )}>
              {type.name}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {type.description}
            </p>
            
            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
