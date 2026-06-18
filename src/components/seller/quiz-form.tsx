"use client";

import { useState } from "react";
import { HelpCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDemo } from "@/lib/demo/use-demo";
import { cn } from "@/lib/utils";

/** Darsga kviz qo'shish formasi (sotuvchi) */
export function QuizForm({ lessonId }: { lessonId: string }) {
  const addQuiz = useDemo((s) => s.addQuiz);
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function setOption(i: number, val: string) {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? val : o)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const filled = options.map((o) => o.trim());
    const kept = filled.filter(Boolean);
    if (kept.length < 2) return setError("Kamida 2 ta variant kiriting");
    if (!filled[correctIndex]) return setError("To'g'ri javob bo'sh bo'lmasin");
    if (question.trim().length < 3) return setError("Savol kamida 3 ta harf");

    const newCorrect = kept.indexOf(filled[correctIndex]);
    addQuiz(lessonId, { question: question.trim(), options: kept, correctOptionIndex: newCorrect });

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(0);
    setOpen(false);
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 flex items-center gap-1.5 text-xs font-medium text-accent"
      >
        {done ? (
          <>
            <Check size={14} /> Kviz qo&apos;shildi
          </>
        ) : (
          <>
            <HelpCircle size={14} /> Kviz qo&apos;shish
          </>
        )}
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 flex flex-col gap-3 rounded-[var(--radius-md)] border border-border bg-background p-3"
    >
      <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Savol" />
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCorrectIndex(i)}
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs",
                correctIndex === i ? "border-success bg-success text-white" : "border-border text-subtle"
              )}
              title="To'g'ri javob"
            >
              {correctIndex === i ? <Check size={14} /> : i + 1}
            </button>
            <Input value={opt} onChange={(e) => setOption(i, e.target.value)} placeholder={`Variant ${i + 1}`} className="h-10" />
          </div>
        ))}
      </div>
      <p className="text-xs text-subtle">
        Yashil belgi — to&apos;g&apos;ri javob. Bo&apos;sh variantlar hisobga olinmaydi.
      </p>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          <Check size={16} /> Saqlash
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Bekor qilish
        </Button>
      </div>
    </form>
  );
}
