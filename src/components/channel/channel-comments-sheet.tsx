"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { selectChannelPostComments } from "@/lib/demo/state";

export function ChannelCommentsSheet({
  postId,
  onClose,
}: {
  postId: string | null;
  onClose: () => void;
}) {
  const st = useDemo();
  const addChannelComment = useDemo((s) => s.addChannelComment);
  const [text, setText] = useState("");

  const open = postId !== null;
  const comments = postId ? selectChannelPostComments(st, postId) : [];

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!postId || !text.trim()) return;
    addChannelComment(postId, text.trim());
    setText("");
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[70dvh] w-full max-w-[var(--width-shell)] flex-col rounded-t-[var(--radius-xl)] border-t border-border bg-surface transition-transform duration-300 ${open ? "translate-y-0" : "translate-y-full"}`}
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
          {comments.length === 0 ? (
            <p className="py-8 text-center text-sm text-subtle">Hali izoh yo&apos;q. Birinchi bo&apos;ling!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                {c.user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.user.avatar} alt={c.user.name} className="h-8 w-8 shrink-0 rounded-full object-cover" />
                ) : (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-bold text-muted">
                    {c.user.name.charAt(0)}
                  </span>
                )}
                <div>
                  <p className="text-xs font-semibold text-foreground">{c.user.name}</p>
                  <p className="text-sm text-muted">{c.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border p-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Izoh yozing..."
            className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm text-foreground placeholder:text-subtle focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
}
