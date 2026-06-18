import { NextResponse, type NextRequest } from "next/server";
import type { Role, SessionPayload } from "@/types";

// Demo sessiya cookie'si: qiymat = `${userId}|${role}` (Edge-safe, inline parse).
const COOKIE_NAME = "avloniy_session";

function parseSession(raw: string | undefined): SessionPayload | null {
  if (!raw) return null;
  const [userId, role] = raw.split("|");
  if (!userId || (role !== "BUYER" && role !== "SELLER")) return null;
  return { userId, role };
}

/** Har bir rol uchun asosiy sahifa */
function homePath(role: Role): string {
  return role === "SELLER" ? "/dashboard" : "/feed";
}

// Faqat shu prefikslar himoyalanadi / boshqariladi
const AUTH_PAGES = ["/login", "/register"];
const BUYER_PREFIXES = [
  "/feed",
  "/courses",
  "/library",
  "/profile",
  "/saved",
  "/wishlist",
  "/certificates",
];
const SELLER_PREFIXES = ["/dashboard", "/studio", "/onboarding"];

function startsWithAny(path: string, prefixes: string[]): boolean {
  return prefixes.some((p) => path === p || path.startsWith(`${p}/`));
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = parseSession(req.cookies.get(COOKIE_NAME)?.value);

  const isAuthPage = AUTH_PAGES.includes(pathname);
  const isBuyerArea = startsWithAny(pathname, BUYER_PREFIXES);
  const isSellerArea = startsWithAny(pathname, SELLER_PREFIXES);

  // 1) Login bo'lgan foydalanuvchi auth sahifasiga kirsa — o'z uyiga
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL(homePath(session.role), req.url));
  }

  // 2) Himoyalangan sahifa, lekin login emas — login'ga
  if (!session && (isBuyerArea || isSellerArea)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 3) Rol mos kelmasa — o'z hududiga yo'naltiramiz
  if (session) {
    if (isBuyerArea && session.role !== "BUYER") {
      return NextResponse.redirect(new URL(homePath(session.role), req.url));
    }
    if (isSellerArea && session.role !== "SELLER") {
      return NextResponse.redirect(new URL(homePath(session.role), req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Static fayllar va API'larni chetlab o'tamiz
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
