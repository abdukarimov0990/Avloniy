"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORIES } from "@/lib/constants";
import { useDemo } from "@/lib/demo/use-demo";
import { cn } from "@/lib/utils";

export function CourseForm() {
  const router = useRouter();
  const createCourse = useDemo((s) => s.createCourse);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (title.trim().length < 3) return setError("Kurs nomi kamida 3 ta harf");
    if (description.trim().length < 10) return setError("Tavsif kamida 10 ta belgi");
    if (!category) return setError("Kategoriyani tanlang");

    const { id } = createCourse({
      title: title.trim(),
      description: description.trim(),
      price: Number(price || 0),
      category,
      coverImage: coverImage.trim() || undefined,
    });
    router.push(`/studio/${id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <Label htmlFor="title">Kurs nomi</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Masalan: Noldan Web Dasturlash" required />
      </div>

      <div>
        <Label htmlFor="description">Tavsif</Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Kurs nima haqida, o'quvchi nimani o'rganadi..."
          rows={4}
          required
          className="w-full resize-none rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <div>
        <Label htmlFor="price">Narx (so&apos;m)</Label>
        <Input id="price" type="number" inputMode="numeric" min={0} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="199000" required />
      </div>

      <div>
        <Label>Kategoriya</Label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition active:scale-95",
                category === c
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-surface text-muted hover:border-border-strong"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="cover">Muqova rasmi havolasi (ixtiyoriy)</Label>
        <Input id="cover" type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." />
      </div>

      {error && (
        <p className="rounded-[var(--radius-sm)] bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
      )}

      <Button type="submit" size="lg" block>
        Kursni yaratish
      </Button>
    </form>
  );
}
