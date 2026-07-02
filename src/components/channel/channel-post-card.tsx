"use client";

import { useState } from "react";
import { MessageCircle, Pin, SmilePlus, MoreVertical, Pencil, Trash2, X, Check } from "lucide-react";
import { REACTION_EMOJIS } from "@/lib/demo/data";
import { cn, formatCompact } from "@/lib/utils";
import type { ChannelPostView } from "@/lib/demo/state";

// Telegram uslubidagi vaqt (soat:daqiqa)
function clockTime(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
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
      <div className="mx-auto rounded-full bg-surface/70 px-3 py-1 text-center text-xs text-subtle">
        🗑 o&apos;chirilgan post
      </div>
    );
  }

  const hasMedia = (post.type === "image" && post.imageUrl) || (post.type === "video" && post.videoUrl);

  return (
    <article className="group relative w-fit max-w-[85%] animate-fade-up">
      <div className="overflow-hidden rounded-2xl rounded-bl-md border border-border bg-surface shadow-sm">
        {/* Pin + kanal nomi (agregat lentada) */}
        {(post.pinned || showSeller) && (
          <div className="flex items-center gap-2 px-3 pt-2.5">
            {showSeller &&
              (post.sellerAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.sellerAvatar} alt={post.sellerName} className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white">
                  {post.sellerName.charAt(0)}
                </span>
              ))}
            {showSeller && <span className="text-xs font-semibold text-accent">{post.sellerName}</span>}
            {post.pinned && (
              <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-subtle">
                <Pin size={11} /> mahkamlangan
              </span>
            )}
          </div>
        )}

        {/* Media */}
        {post.type === "image" && post.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.imageUrl} alt="" className={cn("max-h-80 w-full object-cover", (post.pinned || showSeller) && "mt-2")} />
        )}
        {post.type === "video" && post.videoUrl && (
          <video
            src={post.videoUrl}
            controls
            playsInline
            className={cn("aspect-video w-full bg-black", (post.pinned || showSeller) && "mt-2")}
          />
        )}

        {/* Matn + vaqt */}
        <div className={cn("px-3 pb-1.5", hasMedia || post.pinned || showSeller ? "pt-2" : "pt-2.5")}>
          {editing ? (
            <div className="flex w-[240px] max-w-full flex-col gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-[var(--radius-md)] border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { onEdit?.(post.id, draft.trim()); setEditing(false); }}
                  className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white"
                >
                  <Check size={13} /> Saqlash
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-1 rounded-full bg-surface-2 px-3 py-1 text-xs text-muted"
                >
                  <X size={13} /> Bekor
                </button>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {post.text}
              <span className="ml-2 inline-flex translate-y-0.5 items-center gap-1 align-bottom text-[10px] text-subtle">
                {post.edited && <span>tahrirlangan</span>}
                {clockTime(post.createdAt)}
              </span>
            </p>
          )}
        </div>

        {/* Reaksiyalar — mavjudlari + qo'shish tugmasi (har doim) */}
        {!editing && (
          <div className="flex flex-wrap items-center gap-1.5 px-3 pb-2">
            {post.reactions.map((r) => (
              <button
                key={r.emoji}
                type="button"
                onClick={() => onReact(post.id, r.emoji)}
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition",
                  r.mine ? "bg-accent text-white" : "bg-surface-2 text-muted hover:text-foreground"
                )}
              >
                <span>{r.emoji}</span> {r.count}
              </button>
            ))}
            <div className="relative">
              <button
                type="button"
                onClick={() => setPicker((v) => !v)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 text-muted transition hover:text-foreground"
              >
                <SmilePlus size={14} />
              </button>
              {picker && (
                <div className="absolute bottom-8 left-0 z-20 flex gap-1 rounded-full border border-border bg-elevated px-2 py-1.5 shadow-lg">
                  {REACTION_EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => { onReact(post.id, e); setPicker(false); }}
                      className="text-lg transition hover:scale-125"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Izohlar paneli (Telegram "discussion" tugmasi) */}
        <button
          type="button"
          onClick={() => onOpenComments(post.id)}
          className="flex w-full items-center gap-2 border-t border-border px-3 py-2 text-xs font-medium text-accent transition hover:bg-surface-2"
        >
          <MessageCircle size={15} />
          {post.commentsCount > 0 ? `${formatCompact(post.commentsCount)} izoh` : "Izoh qoldirish"}
        </button>
      </div>

      {/* Boshqaruv menyusi (egasi) */}
      {post.canManage && !editing && (
        <div className="absolute right-1.5 top-1.5">
          <button
            type="button"
            onClick={() => setMenu((v) => !v)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white/90 backdrop-blur-sm transition hover:bg-black/60"
          >
            <MoreVertical size={16} />
          </button>
          {menu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
              <div className="absolute right-0 top-8 z-20 w-36 overflow-hidden rounded-[var(--radius-md)] border border-border bg-elevated text-sm shadow-lg">
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
            </>
          )}
        </div>
      )}

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
