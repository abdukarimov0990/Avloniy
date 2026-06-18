import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { MobileShell } from "@/components/layout/mobile-shell";
import { OnboardingForm } from "@/components/seller/onboarding-form";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "SELLER") redirect("/feed");
  // Allaqachon to'ldirgan bo'lsa — dashboard'ga
  if (user.category) redirect("/dashboard");

  return (
    <MobileShell>
      <div className="flex flex-1 flex-col justify-center py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-foreground">
            Xush kelibsiz, {user.name.split(" ")[0]}! 👋
          </h1>
          <p className="mt-2 text-sm text-muted">
            Boshlashdan oldin profilingizni sozlaymiz. Bu o&apos;quvchilarga sizni
            topishda yordam beradi.
          </p>
        </div>
        <OnboardingForm />
      </div>
    </MobileShell>
  );
}
