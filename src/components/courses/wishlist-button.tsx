"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/** Kursni istaklar ro'yxatiga qo'shish/olib tashlash tugmasi */
export function WishlistButton({
  courseId,
  initialWishlisted,
}: {
  courseId: string;
  initialWishlisted: boolean;
}) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (pending) return;
    setPending(true);
    const next = !wishlisted;
    setWishlisted(next); // optimistik
    try {
      const res = await fetch(`/api/courses/${courseId}/wishlist`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setWishlisted(data.wishlisted);
      } else {
        setWishlisted(!next);
      }
    } catch {
      setWishlisted(!next);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] border transition active:scale-95",
        wishlisted
          ? "border-accent bg-accent-soft text-accent"
          : "border-border bg-surface text-muted"
      )}
      aria-label="Istaklar ro'yxati"
    >
      <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
    </button>
  );
}
