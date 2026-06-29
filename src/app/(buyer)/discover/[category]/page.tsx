"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ShoppingBag, ChevronRight, Layers } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { currentUser, selectCoursesByCategory } from "@/lib/demo/state";
import { BackButton } from "@/components/layout/back-button";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatCompact, formatPrice } from "@/lib/utils";

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const category = decodeURIComponent(params.category);
  const st = useDemo();
  const user = currentUser(st);
  if (!user) return null;

  const courses = selectCoursesByCategory(st, category);

  return (
    <div className="h-full overflow-y-auto px-5 pb-6">
      <header className="flex items-center gap-3 py-5">
        <BackButton fallback="/discover" />
        <h1 className="truncate text-xl font-bold text-foreground">{category}</h1>
      </header>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center gap-4 pt-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-muted">
            <Layers size={28} />
          </span>
          <p className="text-sm text-muted">Bu kategoriyada hali kurs yo&apos;q.</p>
          <Link href="/discover" className={cn(buttonVariants({ size: "md" }))}>
            Kashf qilishga qaytish
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-3 text-sm text-muted">{courses.length} ta kurs — eng ko&apos;p sotilgani tepada</p>
          <div className="flex flex-col gap-2">
            {courses.map((c) => (
              <Link
                key={c.id}
                href={`/courses/${c.id}`}
                className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-3 transition active:scale-[0.99]"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-surface-2">
                  {c.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.coverImage} alt={c.title} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{c.title}</p>
                  <p className="text-xs text-muted">{c.sellerName}</p>
                  <p className="mt-1 flex items-center gap-3 text-xs text-subtle">
                    <span className="font-bold text-accent">{formatPrice(c.price)}</span>
                    <span className="flex items-center gap-1"><ShoppingBag size={12} /> {formatCompact(c.salesCount)} sotuv</span>
                  </p>
                </div>
                <ChevronRight size={20} className="text-subtle" />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
