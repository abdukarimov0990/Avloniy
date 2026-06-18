"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo/use-demo";
import { currentUser } from "@/lib/demo/state";
import { MobileShell } from "@/components/layout/mobile-shell";
import { OnboardingForm } from "@/components/seller/onboarding-form";

export default function OnboardingPage() {
  const router = useRouter();
  const st = useDemo();
  const user = currentUser(st);
  const role = user?.role ?? null;
  const category = user?.category ?? null;
  const hasUser = !!user;

  useEffect(() => {
    if (!hasUser) router.replace("/login");
    else if (role !== "SELLER") router.replace("/feed");
    else if (category) router.replace("/dashboard");
  }, [hasUser, role, category, router]);

  if (!user || user.role !== "SELLER" || user.category) return null;

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
