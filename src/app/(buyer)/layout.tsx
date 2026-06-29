"use client";

import { useGuard } from "@/lib/demo/hooks";
import { BuyerNav } from "@/components/layout/buyer-nav";
import { Sidebar } from "@/components/layout/sidebar";

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const { user } = useGuard("BUYER");
  if (!user) return null;

  return (
    <div className="lg:mx-auto lg:flex lg:max-w-[1180px]">
      <Sidebar />
      <div className="mx-auto flex h-dvh w-full max-w-[var(--width-shell)] flex-col bg-background sm:border-x sm:border-border lg:mx-0 lg:max-w-none lg:flex-1 lg:border-x-0 lg:border-r">
        <main className="relative min-h-0 flex-1">{children}</main>
        <BuyerNav />
      </div>
    </div>
  );
}
