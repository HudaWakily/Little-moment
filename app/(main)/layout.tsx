import type { ReactNode } from "react";
import { Toaster } from "sonner";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
}
