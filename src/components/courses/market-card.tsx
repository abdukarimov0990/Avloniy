"use client";

import { useRef } from "react";
import Link from "next/link";
import { Play, ShoppingBag } from "lucide-react";
import { formatCompact, formatPrice } from "@/lib/utils";
import type { DiscoverCourse } from "@/lib/demo/state";

/** Marketplace uslubidagi kurs kartasi — preview video (hover'da o'ynaydi) yoki rasm. */
export function MarketCard({ c }: { c: DiscoverCourse }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Link
      href={`/courses/${c.id}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface transition active:scale-[0.99] hover:border-border-strong"
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => {
        const v = videoRef.current;
        if (v) {
          v.pause();
          v.currentTime = 0;
        }
      }}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-surface-2">
        {c.previewVideo ? (
          <>
            <video
              ref={videoRef}
              src={c.previewVideo}
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm">
              <Play size={13} className="ml-0.5" fill="currentColor" />
            </span>
          </>
        ) : c.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.coverImage} alt={c.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-subtle">
            {c.title.charAt(0)}
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
          {c.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <p className="line-clamp-2 text-sm font-semibold text-foreground">{c.title}</p>
        <div className="mt-1.5 flex items-center gap-1.5">
          {c.sellerAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.sellerAvatar} alt={c.sellerName} className="h-4 w-4 rounded-full object-cover" />
          ) : (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[8px] font-bold text-white">
              {c.sellerName.charAt(0)}
            </span>
          )}
          <span className="truncate text-xs text-muted">{c.sellerName}</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm font-bold text-accent">{formatPrice(c.price)}</span>
          <span className="flex items-center gap-1 text-[11px] text-subtle">
            <ShoppingBag size={11} /> {formatCompact(c.salesCount)}
          </span>
        </div>
      </div>
    </Link>
  );
}
