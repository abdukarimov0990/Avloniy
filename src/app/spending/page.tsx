"use client";

import Link from "next/link";
import { ArrowLeft, Wallet } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { selectBuyerSpending } from "@/lib/demo/state";
import { useGuard } from "@/lib/demo/hooks";
import { formatPrice } from "@/lib/utils";

const TX_LABEL: Record<string, string> = {
  channel_join: "Kanalga qo'shilish",
  course: "Kurs sotib olish",
  private_message: "Shaxsiy xabar",
  tip: "Tip",
};
function txDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function SpendingPage() {
  const { user } = useGuard();
  const st = useDemo();
  if (!user) return null;

  const sp = selectBuyerSpending(st, user.id);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[var(--width-shell)] flex-col bg-background px-5 pb-6 sm:border-x sm:border-border">
      <header className="flex items-center gap-3 py-5">
        <Link href="/profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Sarf tarixi</h1>
      </header>

      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-5">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Wallet size={16} className="text-accent" /> Jami sarflangan
        </div>
        <p className="mt-2 text-3xl font-extrabold text-foreground">{formatPrice(sp.total)}</p>
      </div>

      <h2 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-subtle">
        Tranzaksiyalar ({sp.transactions.length})
      </h2>
      {sp.transactions.length === 0 ? (
        <p className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-center text-sm text-muted">
          Hali to&apos;lov qilmadingiz.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {sp.transactions.map((t) => (
            <div key={t.id} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{TX_LABEL[t.type] ?? t.type}</p>
                <p className="text-xs text-subtle">{t.counterpartyName} • {txDate(t.createdAt)}</p>
              </div>
              <p className="shrink-0 text-sm font-bold text-foreground">−{formatPrice(t.amount)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
