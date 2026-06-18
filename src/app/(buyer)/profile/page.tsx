import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Flame,
  Award,
  Bookmark,
  Heart,
  ChevronRight,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getPurchasedCourses } from "@/lib/courses";
import { getStreak } from "@/lib/streak";
import { getUserCertificates } from "@/lib/certificates";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [courses, streak, certificates] = await Promise.all([
    getPurchasedCourses(user.id),
    getStreak(user.id),
    getUserCertificates(user.id),
  ]);

  return (
    <div className="h-full overflow-y-auto px-5 pb-6">
      <div className="flex items-center justify-between py-5">
        <h1 className="text-xl font-bold text-foreground">Profil</h1>
        <LogoutButton />
      </div>

      {/* Avatar va ism */}
      <div className="flex flex-col items-center gap-3 py-4">
        {user.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar}
            alt={user.name}
            className="h-24 w-24 rounded-full border-2 border-accent object-cover"
          />
        ) : (
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-accent text-3xl font-bold text-white">
            {user.name.charAt(0)}
          </span>
        )}
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">{user.name}</p>
          <span className="mt-1 inline-block rounded-full bg-accent-soft px-3 py-0.5 text-xs font-semibold text-accent">
            Xaridor
          </span>
        </div>
      </div>

      {/* Streak + statistika */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-center">
          <p className="flex items-center justify-center gap-1 text-2xl font-extrabold text-foreground">
            <Flame
              size={22}
              className={streak.current > 0 ? "text-accent" : "text-subtle"}
              fill={streak.current > 0 ? "currentColor" : "none"}
            />
            {streak.current}
          </p>
          <p className="text-xs text-muted">Kunlik streak</p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-center">
          <p className="text-2xl font-extrabold text-foreground">{courses.length}</p>
          <p className="text-xs text-muted">Kurslar</p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-center">
          <p className="text-2xl font-extrabold text-foreground">
            {certificates.length}
          </p>
          <p className="text-xs text-muted">Sertifikat</p>
        </div>
      </div>

      {streak.longest > 0 && (
        <p className="mt-2 text-center text-xs text-subtle">
          Eng uzun streak: {streak.longest} kun 🔥
        </p>
      )}

      {/* Tezkor havolalar */}
      <div className="mt-5 flex flex-col gap-2">
        <ProfileLink href="/saved" icon={<Bookmark size={18} />} label="Saqlangan reels" />
        <ProfileLink href="/wishlist" icon={<Heart size={18} />} label="Istaklarim" />
      </div>

      {/* Sertifikatlar */}
      {certificates.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-subtle">
            Sertifikatlar
          </h2>
          <div className="flex flex-col gap-2">
            {certificates.map((c) => (
              <Link
                key={c.id}
                href={`/certificates/${c.id}`}
                className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-3 transition active:scale-[0.99]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Award size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {c.courseTitle}
                  </p>
                  <p className="text-xs text-subtle">{c.certificateNumber}</p>
                </div>
                <ChevronRight size={18} className="text-subtle" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Ma'lumotlar */}
      <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-surface">
        <div className="flex items-center gap-3 p-4">
          <Mail size={18} className="text-muted" />
          <div>
            <p className="text-xs text-subtle">Email</p>
            <p className="text-sm text-foreground">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-3.5 transition active:scale-[0.99]"
    >
      <span className="text-accent">{icon}</span>
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      <ChevronRight size={18} className="text-subtle" />
    </Link>
  );
}
