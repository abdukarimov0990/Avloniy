"use client";

import {
  Wallet,
  ShoppingBag,
  Eye,
  BookOpen,
  Heart,
  Clapperboard,
  TrendingUp,
} from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { currentUser, selectSellerStats } from "@/lib/demo/state";
import { Logo } from "@/components/brand/logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { RevenueChart } from "@/components/seller/revenue-chart";
import { formatCompact, formatPrice } from "@/lib/utils";

function StatCard({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] border p-4 ${
        accent ? "border-accent/40 bg-accent-soft" : "border-border bg-surface"
      }`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full ${
          accent ? "bg-accent text-white" : "bg-surface-2 text-accent"
        }`}
      >
        {icon}
      </span>
      <p className="mt-3 text-xl font-extrabold text-foreground">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const st = useDemo();
  const user = currentUser(st);
  if (!user) return null;

  const stats = selectSellerStats(st, user.id);

  return (
    <div className="px-5 pb-6">
      <header className="flex items-center justify-between py-5">
        <Logo />
        <LogoutButton />
      </header>

      <div className="mb-5">
        <h1 className="text-xl font-bold text-foreground">
          Salom, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-muted">Bugungi ko&apos;rsatkichlaringiz</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={<Wallet size={18} />} label="Jami daromad" value={formatPrice(stats.totalRevenue)} accent />
        <StatCard icon={<ShoppingBag size={18} />} label="Sotuvlar" value={formatCompact(stats.totalSales)} />
        <StatCard icon={<Eye size={18} />} label="Kurs ko'rishlari" value={formatCompact(stats.totalViews)} />
        <StatCard icon={<BookOpen size={18} />} label="Kurslar" value={String(stats.totalCourses)} />
      </div>

      {stats.topCourse && stats.topCourse.revenue > 0 && (
        <div className="mt-3 flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
            <TrendingUp size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">Eng ko&apos;p daromad keltirgan</p>
            <p className="truncate text-sm font-semibold text-foreground">{stats.topCourse.title}</p>
          </div>
          <p className="text-sm font-bold text-accent">{formatPrice(stats.topCourse.revenue)}</p>
        </div>
      )}

      <div className="mt-5">
        <RevenueChart
          courses={stats.courses.map((c) => ({ name: c.title, revenue: c.revenue, sales: c.salesCount }))}
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <StatCard icon={<Clapperboard size={18} />} label="Reels" value={String(stats.totalReels)} />
        <StatCard icon={<Eye size={18} />} label="Reel ko'rish" value={formatCompact(stats.reelViews)} />
        <StatCard icon={<Heart size={18} />} label="Like" value={formatCompact(stats.reelLikes)} />
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-subtle">
          Kurslar ko&apos;rsatkichi
        </h2>
        {stats.courses.length === 0 ? (
          <p className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-center text-sm text-muted">
            Hali kurs yo&apos;q. &quot;Yaratish&quot; orqali birinchi kursingizni qo&apos;shing.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {stats.courses.map((c) => (
              <div key={c.id} className="rounded-[var(--radius-md)] border border-border bg-surface p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">{c.title}</p>
                  <p className="shrink-0 text-sm font-bold text-accent">{formatPrice(c.revenue)}</p>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Eye size={13} /> {formatCompact(c.viewsCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    <ShoppingBag size={13} /> {c.salesCount} sotuv
                  </span>
                  <span className="ml-auto">{formatPrice(c.price)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
