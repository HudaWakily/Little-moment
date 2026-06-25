"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback`,
      });

      if (error) {
        toast.error(getAuthErrorMessage(error));
        return;
      }

      toast.success(
        "Solicitação enviada! Verifique seu e-mail para redefinir a senha.",
      );
    } catch (resetError) {
      toast.error(getAuthErrorMessage(resetError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            Enviando...
          </>
        ) : (
          "Redefinir senha"
        )}
      </Button>
    </form>
  );
}
