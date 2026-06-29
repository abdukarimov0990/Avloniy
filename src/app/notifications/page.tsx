"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, UserPlus, MessageCircle, Wallet } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { selectNotifications } from "@/lib/demo/state";
import { useGuard, homePath } from "@/lib/demo/hooks";

function timeAgo(iso: string): string {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "hozir";
  if (m < 60) return `${m} daq oldin`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} soat oldin`;
  return `${Math.floor(h / 24)} kun oldin`;
}

const ICONS = {
  new_member: UserPlus,
  new_message: MessageCircle,
  payment: Wallet,
} as const;

export default function NotificationsPage() {
  const { user } = useGuard();
  const st = useDemo();
  const markRead = useDemo((s) => s.markNotificationsRead);

  useEffect(() => {
    if (user) markRead();
  }, [user, markRead]);

  if (!user) return null;
  const items = selectNotifications(st, user.id);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[var(--width-shell)] flex-col bg-background px-5 pb-6 sm:border-x sm:border-border">
      <header className="flex items-center gap-3 py-5">
        <Link href={homePath(user.role)} className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Bildirishnomalar</h1>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 pt-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-muted">
            <Bell size={28} />
          </span>
          <p className="text-sm text-muted">Bildirishnoma yo&apos;q.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((n) => {
            const Icon = ICONS[n.type] ?? Bell;
            const link = n.type === "new_message" && n.relatedId ? `/chat/${n.relatedId.split("__")[1] === user.id ? n.relatedId.split("__")[0] : n.relatedId.split("__")[1]}` : null;
            const inner = (
              <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{n.title}</p>
                  <p className="text-sm text-muted">{n.body}</p>
                  <p className="mt-1 text-xs text-subtle">{timeAgo(n.createdAt)}</p>
                </div>
              </div>
            );
            return link ? (
              <Link key={n.id} href={link}>{inner}</Link>
            ) : (
              <div key={n.id}>{inner}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
