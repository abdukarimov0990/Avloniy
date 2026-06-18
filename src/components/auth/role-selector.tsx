"use client";

import { ShoppingBag, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

const OPTIONS: { role: Role; title: string; subtitle: string; Icon: typeof ShoppingBag }[] = [
  {
    role: "BUYER",
    title: "Xaridor",
    subtitle: "Kurslarni ko'rib, sotib olaman",
    Icon: ShoppingBag,
  },
  {
    role: "SELLER",
    title: "Sotuvchi",
    subtitle: "Kurs yaratib, sotaman",
    Icon: GraduationCap,
  },
];

export function RoleSelector({
  value,
  onChange,
}: {
  value: Role;
  onChange: (role: Role) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {OPTIONS.map(({ role, title, subtitle, Icon }) => {
        const active = value === role;
        return (
          <button
            key={role}
            type="button"
            onClick={() => onChange(role)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-[var(--radius-lg)] border p-4 text-left transition-all duration-150 active:scale-[0.98]",
              active
                ? "border-accent bg-accent-soft"
                : "border-border bg-surface hover:border-border-strong"
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                active ? "bg-accent text-white" : "bg-surface-2 text-muted"
              )}
            >
              <Icon size={20} />
            </span>
            <span className="text-sm font-semibold text-foreground">{title}</span>
            <span className="text-xs leading-tight text-muted">{subtitle}</span>
          </button>
        );
      })}
    </div>
  );
}
