"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Radio, PlusSquare, Store } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard", label: "Statistika", Icon: LayoutDashboard, exact: true },
  { href: "/channel", label: "Kanal", Icon: Radio, exact: true },
  { href: "/studio/new", label: "Yaratish", Icon: PlusSquare, exact: true },
  { href: "/studio", label: "Profil", Icon: Store, exact: false },
];

export function SellerNav() {
  const pathname = usePathname();

  return (
    <nav className="z-30 flex h-16 shrink-0 items-stretch border-t border-border bg-surface">
      {ITEMS.map(({ href, label, Icon, exact }) => {
        // "/studio/new" "/studio"dan oldin tekshirilishi uchun aniq moslik
        const active = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`);
        // /studio/new bosilganda "Profil" yonib qolmasin
        const isStudioProfile = href === "/studio" && pathname.startsWith("/studio/new");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
              active && !isStudioProfile
                ? "text-accent"
                : "text-muted hover:text-foreground"
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
