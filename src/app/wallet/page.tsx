"use client";

import Link from "next/link";
import { ArrowLeft, Wallet, Radio, MessageCircle, Gift, Download } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { selectSellerWallet } from "@/lib/demo/state";
import { useGuard } from "@/lib/demo/hooks";
import { formatPrice } from "@/lib/utils";

const TX_LABEL: Record<string, string> = {
  channel_join: "Kanal a'zoligi",
  course: "Kurs sotuvi",
  private_message: "Shaxsiy xabar",
  tip: "Tip",
};

function txDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function WalletPage() {
  const { user } = useGuard("SELLER");
  const st = useDemo();
  if (!user) return null;

  const w = selectSellerWallet(st, user.id);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[var(--width-shell)] flex-col bg-background px-5 pb-6 sm:border-x sm:border-border">
      <header className="flex items-center gap-3 py-5">
        <Link href="/dashboard" className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Hamyon</h1>
      </header>

      {/* Balans */}
      <div className="rounded-[var(--radius-xl)] border border-accent/40 bg-accent-soft p-5">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Wallet size={16} className="text-accent" /> Joriy balans
        </div>
        <p className="mt-2 text-3xl font-extrabold text-foreground">{formatPrice(w.total)}</p>
        <button
          type="button"
          className="mt-4 flex items-center gap-2 rounded-[var(--radius-md)] border border-accent/50 px-4 py-2 text-sm font-semibold text-accent"
          onClick={() => alert("Pul yechib olish keyingi versiyada (demo).")}
        >
          <Download size={16} /> Pul yechib olish
        </button>
      </div>

      {/* Daromad manbalari */}
      <h2 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-subtle">Daromad manbalari</h2>
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Radio size={18} />, label: "Kanal", value: w.channel },
          { icon: <MessageCircle size={18} />, label: "Xabarlar", value: w.message },
          { icon: <Gift size={18} />, label: "Tip", value: w.tip },
        ].map((s) => (
          <div key={s.label} className="rounded-[var(--radius-lg)] border border-border bg-surface p-3 text-center">
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-accent">{s.icon}</span>
            <p className="mt-2 text-sm font-bold text-foreground">{formatPrice(s.value)}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tranzaksiyalar */}
      <h2 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-subtle">
        Tranzaksiyalar ({w.transactions.length})
      </h2>
      {w.transactions.length === 0 ? (
        <p className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-center text-sm text-muted">
          Hali tranzaksiya yo&apos;q.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {w.transactions.map((t) => (
            <div key={t.id} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{TX_LABEL[t.type] ?? t.type}</p>
                <p className="text-xs text-subtle">{t.counterpartyName} • {txDate(t.createdAt)}</p>
              </div>
              <p className="shrink-0 text-sm font-bold text-success">+{formatPrice(t.amount)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
