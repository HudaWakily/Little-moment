type AuthErrorLike = {
  message?: string;
  code?: string;
};

function getAuthErrorDetails(error: unknown): AuthErrorLike {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: "code" in error ? String((error as { code?: string }).code) : undefined,
    };
  }

  if (typeof error === "object" && error !== null) {
    return {
      message: "message" in error ? String((error as { message: string }).message) : undefined,
      code: "code" in error ? String((error as { code?: string }).code) : undefined,
    };
  }

  return {};
}

export function normalizeAuthEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getAuthErrorMessage(error: unknown): string {
  const { message = "", code = "" } = getAuthErrorDetails(error);
  const normalized = message.toLowerCase();
  const normalizedCode = code.toLowerCase();

  if (
    normalizedCode === "email_not_confirmed" ||
    normalized.includes("email not confirmed")
  ) {
    return "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada (e spam).";
  }

  if (
    normalizedCode === "invalid_credentials" ||
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid credentials")
  ) {
    return "E-mail ou senha incorretos. Se você acabou de se cadastrar, confirme seu e-mail antes de entrar.";
  }

  if (
    normalizedCode === "user_already_registered" ||
    normalized.includes("user already registered") ||
    normalized.includes("already been registered")
  ) {
    return "Este e-mail já está cadastrado. Faça login ou use outro e-mail.";
  }

  if (normalized.includes("password should be at least")) {
    return "A senha deve ter pelo menos 6 caracteres.";
  }

  if (normalized.includes("unable to validate email")) {
    return "Informe um e-mail válido.";
  }

  if (normalized.includes("signup is disabled")) {
    return "Cadastro temporariamente indisponível. Tente novamente mais tarde.";
  }

  if (normalized.includes("rate limit") || normalizedCode === "over_email_send_rate_limit") {
    return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
  }

  if (normalized.includes("provider is not enabled")) {
    return "Login com Google não está disponível no momento.";
  }

  if (normalized.includes("missing supabase environment variables")) {
    return "Configuração do Supabase ausente. Verifique as variáveis de ambiente.";
  }

  if (
    normalized.includes("failed to fetch") ||
    normalized.includes("fetch failed") ||
    normalized.includes("network")
  ) {
    return "Não foi possível conectar ao Supabase. Verifique NEXT_PUBLIC_SUPABASE_URL no .env.local (use apenas https://seu-projeto.supabase.co, sem /rest/v1).";
  }

  if (normalized.includes("invalid api key")) {
    return "Chave do Supabase inválida. Verifique NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local.";
  }

  return message || "Não foi possível concluir a operação. Tente novamente.";
}

export function isInvalidCredentialsError(error: unknown): boolean {
  const { message = "", code = "" } = getAuthErrorDetails(error);
  const normalized = message.toLowerCase();
  const normalizedCode = code.toLowerCase();

  return (
    normalizedCode === "invalid_credentials" ||
    normalizedCode === "email_not_confirmed" ||
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid credentials") ||
    normalized.includes("email not confirmed")
  );
}
