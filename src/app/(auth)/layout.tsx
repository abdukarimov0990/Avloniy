import { MobileShell } from "@/components/layout/mobile-shell";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileShell>
      <div className="flex flex-1 flex-col justify-center py-10">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Logo className="text-3xl" />
          <p className="text-sm text-muted">Bilim sotib oling. Bilim soting.</p>
        </div>
        {children}
      </div>
    </MobileShell>
  );
}
