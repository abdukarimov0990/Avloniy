"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Clapperboard, Compass, Radio, Mail, GraduationCap, User,
  LayoutDashboard, PlusSquare, Store,
} from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { currentUser, selectMyDmThreads } from "@/lib/demo/state";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const BUYER = [
  { href: "/feed", label: "Lenta", Icon: Clapperboard },
  { href: "/discover", label: "Kashf qilish", Icon: Compass },
  { href: "/channels", label: "Kanallar", Icon: Radio },
  { href: "/inbox", label: "Xabarlar", Icon: Mail, badge: true },
  { href: "/library", label: "Mening kurslarim", Icon: GraduationCap },
  { href: "/profile", label: "Profil", Icon: User },
];
const SELLER = [
  { href: "/dashboard", label: "Statistika", Icon: LayoutDashboard },
  { href: "/channel", label: "Kanal", Icon: Radio },
  { href: "/inbox", label: "Xabarlar", Icon: Mail, badge: true },
  { href: "/studio/new", label: "Yaratish", Icon: PlusSquare },
  { href: "/studio", label: "Profil", Icon: Store },
];

/** Desktop (lg+) chap yon panel navigatsiyasi. Mobil'da yashirin. */
export function Sidebar() {
  const pathname = usePathname();
  const st = useDemo();
  const user = currentUser(st);
  if (!user) return null;

  const items = user.role === "SELLER" ? SELLER : BUYER;
  const unread = selectMyDmThreads(st, user.id).reduce((s, t) => s + t.unread, 0);

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border bg-surface px-3 py-5 lg:flex">
      <Link href={items[0].href} className="mb-7 px-3">
        <Logo className="text-2xl" />
      </Link>
      <nav className="flex flex-col gap-1">
        {items.map(({ href, label, Icon, badge }) => {
          const active =
            href === "/studio"
              ? pathname === "/studio" || (pathname.startsWith("/studio/") && pathname !== "/studio/new")
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition",
                active ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface-2 hover:text-foreground"
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
      <div className="mt-auto px-3 text-xs text-subtle">
        @{user.username}
      </div>
    </aside>
  );
}
