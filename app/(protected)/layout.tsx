import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppNavbar } from "@/components/app-navbar";
import { Footer } from "@/components/footer";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <AppNavbar />
      <div className="pt-16 sm:pt-20">{children}</div>
      <Footer />
    </div>
  );
}
