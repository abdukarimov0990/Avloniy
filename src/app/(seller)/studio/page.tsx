import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Eye, Heart, BookOpen, Clapperboard, ShoppingBag } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getSellerStats, getSellerReels } from "@/lib/seller";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatCompact, formatPrice } from "@/lib/utils";

export default async function StudioPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [stats, reels] = await Promise.all([
    getSellerStats(user.id),
    getSellerReels(user.id),
  ]);

  return (
    <div className="px-5 pb-6">
      {/* Profil sarlavhasi */}
      <div className="flex items-center gap-4 py-6">
        {user.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar}
            alt={user.name}
            className="h-20 w-20 rounded-full border-2 border-accent object-cover"
          />
        ) : (
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-2xl font-bold text-white">
            {user.name.charAt(0)}
          </span>
        )}
        {/* Statistika */}
        <div className="grid flex-1 grid-cols-3 gap-1 text-center">
          <div>
            <p className="text-lg font-extrabold text-foreground">{stats.totalCourses}</p>
            <p className="text-xs text-muted">Kurs</p>
          </div>
          <div>
            <p className="text-lg font-extrabold text-foreground">{stats.totalReels}</p>
            <p className="text-xs text-muted">Reels</p>
          </div>
          <div>
            <p className="text-lg font-extrabold text-foreground">
              {formatCompact(stats.totalSales)}
            </p>
            <p className="text-xs text-muted">Sotuv</p>
          </div>
        </div>
      </div>

      {/* Ism, kategoriya, bio */}
      <div>
        <p className="text-base font-bold text-foreground">{user.name}</p>
        {user.category && (
          <span className="mt-1 inline-block rounded-full bg-accent-soft px-3 py-0.5 text-xs font-semibold text-accent">
            {user.category}
          </span>
        )}
        {user.bio && <p className="mt-2 text-sm text-muted">{user.bio}</p>}
      </div>

      {/* Yangi kurs */}
      <Link
        href="/studio/new"
        className={cn(buttonVariants({ size: "md", block: true }), "mt-4")}
      >
        <Plus size={18} /> Yangi kurs yaratish
      </Link>

      {/* Kurslar */}
      <section className="mt-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-subtle">
          <BookOpen size={15} /> Kurslar
        </h2>
        {stats.courses.length === 0 ? (
          <p className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-center text-sm text-muted">
            Hali kurs yo&apos;q.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {stats.courses.map((c) => (
              <Link
                key={c.id}
                href={`/studio/${c.id}`}
                className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-3 transition active:scale-[0.99]"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-surface-2">
                  {c.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.coverImage} alt={c.title} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{c.title}</p>
                  <p className="text-xs text-muted">{formatPrice(c.price)}</p>
                  <p className="mt-0.5 flex items-center gap-3 text-xs text-subtle">
                    <span className="flex items-center gap-1">
                      <ShoppingBag size={12} /> {c.salesCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={12} /> {formatCompact(c.viewsCount)}
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Reels gridi (Instagram uslubida) */}
      <section className="mt-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-subtle">
          <Clapperboard size={15} /> Reels
        </h2>
        {reels.length === 0 ? (
          <p className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-center text-sm text-muted">
            Hali reel yo&apos;q. Kurs ichida reel qo&apos;shing.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {reels.map((r) => (
              <Link
                key={r.id}
                href={`/studio/${r.courseId}`}
                className="relative aspect-[9/16] overflow-hidden rounded-[var(--radius-sm)] bg-black"
              >
                <video
                  src={r.videoUrl}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent p-1.5 text-[10px] font-medium text-white">
                  <span className="flex items-center gap-0.5">
                    <Eye size={11} /> {formatCompact(r.viewsCount)}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Heart size={11} /> {formatCompact(r.likesCount)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
