"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { currentUser } from "@/lib/demo/state";
import { homePath } from "@/lib/demo/hooks";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LandingPage() {
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
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between py-5">
          <Logo />
        </header>

        <div className="flex flex-1 flex-col justify-center">
          <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-[var(--radius-xl)] bg-accent text-white shadow-lg shadow-accent/30">
            <Play size={28} className="ml-1" fill="currentColor" />
          </span>
          <h1 className="text-3xl font-extrabold leading-tight text-foreground">
            Qisqa videolar orqali
            <br />
            <span className="text-accent">eng yaxshi kurslar</span>
          </h1>
          <p className="mt-3 text-base text-muted">
            Yoqtirgan kursingizni ko&apos;ring, swipe qiling va bir tugma bilan sotib
            oling. Bilimingizni sotmoqchimisiz? Siz ham boshlang.
          </p>
        </div>

        <div className="flex flex-col gap-3 py-8">
          <Link href="/register" className={cn(buttonVariants({ size: "lg", block: true }))}>
            Boshlash <ArrowRight size={18} />
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "secondary", size: "lg", block: true }))}
          >
            Kirish
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}
