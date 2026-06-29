"use client";

import { useState } from "react";
import { MessageCircle, Pin, Video, SmilePlus, MoreVertical, Pencil, Trash2, X, Check } from "lucide-react";
import { REACTION_EMOJIS } from "@/lib/demo/data";
import { cn, formatCompact } from "@/lib/utils";
import type { ChannelPostView } from "@/lib/demo/state";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "hozir";
  if (m < 60) return `${m} daq oldin`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} soat oldin`;
  return `${Math.floor(h / 24)} kun oldin`;
}

export function ChannelPostCard({
  post,
  showSeller = false,
  onReact,
  onOpenComments,
  onPin,
  onEdit,
  onDelete,
}: {
  post: ChannelPostView;
  showSeller?: boolean;
  onReact: (id: string, emoji: string) => void;
  onOpenComments: (id: string) => void;
  onPin?: (id: string) => void;
  onEdit?: (id: string, text: string) => void;
  onDelete?: (id: string) => void;
}) {
  const [picker, setPicker] = useState(false);
  const [menu, setMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [draft, setDraft] = useState(post.text);

  if (post.deleted) {
    return (
      <article className="rounded-[var(--radius-lg)] border border-dashed border-border bg-surface p-4 text-center text-sm text-subtle">
        🗑 Bu post o&apos;chirildi
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface">
      {(showSeller || post.canManage) && (
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
          {post.canManage && (
            <div className="relative">
              <button type="button" onClick={() => setMenu((v) => !v)} className="text-muted">
                <MoreVertical size={18} />
              </button>
              {menu && (
                <div className="absolute right-0 top-7 z-20 w-36 overflow-hidden rounded-[var(--radius-md)] border border-border bg-elevated text-sm shadow-lg">
                  <button type="button" onClick={() => { onPin?.(post.id); setMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-foreground hover:bg-surface-2">
                    <Pin size={14} /> {post.pinned ? "Olib tashlash" : "Mahkamlash"}
                  </button>
                  <button type="button" onClick={() => { setEditing(true); setDraft(post.text); setMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-foreground hover:bg-surface-2">
                    <Pencil size={14} /> Tahrirlash
                  </button>
                  <button type="button" onClick={() => { setConfirmDel(true); setMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-danger hover:bg-surface-2">
                    <Trash2 size={14} /> O&apos;chirish
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="px-4 pb-1 pt-3">
        {post.pinned && (
          <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">
            <Pin size={10} /> Mahkamlangan
          </span>
        )}
        {!showSeller && !post.canManage && <p className="mb-1 text-xs text-subtle">{timeAgo(post.createdAt)}</p>}

        {editing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-[var(--radius-md)] border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => { onEdit?.(post.id, draft.trim()); setEditing(false); }} className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                <Check size={13} /> Saqlash
              </button>
              <button type="button" onClick={() => setEditing(false)} className="flex items-center gap-1 rounded-full bg-surface-2 px-3 py-1 text-xs text-muted">
                <X size={13} /> Bekor
              </button>
            </div>
          </div>
        ) : (
          post.text && (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {post.text}
              {post.edited && <span className="ml-1 text-[11px] text-subtle">(tahrirlangan)</span>}
            </p>
          )
        )}
      </div>

      {post.type === "image" && post.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.imageUrl} alt="" className="mt-2 max-h-80 w-full object-cover" />
      )}
      {post.type === "video" && post.videoUrl && (
        <div className="mt-2 border-y border-border bg-black">
          <video src={post.videoUrl} controls playsInline className="aspect-video w-full" />
          <p className="flex items-center gap-1.5 bg-surface px-4 py-2 text-xs text-subtle">
            <Video size={12} /> Video post
          </p>
        </div>
      )}

      {/* Reaksiyalar + izoh */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        {post.reactions.map((r) => (
          <button
            key={r.emoji}
            type="button"
            onClick={() => onReact(post.id, r.emoji)}
            className={cn(
              "flex items-center gap-1 rounded-full border px-2 py-1 text-xs transition",
              r.mine ? "border-accent bg-accent-soft text-accent" : "border-border bg-background text-muted"
            )}
          >
            <span>{r.emoji}</span> {r.count}
          </button>
        ))}
        <div className="relative">
          <button type="button" onClick={() => setPicker((v) => !v)} className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted">
            <SmilePlus size={15} />
          </button>
          {picker && (
            <div className="absolute bottom-9 left-0 z-20 flex gap-1 rounded-full border border-border bg-elevated px-2 py-1.5 shadow-lg">
              {REACTION_EMOJIS.map((e) => (
                <button key={e} type="button" onClick={() => { onReact(post.id, e); setPicker(false); }} className="text-lg transition hover:scale-125">
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="button" onClick={() => onOpenComments(post.id)} className="ml-auto flex items-center gap-1.5 text-sm text-muted transition hover:text-foreground">
          <MessageCircle size={18} /> {formatCompact(post.commentsCount)}
        </button>
      </div>

      {confirmDel && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setConfirmDel(false)} />
          <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[var(--width-shell)] rounded-t-[var(--radius-xl)] border-t border-border bg-surface p-5">
            <h3 className="text-base font-bold text-foreground">Postni o&apos;chirish</h3>
            <p className="mt-2 text-sm text-muted">Bu postni o&apos;chirmoqchimisiz? Qaytarib bo&apos;lmaydi.</p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => { onDelete?.(post.id); setConfirmDel(false); }} className="flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-md)] bg-danger py-2.5 text-sm font-semibold text-white">
                <Trash2 size={16} /> O&apos;chirish
              </button>
              <button type="button" onClick={() => setConfirmDel(false)} className="rounded-[var(--radius-md)] px-4 text-sm text-muted">
                Bekor
              </button>
            </div>
          </div>
        </>
      )}
    </article>
  );
}
