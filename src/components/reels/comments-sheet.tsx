"use client";

import { useEffect, useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import type { FeedComment, FeedReel } from "@/types";

export function CommentsSheet({
  reel,
  onClose,
  onAdded,
}: {
  reel: FeedReel | null;
  onClose: () => void;
  onAdded: (reelId: string) => void;
}) {
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const open = reel !== null;

  useEffect(() => {
    if (!reel) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setComments([]);
      try {
        const res = await fetch(`/api/reels/${reel.id}/comments`);
        const data = await res.json();
        if (!cancelled) setComments(data.comments ?? []);
      } catch {
        if (!cancelled) setComments([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [reel]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!reel || !text.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/reels/${reel.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [data.comment, ...prev]);
        onAdded(reel.id);
        setText("");
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Fon (orqa qism) */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[70dvh] w-full max-w-[var(--width-shell)] flex-col rounded-t-[var(--radius-xl)] border-t border-border bg-surface transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">
            Izohlar {comments.length > 0 && `(${comments.length})`}
          </h3>
          <button onClick={onClose} type="button" className="text-muted">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {loading ? (
            <div className="flex justify-center py-8 text-muted">
              <Loader2 className="animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <p className="py-8 text-center text-sm text-subtle">
              Hali izoh yo&apos;q. Birinchi bo&apos;ling!
            </p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                {c.user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.user.avatar}
                    alt={c.user.name}
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-bold text-muted">
                    {c.user.name.charAt(0)}
                  </span>
                )}
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {c.user.name}
                  </p>
                  <p className="text-sm text-muted">{c.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 border-t border-border p-3"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Izoh yozing..."
            className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm text-foreground placeholder:text-subtle focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white disabled:opacity-40"
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>
    </>
  );
}
