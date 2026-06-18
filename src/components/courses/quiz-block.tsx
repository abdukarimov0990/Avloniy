"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Quiz {
  id: string;
  question: string;
  options: string[];
}

interface Answer {
  selectedIndex: number;
  isCorrect: boolean;
  correctOptionIndex: number;
}

/** Dars ostidagi kviz bloki — buyer javob beradi, natija ko'rsatiladi */
export function QuizBlock({ lessonId }: { lessonId: string }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/lessons/${lessonId}/quiz`);
        const data = await res.json();
        if (!cancelled) setQuizzes(data.quizzes ?? []);
      } catch {
        if (!cancelled) setQuizzes([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  async function answer(quizId: string, index: number) {
    if (answers[quizId]) return; // allaqachon javob berilgan
    try {
      const res = await fetch(`/api/quiz/${quizId}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedIndex: index }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setAnswers((prev) => ({
        ...prev,
        [quizId]: {
          selectedIndex: index,
          isCorrect: data.isCorrect,
          correctOptionIndex: data.correctOptionIndex,
        },
      }));
    } catch {
      /* ignore */
    }
  }

  if (loading || quizzes.length === 0) return null;

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
