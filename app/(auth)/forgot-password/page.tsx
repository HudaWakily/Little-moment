import Link from "next/link";
import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

function ForgotPasswordFormFallback() {
  return (
    <div className="flex justify-center py-8">
      <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Recuperar senha"
      description="Enviaremos um link para redefinir sua senha."
      footer={
        <p className="text-muted-foreground">
          Lembrou a senha?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Entrar
          </Link>
        </p>
      }
    >
      <Suspense fallback={<ForgotPasswordFormFallback />}>
        <ForgotPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
