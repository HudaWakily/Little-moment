import Link from "next/link";
import { Suspense } from "react";

import { AuthCallbackToast } from "@/components/auth/auth-callback-toast";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

function LoginFormFallback() {
  return (
    <div className="flex justify-center py-8">
      <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthCard
      title="Entrar"
      description="Acesse sua conta para continuar criando momentos mágicos."
      footer={
        <p className="text-muted-foreground">
          Não tem conta? {" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Criar conta
          </Link>
        </p>
      }
    >
      <Suspense fallback={<LoginFormFallback />}>
        <AuthCallbackToast />
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
