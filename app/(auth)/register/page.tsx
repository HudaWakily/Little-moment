import Link from "next/link";
import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";

function RegisterFormFallback() {
  return (
    <div className="flex justify-center py-8">
      <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <AuthCard
      title="Criar conta"
      description="Comece agora a montar o Momentinho Mágico da sua família."
      footer={
        <p className="text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Entrar
          </Link>
        </p>
      }
    >
      <Suspense fallback={<RegisterFormFallback />}>
        <RegisterForm />
      </Suspense>
    </AuthCard>
  );
}
