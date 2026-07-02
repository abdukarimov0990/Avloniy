"use client";

import { useRef, useState } from "react";
import { Send, Video, Image as ImageIcon, Paperclip, X } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type PostType = "text" | "image" | "video";

/** Telegram uslubidagi pastki post yozish paneli (matn / rasm / video). */
export function ChannelComposerBar() {
  const createChannelPost = useDemo((s) => s.createChannelPost);
  const toast = useToast((s) => s.show);
  const [text, setText] = useState("");
  const [type, setType] = useState<PostType>("text");
  const [mediaUrl, setMediaUrl] = useState("");
  const [attachOpen, setAttachOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const canSend = text.trim().length >= 2 || (type === "image" && mediaUrl.trim().length > 0) || type === "video";

  function submit() {
    if (!canSend) return;
    createChannelPost({ type, text: text.trim(), mediaUrl: mediaUrl.trim() || undefined });
    setText("");
    setType("text");
    setMediaUrl("");
    setAttachOpen(false);
    toast("Post e'lon qilindi 📢");
    inputRef.current?.focus();
  }

  function pick(t: PostType) {
    setType(t);
    setAttachOpen(false);
    if (t === "video") toast("Video standart videodan olinadi (demo).");
  }

  return (
    <div className="relative shrink-0 border-t border-border bg-surface">
      {/* Tanlangan media haqida chiziq */}
      {type !== "text" && (
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <span className="flex items-center gap-1 text-xs font-medium text-accent">
            {type === "image" ? <ImageIcon size={13} /> : <Video size={13} />}
            {type === "image" ? "Rasm posti" : "Video post"}
          </span>
          {type === "image" && (
            <input
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="Rasm havolasi (https://...)"
              className="h-8 flex-1 rounded-full border border-border bg-background px-3 text-xs text-foreground placeholder:text-subtle focus:border-accent focus:outline-none"
            />
          )}
          <button
            type="button"
            onClick={() => { setType("text"); setMediaUrl(""); }}
            className="ml-auto flex h-6 w-6 items-center justify-center rounded-full text-muted hover:text-foreground"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 px-2.5 py-2">
        {/* Biriktirish */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setAttachOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition hover:bg-surface-2 hover:text-accent"
            aria-label="Biriktirish"
          >
            <Paperclip size={20} />
          </button>
          {attachOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setAttachOpen(false)} />
              <div className="absolute bottom-12 left-0 z-20 w-36 overflow-hidden rounded-[var(--radius-md)] border border-border bg-elevated text-sm shadow-lg">
                <button type="button" onClick={() => pick("image")} className="flex w-full items-center gap-2 px-3 py-2.5 text-foreground hover:bg-surface-2">
                  <ImageIcon size={15} className="text-accent" /> Rasm
                </button>
                <button type="button" onClick={() => pick("video")} className="flex w-full items-center gap-2 px-3 py-2.5 text-foreground hover:bg-surface-2">
                  <Video size={15} className="text-accent" /> Video
                </button>
              </div>
            </>
          )}
        </div>

        {/* Matn */}
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder="Xabar yozing..."
          className="max-h-28 min-h-[40px] flex-1 resize-none rounded-[var(--radius-lg)] border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-subtle focus:border-accent focus:outline-none"
        />

        {/* Yuborish */}
        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition",
            canSend ? "bg-accent hover:bg-accent-bright" : "bg-surface-2 text-subtle"
          )}
          aria-label="Yuborish"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
