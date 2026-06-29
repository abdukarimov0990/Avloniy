"use client";

import { CheckCircle2, XCircle, Info } from "lucide-react";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const ICON = { success: CheckCircle2, error: XCircle, info: Info };

/** Yuqori-markazda toast bildirishnomalar (mobil shell ichida). */
export function Toaster() {
  const toasts = useToast((s) => s.toasts);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[100] mx-auto flex w-full max-w-[var(--width-shell)] flex-col items-center gap-2 px-4">
      {toasts.map((t) => {
        const Icon = ICON[t.type];
        return (
          <div
            key={t.id}
            className={cn(
              "animate-fade-up flex w-full items-center gap-2.5 rounded-[var(--radius-md)] border px-4 py-3 text-sm font-medium shadow-lg",
              t.type === "error"
                ? "border-danger/40 bg-elevated text-danger"
                : "border-border bg-elevated text-foreground"
            )}
          >
            <Icon size={18} className={t.type === "error" ? "text-danger" : "text-accent"} />
            <span className="flex-1">{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}
