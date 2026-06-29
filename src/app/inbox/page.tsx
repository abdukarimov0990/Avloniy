"use client";

import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { selectMyDmThreads } from "@/lib/demo/state";
import { useGuard, homePath } from "@/lib/demo/hooks";

function timeAgo(iso: string): string {
  if (!iso) return "";
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "hozir";
  if (m < 60) return `${m} daq`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} soat`;
  return `${Math.floor(h / 24)} kun`;
}

export default function InboxPage() {
  const { user } = useGuard();
  const st = useDemo();
  if (!user) return null;

  const threads = selectMyDmThreads(st, user.id);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[var(--width-shell)] flex-col bg-background px-5 pb-6 sm:border-x sm:border-border">
      <header className="flex items-center gap-3 py-5">
        <Link href={homePath(user.role)} className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Xabarlar</h1>
      </header>

      {threads.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 pt-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-muted">
            <MessageCircle size={28} />
          </span>
          <p className="text-sm text-muted">Hali shaxsiy xabar yo&apos;q.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {threads.map((t) => (
            <Link
              key={t.key}
              href={`/chat/${t.partnerId}`}
              className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-3 transition active:scale-[0.99]"
            >
              {t.partner?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.partner.avatar} alt={t.partner.name} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-base font-bold text-white">
                  {t.partner?.name.charAt(0) ?? "?"}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">{t.partner?.name}</p>
                  <span className="shrink-0 text-xs text-subtle">{timeAgo(t.lastAt)}</span>
                </div>
                <p className="mt-0.5 truncate text-sm text-muted">{t.lastText}</p>
              </div>
              {t.unread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-white">
                  {t.unread}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
