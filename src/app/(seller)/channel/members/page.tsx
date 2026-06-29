"use client";

import Link from "next/link";
import { ArrowLeft, VolumeX, Volume2, Ban, Check, Users } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { currentUser, selectChannelMembers } from "@/lib/demo/state";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

export default function ChannelMembersPage() {
  const st = useDemo();
  const setMemberStatus = useDemo((s) => s.setMemberStatus);
  const toast = useToast((s) => s.show);
  const user = currentUser(st);
  if (!user) return null;

  const members = selectChannelMembers(st, user.id);

  return (
    <div className="px-5 pb-6">
      <header className="flex items-center gap-3 py-5">
        <Link href="/channel" className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-foreground">A&apos;zolar ({members.length})</h1>
      </header>

      {members.length === 0 ? (
        <div className="flex flex-col items-center gap-3 pt-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-muted">
            <Users size={28} />
          </span>
          <p className="text-sm text-muted">Hali a&apos;zo yo&apos;q. Kurs sotilganda a&apos;zolar paydo bo&apos;ladi.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {members.map((m) => (
            <div key={m.userId} className="rounded-[var(--radius-md)] border border-border bg-surface p-3">
              <div className="flex items-center gap-3">
                {m.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.avatar} alt={m.name} className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-base font-bold text-white">{m.name.charAt(0)}</span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{m.name}</p>
                  <p className="text-xs text-subtle">@{m.username}</p>
                </div>
                {m.status !== "active" && (
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", m.status === "banned" ? "bg-danger/15 text-danger" : "bg-surface-2 text-muted")}>
                    {m.status === "banned" ? "Bloklangan" : "Mute"}
                  </span>
                )}
              </div>
              <div className="mt-2.5 flex gap-2">
                <button
                  type="button"
                  onClick={() => { const next = m.status === "muted" ? null : "muted"; setMemberStatus(user.id, m.userId, next); toast(next ? `${m.name} mute qilindi` : "Mute olib tashlandi"); }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-border py-1.5 text-xs font-medium text-muted"
                >
                  {m.status === "muted" ? <><Volume2 size={14} /> Mute olib tashlash</> : <><VolumeX size={14} /> Mute</>}
                </button>
                <button
                  type="button"
                  onClick={() => { const next = m.status === "banned" ? null : "banned"; setMemberStatus(user.id, m.userId, next); toast(next ? `${m.name} bloklandi` : "Blokdan chiqarildi"); }}
                  className={cn("flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border py-1.5 text-xs font-medium", m.status === "banned" ? "border-border text-muted" : "border-danger/40 text-danger")}
                >
                  {m.status === "banned" ? <><Check size={14} /> Blokdan chiqarish</> : <><Ban size={14} /> Bloklash</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
