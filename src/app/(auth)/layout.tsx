"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo/use-demo";
import { currentUser } from "@/lib/demo/state";
import { homePath } from "@/lib/demo/hooks";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const st = useDemo();
  const user = currentUser(st);
  const role = user?.role ?? null;

  useEffect(() => {
    if (role) router.replace(homePath(role));
  }, [role, router]);

  if (user) return null;

  return (
    <MobileShell>
      <div className="flex flex-1 flex-col justify-center py-10">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Logo className="text-3xl" />
          <p className="text-sm text-muted">Bilim sotib oling. Bilim soting.</p>
        </div>
        {children}
      </div>
    </MobileShell>
  );
}
