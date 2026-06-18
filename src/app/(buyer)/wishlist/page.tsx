"use client";

import Link from "next/link";
import { ArrowLeft, Heart, ChevronRight } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { currentUser, selectWishlist } from "@/lib/demo/state";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const st = useDemo();
  const user = currentUser(st);
  if (!user) return null;

  const courses = selectWishlist(st, user.id);

  return (
    <div className="h-full overflow-y-auto px-5 pb-6">
      <header className="flex items-center gap-3 py-5">
        <Link
          href="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Istaklarim</h1>
      </header>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center gap-4 pt-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-muted">
            <Heart size={28} />
          </span>
          <p className="text-sm text-muted">
            Istaklar ro&apos;yxati bo&apos;sh. Kurs sahifasida 🤍 belgisini bosing.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-3 transition active:scale-[0.99]"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-surface-2">
                {course.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.coverImage}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {course.title}
                </p>
                <p className="text-xs text-muted">{course.sellerName}</p>
                <p className="mt-1 text-sm font-bold text-accent">
                  {formatPrice(course.price)}
                </p>
              </div>
              <ChevronRight size={20} className="text-subtle" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
