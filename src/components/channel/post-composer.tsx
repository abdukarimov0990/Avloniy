"use client";

import { useState } from "react";
import { Send, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/demo/use-demo";
import { cn } from "@/lib/utils";

/** Sotuvchi kanalga post yozadi (matn yoki video) */
export function PostComposer() {
  const createChannelPost = useDemo((s) => s.createChannelPost);
  const [text, setText] = useState("");
  const [isVideo, setIsVideo] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length < 2) return;
    createChannelPost({ type: isVideo ? "video" : "text", text: text.trim() });
    setText("");
    setIsVideo(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-4"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="A'zolaringizga nima yozmoqchisiz?"
        rows={3}
        className="w-full resize-none rounded-[var(--radius-md)] border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-subtle focus:border-accent focus:outline-none"
      />
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsVideo((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition",
            isVideo ? "border-accent bg-accent-soft text-accent" : "border-border bg-background text-muted"
          )}
        >
          {isVideo ? <Video size={14} /> : <FileText size={14} />}
          {isVideo ? "Video post" : "Matnli post"}
        </button>
        <Button type="submit" size="sm" disabled={text.trim().length < 2}>
          <Send size={15} /> E&apos;lon qilish
        </Button>
      </div>
      {isVideo && (
        <p className="text-xs text-subtle">
          Video standart videodan olinadi (yuklash keyin qo&apos;shiladi).
        </p>
      )}
    </form>
  );
}
