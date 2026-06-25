"use client"

import Link from "next/link"
import { Sparkles, Star, Heart, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating decorative elements */}
        <div className="absolute top-32 left-[10%] animate-float">
          <Star className="w-8 h-8 text-carnival-yellow fill-carnival-yellow" style={{ animationDelay: "0s" }} />
        </div>
        <div className="absolute top-40 right-[15%] animate-float" style={{ animationDelay: "1s" }}>
          <Heart className="w-6 h-6 text-primary fill-primary/50" />
        </div>
        <div className="absolute bottom-40 left-[20%] animate-float" style={{ animationDelay: "0.5s" }}>
          <Sparkles className="w-10 h-10 text-carnival-turquoise" />
        </div>
        <div className="absolute top-60 right-[8%] animate-float" style={{ animationDelay: "1.5s" }}>
          <BookOpen className="w-8 h-8 text-carnival-green" />
        </div>
        <div className="absolute bottom-60 right-[25%] animate-float" style={{ animationDelay: "2s" }}>
          <Star className="w-5 h-5 text-carnival-gold fill-carnival-gold" />
        </div>
        
        {/* Soft gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-carnival-turquoise/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-carnival-yellow/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 sm:mb-8">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Momentinho Mágico</span>
          <Sparkles className="w-4 h-4" />
        </div>

        {/* Main headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-tight mb-6 text-balance">
          Transforme a foto do seu filho em um{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-primary">livro de histórias mágico!</span>
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 300 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 8C50 2 100 2 150 6C200 10 250 4 298 8"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                className="text-carnival-yellow"
              />
            </svg>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-10 text-pretty leading-relaxed">
          Crie seu <span className="text-primary font-semibold">Momentinho Mágico</span> personalizado 
          com o rostinho dele como príncipe, princesa ou herói brasileiro
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            asChild 
            size="lg" 
            className="rounded-full px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
          >
            <Link href="/criar">
              <Sparkles className="w-5 h-5 mr-2" />
              Criar Meu Momentinho Agora
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            ✨ Mais de 10.000 famílias felizes
          </p>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              <div className="w-8 h-8 rounded-full bg-carnival-pink flex items-center justify-center text-primary-foreground text-xs font-bold">M</div>
              <div className="w-8 h-8 rounded-full bg-carnival-turquoise flex items-center justify-center text-primary-foreground text-xs font-bold">A</div>
              <div className="w-8 h-8 rounded-full bg-carnival-yellow flex items-center justify-center text-foreground text-xs font-bold">L</div>
            </div>
            <span className="text-sm">Amado por mamães</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-carnival-yellow fill-carnival-yellow" />
              ))}
            </div>
            <span className="text-sm">4.9/5 estrelas</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <span className="text-sm">Feito com amor no Brasil</span>
          </div>
        </div>
      </div>
    </section>
  )
}
