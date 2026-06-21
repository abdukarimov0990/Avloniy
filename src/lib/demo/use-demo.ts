"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as D from "@/lib/demo/data";
import type { FeedComment, Role } from "@/types";
import {
  type DemoState,
  initialState,
  findUserByEmail,
  courseById,
  lessonById,
  lessonsOf,
  isPurchased,
  courseProgress,
  dayDiff,
} from "@/lib/demo/state";

interface Actions {
  login: (email: string, password: string, role: Role) => { ok: boolean; error?: string };
  register: (data: { name: string; email: string; password: string; role: Role }) => { ok: boolean; error?: string };
  logout: () => void;
  toggleLike: (reelId: string) => void;
  toggleSave: (reelId: string) => void;
  toggleWishlist: (courseId: string) => void;
  incrementView: (reelId: string) => void;
  addComment: (reelId: string, text: string) => FeedComment | null;
  purchase: (courseId: string) => { ok?: boolean; alreadyOwned?: boolean; notFound?: boolean };
  markProgress: (
    lessonId: string,
    data: { watchedSeconds?: number; isCompleted?: boolean }
  ) => { percent: number; certificateId: string | null } | null;
  recordQuiz: (quizId: string, selectedIndex: number) => { isCorrect: boolean; correctOptionIndex: number } | null;
  createCourse: (data: { title: string; description: string; price: number; category: string; coverImage?: string }) => { id: string };
  addLesson: (courseId: string, data: { title: string; content?: string; videoUrl?: string }) => { ok: boolean } | null;
  createReel: (data: { courseId: string; caption?: string; videoUrl?: string }) => { id: string } | null;
  addQuiz: (lessonId: string, data: { question: string; options: string[]; correctOptionIndex: number }) => { ok: boolean } | null;
  setOnboarding: (category: string, bio: string | null) => void;
  createChannelPost: (data: { type: "text" | "video"; text: string; videoUrl?: string }) => { id: string } | null;
  toggleChannelPostLike: (postId: string) => void;
  addChannelComment: (postId: string, text: string) => FeedComment | null;
}

type Store = DemoState & Actions;

const nowISO = () => new Date().toISOString();

/** Streak massivini yangilaydi (yangi massiv qaytaradi) */
function applyStreak(streaks: DemoState["streaks"], userId: string): DemoState["streaks"] {
  const now = new Date();
  const cur = streaks.find((s) => s.userId === userId);
  if (!cur || !cur.lastActiveDate) {
    const updated = { userId, currentStreak: 1, longestStreak: Math.max(1, cur?.longestStreak ?? 0), lastActiveDate: now.toISOString() };
    return cur ? streaks.map((s) => (s.userId === userId ? updated : s)) : [...streaks, updated];
  }
  const diff = dayDiff(now, new Date(cur.lastActiveDate));
  if (diff === 0) return streaks;
  const current = diff === 1 ? cur.currentStreak + 1 : 1;
  const updated = { ...cur, currentStreak: current, longestStreak: Math.max(cur.longestStreak, current), lastActiveDate: now.toISOString() };
  return streaks.map((s) => (s.userId === userId ? updated : s));
}

