"use client";

import Link from "next/link";
import { ArrowLeft, Bookmark, Eye, Heart } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { currentUser, selectSavedReels } from "@/lib/demo/state";
import { formatCompact } from "@/lib/utils";

export default function SavedPage() {
  const st = useDemo();
  const user = currentUser(st);
  if (!user) return null;

  const reels = selectSavedReels(st, user.id);

  return (
    <div className="h-full overflow-y-auto px-5 pb-6">
      <header className="flex items-center gap-3 py-5">
        <Link
          href="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Saqlangan reels</h1>
      </header>

      {reels.length === 0 ? (
        <div className="flex flex-col items-center gap-4 pt-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-muted">
            <Bookmark size={28} />
          </span>
          <p className="text-sm text-muted">
            Hali saqlangan reel yo&apos;q. Lentada bookmark belgisini bosing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {reels.map((r) => (
            <Link
              key={r.id}
              href={`/courses/${r.courseId}`}
              className="relative aspect-[9/16] overflow-hidden rounded-[var(--radius-sm)] bg-black"
            >
              <video
                src={r.videoUrl}
                className="h-full w-full object-cover"
                muted
                playsInline
                preload="metadata"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent p-1.5 text-[10px] font-medium text-white">
                <span className="flex items-center gap-0.5">
                  <Eye size={11} /> {formatCompact(r.viewsCount)}
                </span>
                <span className="flex items-center gap-0.5">
                  <Heart size={11} /> {formatCompact(r.likesCount)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
