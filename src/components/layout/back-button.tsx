"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/** Kontekstli ortga tugmasi — qaerdan kelgan bo'lsa o'sha yerga (yo'q bo'lsa fallback). 44px nishon. */
export function BackButton({ fallback = "/", className }: { fallback?: string; className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label="Ortga"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) router.back();
        else router.push(fallback);
      }}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 text-muted transition active:scale-90",
        className
      )}
    >
      <ArrowLeft size={20} />
    </button>
  );
}
