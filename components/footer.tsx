import Link from "next/link"
import { Sparkles, Heart, Instagram, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-carnival-yellow" />
              <span className="text-xl font-bold font-display">
                Little <span className="text-carnival-pink">Moment</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Criando memórias mágicas para famílias brasileiras através de 
              histórias personalizadas que encantam corações.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-bold font-display text-lg">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/create/story" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Criar Meu Livro
                </Link>
              </li>
              <li>
                <Link href="#como-funciona" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-bold font-display text-lg">Fale Conosco</h3>
            <p className="text-primary-foreground/70 text-sm">
              Dúvidas? Estamos aqui para ajudar!
            </p>
            <p className="text-sm">
              <a href="mailto:ola@littlemoment.com.br" className="text-carnival-yellow hover:underline">
                ola@littlemoment.com.br
              </a>
            </p>
            <p className="text-primary-foreground/70 text-sm">
              Seg - Sex: 9h às 18h
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/60 text-sm text-center sm:text-left">
            © 2024 Little Moment. Todos os direitos reservados.
          </p>
          <p className="text-primary-foreground/60 text-sm flex items-center gap-1">
            Feito com <Heart className="w-4 h-4 text-primary fill-primary" /> no Brasil
          </p>
        </div>
      </div>
    </footer>
  )
}
