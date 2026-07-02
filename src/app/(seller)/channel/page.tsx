"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { currentUser, selectSellerChannel } from "@/lib/demo/state";
import { ChannelComposerBar } from "@/components/channel/channel-composer-bar";
import { ChannelFeed } from "@/components/channel/channel-feed";
import { formatCompact } from "@/lib/utils";

export default function SellerChannelPage() {
  const st = useDemo();
  const user = currentUser(st);
  if (!user) return null;

  const channel = selectSellerChannel(st, user.id);

  return (
    <div className="flex h-full flex-col">
      {/* Telegram uslubidagi sarlavha — kanal identifikatori + a'zolarni boshqarish */}
      <header className="z-10 flex shrink-0 items-center gap-3 border-b border-border bg-surface px-3 py-2.5">
        {user.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-base font-bold text-white">
            {user.name.charAt(0)}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold text-foreground">{user.name}</p>
          <p className="text-xs text-subtle">{channel.postsCount} post · mening kanalim</p>
        </div>
        <Link
          href="/channel/members"
          className="flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-xs font-semibold text-foreground transition hover:text-accent"
        >
          <Users size={15} /> {formatCompact(channel.membersCount)}
        </Link>
      </header>

      {/* Postlar — chat */}
      <div className="tg-chat flex-1 overflow-y-auto px-3 py-4">
        <ChannelFeed
          posts={channel.posts}
          empty={
            <p className="mx-auto w-fit rounded-full bg-surface/70 px-4 py-1.5 text-center text-sm text-subtle">
              Hali post yo&apos;q. Birinchi postingizni yozing 👇
            </p>
          }
        />
      </div>

      {/* Yozish paneli */}
      <ChannelComposerBar />
    </div>
  );
}
