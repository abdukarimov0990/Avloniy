"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Share2,
  Play,
  Volume2,
  VolumeX,
  ShoppingBag,
  Check,
  Bookmark,
} from "lucide-react";
import { cn, formatCompact, formatPrice } from "@/lib/utils";
import type { FeedReel } from "@/types";

/** O'ng tomondagi harakat tugmasi (like/comment/share) */
function ActionButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 text-white"
      type="button"
    >
      <span
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full bg-black/35 backdrop-blur-sm transition-transform active:scale-90",
          active && "text-accent"
        )}
      >
        {icon}
      </span>
      {label && <span className="text-xs font-medium drop-shadow">{label}</span>}
    </button>
  );
}

export function ReelCard({
  reel,
  isActive,
  onLike,
  onSave,
  onView,
  onOpenComments,
}: {
  reel: FeedReel;
  isActive: boolean;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onView: (id: string) => void;
  onOpenComments: (reel: FeedReel) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [shared, setShared] = useState(false);
  const [likePop, setLikePop] = useState(false);
  const viewedRef = useRef(false);

  // Faol reel avtomatik o'ynaydi, nofaol — to'xtaydi
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.currentTime = 0;
      video.play().then(() => setPaused(false)).catch(() => {});
      // Ko'rishni bir marta hisoblaymiz
      if (!viewedRef.current) {
        viewedRef.current = true;
        onView(reel.id);
      }
    } else {
      video.pause();
    }
  }, [isActive, reel.id, onView]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  }

  function handleLike() {
    if (!reel.likedByMe) {
      setLikePop(true);
      setTimeout(() => setLikePop(false), 300);
    }
    onLike(reel.id);
  }

  async function handleShare() {
    const url = `${window.location.origin}/courses/${reel.course.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: reel.course.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 1800);
      }
    } catch {
      /* foydalanuvchi bekor qildi */
    }
  }

  return (
    <section className="relative h-full w-full shrink-0 snap-start snap-always overflow-hidden bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted={muted}
        playsInline
        preload="metadata"
        onClick={togglePlay}
      />

      {/* To'xtatilganda markazda play belgisi */}
      {paused && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 z-10 flex items-center justify-center"
          type="button"
          aria-label="O'ynatish"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
            <Play size={30} className="ml-1 text-white" fill="currentColor" />
          </span>
        </button>
      )}

      {/* Pastdan tepaga qoraytirish (matn o'qilishi uchun) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Ovoz tugmasi (tepa o'ng) */}
      <button
        onClick={() => setMuted((m) => !m)}
        className="absolute right-3 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm"
        type="button"
        aria-label={muted ? "Ovozni yoqish" : "Ovozni o'chirish"}
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      {/* O'ng harakat paneli */}
      <div className="absolute bottom-28 right-3 z-20 flex flex-col items-center gap-5">
        <ActionButton
          icon={
            <Heart
              size={24}
              className={cn(likePop && "animate-pop")}
              fill={reel.likedByMe ? "currentColor" : "none"}
            />
          }
          label={formatCompact(reel.likesCount)}
          active={reel.likedByMe}
          onClick={handleLike}
        />
        <ActionButton
          icon={<MessageCircle size={24} />}
          label={formatCompact(reel.commentsCount)}
          onClick={() => onOpenComments(reel)}
        />
        <ActionButton
          icon={
            <Bookmark size={24} fill={reel.savedByMe ? "currentColor" : "none"} />
          }
          label={reel.savedByMe ? "Saqlandi" : "Saqlash"}
          active={reel.savedByMe}
          onClick={() => onSave(reel.id)}
        />
        <ActionButton
          icon={shared ? <Check size={24} /> : <Share2 size={24} />}
          label={shared ? "Nusxalandi" : "Ulashish"}
          onClick={handleShare}
        />
      </div>

      {/* Pastki ma'lumot bloki */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-3 p-4 pr-20">
        {/* Sotuvchi */}
        <div className="flex items-center gap-2">
          {reel.seller.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={reel.seller.avatar}
              alt={reel.seller.name}
              className="h-9 w-9 rounded-full border border-white/40 object-cover"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
              {reel.seller.name.charAt(0)}
            </span>
          )}
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white drop-shadow">
              {reel.seller.name}
            </p>
            {reel.seller.category && (
              <p className="text-xs text-white/70">{reel.seller.category}</p>
            )}
          </div>
        </div>

        {/* Kurs nomi + izoh */}
        <div>
          <p className="text-base font-bold text-white drop-shadow">
            {reel.course.title}
          </p>
          {reel.caption && (
            <p className="mt-0.5 line-clamp-2 text-sm text-white/85 drop-shadow">
              {reel.caption}
            </p>
          )}
        </div>

        {/* Sotib olish / ochish tugmasi */}
        {reel.purchased ? (
          <Link
            href={`/courses/${reel.course.id}`}
            className="flex h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-white/15 text-sm font-semibold text-white backdrop-blur-sm transition active:scale-[0.98]"
          >
            <Check size={18} /> Kursni ochish
          </Link>
        ) : (
          <Link
            href={`/courses/${reel.course.id}`}
            className="flex h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-accent text-sm font-semibold text-white shadow-lg shadow-accent/30 transition active:scale-[0.98]"
          >
            <ShoppingBag size={18} />
            Sotib olish — {formatPrice(reel.course.price)}
          </Link>
        )}
      </div>
    </section>
  );
}
