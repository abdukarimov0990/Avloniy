"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoleSelector } from "@/components/auth/role-selector";
import { useAuthStore } from "@/lib/store/auth-store";
import type { Role } from "@/types";

type Mode = "login" | "register";

const HOME_PATH: Record<Role, string> = {
  BUYER: "/feed",
  SELLER: "/dashboard",
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [role, setRole] = useState<Role>("BUYER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isRegister ? { name, email, password, role } : { email, password, role }
        ),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Xatolik yuz berdi");
        return;
      }

      setUser(data.user);
      // Sotuvchi profilini hali to'ldirmagan bo'lsa, keyinchalik onboarding'ga
      // yo'naltirish mantiqi qo'shiladi. Hozircha asosiy sahifaga.
      router.push(HOME_PATH[data.user.role as Role]);
      router.refresh();
    } catch {
      setError("Server bilan bog'lanib bo'lmadi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <Label>Kim sifatida?</Label>
        <RoleSelector value={role} onChange={setRole} />
      </div>

      {isRegister && (
        <div>
          <Label htmlFor="name">Ism</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ismingiz"
            autoComplete="name"
            required
          />
        </div>
      )}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@misol.uz"
          autoComplete="email"
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Parol</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••"
          autoComplete={isRegister ? "new-password" : "current-password"}
          required
        />
      </div>

      {error && (
        <p className="rounded-[var(--radius-sm)] bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" block disabled={loading}>
        {loading && <Loader2 size={18} className="animate-spin" />}
        {isRegister ? "Ro'yxatdan o'tish" : "Kirish"}
      </Button>

      <p className="text-center text-sm text-muted">
        {isRegister ? "Akkauntingiz bormi? " : "Akkauntingiz yo'qmi? "}
        <Link
          href={isRegister ? "/login" : "/register"}
          className="font-semibold text-accent hover:underline"
        >
          {isRegister ? "Kirish" : "Ro'yxatdan o'tish"}
        </Link>
      </p>
    </form>
  );
}
