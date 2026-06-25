"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

import { finalizeAuthSession } from "@/app/actions/auth";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuthErrorMessage, isInvalidCredentialsError, normalizeAuthEmail } from "@/lib/auth/errors";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ResendConfirmationButton } from "@/components/auth/resend-confirmation-button";

function normalizeRedirect(path: string) {
  if (path === "/criar") return "/create/story";
  return path.startsWith("/") ? path : "/";
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = normalizeRedirect(searchParams.get("redirectTo") ?? "/");
  const confirmEmail = searchParams.get("confirmEmail") === "1";
  const emailFromQuery = searchParams.get("email") ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResendConfirmation, setShowResendConfirmation] = useState(confirmEmail);

  useEffect(() => {
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [emailFromQuery]);

  useEffect(() => {
    if (confirmEmail) {
      toast.message("Confirme seu e-mail", {
        description: "Abra o link que enviamos antes de tentar entrar.",
      });
    }
  }, [confirmEmail]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setShowResendConfirmation(false);

    const normalizedEmail = normalizeAuthEmail(email);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data: sessionData, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        //toast.error(getAuthErrorMessage(error));
        console.log(error);
        if (isInvalidCredentialsError(error)) {
          setShowResendConfirmation(true);
        }
        return;
      }

      if (!sessionData.session) {
        toast.error("Confirme seu e-mail antes de entrar.");
        setShowResendConfirmation(true);
        return;
      }

      try {
        await finalizeAuthSession();
      } catch {
        // Profile sync is best-effort; session is already in the browser.
      }

      toast.success("Bem-vindo de volta!");
      window.location.href = redirectTo;
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <GoogleSignInButton redirectTo={redirectTo} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">ou com e-mail</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isLoading}
              className="h-12 rounded-xl border-2 pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              disabled={isLoading}
              className="h-12 rounded-xl border-2 pl-10"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 w-full rounded-xl text-base font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>

        {showResendConfirmation && email.trim() && (
          <div className="space-y-2 rounded-xl border border-border bg-secondary/40 p-4">
            <p className="text-sm text-muted-foreground">
              Acabou de se cadastrar? Confirme seu e-mail ou peça um novo link:
            </p>
            <ResendConfirmationButton
              email={email}
              redirectTo={redirectTo}
            />
          </div>
        )}
      </form>
    </div>
  );
}
