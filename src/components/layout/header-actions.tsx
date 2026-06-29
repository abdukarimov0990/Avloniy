"use client";

import Link from "next/link";
import { Mail, Bell } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { currentUser, selectMyDmThreads, unreadNotifCount } from "@/lib/demo/state";

function Badge({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
      {n > 9 ? "9+" : n}
    </span>
  );
}

/** Sarlavha o'ng burchagi: xabarlar (inbox) + bildirishnomalar, o'qilmagan belgilar bilan */
export function HeaderActions() {
  const st = useDemo();
  const user = currentUser(st);
  if (!user) return null;

  const unreadDm = selectMyDmThreads(st, user.id).reduce((s, t) => s + t.unread, 0);
  const unreadNotif = unreadNotifCount(st, user.id);

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/inbox"
        className="relative flex h-11 w-11 items-center justify-center rounded-full text-muted transition hover:text-foreground"
        aria-label="Xabarlar"
      >
        <Mail size={20} />
        <Badge n={unreadDm} />
      </Link>
      <Link
        href="/notifications"
        className="relative flex h-11 w-11 items-center justify-center rounded-full text-muted transition hover:text-foreground"
        aria-label="Bildirishnomalar"
      >
        <Bell size={20} />
        <Badge n={unreadNotif} />
      </Link>
    </div>
  );
}
