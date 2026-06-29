"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGuard } from "@/lib/demo/hooks";
import { SellerNav } from "@/components/layout/seller-nav";
import { Sidebar } from "@/components/layout/sidebar";

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

  return (
    <div className="lg:mx-auto lg:flex lg:max-w-[1180px]">
      <Sidebar />
      <div className="mx-auto flex h-dvh w-full max-w-[var(--width-shell)] flex-col bg-background sm:border-x sm:border-border lg:mx-0 lg:max-w-none lg:flex-1 lg:border-x-0 lg:border-r">
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
        <SellerNav />
      </div>
    </div>
  );
}
