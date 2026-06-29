"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clapperboard, Radio, Mail, GraduationCap, User } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { currentUser, selectMyDmThreads } from "@/lib/demo/state";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/feed", label: "Lenta", Icon: Clapperboard },
  { href: "/channels", label: "Kanallar", Icon: Radio },
  { href: "/inbox", label: "Xabarlar", Icon: Mail, badge: true },
  { href: "/library", label: "Kurslarim", Icon: GraduationCap },
  { href: "/profile", label: "Profil", Icon: User },
];

export function BuyerNav() {
  const pathname = usePathname();
  const st = useDemo();
  const user = currentUser(st);
  const unread = user ? selectMyDmThreads(st, user.id).reduce((s, t) => s + t.unread, 0) : 0;

  return (
    <nav className="z-30 flex h-16 shrink-0 items-stretch border-t border-border bg-surface">
      {ITEMS.map(({ href, label, Icon, badge }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
              active ? "text-accent" : "text-muted hover:text-foreground"
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
