"use client";

import { useEffect, useState } from "react";
import { useDemo } from "@/lib/demo/use-demo";
import { Logo } from "@/components/brand/logo";

/**
 * localStorage'дан holatni qayta tiklaydi (rehydrate) va shu tugaguncha splash ko'rsatadi.
 * Bu SSR ↔ client mos kelmasligi (hydration mismatch) muammosini oldini oladi —
 * sahifa kontenti faqat client'да, holat tayyor bo'lгандан keyин chiziladi.
 */
export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.resolve(useDemo.persist.rehydrate()).finally(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[var(--width-shell)] flex-col items-center justify-center gap-2 bg-background">
        <Logo className="text-3xl animate-pulse" />
        <p className="text-sm text-muted">Yuklanmoqda...</p>
      </div>
    );
  }

  return <>{children}</>;
}
