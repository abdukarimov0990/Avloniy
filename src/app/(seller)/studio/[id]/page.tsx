"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Eye, ShoppingBag, Heart, PlayCircle, HelpCircle } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { currentUser, selectSellerCourse } from "@/lib/demo/state";
import { AddLessonForm, CreateReelForm } from "@/components/seller/course-manage-forms";
import { QuizForm } from "@/components/seller/quiz-form";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatCompact, formatPrice } from "@/lib/utils";

export default function ManageCoursePage() {
  const params = useParams<{ id: string }>();
  const st = useDemo();
  const user = currentUser(st);
  if (!user) return null;

  const course = selectSellerCourse(st, params.id, user.id);
  if (!course) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-5 text-center">
        <p className="text-muted">Kurs topilmadi.</p>
        <Link href="/studio" className={cn(buttonVariants({ size: "md" }))}>
          Studiyaga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="px-5 pb-6">
      <header className="flex items-center gap-3 py-5">
        <Link
          href="/studio"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="truncate text-lg font-bold text-foreground">{course.title}</h1>
      </header>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface">
        {course.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.coverImage} alt={course.title} className="h-32 w-full object-cover" />
        )}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-accent-soft px-3 py-0.5 text-xs font-semibold text-accent">
              {course.category}
            </span>
            <span className="text-sm font-bold text-foreground">{formatPrice(course.price)}</span>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Eye size={14} /> {formatCompact(course.viewsCount)} ko&apos;rish
            </span>
            <span className="flex items-center gap-1">
              <ShoppingBag size={14} /> {course.salesCount} sotuv
            </span>
          </div>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-subtle">
          Darslar ({course.lessons.length})
        </h2>
        {course.lessons.length > 0 && (
          <div className="mb-3 flex flex-col gap-2">
            {course.lessons.map((l) => (
              <div key={l.id} className="rounded-[var(--radius-md)] border border-border bg-surface p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                    {l.order}
                  </span>
                  <span className="flex-1 text-sm text-foreground">{l.title}</span>
                  {l.quizCount > 0 && (
                    <span className="flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted">
                      <HelpCircle size={11} /> {l.quizCount} kviz
                    </span>
                  )}
                  <PlayCircle size={16} className="text-subtle" />
                </div>
                <QuizForm lessonId={l.id} />
              </div>
            ))}
          </div>
        )}
        <AddLessonForm courseId={course.id} />
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-subtle">
          Reels ({course.reels.length})
        </h2>
        {course.reels.length > 0 && (
          <div className="mb-3 flex flex-col gap-2">
            {course.reels.map((r) => (
              <div key={r.id} className="rounded-[var(--radius-md)] border border-border bg-surface p-3">
                <p className="text-sm text-foreground">{r.caption || "(matnsiz reel)"}</p>
                <p className="mt-1 flex items-center gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Eye size={12} /> {formatCompact(r.viewsCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart size={12} /> {formatCompact(r.likesCount)}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
        <CreateReelForm courseId={course.id} />
      </section>
    </div>
  );
}
