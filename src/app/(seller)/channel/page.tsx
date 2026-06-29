"use client";

import Link from "next/link";
import { Users, FileText, Radio, ChevronRight } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { currentUser, selectSellerChannel } from "@/lib/demo/state";
import { Logo } from "@/components/brand/logo";
import { PostComposer } from "@/components/channel/post-composer";
import { ChannelFeed } from "@/components/channel/channel-feed";
import { formatCompact } from "@/lib/utils";

export default function SellerChannelPage() {
  const st = useDemo();
  const user = currentUser(st);
  if (!user) return null;

  const channel = selectSellerChannel(st, user.id);

  return (
    <div className="px-5 pb-6">
      <header className="flex items-center justify-between py-5">
        <Logo />
        <span className="flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
          <Radio size={13} /> Mening kanalim
        </span>
      </header>

      {/* Statistika */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/channel/members" className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 transition active:scale-[0.99]">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-accent">
            <Users size={18} />
          </span>
          <p className="mt-3 flex items-center gap-1 text-xl font-extrabold text-foreground">
            {formatCompact(channel.membersCount)}
            <ChevronRight size={16} className="text-subtle" />
          </p>
          <p className="text-xs text-muted">A&apos;zolar — boshqarish</p>
        </Link>
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-accent">
            <FileText size={18} />
          </span>
          <p className="mt-3 text-xl font-extrabold text-foreground">{channel.postsCount}</p>
          <p className="text-xs text-muted">Postlar</p>
        </div>
      </div>

      {/* Post yozish */}
      <section className="mt-5">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-subtle">Yangi post</h2>
        <PostComposer />
      </section>

      {/* Postlar */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-subtle">
          Kanal postlari ({channel.postsCount})
        </h2>
        <ChannelFeed
          posts={channel.posts}
          empty={
            <p className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-center text-sm text-muted">
              Hali post yo&apos;q. Birinchi postingizni yozing!
            </p>
          }
        />
      </section>
    </div>
  );
}
