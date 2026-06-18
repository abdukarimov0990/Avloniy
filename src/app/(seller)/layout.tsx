import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SellerNav } from "@/components/layout/seller-nav";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "SELLER") redirect("/feed");
  // Profil to'ldirilmagan bo'lsa — onboarding'ga
  if (!user.category) redirect("/onboarding");

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[var(--width-shell)] flex-col bg-background sm:border-x sm:border-border">
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      <SellerNav />
    </div>
  );
}
