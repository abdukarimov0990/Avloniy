"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, FileText, Lock, Check, ChevronRight } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { currentUser, selectChannel } from "@/lib/demo/state";
import { ChannelFeed } from "@/components/channel/channel-feed";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatCompact, formatPrice } from "@/lib/utils";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-lg font-extrabold text-foreground">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

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

  return (
    <div className="h-full overflow-y-auto px-5 pb-6">
      <header className="flex items-center gap-3 py-5">
        <Link href="/channels" className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="truncate text-lg font-bold text-foreground">{ch.name}</h1>
      </header>

      {/* Kanal sarlavhasi */}
      <div className="flex items-center gap-4">
        {ch.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ch.avatar} alt={ch.name} className="h-20 w-20 rounded-full border-2 border-accent object-cover" />
        ) : (
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-2xl font-bold text-white">
            {ch.name.charAt(0)}
          </span>
        )}
        <div className="grid flex-1 grid-cols-3 gap-1">
          <Stat value={formatCompact(ch.membersCount)} label="A'zo" />
          <Stat value={String(ch.coursesCount)} label="Kurs" />
          <Stat value={String(ch.postsCount)} label="Post" />
        </div>
      </div>
      <div className="mt-3">
        {ch.category && (
          <span className="inline-block rounded-full bg-accent-soft px-3 py-0.5 text-xs font-semibold text-accent">
            {ch.category}
          </span>
        )}
        {ch.bio && <p className="mt-2 text-sm text-muted">{ch.bio}</p>}
      </div>

      {ch.isMember ? (
        <>
          <div className="mt-4 flex items-center gap-2 rounded-[var(--radius-md)] bg-accent-soft px-4 py-2.5 text-sm font-medium text-accent">
            <Check size={16} /> Siz bu kanalning a&apos;zosisiz
          </div>
          <section className="mt-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-subtle">
              <FileText size={15} /> Postlar
            </h2>
            <ChannelFeed
              posts={ch.posts}
              empty={
                <p className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-center text-sm text-muted">
                  Hali post yo&apos;q.
                </p>
              }
            />
          </section>
        </>
      ) : (
        <>
          {/* Qulflangan holat */}
          <div className="mt-5 flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-border bg-surface p-6 text-center">
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
        </>
      )}
    </div>
  );
}
