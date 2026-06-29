import { cn } from "@/lib/utils";

/** Ilmy so'z-logotipi. Birinchi harf — mahogany aksent. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("text-2xl font-extrabold tracking-tight text-foreground", className)}>
      <span className="text-accent">I</span>lmy
    </span>
  );
}
