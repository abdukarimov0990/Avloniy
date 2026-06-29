"use client";

import { useState } from "react";
import { Send, Video, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/demo/use-demo";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type PostType = "text" | "image" | "video";

/** Sotuvchi kanalga post yozadi (matn / rasm / video) */
export function PostComposer() {
  const createChannelPost = useDemo((s) => s.createChannelPost);
  const toast = useToast((s) => s.show);
  const [text, setText] = useState("");
  const [type, setType] = useState<PostType>("text");
  const [mediaUrl, setMediaUrl] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length < 2 && type === "text") return;
    createChannelPost({ type, text: text.trim(), mediaUrl: mediaUrl.trim() || undefined });
    setText(""); setType("text"); setMediaUrl("");
    toast("Post e'lon qilindi 📢");
  }

  const opts: { t: PostType; label: string; icon: React.ReactNode }[] = [
    { t: "text", label: "Matn", icon: <FileText size={14} /> },
    { t: "image", label: "Rasm", icon: <ImageIcon size={14} /> },
    { t: "video", label: "Video", icon: <Video size={14} /> },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="A'zolaringizga nima yozmoqchisiz?"
        rows={3}
        className="w-full resize-none rounded-[var(--radius-md)] border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-subtle focus:border-accent focus:outline-none"
      />

      {type === "image" && (
        <input
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          placeholder="Rasm havolasi (https://...)"
          className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-background px-3 text-sm text-foreground placeholder:text-subtle focus:border-accent focus:outline-none"
        />
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1.5">
          {opts.map((o) => (
            <button
              key={o.t}
              type="button"
              onClick={() => setType(o.t)}
              className={cn(
                "flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-xs font-medium transition",
                type === o.t ? "border-accent bg-accent-soft text-accent" : "border-border bg-background text-muted"
              )}
            >
              {o.icon} {o.label}
            </button>
          ))}
        </div>
        <Button type="submit" size="sm" disabled={text.trim().length < 2 && type === "text"}>
          <Send size={15} /> E&apos;lon
        </Button>
      </div>
      {type === "video" && <p className="text-xs text-subtle">Video standart videodan olinadi (demo).</p>}
    </form>
  );
}
