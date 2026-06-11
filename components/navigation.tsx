"use client"

import Link from "next/link"
import { Sparkles, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-primary animate-sparkle" />
              <div className="absolute inset-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary/20 rounded-full blur-lg" />
            </div>
            <span className="text-xl sm:text-2xl font-bold font-display text-foreground">
              Little <span className="text-primary">Moment</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Inicio
            </Link>
            <Link 
              href="/create/story" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Criar História
            </Link>
            <Link 
              href="/create/album" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Criar Álbum
            </Link>
            <Link 
              href="#como-funciona" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Como Funciona
            </Link>
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Entrar
            </Link>
            <Button asChild className="rounded-full px-6 bg-primary hover:bg-primary/90">
              <Link href="/create/story">
                <Sparkles className="w-4 h-4 mr-2" />
                Criar Agora
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-4 py-4 space-y-4">
            <Link 
              href="/" 
              className="block text-foreground font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              href="/create/story" 
              className="block text-foreground font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Criar História
            </Link>
            <Link 
              href="/create/album" 
              className="block text-foreground font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Criar Álbum
            </Link>
            <Link 
              href="#como-funciona" 
              className="block text-foreground font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Como Funciona
            </Link>
            <Link
              href="/login"
              className="block text-foreground font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Entrar
            </Link>
            <Button asChild className="w-full rounded-full bg-primary hover:bg-primary/90">
              <Link href="/create/story" onClick={() => setIsMenuOpen(false)}>
                <Sparkles className="w-4 h-4 mr-2" />
                Criar Agora
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
