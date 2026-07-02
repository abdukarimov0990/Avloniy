"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Layers } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { currentUser, selectCoursesByCategory } from "@/lib/demo/state";
import { BackButton } from "@/components/layout/back-button";
import { MarketCard } from "@/components/courses/market-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
          <div className="grid grid-cols-2 gap-3">
            {courses.map((c) => (
              <MarketCard key={c.id} c={c} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
