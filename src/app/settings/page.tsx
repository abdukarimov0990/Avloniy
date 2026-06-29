"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AtSign, MessageCircle, Check } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { useGuard, homePath } from "@/lib/demo/hooks";
import { useToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const { user } = useGuard();
  const setUsername = useDemo((s) => s.setUsername);
  const setPrice = useDemo((s) => s.setPrivateMessagePrice);
  const toast = useToast((s) => s.show);

  const [username, setU] = useState(user?.username ?? "");
  const [price, setPriceVal] = useState(String(user?.privateMessagePrice ?? 0));
  const [uErr, setUErr] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  function save(e: React.FormEvent) {
    e.preventDefault();
    setUErr(null);
    const res = setUsername(username);
    if (!res.ok) {
      setUErr(res.error ?? "Xato");
      return;
    }
    if (user!.role === "SELLER") setPrice(Number(price || 0));
    setSaved(true);
    toast("Sozlamalar saqlandi ✓");
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[var(--width-shell)] flex-col bg-background px-5 pb-6 sm:border-x sm:border-border">
      <header className="flex items-center gap-3 py-5">
        <Link href={homePath(user.role)} className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Sozlamalar</h1>
      </header>

      <form onSubmit={save} className="flex flex-col gap-5">
        <div>
          <Label htmlFor="u">Username (@handle)</Label>
          <div className="relative">
            <AtSign size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
            <Input
              id="u"
              value={username}
              onChange={(e) => setU(e.target.value.replace(/^@/, ""))}
              placeholder="username"
              className="pl-10"
            />
          </div>
          {uErr && <p className="mt-1.5 text-sm text-danger">{uErr}</p>}
          <p className="mt-1.5 text-xs text-subtle">Profilingiz manzili: ilmy.uz/@{username || "username"}</p>
        </div>

        {user.role === "SELLER" && (
          <div>
            <Label htmlFor="p">Shaxsiy xabar narxi (so&apos;m)</Label>
            <div className="relative">
              <MessageCircle size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
              <Input
                id="p"
                type="number"
                inputMode="numeric"
                min={0}
                value={price}
                onChange={(e) => setPriceVal(e.target.value)}
                placeholder="15000"
                className="pl-10"
              />
            </div>
            <p className="mt-1.5 text-xs text-subtle">
              0 = shaxsiy xabar o&apos;chiq. A&apos;zolar har xabar uchun shu summani to&apos;laydi.
            </p>
          </div>
        )}

        <Button type="submit" size="lg" block>
          {saved ? (
            <>
              <Check size={18} /> Saqlandi
            </>
          ) : (
            "Saqlash"
          )}
        </Button>
      </form>
    </div>
  );
}
