"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";

import { finalizeAuthSession } from "@/app/actions/auth";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuthErrorMessage, normalizeAuthEmail } from "@/lib/auth/errors";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function normalizeRedirect(path: string) {
  if (path === "/criar") return "/create/story";
  return path.startsWith("/") ? path : "/";
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = normalizeRedirect(searchParams.get("redirectTo") ?? "/");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem. Verifique e tente novamente.");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const normalizedEmail = normalizeAuthEmail(email);

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) {
        toast.error(getAuthErrorMessage(error));
        return;
      }

      if (data.user?.identities?.length === 0) {
        toast.error(
          "Este e-mail já está cadastrado. Faça login ou confirme seu e-mail se ainda não confirmou.",
        );
        router.push(`/login?redirectTo=${encodeURIComponent(redirectTo)}&confirmEmail=1`);
        return;
      }

      if (data.session) {
        try {
          await finalizeAuthSession();
        } catch {
          // Profile sync is best-effort; session is already in the browser.
        }

        toast.success("Conta criada com sucesso! Bem-vindo ao Little Moment.");
        window.location.href = redirectTo;
        return;
      }

      toast.success(
        "Conta criada! Enviamos um e-mail de confirmação — clique no link antes de entrar.",
      );
      router.push(
        `/login?redirectTo=${encodeURIComponent(redirectTo)}&confirmEmail=1&email=${encodeURIComponent(normalizedEmail)}`,
      );
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
          <Label htmlFor="fullName">Nome completo</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="Seu nome"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              disabled={isLoading}
              className="h-12 rounded-xl border-2 pl-10"
            />
          </div>
        </div>

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
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              disabled={isLoading}
              className="h-12 rounded-xl border-2 pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repita sua senha"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
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
              Criando conta...
            </>
          ) : (
            "Criar conta"
          )}
        </Button>
      </form>
    </div>
  );
}
