"use client";

import { Heart } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { cn } from "@/lib/utils";

/** Kursni istaklar ro'yxatiga qo'shish/olib tashlash tugmasi (store'ni o'qiydi) */
export function WishlistButton({
  courseId,
  initialWishlisted,
}: {
  courseId: string;
  initialWishlisted: boolean;
}) {
  const uid = useDemo((s) => s.currentUserId);
  const wishlist = useDemo((s) => s.wishlist);
  const toggleWishlist = useDemo((s) => s.toggleWishlist);

  const wishlisted = uid ? wishlist.includes(`${uid}:${courseId}`) : initialWishlisted;

  return (
    <button
      type="button"
      onClick={() => toggleWishlist(courseId)}
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
