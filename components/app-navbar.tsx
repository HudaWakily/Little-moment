"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Images, Home, LogOut, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const navLinks = [
  { href: "/", label: "Início", icon: Home },
  { href: "/create/story", label: "Criar História", icon: BookOpen },
  { href: "/create/album", label: "Criar Álbum", icon: Images },
];

export function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error("Não foi possível sair da conta. Tente novamente.");
        return;
      }

      toast.success("Você saiu da sua conta.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Não foi possível sair da conta. Tente novamente.");
    } finally {
      setIsLoggingOut(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <div className="relative">
            <Sparkles className="size-7 animate-sparkle text-primary sm:size-8" />
            <div className="absolute inset-0 size-7 rounded-full bg-primary/20 blur-lg sm:size-8" />
          </div>
          <span className="font-display text-xl font-bold text-foreground sm:text-2xl">
            Little <span className="text-primary">Moment</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 font-medium transition-colors",
                pathname === href || pathname.startsWith(`${href}/`)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="size-4" />
            Sair
          </Button>
        </div>

        <button
          type="button"
          className="p-2 text-foreground md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menu"
        >
          {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
              <div className="space-y-1 px-4 py-4">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 font-medium",
                  pathname === href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground",
                )}
              >
                <Icon className="size-5" />
                {label}
              </Link>
            ))}
            <Button
              variant="outline"
              className="mt-2 w-full rounded-full"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="size-4" />
              Sair
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
