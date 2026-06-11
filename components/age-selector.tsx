"use client"

import { cn } from "@/lib/utils"

interface AgeSelectorProps {
  selectedAge: number | null
  onSelectAge: (age: number) => void
}

const ages = [3, 4, 5, 6, 7, 8, 9]

export function AgeSelector({ selectedAge, onSelectAge }: AgeSelectorProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {ages.map((age) => {
        const isSelected = selectedAge === age
        
        return (
          <button
            key={age}
            onClick={() => onSelectAge(age)}
            className={cn(
              "w-14 h-14 sm:w-16 sm:h-16 rounded-full font-bold text-lg sm:text-xl font-display transition-all duration-300",
              "flex items-center justify-center",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "hover:scale-110",
              isSelected
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
            aria-label={`${age} anos`}
          >
            {age}
          </button>
        )
      })}
      <span className="text-muted-foreground font-medium ml-2">anos</span>
    </div>
  )
}
