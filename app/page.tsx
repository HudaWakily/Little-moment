import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { BookPreviews } from "@/components/book-previews"
import { Footer } from "@/components/footer"
import { Sparkles, BookOpen, Heart, Camera, Wand2, Gift } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <BookPreviews />
      
      {/* How it works section */}
      <section id="como-funciona" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Super Fácil</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-4 text-balance">
              Como funciona a magia?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Em apenas 3 passos simples, crie uma história única para seu pequeno
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
            {/* Step 1 */}
            <div className="relative text-center group">
              <div className="relative inline-flex mb-6">
                <div className="w-20 h-20 bg-carnival-pink/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Camera className="w-10 h-10 text-carnival-pink" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold font-display mb-3">Envie uma Foto</h3>
              <p className="text-muted-foreground leading-relaxed">
                Escolha a foto mais linda do seu filho. O rostinho dele será o protagonista da história!
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center group">
              <div className="relative inline-flex mb-6">
                <div className="w-20 h-20 bg-carnival-turquoise/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Wand2 className="w-10 h-10 text-carnival-turquoise" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold font-display mb-3">Escolha o Tema</h3>
              <p className="text-muted-foreground leading-relaxed">
                Princesa, super-herói, sereia... Temos temas incríveis inspirados na cultura brasileira!
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center group">
              <div className="relative inline-flex mb-6">
                <div className="w-20 h-20 bg-carnival-yellow/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Gift className="w-10 h-10 text-carnival-gold" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold font-display mb-3">Receba a Magia</h3>
              <p className="text-muted-foreground leading-relaxed">
                Em instantes, seu livro personalizado estará pronto para encantar toda a família!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Trust section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-4 text-balance">
              Mamães que amaram ❤️
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {/* Testimonial 1 */}
            <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-carnival-pink rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  A
                </div>
                <div>
                  <p className="font-bold">Ana Paula</p>
                  <p className="text-sm text-muted-foreground">Mãe do Pedro, 5 anos</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {'"Meu filho não larga o livro! Ele se sente um verdadeiro herói. Chorei de emoção quando vi o resultado."'}
              </p>
              <div className="flex text-carnival-yellow">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-carnival-turquoise rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  M
                </div>
                <div>
                  <p className="font-bold">Mariana Santos</p>
                  <p className="text-sm text-muted-foreground">Mãe da Sofia, 4 anos</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {'"A Sofia pediu para ler a história dela toda noite. É o presente mais especial que já dei para ela!"'}
              </p>
              <div className="flex text-carnival-yellow">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-carnival-green rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  C
                </div>
                <div>
                  <p className="font-bold">Camila Oliveira</p>
                  <p className="text-sm text-muted-foreground">Mãe do Davi, 6 anos</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {'"Presenteei no aniversário e foi sucesso absoluto! Todos os convidados queriam saber onde comprei."'}
              </p>
              <div className="flex text-carnival-yellow">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <BookOpen className="w-16 h-16 mx-auto text-primary mb-6" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-6 text-balance">
              Pronto para criar memórias mágicas?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Dê ao seu filho o presente mais especial: uma história onde ele é o herói.
            </p>
            <a
              href="/criar"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              Criar Meu Momentinho Agora
              <Heart className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
