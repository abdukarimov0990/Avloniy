"use client";

import { useState } from "react";
import { ShoppingBag, Loader2, Check, CreditCard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/demo/use-demo";
import { formatPrice } from "@/lib/utils";

type Stage = "idle" | "confirm" | "processing" | "done";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function CoursePurchase({
  courseId,
  title,
  price,
}: {
  courseId: string;
  title: string;
  price: number;
}) {
  const purchase = useDemo((s) => s.purchase);
  const [stage, setStage] = useState<Stage>("idle");

  async function handlePay() {
    setStage("processing");
    await wait(600);
    setStage("done");
    await wait(1200);
    // Store yangilanadi → kurs sahifasi qayta chiziladi, bu panel yo'qoladi.
    purchase(courseId);
  }

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[var(--width-shell)] border-t border-border bg-surface/95 p-4 backdrop-blur">
        <Button block size="lg" onClick={() => setStage("confirm")}>
          <ShoppingBag size={18} />
          Sotib olish — {formatPrice(price)}
        </Button>
      </div>

      {stage !== "idle" && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60"
            onClick={() => stage === "confirm" && setStage("idle")}
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

                <Button block size="lg" onClick={handlePay} disabled={stage === "processing"}>
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
