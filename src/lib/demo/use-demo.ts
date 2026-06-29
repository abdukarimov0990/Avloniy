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
  dmThreadKey,
  isUsernameTaken,
  publicUser,
  userById,
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
  createChannelPost: (data: { type: "text" | "image" | "video"; text: string; mediaUrl?: string }) => { id: string } | null;
  reactToPost: (postId: string, emoji: string) => void;
  pinPost: (postId: string) => void;
  editPost: (postId: string, text: string) => void;
  deletePost: (postId: string) => void;
  addChannelComment: (postId: string, text: string) => FeedComment | null;
  setUsername: (username: string) => { ok: boolean; error?: string };
  setPrivateMessagePrice: (price: number) => void;
  sendDm: (partnerId: string, text: string, opts?: { replyToId?: string; imageUrl?: string }) => { ok: boolean; error?: string; paid?: number };
  editDm: (id: string, text: string) => void;
  deleteDm: (id: string) => void;
  markThreadRead: (partnerId: string) => void;
  markNotificationsRead: () => void;
  setMemberStatus: (sellerId: string, userId: string, status: "muted" | "banned" | null) => void;
}

type Store = DemoState & Actions;

const nowISO = () => new Date().toISOString();

/** Profil override massivini yangilaydi (username / xabar narxi) */
function upsertOverride(
  list: DemoState["profileOverrides"],
  userId: string,
  patch: { username?: string; privateMessagePrice?: number }
): DemoState["profileOverrides"] {
  const existing = list.find((o) => o.userId === userId);
  if (existing) return list.map((o) => (o.userId === userId ? { ...o, ...patch } : o));
  return [...list, { userId, ...patch }];
}

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
        const st0 = get();
        if (findUserByEmail(st0, email)) return { ok: false, error: "Bu email allaqachon ro'yxatdan o'tgan" };
        const id = `u-${st0.seq}`;
        // Email prefiksidan unikal username yasaymiz
        const base = email.toLowerCase().split("@")[0].replace(/[^a-z0-9_]/g, "") || "user";
        let username = base;
        let n = 1;
        while (isUsernameTaken(st0, username)) username = `${base}${n++}`;
        const user: D.DemoUser = {
          id,
          name,
          email: email.toLowerCase(),
          password,
          role,
          avatar: null,
          bio: null,
          category: null,
          username,
          privateMessagePrice: role === "SELLER" ? 10000 : 0,
        };
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
        const now = nowISO();
        const buyerName = userById(st, uid)?.name ?? "Foydalanuvchi";
        set((s) => ({
          purchases: [...s.purchases, { buyerId: uid, courseId, amountPaid: course.price, createdAt: now }],
          courses: s.courses.map((c) => (c.id === courseId ? { ...c, salesCount: c.salesCount + 1 } : c)),
          // Pul oqimi: kanalga qo'shilish (= kurs sotib olish)
          transactions: [
            ...s.transactions,
            { id: `tx-${s.seq}`, userId: uid, sellerId: course.sellerId, type: "channel_join" as D.TxType, amount: course.price, relatedId: courseId, createdAt: now },
          ],
          // Sotuvchiga "yangi a'zo" bildirishnomasi
          notifications: [
            ...s.notifications,
            { id: `nt-${s.seq}`, userId: course.sellerId, type: "new_member" as D.NotifType, title: "Yangi a'zo", body: `${buyerName} "${course.title}" kanalingizga qo'shildi`, read: false, relatedId: courseId, createdAt: now },
          ],
          seq: s.seq + 1,
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
          videoUrl: data.type === "video" ? data.mediaUrl || D.DEFAULT_VIDEO : null,
          imageUrl: data.type === "image" ? data.mediaUrl || null : null,
          editedAt: null,
          deletedAt: null,
          pinned: false,
          likesCount: 0,
          createdAt: nowISO(),
        };
        set((s) => ({ channelPosts: [...s.channelPosts, post], seq: s.seq + 1 }));
        return { id };
      },

      reactToPost: (postId, emoji) => {
        const uid = get().currentUserId;
        if (!uid) return;
        set((s) => {
          const mine = s.channelReactions.find((r) => r.postId === postId && r.userId === uid);
          let next = s.channelReactions.filter((r) => !(r.postId === postId && r.userId === uid));
          // Bir xil emoji bo'lsa — olib tashlash; aks holda almashtirish
          if (!mine || mine.emoji !== emoji) next = [...next, { postId, userId: uid, emoji }];
          return { channelReactions: next };
        });
      },

      pinPost: (postId) => {
        const uid = get().currentUserId;
        set((s) => ({
          channelPosts: s.channelPosts.map((p) =>
            p.id === postId && p.sellerId === uid ? { ...p, pinned: !p.pinned } : p
          ),
        }));
      },

      editPost: (postId, text) => {
        const uid = get().currentUserId;
        set((s) => ({
          channelPosts: s.channelPosts.map((p) =>
            p.id === postId && p.sellerId === uid ? { ...p, text, editedAt: nowISO() } : p
          ),
        }));
      },

      deletePost: (postId) => {
        const uid = get().currentUserId;
        set((s) => ({
          channelPosts: s.channelPosts.map((p) =>
            p.id === postId && p.sellerId === uid ? { ...p, deletedAt: nowISO() } : p
          ),
        }));
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

      setUsername: (username) => {
        const uid = get().currentUserId;
        if (!uid) return { ok: false, error: "Avval kiring" };
        const clean = username.trim().replace(/^@/, "").toLowerCase();
        if (!/^[a-z0-9_]{3,20}$/.test(clean)) {
          return { ok: false, error: "Username 3-20 ta harf/raqam/_ bo'lsin" };
        }
        if (isUsernameTaken(get(), clean, uid)) {
          return { ok: false, error: "Bu username band" };
        }
        set((s) => ({
          profileOverrides: upsertOverride(s.profileOverrides, uid, { username: clean }),
        }));
        return { ok: true };
      },

      setPrivateMessagePrice: (price) => {
        const uid = get().currentUserId;
        if (!uid) return;
        set((s) => ({
          profileOverrides: upsertOverride(s.profileOverrides, uid, {
            privateMessagePrice: Math.max(0, Math.round(price)),
          }),
        }));
      },

      sendDm: (partnerId, text, opts) => {
        const uid = get().currentUserId;
        if (!uid || (!text.trim() && !opts?.imageUrl)) return { ok: false, error: "Xato" };
        const st = get();
        const key = dmThreadKey(st, uid, partnerId);
        const [buyerId, sellerId] = key.split("__");
        const meIsSeller = uid === sellerId;
        const seller = publicUser(st, sellerId);
        const price = seller?.privateMessagePrice ?? 0;

        if (!meIsSeller && price <= 0) {
          return { ok: false, error: "Bu sotuvchi shaxsiy xabarni o'chirgan" };
        }

        const id = `dm-${st.seq}`;
        const isPaid = !meIsSeller; // xaridor xabari pullik, sotuvchi javobi bepul
        const paidAmount = isPaid ? price : 0;
        const now = nowISO();
        const receiverId = uid === buyerId ? sellerId : buyerId;

        set((s) => {
          const msg = { id, threadKey: key, senderId: uid, text: text.trim(), imageUrl: opts?.imageUrl ?? null, replyToId: opts?.replyToId ?? null, isPaid, paidAmount, read: false, editedAt: null, deletedAt: null, createdAt: now };
          const updates: Partial<DemoState> = {
            dmMessages: [...s.dmMessages, msg],
            seq: s.seq + 1,
          };
          // Pullik xabar → tranzaksiya
          if (isPaid) {
            updates.transactions = [
              ...s.transactions,
              { id: `tx-${s.seq}`, userId: buyerId, sellerId, type: "private_message" as D.TxType, amount: paidAmount, relatedId: id, createdAt: now },
            ];
          }
          // Qabul qiluvchiga bildirishnoma
          const fromName = userById(s, uid)?.name ?? "Foydalanuvchi";
          updates.notifications = [
            ...s.notifications,
            {
              id: `nt-${s.seq}`,
              userId: receiverId,
              type: "new_message" as D.NotifType,
              title: "Yangi shaxsiy xabar",
              body: isPaid ? `${fromName} sizga xabar yubordi (${paidAmount.toLocaleString("ru-RU").replace(/,/g, " ")} so'm)` : `${fromName}: ${text.trim().slice(0, 40)}`,
              read: false,
              relatedId: key,
              createdAt: now,
            },
          ];
          return updates;
        });
        return { ok: true, paid: paidAmount };
      },

      editDm: (id, text) => {
        const uid = get().currentUserId;
        set((s) => ({
          dmMessages: s.dmMessages.map((m) =>
            m.id === id && m.senderId === uid && !m.deletedAt ? { ...m, text, editedAt: nowISO() } : m
          ),
        }));
      },

      deleteDm: (id) => {
        const uid = get().currentUserId;
        set((s) => ({
          dmMessages: s.dmMessages.map((m) =>
            m.id === id && m.senderId === uid ? { ...m, deletedAt: nowISO() } : m
          ),
        }));
      },

      setMemberStatus: (sellerId, userId, status) => {
        const uid = get().currentUserId;
        if (uid !== sellerId) return; // faqat kanal egasi
        set((s) => {
          const rest = s.channelMemberStatus.filter((m) => !(m.sellerId === sellerId && m.userId === userId));
          return { channelMemberStatus: status ? [...rest, { sellerId, userId, status }] : rest };
        });
      },

      markThreadRead: (partnerId) => {
        const uid = get().currentUserId;
        if (!uid) return;
        const key = dmThreadKey(get(), uid, partnerId);
        // Faqat o'qilmagan bor bo'lsa yangilaymiz (aks holda cheksiz render)
        const hasUnread = get().dmMessages.some((m) => m.threadKey === key && m.senderId !== uid && !m.read);
        if (!hasUnread) return;
        set((s) => ({
          dmMessages: s.dmMessages.map((m) =>
            m.threadKey === key && m.senderId !== uid && !m.read ? { ...m, read: true } : m
          ),
        }));
      },

      markNotificationsRead: () => {
        const uid = get().currentUserId;
        if (!uid) return;
        set((s) => ({
          notifications: s.notifications.map((n) => (n.userId === uid ? { ...n, read: true } : n)),
        }));
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
