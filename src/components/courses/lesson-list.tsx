"use client";

import { useState } from "react";
import { Lock, Play, ChevronDown, Check, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { QuizBlock } from "@/components/courses/quiz-block";
import { useDemo } from "@/lib/demo/use-demo";
import type { CourseLesson } from "@/lib/demo/state";

export function LessonList({
  lessons,
  purchased,
}: {
  lessons: CourseLesson[];
  /** Kurs sotib olinganmi (preview darslar baribir ochiq) */
  purchased: boolean;
}) {
  const markProgress = useDemo((s) => s.markProgress);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {lessons.map((lesson, i) => {
        const unlocked = purchased || lesson.isFreePreview;
        const isOpen = openId === lesson.id;
        const isDone = lesson.completed;

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
                    onEnded={() => markProgress(lesson.id, { isCompleted: true })}
                  />
                )}
                {lesson.content && (
                  <p className="bg-surface p-3 text-sm text-muted">{lesson.content}</p>
                )}

                {lesson.hasQuiz && <QuizBlock lessonId={lesson.id} />}

                <div className="bg-surface p-3">
                  {isDone ? (
                    <p className="flex items-center gap-1.5 text-sm font-medium text-success">
                      <Check size={16} /> Bu dars tugatilgan
                    </p>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => markProgress(lesson.id, { isCompleted: true })}
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
