import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Kirish — Avloniy" };

export default function LoginPage() {
  return (
    <div className="animate-fade-up">
      <h1 className="mb-1 text-xl font-bold text-foreground">Xush kelibsiz</h1>
      <p className="mb-6 text-sm text-muted">Davom etish uchun akkauntingizga kiring.</p>
      <AuthForm mode="login" />

      {/* Demo akkauntlar */}
      <div className="mt-6 rounded-[var(--radius-md)] border border-dashed border-border bg-surface p-3 text-xs text-muted">
        <p className="mb-1 font-semibold text-foreground">Demo akkauntlar (parol: parol123)</p>
        <p>👤 Xaridor: <span className="text-accent">ali@misol.uz</span></p>
        <p>🎓 Sotuvchi: <span className="text-accent">aziz@misol.uz</span></p>
      </div>
    </div>
  );
}
