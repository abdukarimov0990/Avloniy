"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function OnboardingForm() {
  const router = useRouter();
  const [category, setCategory] = useState<string>("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category) {
      setError("Yo'nalishni tanlang");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/seller/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, bio }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Xatolik yuz berdi");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Server bilan bog'lanib bo'lmadi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

      <Button type="submit" size="lg" block disabled={loading}>
        {loading && <Loader2 size={18} className="animate-spin" />}
        Davom etish
      </Button>
    </form>
  );
}
