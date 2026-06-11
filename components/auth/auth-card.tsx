import { Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      <AuthBackground />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="relative">
            <Sparkles className="size-8 text-primary animate-sparkle" />
            <div className="absolute inset-0 size-8 rounded-full bg-primary/20 blur-lg" />
          </div>
          <span className="text-2xl font-bold font-display">
            Little <span className="text-primary">Moment</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-border bg-card/95 p-6 shadow-xl backdrop-blur-sm sm:p-8">
          <div className="mb-6 space-y-2 text-center">
            <h1 className="text-2xl font-bold font-display sm:text-3xl">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>

        <div className="mt-6 text-center text-sm">{footer}</div>
      </div>
    </main>
  );
}

function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute top-1/4 -left-32 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 size-96 rounded-full bg-carnival-turquoise/10 blur-3xl" />
      <Sparkles className="absolute top-24 right-[18%] size-8 text-carnival-yellow animate-sparkle" />
    </div>
  );
}
