"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clapperboard, GraduationCap, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/feed", label: "Lenta", Icon: Clapperboard },
  { href: "/library", label: "Kurslarim", Icon: GraduationCap },
  { href: "/profile", label: "Profil", Icon: User },
];

export function BuyerNav() {
  const pathname = usePathname();

  return (
    <nav className="z-30 flex h-16 shrink-0 items-stretch border-t border-border bg-surface">
      {ITEMS.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
              active ? "text-accent" : "text-muted hover:text-foreground"
            )}
          >
            <Icon size={22} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
