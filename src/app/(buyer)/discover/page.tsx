"use client";

import Link from "next/link";
import { Flame, ShoppingBag, ChevronRight, Layers, Star, BookOpen } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import {
  currentUser,
  selectTopCourses,
  selectCategoriesRanked,
  selectTopCreators,
  selectAllCourses,
  type DiscoverCourse,
} from "@/lib/demo/state";
import { HeaderActions } from "@/components/layout/header-actions";
import { formatCompact, formatPrice } from "@/lib/utils";

/** Gorizontal kichik kurs kartasi */
function CourseTile({ c }: { c: DiscoverCourse }) {
  return (
    <Link href={`/courses/${c.id}`} className="w-40 shrink-0">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-md)] bg-surface-2">
        {c.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.coverImage} alt={c.title} className="h-full w-full object-cover" />
        )}
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-semibold text-foreground">{c.title}</p>
      <p className="text-xs text-muted">{c.sellerName}</p>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-sm font-bold text-accent">{formatPrice(c.price)}</span>
        <span className="flex items-center gap-0.5 text-[11px] text-subtle">
          <ShoppingBag size={11} /> {formatCompact(c.salesCount)}
        </span>
      </div>
    </Link>
  );
}

/** Vertikal ro'yxat kartasi */
function CourseRow({ c, rank }: { c: DiscoverCourse; rank?: number }) {
  return (
    <Link href={`/courses/${c.id}`} className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-3 transition active:scale-[0.99]">
      {rank !== undefined && (
        <span className="w-5 shrink-0 text-center text-base font-extrabold text-accent">{rank}</span>
      )}
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-surface-2">
        {c.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.coverImage} alt={c.title} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{c.title}</p>
        <p className="text-xs text-muted">{c.sellerName} • {c.category}</p>
        <p className="mt-1 flex items-center gap-3 text-xs text-subtle">
          <span className="font-bold text-accent">{formatPrice(c.price)}</span>
          <span className="flex items-center gap-1"><ShoppingBag size={12} /> {formatCompact(c.salesCount)} sotuv</span>
        </p>
      </div>
      <ChevronRight size={20} className="text-subtle" />
    </Link>
  );
}

export default function DiscoverPage() {
  const st = useDemo();
  const user = currentUser(st);
  if (!user) return null;

  const top = selectTopCourses(st, 6);
  const categories = selectCategoriesRanked(st);
  const creators = selectTopCreators(st, 6);
  const all = selectAllCourses(st);
  const trendingCat = categories[0]?.category;

  return (
    <div className="h-full overflow-y-auto px-5 pb-6">
      <div className="flex items-center justify-between py-5">
        <h1 className="text-xl font-bold text-foreground">Kashf qilish</h1>
        <HeaderActions />
      </div>

      {/* Top kurslar */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-subtle">
            <Flame size={15} className="text-accent" /> Top kurslar
          </h2>
          {trendingCat && <span className="text-xs text-muted">trend: {trendingCat}</span>}
        </div>
        <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1" style={{ scrollbarWidth: "none" }}>
          {top.map((c) => (
            <CourseTile key={c.id} c={c} />
          ))}
        </div>
      </section>

      {/* Kategoriyalar */}
      <section className="mt-7">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-subtle">
          <Layers size={15} /> Kategoriyalar
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.category}
              href={`/discover/${encodeURIComponent(cat.category)}`}
              className="flex items-center justify-between rounded-[var(--radius-lg)] border border-border bg-surface p-4 transition active:scale-[0.99]"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{cat.category}</p>
                <p className="text-xs text-muted">{cat.courseCount} kurs</p>
              </div>
              <ChevronRight size={18} className="text-subtle" />
            </Link>
          ))}
        </div>
      </section>

      {/* Top kreatorlar */}
      <section className="mt-7">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-subtle">
          <Star size={15} className="text-accent" /> Top kreatorlar
        </h2>
        <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1" style={{ scrollbarWidth: "none" }}>
          {creators.map((cr) => (
            <Link key={cr.id} href={`/channels/${cr.id}`} className="flex w-28 shrink-0 flex-col items-center gap-2 text-center">
              {cr.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cr.avatar} alt={cr.name} className="h-16 w-16 rounded-full border-2 border-accent object-cover" />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-xl font-bold text-white">{cr.name.charAt(0)}</span>
              )}
              <div>
                <p className="truncate text-xs font-semibold text-foreground">{cr.name}</p>
                <p className="text-[11px] text-subtle">{formatCompact(cr.totalSales)} sotuv</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Barcha kurslar */}
      <section className="mt-7">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-subtle">
          <BookOpen size={15} /> Barcha kurslar ({all.length})
        </h2>
        <div className="flex flex-col gap-2">
          {all.map((c, i) => (
            <CourseRow key={c.id} c={c} rank={i + 1} />
          ))}
        </div>
      </section>
    </div>
  );
}
