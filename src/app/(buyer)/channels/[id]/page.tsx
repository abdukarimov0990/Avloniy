"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { BookOpen, Lock, ChevronRight, MessageCircle, Users } from "lucide-react";
import { BackButton } from "@/components/layout/back-button";
import { useDemo } from "@/lib/demo/use-demo";
import { currentUser, selectChannel } from "@/lib/demo/state";
import { ChannelFeed } from "@/components/channel/channel-feed";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatCompact, formatPrice } from "@/lib/utils";

export default function ChannelPage() {
  const params = useParams<{ id: string }>();
  const st = useDemo();
  const user = currentUser(st);
  if (!user) return null;

  const ch = selectChannel(st, params.id, user.id);
  if (!ch) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-5 text-center">
        <p className="text-muted">Kanal topilmadi.</p>
        <Link href="/channels" className={cn(buttonVariants({ size: "md" }))}>
          Kanallarga qaytish
        </Link>
      </div>
    );
  }

  const avatar = (size: number) =>
    ch.avatar ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={ch.avatar} alt={ch.name} className="rounded-full object-cover" style={{ height: size, width: size }} />
    ) : (
      <span
        className="flex items-center justify-center rounded-full bg-accent font-bold text-white"
        style={{ height: size, width: size, fontSize: size / 2.4 }}
      >
        {ch.name.charAt(0)}
      </span>
    );

  return (
    <div className="flex h-full flex-col">
      {/* Telegram uslubidagi sarlavha paneli */}
      <header className="z-10 flex shrink-0 items-center gap-3 border-b border-border bg-surface px-3 py-2.5">
        <BackButton fallback="/channels" />
        {avatar(40)}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold text-foreground">{ch.name}</p>
          <p className="flex items-center gap-1 text-xs text-subtle">
            <Users size={11} /> {formatCompact(ch.membersCount)} a&apos;zo
          </p>
        </div>
        <Link
          href={`/chat/${ch.id}`}
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition hover:bg-surface-2 hover:text-accent"
          aria-label="Shaxsiy xabar"
        >
          <MessageCircle size={20} />
        </Link>
      </header>

      {ch.banned ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/15 text-danger">
            <Lock size={26} />
          </span>
          <p className="font-semibold text-foreground">Siz bu kanaldan bloklangansiz</p>
          <p className="text-sm text-muted">Kanal egasi sizni bloklagan. Postlarni ko&apos;ra olmaysiz.</p>
        </div>
      ) : ch.isMember ? (
        <div className="tg-chat flex-1 overflow-y-auto px-3 py-4">
          {/* Kanal tavsifi — chat boshidagi kartrochka */}
          <div className="mx-auto mb-4 max-w-[300px] rounded-2xl border border-border bg-surface/80 px-4 py-4 text-center backdrop-blur-sm">
            <div className="mx-auto w-fit">
              {avatar(64)}
            </div>
            <p className="mt-2 text-base font-bold text-foreground">{ch.name}</p>
            {ch.category && (
              <span className="mt-1 inline-block rounded-full bg-accent-soft px-3 py-0.5 text-xs font-semibold text-accent">
                {ch.category}
              </span>
            )}
            {ch.bio && <p className="mt-2 text-sm text-muted">{ch.bio}</p>}
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-subtle">
              <span>{formatCompact(ch.membersCount)} a&apos;zo</span>
              <span>·</span>
              <span>{ch.coursesCount} kurs</span>
              <span>·</span>
              <span>{ch.postsCount} post</span>
            </div>
          </div>

          <ChannelFeed
            posts={ch.posts}
            empty={
              <p className="mx-auto w-fit rounded-full bg-surface/70 px-4 py-1.5 text-center text-sm text-subtle">
                Hali post yo&apos;q.
              </p>
            }
          />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Qulflangan holat */}
          <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-border bg-surface p-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 text-accent">
              <Lock size={26} />
            </span>
            <div>
              <p className="font-semibold text-foreground">Bu yopiq kanal</p>
              <p className="mt-1 text-sm text-muted">
                Sotuvchining kursini sotib olib kanalga qo&apos;shiling — video va shaxsiy
                postlarni ko&apos;ring.
              </p>
            </div>
          </div>

          <section className="mt-6">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-subtle">
              <BookOpen size={15} /> Kanal kurslari
            </h2>
            <div className="flex flex-col gap-2">
              {ch.courses.map((c) => (
                <Link
                  key={c.id}
                  href={`/courses/${c.id}`}
                  className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-3 transition active:scale-[0.99]"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-surface-2">
                    {c.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.coverImage} alt={c.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{c.title}</p>
                    <p className="text-sm font-bold text-accent">{formatPrice(c.price)}</p>
                  </div>
                  <ChevronRight size={20} className="text-subtle" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
