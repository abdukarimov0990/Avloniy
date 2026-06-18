import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { BuyerNav } from "@/components/layout/buyer-nav";

/**
 * Buyer hududi uchun umumiy karkas: telefon kengligidagi shell + pastki navigatsiya.
 * Balandlik aniq (h-dvh) — Reels lentasidagi snap-scroll to'g'ri ishlashi uchun.
 */
export default async function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "BUYER") redirect("/dashboard");

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[var(--width-shell)] flex-col bg-background sm:border-x sm:border-border">
      <main className="relative min-h-0 flex-1">{children}</main>
      <BuyerNav />
    </div>
  );
}
