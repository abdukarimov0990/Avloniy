"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { selectLessonQuizzes } from "@/lib/demo/state";
import { cn } from "@/lib/utils";

interface Answer {
  selectedIndex: number;
  isCorrect: boolean;
  correctOptionIndex: number;
}

/** Dars ostidagi kviz bloki — buyer javob beradi, natija ko'rsatiladi */
export function QuizBlock({ lessonId }: { lessonId: string }) {
  const st = useDemo();
  const recordQuiz = useDemo((s) => s.recordQuiz);
  const quizzes = selectLessonQuizzes(st, lessonId);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  if (quizzes.length === 0) return null;

  function answer(quizId: string, index: number) {
    if (answers[quizId]) return;
    const result = recordQuiz(quizId, index);
    if (!result) return;
    setAnswers((prev) => ({
      ...prev,
      [quizId]: {
        selectedIndex: index,
        isCorrect: result.isCorrect,
        correctOptionIndex: result.correctOptionIndex,
      },
    }));
  }

  return (
    <div className="space-y-4 bg-surface p-3">
      {quizzes.map((quiz) => {
        const ans = answers[quiz.id];
        return (
          <div key={quiz.id}>
            <p className="mb-2 flex items-start gap-2 text-sm font-semibold text-foreground">
              <HelpCircle size={16} className="mt-0.5 shrink-0 text-accent" />
              {quiz.question}
            </p>
            <div className="flex flex-col gap-2">
              {quiz.options.map((opt, i) => {
                const isSelected = ans?.selectedIndex === i;
                const isCorrectOption = ans && ans.correctOptionIndex === i;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!!ans}
                    onClick={() => answer(quiz.id, i)}
                    className={cn(
                      "flex items-center justify-between rounded-[var(--radius-sm)] border px-3 py-2 text-left text-sm transition",
                      !ans && "border-border bg-background hover:border-accent",
                      ans && isCorrectOption && "border-success bg-success/10 text-success",
                      ans && isSelected && !ans.isCorrect && "border-danger bg-danger/10 text-danger",
                      ans && !isSelected && !isCorrectOption && "border-border bg-background opacity-60"
                    )}
                  >
                    {opt}
                    {ans && isCorrectOption && <CheckCircle2 size={16} />}
                    {ans && isSelected && !ans.isCorrect && <XCircle size={16} />}
                  </button>
                );
              })}
            </div>
            {ans && (
              <p
                className={cn(
                  "mt-2 text-xs font-medium",
                  ans.isCorrect ? "text-success" : "text-danger"
                )}
              >
                {ans.isCorrect ? "To'g'ri! 🎉" : "Noto'g'ri. To'g'ri javob belgilandi."}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
