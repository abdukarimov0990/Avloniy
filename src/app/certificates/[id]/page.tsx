import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Award } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getCertificate } from "@/lib/certificates";
import { Logo } from "@/components/brand/logo";
import { PrintButton } from "@/components/courses/print-button";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}.${String(
    d.getMonth() + 1
  ).padStart(2, "0")}.${d.getFullYear()}`;
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const cert = await getCertificate(id, user.id);
  if (!cert) notFound();

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[var(--width-shell)] bg-background px-5 py-6 print:max-w-none print:bg-white print:p-0">
      {/* Yuqori panel (chop etishda yashiriladi) */}
      <div className="mb-5 flex items-center justify-between print:hidden">
        <Link
          href="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted"
        >
          <ArrowLeft size={20} />
        </Link>
        <span className="text-sm text-muted">Sertifikat</span>
      </div>

      {/* Sertifikat kartasi */}
      <div className="relative overflow-hidden rounded-[var(--radius-xl)] border-2 border-accent bg-surface p-8 text-center print:min-h-screen print:rounded-none print:border-0 print:bg-white print:py-24">
        {/* Bezak doiralari */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 print:hidden" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-accent/10 print:hidden" />

        <div className="mb-6 flex justify-center">
          <Logo className="text-3xl print:text-black" />
        </div>

        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white">
          <Award size={32} />
        </span>

        <p className="text-sm uppercase tracking-widest text-muted print:text-gray-500">
          Tugatganlik sertifikati
        </p>

        <p className="mt-6 text-xs text-subtle print:text-gray-500">
          Ushbu sertifikat
        </p>
        <p className="mt-1 text-2xl font-extrabold text-foreground print:text-black">
          {cert.userName}
        </p>
        <p className="mt-3 text-xs text-subtle print:text-gray-500">
          quyidagi kursni muvaffaqiyatli tugatganini tasdiqlaydi:
        </p>
        <p className="mt-1 text-lg font-bold text-accent">{cert.courseTitle}</p>

        <div className="mt-8 flex items-center justify-between border-t border-border pt-4 text-left print:border-gray-200">
          <div>
            <p className="text-[10px] uppercase text-subtle print:text-gray-400">
              O&apos;qituvchi
            </p>
            <p className="text-sm font-semibold text-foreground print:text-black">
              {cert.sellerName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase text-subtle print:text-gray-400">Sana</p>
            <p className="text-sm font-semibold text-foreground print:text-black">
              {formatDate(cert.issuedAt)}
            </p>
          </div>
        </div>

        <p className="mt-4 text-[10px] text-subtle print:text-gray-400">
          Sertifikat raqami: {cert.certificateNumber}
        </p>
      </div>

      {/* Chop etish tugmasi */}
      <div className="mt-5">
        <PrintButton />
      </div>
    </div>
  );
}
