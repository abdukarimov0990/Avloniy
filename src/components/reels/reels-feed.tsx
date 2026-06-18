"use client";

import { useEffect, useRef, useState } from "react";
import { ReelCard } from "@/components/reels/reel-card";
import { CommentsSheet } from "@/components/reels/comments-sheet";
import { useDemo } from "@/lib/demo/use-demo";
import { currentUser, selectFeedReels } from "@/lib/demo/state";
import type { FeedReel } from "@/types";

export function ReelsFeed() {
  const st = useDemo();
  const user = currentUser(st);
  const reels = selectFeedReels(st, user?.id ?? undefined);

  const toggleLike = useDemo((s) => s.toggleLike);
  const toggleSave = useDemo((s) => s.toggleSave);
  const incrementView = useDemo((s) => s.incrementView);

  const [activeId, setActiveId] = useState<string | null>(reels[0]?.id ?? null);
  const [commentsReelId, setCommentsReelId] = useState<string | null>(null);
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

  const commentsReel: FeedReel | null =
    reels.find((r) => r.id === commentsReelId) ?? null;

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
              onLike={toggleLike}
              onSave={toggleSave}
              onView={incrementView}
              onOpenComments={(r) => setCommentsReelId(r.id)}
            />
          </div>
        ))}
      </div>

      <CommentsSheet reel={commentsReel} onClose={() => setCommentsReelId(null)} />
    </>
  );
}
