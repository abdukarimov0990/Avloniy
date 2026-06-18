import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Kirish — Avloniy" };

export default function LoginPage() {
  return (
    <div className="animate-fade-up">
      <h1 className="mb-1 text-xl font-bold text-foreground">Xush kelibsiz</h1>
      <p className="mb-6 text-sm text-muted">Davom etish uchun akkauntingizga kiring.</p>
      <AuthForm mode="login" />
    </div>
  );
}
