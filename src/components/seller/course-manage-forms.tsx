"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Kursga dars qo'shish formasi */
export function AddLessonForm({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/courses/${courseId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Xatolik");
        return;
      }
      setTitle("");
      setContent("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-4"
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Dars nomi"
      />
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
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit" size="sm" disabled={loading}>
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
        Dars qo&apos;shish
      </Button>
    </form>
  );
}

/** Kursni reklama qiluvchi reel yaratish formasi */
export function CreateReelForm({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, caption }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Xatolik");
        return;
      }
      setCaption("");
      router.refresh();
    } finally {
      setLoading(false);
    }
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
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit" size="sm" variant="secondary" disabled={loading}>
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Clapperboard size={16} />
        )}
        Reel yaratish
      </Button>
    </form>
  );
}
