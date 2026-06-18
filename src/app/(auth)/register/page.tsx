import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Ro'yxatdan o'tish — Avloniy" };

export default function RegisterPage() {
  return (
    <div className="animate-fade-up">
      <h1 className="mb-1 text-xl font-bold text-foreground">Akkaunt yarating</h1>
      <p className="mb-6 text-sm text-muted">
        Bir daqiqada ro&apos;yxatdan o&apos;ting.
      </p>
      <AuthForm mode="register" />
    </div>
  );
}
