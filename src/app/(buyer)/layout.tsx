"use client";

import { useGuard } from "@/lib/demo/hooks";
import { BuyerNav } from "@/components/layout/buyer-nav";

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const { user } = useGuard("BUYER");
  if (!user) return null;

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[var(--width-shell)] flex-col bg-background sm:border-x sm:border-border">
      <main className="relative min-h-0 flex-1">{children}</main>
      <BuyerNav />
    </div>
  );
}
