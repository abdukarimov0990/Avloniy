"use client";

import { Heart, MessageCircle, Pin, Video } from "lucide-react";
import { cn, formatCompact } from "@/lib/utils";
import type { ChannelPostView } from "@/lib/demo/state";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "hozir";
  if (m < 60) return `${m} daq oldin`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} soat oldin`;
  const d = Math.floor(h / 24);
  return `${d} kun oldin`;
}

export function ChannelPostCard({
  post,
  showSeller = false,
  onLike,
  onOpenComments,
}: {
  post: ChannelPostView;
  showSeller?: boolean;
  onLike: (id: string) => void;
  onOpenComments: (id: string) => void;
}) {
  return (
    <article className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface">
      {/* Sarlavha (sotuvchi) */}
      {showSeller && (
        <div className="flex items-center gap-2.5 px-4 pt-3.5">
          {post.sellerAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.sellerAvatar} alt={post.sellerName} className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
              {post.sellerName.charAt(0)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{post.sellerName}</p>
            <p className="text-xs text-subtle">kanal • {timeAgo(post.createdAt)}</p>
          </div>
        </div>
      )}

      <div className="px-4 pb-1 pt-3">
        {post.pinned && (
          <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">
            <Pin size={10} /> Mahkamlangan
          </span>
        )}
        {!showSeller && (
          <p className="mb-1 text-xs text-subtle">{timeAgo(post.createdAt)}</p>
        )}
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{post.text}</p>
      </div>

      {/* Video */}
      {post.type === "video" && post.videoUrl && (
        <div className="mt-2 border-y border-border bg-black">
          <video src={post.videoUrl} controls playsInline className="aspect-video w-full" />
          <p className="flex items-center gap-1.5 bg-surface px-4 py-2 text-xs text-subtle">
            <Video size={12} /> Video post
          </p>
        </div>
      )}

      {/* Harakatlar */}
      <div className="flex items-center gap-5 px-4 py-3">
        <button
          type="button"
          onClick={() => onLike(post.id)}
          className={cn("flex items-center gap-1.5 text-sm transition", post.likedByMe ? "text-accent" : "text-muted")}
        >
          <Heart size={18} fill={post.likedByMe ? "currentColor" : "none"} />
          {formatCompact(post.likesCount)}
        </button>
        <button
          type="button"
          onClick={() => onOpenComments(post.id)}
          className="flex items-center gap-1.5 text-sm text-muted transition hover:text-foreground"
        >
          <MessageCircle size={18} />
          {formatCompact(post.commentsCount)}
        </button>
      </div>
    </article>
  );
}
