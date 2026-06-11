"use client"

import Image from "next/image"
import { Crown, Sparkles, Waves, TreePine, Music, Flame } from "lucide-react"

const bookPreviews = [
  {
    title: "Princesa do Carnaval",
    color: "bg-gradient-to-br from-pink-400 to-pink-600",
    icon: Crown,
    emoji: "👑",
    image: "/images/princess-carnival.jpg",
  },
  {
    title: "Herói do Futebol",
    color: "bg-gradient-to-br from-green-500 to-green-700",
    icon: Flame,
    emoji: "⚽",
    image: "/images/soccer-hero.jpg",
  },
  {
    title: "Iara Sereia",
    color: "bg-gradient-to-br from-cyan-400 to-teal-600",
    icon: Waves,
    emoji: "🧜‍♀️",
    image: "/images/iara-mermaid.jpg",
  },
  {
    title: "Explorador da Amazônia",
    color: "bg-gradient-to-br from-emerald-500 to-green-700",
    icon: TreePine,
    emoji: "🌿",
    image: "/images/amazon-explorer.jpg",
  },
  {
    title: "Festa Junina",
    color: "bg-gradient-to-br from-amber-400 to-orange-500",
    icon: Music,
    emoji: "🎉",
    image: "/images/festa-junina.jpg",
  },
  {
    title: "Saci-Pererê",
    color: "bg-gradient-to-br from-red-500 to-red-700",
    icon: Sparkles,
    emoji: "🔥",
    image: "/images/saci-perere.jpg",
  },
]

export function BookPreviews() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-4 text-balance">
            Histórias que encantam
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Escolha entre temas mágicos inspirados na cultura brasileira
          </p>
        </div>

        {/* Book grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {bookPreviews.map((book, index) => {
            const IconComponent = book.icon
            return (
              <div
                key={book.title}
                className="group relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Book card */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:-rotate-2">
                  {/* Book cover image */}
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                  />
                  
                  {/* Overlay gradient */}
                  <div className={`absolute inset-0 ${book.color} opacity-30`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Book spine effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/20" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-primary-foreground">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg sm:text-xl">{book.emoji}</span>
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold leading-tight">
                      {book.title}
                    </h3>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* Shadow under book */}
                <div className="absolute -bottom-2 left-2 right-2 h-4 bg-black/10 rounded-full blur-md" />
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-muted-foreground">
            <Sparkles className="w-4 h-4 inline mr-2 text-carnival-yellow" />
            E muitos outros temas mágicos esperando por você!
            <Sparkles className="w-4 h-4 inline ml-2 text-carnival-yellow" />
          </p>
        </div>
      </div>
    </section>
  )
}
