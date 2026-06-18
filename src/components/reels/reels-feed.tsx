"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ReelCard } from "@/components/reels/reel-card";
import { CommentsSheet } from "@/components/reels/comments-sheet";
import type { FeedReel } from "@/types";

export function ReelsFeed({ initialReels }: { initialReels: FeedReel[] }) {
  const [reels, setReels] = useState<FeedReel[]>(initialReels);
  const [activeId, setActiveId] = useState<string | null>(
    initialReels[0]?.id ?? null
  );
  const [commentsReel, setCommentsReel] = useState<FeedReel | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Qaysi reel ko'rinayotganini aniqlaymiz (autoplay uchun)
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const id = entry.target.getAttribute("data-reel-id");
            if (id) setActiveId(id);
          }
        }
      },
      { root, threshold: [0.6] }
    );
    const cards = root.querySelectorAll<HTMLElement>("[data-reel-id]");
    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [reels.length]);

  // Reel holatini qisman yangilash yordamchisi
  const patchReel = useCallback((id: string, patch: Partial<FeedReel>) => {
    setReels((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  // Like (optimistik)
  const handleLike = useCallback(
    async (id: string) => {
      const current = reels.find((r) => r.id === id);
      if (!current) return;
      const nextLiked = !current.likedByMe;
      patchReel(id, {
        likedByMe: nextLiked,
        likesCount: current.likesCount + (nextLiked ? 1 : -1),
      });
      try {
        const res = await fetch(`/api/reels/${id}/like`, { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          patchReel(id, { likedByMe: data.liked, likesCount: data.likesCount });
        } else {
          // Xatolik bo'lsa qaytaramiz
          patchReel(id, {
            likedByMe: current.likedByMe,
            likesCount: current.likesCount,
          });
        }
      } catch {
        patchReel(id, {
          likedByMe: current.likedByMe,
          likesCount: current.likesCount,
        });
      }
    },
    [reels, patchReel]
  );

  // Saqlash (optimistik)
  const handleSave = useCallback(
    async (id: string) => {
      const current = reels.find((r) => r.id === id);
      if (!current) return;
      const next = !current.savedByMe;
      patchReel(id, { savedByMe: next });
      try {
        const res = await fetch(`/api/reels/${id}/save`, { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          patchReel(id, { savedByMe: data.saved });
        } else {
          patchReel(id, { savedByMe: current.savedByMe });
        }
      } catch {
        patchReel(id, { savedByMe: current.savedByMe });
      }
    },
    [reels, patchReel]
  );

  const handleCommentAdded = useCallback(
    (reelId: string) => {
      const current = reels.find((r) => r.id === reelId);
      if (current) patchReel(reelId, { commentsCount: current.commentsCount + 1 });
    },
    [reels, patchReel]
  );

  if (reels.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-muted">
        Hali reels yo&apos;q. Tez orada yangi kurslar paydo bo&apos;ladi.
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="h-full snap-y snap-mandatory overflow-y-scroll scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {reels.map((reel) => (
          <div key={reel.id} data-reel-id={reel.id} className="h-full w-full">
            <ReelCard
              reel={reel}
              isActive={activeId === reel.id}
              onLike={handleLike}
              onSave={handleSave}
              onOpenComments={setCommentsReel}
            />
          </div>
        ))}
      </div>

      <CommentsSheet
        reel={commentsReel}
        onClose={() => setCommentsReel(null)}
        onAdded={handleCommentAdded}
      />
    </>
  );
}
