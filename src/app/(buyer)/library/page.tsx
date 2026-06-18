import Link from "next/link";
import { redirect } from "next/navigation";
import { GraduationCap, PlayCircle, ChevronRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getPurchasedCourses } from "@/lib/courses";
import { buttonVariants } from "@/components/ui/button";
import { ProgressBar } from "@/components/courses/progress-bar";
import { cn } from "@/lib/utils";

export default async function LibraryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const courses = await getPurchasedCourses(user.id);

  return (
    <div className="h-full overflow-y-auto px-5 pb-6">
      <h1 className="py-5 text-xl font-bold text-foreground">Mening kurslarim</h1>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center gap-4 pt-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-muted">
            <GraduationCap size={30} />
          </span>
          <div>
            <p className="font-semibold text-foreground">Hali kurs yo&apos;q</p>
            <p className="mt-1 text-sm text-muted">
              Lentadan yoqtirgan kursingizni sotib oling.
            </p>
          </div>
          <Link href="/feed" className={cn(buttonVariants({ size: "md" }))}>
            Lentaga o&apos;tish
          </Link>
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
                <p className="mt-1 flex items-center gap-1 text-xs text-subtle">
                  <PlayCircle size={13} /> {course.lessonsCount} dars
                </p>
                <ProgressBar percent={course.percent} className="mt-2" showLabel />
              </div>
              <ChevronRight size={20} className="text-subtle" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
