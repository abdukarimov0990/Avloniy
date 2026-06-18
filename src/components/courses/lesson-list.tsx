"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Play, ChevronDown, Check, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { QuizBlock } from "@/components/courses/quiz-block";
import type { CourseLesson } from "@/lib/courses";

export function LessonList({
  lessons,
  purchased,
}: {
  lessons: CourseLesson[];
  /** Kurs sotib olinganmi (preview darslar baribir ochiq) */
  purchased: boolean;
}) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(
    () => new Set(lessons.filter((l) => l.completed).map((l) => l.id))
  );
  const [marking, setMarking] = useState<string | null>(null);

  async function markComplete(lessonId: string) {
    if (completed.has(lessonId)) return;
    setMarking(lessonId);
    // Optimistik
    setCompleted((prev) => new Set(prev).add(lessonId));
    try {
      await fetch(`/api/lessons/${lessonId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: true }),
      });
      // Server progress bar / sertifikatni yangilash uchun
      router.refresh();
    } finally {
      setMarking(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {lessons.map((lesson, i) => {
        const unlocked = purchased || lesson.isFreePreview;
        const isOpen = openId === lesson.id;
        const isDone = completed.has(lesson.id);

        return (
          <div
            key={lesson.id}
            className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface"
          >
            <button
              type="button"
              disabled={!unlocked}
              onClick={() => setOpenId(isOpen ? null : lesson.id)}
              className="flex w-full items-center gap-3 p-3 text-left disabled:cursor-default"
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  isDone
                    ? "bg-success text-white"
                    : unlocked
                      ? "bg-accent-soft text-accent"
                      : "bg-surface-2 text-subtle"
                )}
              >
                {isDone ? <Check size={16} /> : unlocked ? i + 1 : <Lock size={15} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {lesson.title}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-subtle">
                  {unlocked ? "Video dars" : "Sotib olgandan keyin ochiladi"}
                  {!purchased && lesson.isFreePreview && (
                    <span className="flex items-center gap-0.5 rounded-full bg-accent-soft px-1.5 text-[10px] font-semibold text-accent">
                      <Gift size={10} /> Bepul
                    </span>
                  )}
                </span>
              </span>
              {unlocked &&
                (isOpen ? (
                  <ChevronDown size={18} className="text-muted" />
                ) : (
                  <Play size={16} className="text-muted" />
                ))}
            </button>

            {unlocked && isOpen && (
              <div className="border-t border-border bg-black">
                {lesson.videoUrl && (
                  <video
                    src={lesson.videoUrl}
                    controls
                    playsInline
                    className="aspect-video w-full"
                    onEnded={() => markComplete(lesson.id)}
                  />
                )}
                {lesson.content && (
                  <p className="bg-surface p-3 text-sm text-muted">{lesson.content}</p>
                )}

                {/* Kviz (agar bo'lsa) */}
                {lesson.hasQuiz && <QuizBlock lessonId={lesson.id} />}

                {/* Tugatish tugmasi */}
                <div className="bg-surface p-3">
                  {isDone ? (
                    <p className="flex items-center gap-1.5 text-sm font-medium text-success">
                      <Check size={16} /> Bu dars tugatilgan
                    </p>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => markComplete(lesson.id)}
                      disabled={marking === lesson.id}
                    >
                      <Check size={16} /> Tugatdim
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
