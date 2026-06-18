import type { Role } from "@/lib/demo/data";

export type { Role };

/** Sessiya (cookie) ichidagi minimal ma'lumot */
export interface SessionPayload {
  userId: string;
  role: Role;
}

/** Klientga xavfsiz uzatiladigan foydalanuvchi (parolsiz) */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string | null;
  bio: string | null;
  category: string | null;
}

/** Reels lentasidagi bitta reel (kurs va sotuvchi bilan) */
export interface FeedReel {
  id: string;
  videoUrl: string;
  caption: string | null;
  likesCount: number;
  viewsCount: number;
  commentsCount: number;
  likedByMe: boolean;
  savedByMe: boolean;
  purchased: boolean;
  seller: {
    id: string;
    name: string;
    avatar: string | null;
    category: string | null;
  };
  course: {
    id: string;
    title: string;
    price: number;
  };
}

/** Reel izohi */
export interface FeedComment {
  id: string;
  text: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
}
