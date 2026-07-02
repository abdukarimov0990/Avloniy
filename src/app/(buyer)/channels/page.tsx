"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Users, BookOpen, Check, ChevronRight, Radio } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import {
  currentUser,
  selectChannels,
  selectMyChannelFeed,
  type ChannelSummary,
} from "@/lib/demo/state";
import { CATEGORIES } from "@/lib/constants";
import { ChannelFeed } from "@/components/channel/channel-feed";
import { HeaderActions } from "@/components/layout/header-actions";
import { cn, formatCompact } from "@/lib/utils";

function ChannelCard({ ch }: { ch: ChannelSummary }) {
  return (
    <Link
      href={`/channels/${ch.id}`}
      className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-3 transition active:scale-[0.99]"
    >
      {ch.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={ch.avatar} alt={ch.name} className="h-12 w-12 rounded-full object-cover" />
      ) : (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-base font-bold text-white">
          {ch.name.charAt(0)}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground">{ch.name}</p>
          {ch.isMember && (
            <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold text-accent">
              <Check size={9} /> A&apos;zo
            </span>
          )}
        </div>
        {ch.category && <p className="text-xs text-accent">{ch.category}</p>}
        <p className="mt-0.5 flex items-center gap-3 text-xs text-subtle">
          <span className="flex items-center gap-1">
            <Users size={12} /> {formatCompact(ch.membersCount)}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen size={12} /> {ch.coursesCount} kurs
          </span>
        </p>
      </div>
      <ChevronRight size={20} className="text-subtle" />
    </Link>
  );
}

export default function ChannelsPage() {
  const st = useDemo();
  const user = currentUser(st);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  if (!user) return null;

  const filtering = query.trim() !== "" || category !== "";
  const channels = selectChannels(st, user.id, { query, category });
  const myFeed = selectMyChannelFeed(st, user.id);

  return (
    <div className="h-full overflow-y-auto px-5 pb-6">
      <div className="flex items-center justify-between py-5">
        <h1 className="text-xl font-bold text-foreground">Kanallar</h1>
        <HeaderActions />
      </div>

      {/* Qidiruv */}
      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Kanal yoki soha qidirish..."
          className="h-12 w-full rounded-[var(--radius-md)] border border-border bg-surface pl-11 pr-4 text-sm text-foreground placeholder:text-subtle focus:border-accent focus:outline-none"
        />
      </div>

      {/* Kategoriya filtri */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory("")}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium transition",
            category === "" ? "border-accent bg-accent text-white" : "border-border bg-surface text-muted"
          )}
        >
          Hammasi
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(category === c ? "" : c)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition",
              category === c ? "border-accent bg-accent text-white" : "border-border bg-surface text-muted"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Mening kanallarim lentasi (filtrlanmaganda) */}
      {!filtering && myFeed.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-subtle">
            <Radio size={15} /> Mening kanallarim — so&apos;nggi postlar
          </h2>
          <ChannelFeed posts={myFeed.slice(0, 4)} showSeller />
        </section>
      )}

      {/* Kanallar ro'yxati */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-subtle">
          {filtering ? `Natijalar (${channels.length})` : "Kashf qilish"}
        </h2>
        {channels.length === 0 ? (
          <p className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-center text-sm text-muted">
            Kanal topilmadi.
          </p>
        ) : (
          <div className="grid gap-2">
            {channels.map((ch) => (
              <ChannelCard key={ch.id} ch={ch} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
