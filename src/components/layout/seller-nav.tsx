"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Radio, Mail, PlusSquare, Store } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { currentUser, selectMyDmThreads } from "@/lib/demo/state";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard", label: "Statistika", Icon: LayoutDashboard, exact: true },
  { href: "/channel", label: "Kanal", Icon: Radio, exact: true },
  { href: "/inbox", label: "Xabarlar", Icon: Mail, exact: true, badge: true },
  { href: "/studio/new", label: "Yaratish", Icon: PlusSquare, exact: true },
  { href: "/studio", label: "Profil", Icon: Store, exact: false },
];

export function SellerNav() {
  const pathname = usePathname();
  const st = useDemo();
  const user = currentUser(st);
  const unread = user ? selectMyDmThreads(st, user.id).reduce((s, t) => s + t.unread, 0) : 0;

  return (
    <nav className="z-30 flex h-16 shrink-0 items-stretch border-t border-border bg-surface">
      {ITEMS.map(({ href, label, Icon, exact, badge }) => {
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        const isStudioProfile = href === "/studio" && pathname.startsWith("/studio/new");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
              active && !isStudioProfile ? "text-accent" : "text-muted hover:text-foreground"
            )}
          >
            <span className="relative">
              <Icon size={22} />
              {badge && unread > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
