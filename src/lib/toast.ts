"use client";

import { create } from "zustand";

export type ToastType = "success" | "error" | "info";
export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: ToastItem[];
  show: (message: string, type?: ToastType) => void;
  remove: (id: string) => void;
}

let counter = 0;

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  show: (message, type = "success") => {
    const id = `t-${++counter}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => get().remove(id), 2600);
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