export const useDemo = create<Store>()(
  persist(
    (set, get) => ({
      ...initialState(),

      login: (email, password, role) => {
        const user = findUserByEmail(get(), email);
        if (!user || user.password !== password) return { ok: false, error: "Email yoki parol noto'g'ri" };
        if (user.role !== role) {
          const correct = user.role === "BUYER" ? "Xaridor" : "Sotuvchi";
          return { ok: false, error: `Bu akkaunt "${correct}" sifatida ro'yxatdan o'tgan` };
        }
        set({ currentUserId: user.id });
        return { ok: true };
      },

      register: ({ name, email, password, role }) => {
        if (findUserByEmail(get(), email)) return { ok: false, error: "Bu email allaqachon ro'yxatdan o'tgan" };
        const id = `u-${get().seq}`;
        const user: D.DemoUser = { id, name, email: email.toLowerCase(), password, role, avatar: null, bio: null, category: null };
        set((s) => ({ users: [...s.users, user], currentUserId: id, seq: s.seq + 1 }));
        return { ok: true };
      },

      logout: () => set({ currentUserId: null }),

      toggleLike: (reelId) => {
        const uid = get().currentUserId;
        if (!uid) return;
        const key = `${uid}:${reelId}`;
        set((s) => {
          const has = s.likes.includes(key);
          return {
            likes: has ? s.likes.filter((k) => k !== key) : [...s.likes, key],
            reels: s.reels.map((r) => (r.id === reelId ? { ...r, likesCount: Math.max(0, r.likesCount + (has ? -1 : 1)) } : r)),
          };
        });
      },

      toggleSave: (reelId) => {
        const uid = get().currentUserId;
        if (!uid) return;
        const key = `${uid}:${reelId}`;
        set((s) => ({ saves: s.saves.includes(key) ? s.saves.filter((k) => k !== key) : [...s.saves, key] }));
      },

      toggleWishlist: (courseId) => {
        const uid = get().currentUserId;
        if (!uid) return;
        const key = `${uid}:${courseId}`;
        set((s) => ({ wishlist: s.wishlist.includes(key) ? s.wishlist.filter((k) => k !== key) : [...s.wishlist, key] }));
      },

      incrementView: (reelId) =>
        set((s) => ({ reels: s.reels.map((r) => (r.id === reelId ? { ...r, viewsCount: r.viewsCount + 1 } : r)) })),

      addComment: (reelId, text) => {
        const uid = get().currentUserId;
        if (!uid) return null;
        const id = `cm-${get().seq}`;
        const comment: D.DemoComment = { id, reelId, userId: uid, text, createdAt: nowISO() };
        set((s) => ({ comments: [...s.comments, comment], seq: s.seq + 1 }));
        const u = get().users.find((x) => x.id === uid)!;
        return { id, text, createdAt: comment.createdAt, user: { id: u.id, name: u.name, avatar: u.avatar } };
      },

      purchase: (courseId) => {
        const uid = get().currentUserId;
        if (!uid) return { notFound: true };
        const st = get();
        if (isPurchased(st, uid, courseId)) return { alreadyOwned: true };
        const course = courseById(st, courseId);
        if (!course) return { notFound: true };
        set((s) => ({
          purchases: [...s.purchases, { buyerId: uid, courseId, amountPaid: course.price, createdAt: nowISO() }],
          courses: s.courses.map((c) => (c.id === courseId ? { ...c, salesCount: c.salesCount + 1 } : c)),
        }));
        return { ok: true };
      },

      markProgress: (lessonId, data) => {
        const uid = get().currentUserId;
        if (!uid) return null;
        const lesson = lessonById(get(), lessonId);
        if (!lesson) return null;
        const courseId = lesson.courseId;

        set((s) => {
          const existing = s.progress.find((p) => p.userId === uid && p.lessonId === lessonId);
          const completed = data.isCompleted ?? existing?.isCompleted ?? false;
          const completedAt = completed ? existing?.completedAt ?? nowISO() : null;
          const watched = Math.max(existing?.watchedSeconds ?? 0, data.watchedSeconds ?? 0);
          const progress = existing
            ? s.progress.map((p) => (p.userId === uid && p.lessonId === lessonId ? { ...p, isCompleted: completed, completedAt, watchedSeconds: watched } : p))
            : [...s.progress, { userId: uid, lessonId, courseId, watchedSeconds: watched, isCompleted: completed, completedAt }];
          return { progress, streaks: applyStreak(s.streaks, uid) };
        });

        const prog = courseProgress(get(), uid, courseId);
        let certificateId: string | null = null;
        if (prog.percent === 100) {
          const existing = get().certificates.find((c) => c.userId === uid && c.courseId === courseId);
          if (existing) {
            certificateId = existing.id;
          } else {
            const id = `cert-${get().seq}`;
            const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
            set((s) => ({
              certificates: [...s.certificates, { id, userId: uid, courseId, certificateNumber: `AVL-${new Date().getFullYear()}-${rand}`, issuedAt: nowISO() }],
              seq: s.seq + 1,
            }));
            certificateId = id;
          }
        }
        return { percent: prog.percent, certificateId };
      },

      recordQuiz: (quizId, selectedIndex) => {
        const uid = get().currentUserId;
        if (!uid) return null;
        const quiz = get().quizzes.find((q) => q.id === quizId);
        if (!quiz) return null;
        const isCorrect = selectedIndex === quiz.correctOptionIndex;
        set((s) => ({ attempts: [...s.attempts, { userId: uid, quizId, selectedIndex, isCorrect }] }));
        return { isCorrect, correctOptionIndex: quiz.correctOptionIndex };
      },

      createCourse: (data) => {
        const uid = get().currentUserId!;
        const id = `c-${get().seq}`;
        const course: D.DemoCourse = {
          id,
          sellerId: uid,
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          coverImage: data.coverImage || null,
          hashtags: [],
          viewsCount: 0,
          salesCount: 0,
        };
        set((s) => ({ courses: [...s.courses, course], seq: s.seq + 1 }));
        return { id };
      },

      addLesson: (courseId, data) => {
        const uid = get().currentUserId;
        const course = courseById(get(), courseId);
        if (!course || course.sellerId !== uid) return null;
        const order = lessonsOf(get(), courseId).length + 1;
        const lesson: D.DemoLesson = {
          id: `l-${get().seq}`,
          courseId,
          title: data.title,
          content: data.content || null,
          videoUrl: data.videoUrl || D.DEFAULT_VIDEO,
          order,
          isFreePreview: false,
        };
        set((s) => ({ lessons: [...s.lessons, lesson], seq: s.seq + 1 }));
        return { ok: true };
      },

      createReel: (data) => {
        const uid = get().currentUserId;
        const course = courseById(get(), data.courseId);
        if (!course || course.sellerId !== uid) return null;
        const id = `r-${get().seq}`;
        const reel: D.DemoReel = {
          id,
          sellerId: uid!,
          courseId: data.courseId,
          videoUrl: data.videoUrl || D.DEFAULT_VIDEO,
          caption: data.caption || null,
          hashtags: [],
          likesCount: 0,
          viewsCount: 0,
          createdAt: nowISO(),
        };
        set((s) => ({ reels: [...s.reels, reel], seq: s.seq + 1 }));
        return { id };
      },

      addQuiz: (lessonId, data) => {
        const uid = get().currentUserId;
        const lesson = lessonById(get(), lessonId);
        if (!lesson) return null;
        const course = courseById(get(), lesson.courseId);
        if (!course || course.sellerId !== uid) return null;
        const quiz: D.DemoQuiz = { id: `q-${get().seq}`, lessonId, question: data.question, options: data.options, correctOptionIndex: data.correctOptionIndex };
        set((s) => ({ quizzes: [...s.quizzes, quiz], seq: s.seq + 1 }));
        return { ok: true };
      },

      setOnboarding: (category, bio) => {
        const uid = get().currentUserId;
        if (!uid) return;
        set((s) => ({
          onboarding: [...s.onboarding.filter((o) => o.userId !== uid), { userId: uid, category, bio }],
        }));
      },

      createChannelPost: (data) => {
        const uid = get().currentUserId;
        if (!uid) return null;
        const id = `cp-${get().seq}`;
        const post: D.DemoChannelPost = {
          id,
          sellerId: uid,
          type: data.type,
          text: data.text,
          videoUrl: data.type === "video" ? data.videoUrl || D.DEFAULT_VIDEO : null,
          pinned: false,
          likesCount: 0,
          createdAt: nowISO(),
        };
        set((s) => ({ channelPosts: [...s.channelPosts, post], seq: s.seq + 1 }));
        return { id };
      },

      toggleChannelPostLike: (postId) => {
        const uid = get().currentUserId;
        if (!uid) return;
        const key = `${uid}:${postId}`;
        set((s) => {
          const has = s.channelLikes.includes(key);
          return {
            channelLikes: has ? s.channelLikes.filter((k) => k !== key) : [...s.channelLikes, key],
            channelPosts: s.channelPosts.map((p) =>
              p.id === postId ? { ...p, likesCount: Math.max(0, p.likesCount + (has ? -1 : 1)) } : p
            ),
          };
        });
      },

      addChannelComment: (postId, text) => {
        const uid = get().currentUserId;
        if (!uid) return null;
        const id = `cc-${get().seq}`;
        const comment = { id, postId, userId: uid, text, createdAt: nowISO() };
        set((s) => ({ channelComments: [...s.channelComments, comment], seq: s.seq + 1 }));
        const u = get().users.find((x) => x.id === uid)!;
        return { id, text, createdAt: comment.createdAt, user: { id: u.id, name: u.name, avatar: u.avatar } };
      },
    }),
    {
      name: "avloniy-demo",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // SSR'да localStorage'ga tegmaymiz; DemoProvider qo'lda rehydrate qiladi
    }
  )
);
