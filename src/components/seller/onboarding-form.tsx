"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CATEGORIES } from "@/lib/constants";
import { useDemo } from "@/lib/demo/use-demo";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

export function OnboardingForm() {
  const router = useRouter();
  const setOnboarding = useDemo((s) => s.setOnboarding);
  const toast = useToast((s) => s.show);
  const [category, setCategory] = useState<string>("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category) {
      setError("Yo'nalishni tanlang");
      return;
    }
    setOnboarding(category, bio.trim() || null);
    toast("Profil sozlandi 🎉");
    router.replace("/dashboard");
  }

  function skip() {
    setOnboarding("Boshqa", null);
    toast("Profilni keyinroq Sozlamalarda to'ldirasiz");
    router.replace("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Qadam ko'rsatkichi */}
      <div className="flex items-center gap-2">
        <span className="h-1.5 flex-1 rounded-full bg-accent" />
        <span className="h-1.5 w-8 rounded-full bg-surface-2" />
        <span className="text-xs font-medium text-subtle">1/2</span>
      </div>

      <div>
        <Label>Yo&apos;nalishingiz qaysi?</Label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all active:scale-95",
                category === c
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-surface text-muted hover:border-border-strong"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="bio">O&apos;zingiz haqingizda (ixtiyoriy)</Label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Masalan: 5 yillik tajribaga ega dasturchi. Sodda tilda o'rgataman."
          rows={3}
          maxLength={300}
          className="w-full resize-none rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {error && (
        <p className="rounded-[var(--radius-sm)] bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" block>
        Davom etish
      </Button>
      <button type="button" onClick={skip} className="-mt-2 text-center text-sm font-medium text-muted hover:text-foreground">
        Keyinroq to&apos;ldirish
      </button>
    </form>
  );
}
