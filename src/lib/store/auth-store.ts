import { create } from "zustand";
import type { PublicUser } from "@/types";

interface AuthState {
  user: PublicUser | null;
  /** Boshlang'ich `/api/auth/me` so'rovi tugadimi */
  initialized: boolean;
  setUser: (user: PublicUser | null) => void;
  /** Joriy foydalanuvchini serverdan yuklaydi */
  fetchUser: () => Promise<void>;
  /** Logout qiladi va holatni tozalaydi */
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,

  setUser: (user) => set({ user, initialized: true }),

  fetchUser: async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, initialized: true });
      } else {
        set({ user: null, initialized: true });
      }
    } catch {
      set({ user: null, initialized: true });
    }
  },

  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    set({ user: null });
  },
}));
