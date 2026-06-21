"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Eye, Users, PlayCircle, Award } from "lucide-react";
import { selectCourseDetail } from "@/lib/demo/state";
import { useGuard } from "@/lib/demo/hooks";
import { MobileShell } from "@/components/layout/mobile-shell";
import { LessonList } from "@/components/courses/lesson-list";
import { CoursePurchase } from "@/components/courses/course-purchase";
import { ProgressBar } from "@/components/courses/progress-bar";
import { WishlistButton } from "@/components/courses/wishlist-button";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatCompact } from "@/lib/utils";

export default function CoursePage() {
  const params = useParams<{ id: string }>();
  const { st, user } = useGuard("BUYER");
  if (!user) return null;

  const course = selectCourseDetail(st, params.id, user.id);
  if (!course) {
    return (
      <MobileShell>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <p className="text-muted">Kurs topilmadi.</p>
          <Link href="/feed" className={cn(buttonVariants({ size: "md" }))}>
            Lentaga qaytish
          </Link>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell noPadding>
      <div className="relative flex-1 overflow-y-auto pb-28">
        <div className="relative h-56 w-full bg-surface-2">
          {course.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.coverImage}
              alt={course.title}
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-black/30" />
          <Link
            href="/feed"
            className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <span className="absolute left-4 top-4 ml-12 rounded-full bg-accent/90 px-3 py-1 text-xs font-semibold text-white">
            {course.category}
          </span>
        </div>

        <div className="px-5">
          <div className="-mt-6 flex items-end gap-3">
            <h1 className="flex-1 text-2xl font-extrabold leading-tight text-foreground">
              {course.title}
            </h1>
            <WishlistButton courseId={course.id} initialWishlisted={course.wishlisted} />
          </div>

          <div className="mt-3 flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <Eye size={16} /> {formatCompact(course.viewsCount)} ko&apos;rish
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={16} /> {formatCompact(course.salesCount)} o&apos;quvchi
            </span>
            <span className="flex items-center gap-1.5">
              <PlayCircle size={16} /> {course.lessons.length} dars
            </span>
          </div>

          {course.hashtags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {course.hashtags.map((tag) => (
                <span key={tag} className="text-xs font-medium text-accent">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <Link
            href={`/channels/${course.seller.id}`}
            className="mt-4 flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-3 transition active:scale-[0.99]"
          >
            {course.seller.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={course.seller.avatar}
                alt={course.seller.name}
                className="h-11 w-11 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-base font-bold text-white">
                {course.seller.name.charAt(0)}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{course.seller.name}</p>
              <p className="truncate text-xs text-accent">Kanalni ochish →</p>
            </div>
          </Link>

          {course.purchased && (
            <div className="mt-4 rounded-[var(--radius-md)] border border-border bg-surface p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  Sizning progressingiz
                </span>
                <span className="text-sm font-bold text-accent">{course.percent}%</span>
              </div>
              <ProgressBar percent={course.percent} />
              {course.certificateId ? (
                <Link
                  href={`/certificates/${course.certificateId}`}
                  className={cn(buttonVariants({ size: "sm", block: true }), "mt-3")}
                >
                  <Award size={16} /> Sertifikatni ko&apos;rish
                </Link>
              ) : (
                course.percent === 100 && (
                  <p className="mt-3 text-sm text-success">
                    Tabriklaymiz! Sertifikat tayyorlanmoqda...
                  </p>
                )
              )}
            </div>
          )}

          <section className="mt-5">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-subtle">
              Kurs haqida
            </h2>
            <p className="text-sm leading-relaxed text-muted">{course.description}</p>
          </section>

          <section className="mt-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-subtle">
              Darslar ({course.lessons.length})
            </h2>
            <LessonList lessons={course.lessons} purchased={course.purchased} />
          </section>
        </div>
      </div>

      {!course.purchased && (
        <CoursePurchase courseId={course.id} title={course.title} price={course.price} />
      )}
    </MobileShell>
  );
}
