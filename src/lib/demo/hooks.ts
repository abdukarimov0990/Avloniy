"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo/use-demo";
import { currentUser, type DemoState, type Role } from "@/lib/demo/state";
import type { PublicUser } from "@/types";

/** Har rol uchun asosiy sahifa */
export function homePath(role: Role): string {
  return role === "SELLER" ? "/dashboard" : "/feed";
}

/**
 * Sahifa/layout uchun himoya hook'i. To'liq holat (`st`) va joriy foydalanuvchini qaytaradi,
 * kerak bo'lganda /login yoki to'g'ri hududga yo'naltiradi.
 */
export function useGuard(role?: Role): { st: DemoState; user: PublicUser | null } {
  const router = useRouter();
  const st = useDemo();
  const user = currentUser(st);

  const userId = user?.id ?? null;
  const userRole = user?.role ?? null;
  useEffect(() => {
    if (!userId) {
      router.replace("/login");
    } else if (role && userRole !== role) {
      router.replace(homePath(userRole as Role));
    }
  }, [userId, userRole, role, router]);

  return { st, user };
}
