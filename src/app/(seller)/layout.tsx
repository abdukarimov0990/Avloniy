"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGuard } from "@/lib/demo/hooks";
import { SellerNav } from "@/components/layout/seller-nav";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useGuard("SELLER");
  const role = user?.role ?? null;
  const category = user?.category ?? null;

  // Profil to'ldirilmagan bo'lsa — onboarding'ga
  useEffect(() => {
    if (role === "SELLER" && !category) {
      router.replace("/onboarding");
    }
  }, [role, category, router]);

  if (!user || !user.category) return null;

  // Doim mobil "app" ko'rinishi — kompyuterda ham 430px shell markazda
  return (
    <div className="mx-auto flex h-dvh w-full max-w-[var(--width-shell)] flex-col bg-background sm:border-x sm:border-border">
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      <SellerNav />
    </div>
  );
}
