"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function AuthCallbackToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("error") === "auth_callback_failed") {
      toast.error("Não foi possível concluir o login. Tente novamente.");
    }
  }, [searchParams]);

  return null;
}
