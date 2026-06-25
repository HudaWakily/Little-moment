"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { normalizeAuthEmail } from "@/lib/auth/errors";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ResendConfirmationButtonProps = {
  email: string;
  redirectTo?: string;
};

export function ResendConfirmationButton({
  email,
  redirectTo = "/",
}: ResendConfirmationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleResend = async () => {
    const normalizedEmail = normalizeAuthEmail(email);
    if (!normalizedEmail) return;

    setIsLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const callbackUrl = new URL("/auth/callback", window.location.origin);
      callbackUrl.searchParams.set("redirectTo", redirectTo);

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: normalizedEmail,
        options: {
          emailRedirectTo: callbackUrl.toString(),
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("E-mail de confirmação reenviado! Verifique sua caixa de entrada.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível reenviar o e-mail.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="w-full rounded-xl"
      onClick={handleResend}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Reenviando...
        </>
      ) : (
        "Reenviar e-mail de confirmação"
      )}
    </Button>
  );
}
