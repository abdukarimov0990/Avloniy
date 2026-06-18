"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Loader2, Check, CreditCard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

type Stage = "idle" | "confirm" | "processing" | "done";

export function CoursePurchase({
  courseId,
  title,
  price,
}: {
  courseId: string;
  title: string;
  price: number;
}) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setStage("processing");
    setError(null);
    try {
      const res = await fetch(`/api/courses/${courseId}/purchase`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "To'lov amalga oshmadi");
        setStage("confirm");
        return;
      }
      setStage("done");
      // Bir oz kutib, sahifani yangilaymiz (endi "sotib olingan" holatda)
      setTimeout(() => {
        router.refresh();
      }, 1200);
    } catch {
      setError("Server bilan bog'lanib bo'lmadi");
      setStage("confirm");
    }
  }

  return (
    <>
      {/* Pastki belgilangan sotib olish paneli */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[var(--width-shell)] border-t border-border bg-surface/95 p-4 backdrop-blur">
        <Button block size="lg" onClick={() => setStage("confirm")}>
          <ShoppingBag size={18} />
          Sotib olish — {formatPrice(price)}
        </Button>
      </div>

      {/* Mock to'lov oynasi */}
      {stage !== "idle" && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60"
            onClick={() => stage !== "processing" && setStage("idle")}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[var(--width-shell)] rounded-t-[var(--radius-xl)] border-t border-border bg-surface p-5">
            {stage === "done" ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check size={32} />
                </span>
                <p className="text-lg font-bold text-foreground">Sotib olindi! 🎉</p>
                <p className="text-sm text-muted">
                  Kurs &quot;Mening kurslarim&quot;ga qo&apos;shildi.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground">To&apos;lov</h3>
                  <button
                    onClick={() => setStage("idle")}
                    disabled={stage === "processing"}
                    className="text-muted disabled:opacity-40"
                    type="button"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mb-4 rounded-[var(--radius-md)] border border-border bg-background p-4">
                  <p className="text-sm text-muted">{title}</p>
                  <p className="mt-1 text-2xl font-extrabold text-foreground">
                    {formatPrice(price)}
                  </p>
                </div>

                <div className="mb-4 flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-background px-4 py-3 text-sm text-muted">
                  <CreditCard size={18} className="text-accent" />
                  Demo to&apos;lov — haqiqiy karta talab qilinmaydi
                </div>

                {error && (
                  <p className="mb-3 rounded-[var(--radius-sm)] bg-danger/10 px-3 py-2 text-sm text-danger">
                    {error}
                  </p>
                )}

                <Button
                  block
                  size="lg"
                  onClick={handlePay}
                  disabled={stage === "processing"}
                >
                  {stage === "processing" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> To&apos;lanmoqda...
                    </>
                  ) : (
                    <>To&apos;lash</>
                  )}
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
