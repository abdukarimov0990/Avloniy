import "server-only";
import { cookies } from "next/headers";
import { toPublicUser } from "@/lib/demo/store";
import type { PublicUser, SessionPayload } from "@/types";

/**
 * Demo autentifikatsiya — bazasiz. Sessiya oddiy httpOnly cookie'да saqlanadi:
 * qiymat = `${userId}|${role}`. (Demo uchun yetarli; prodда JWT ishlatiladi.)
 */
export const COOKIE_NAME = "avloniy_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 kun

export async function createSession(payload: SessionPayload): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, `${payload.userId}|${payload.role}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  return parseSession(raw);
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const session = await getSession();
  if (!session) return null;
  return toPublicUser(session.userId);
}

/** Cookie qiymatini sessiyaga aylantiradi (proxy ham xuddi shu formatdan foydalanadi) */
export function parseSession(raw: string | undefined): SessionPayload | null {
  if (!raw) return null;
  const [userId, role] = raw.split("|");
  if (!userId || (role !== "BUYER" && role !== "SELLER")) return null;
  return { userId, role };
}
