import { redirect } from "next/navigation";
import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function LandingPage() {
  // Allaqachon kirgan bo'lsa — o'z sahifasiga
  const user = await getCurrentUser();
  if (user) {
    redirect(user.role === "SELLER" ? "/dashboard" : "/feed");
  }

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
