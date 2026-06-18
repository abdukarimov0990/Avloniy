"use client";

import { useState } from "react";
import { Plus, Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDemo } from "@/lib/demo/use-demo";

/** Kursga dars qo'shish formasi */
export function AddLessonForm({ courseId }: { courseId: string }) {
  const addLesson = useDemo((s) => s.addLesson);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addLesson(courseId, { title: title.trim(), content: content.trim() });
    setTitle("");
    setContent("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-4"
    >
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Dars nomi" />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Dars matni / material (ixtiyoriy)"
        rows={2}
        className="w-full resize-none rounded-[var(--radius-md)] border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-subtle focus:border-accent focus:outline-none"
      />
      <p className="text-xs text-subtle">
        Video hozircha standart videodan olinadi (yuklash keyin qo&apos;shiladi).
      </p>
      <Button type="submit" size="sm">
        <Plus size={16} /> Dars qo&apos;shish
      </Button>
    </form>
  );
}

/** Kursni reklama qiluvchi reel yaratish formasi */
export function CreateReelForm({ courseId }: { courseId: string }) {
  const createReel = useDemo((s) => s.createReel);
  const [caption, setCaption] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createReel({ courseId, caption: caption.trim() });
    setCaption("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-4"
    >
      <Input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Reel matni (masalan: Noldan dasturchi bo'l! 🚀)"
      />
      <p className="text-xs text-subtle">
        Reel xaridorlar lentasida standart video bilan chiqadi.
      </p>
      <Button type="submit" size="sm" variant="secondary">
        <Clapperboard size={16} /> Reel yaratish
      </Button>
    </form>
  );
}
