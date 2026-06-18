import { cn } from "@/lib/utils";

/** Avloniy so'z-logotipi. Birinchi harf — orange aksent. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("text-2xl font-extrabold tracking-tight text-foreground", className)}>
      <span className="text-accent">A</span>vloniy
    </span>
  );
}
