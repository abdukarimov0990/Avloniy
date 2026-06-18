import "server-only";
import * as D from "@/lib/demo/data";
import type { FeedReel, FeedComment, PublicUser } from "@/types";

/**
 * In-memory demo store. Vercel serverless'да xotirada saqlanadi — cold start'да
 * dastlabki seed holatiga qaytadi. Demo uchun yetarli (doimiy baza talab qilmaydi).
 */
interface StoreState {
  courses: D.DemoCourse[];
  quizzes: D.DemoQuiz[];
  reels: D.DemoReel[];
  comments: D.DemoComment[];
  purchases: D.DemoPurchase[];
  likes: Set<string>;
  saves: Set<string>;
  wishlist: Set<string>;
  progress: Map<
    string,
    { userId: string; lessonId: string; courseId: string; watchedSeconds: number; isCompleted: boolean; completedAt: string | null }
  >;
  lessonsExtra: D.DemoLesson[]; // sotuvchi qo'shgan darslar
  certificates: { id: string; userId: string; courseId: string; certificateNumber: string; issuedAt: string }[];
  streaks: Map<string, { currentStreak: number; longestStreak: number; lastActiveDate: string | null }>;
  attempts: { userId: string; quizId: string; selectedIndex: number; isCorrect: boolean }[];
  category: Map<string, { category: string | null; bio: string | null }>; // onboarding o'zgarishlari
  extraUsers: D.DemoUser[]; // register orqali qo'shilgan (ephemeral)
  seq: number;
}

const g = globalThis as unknown as { __avloniyStore?: StoreState };

function init(): StoreState {
  return {
    courses: D.COURSES.map((c) => ({ ...c })),
    quizzes: D.QUIZZES.map((q) => ({ ...q })),
    reels: D.REELS.map((r) => ({ ...r })),
    comments: D.COMMENTS.map((c) => ({ ...c })),
    purchases: D.PURCHASES.map((p) => ({ ...p })),
    likes: new Set(),
    saves: new Set(D.INITIAL_SAVED.map((s) => `${s.userId}:${s.reelId}`)),
    wishlist: new Set(D.INITIAL_WISHLIST.map((w) => `${w.userId}:${w.courseId}`)),
    progress: new Map(),
    lessonsExtra: [],
    certificates: [],
    streaks: new Map(),
    attempts: [],
    category: new Map(),
    extraUsers: [],
    seq: 1,
  };
}

function s(): StoreState {
  return (g.__avloniyStore ??= init());
}

const nowISO = () => new Date().toISOString();
const nextId = (prefix: string) => `${prefix}-${s().seq++}`;

// --- Foydalanuvchilar ---
function allUsers(): D.DemoUser[] {
  return [...D.USERS, ...s().extraUsers];
}
function rawUser(id: string): D.DemoUser | undefined {
  return allUsers().find((u) => u.id === id);
}

export function findUserByEmail(email: string): D.DemoUser | undefined {
  return allUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

/** Register — xotirага yangi foydalanuvchi qo'shadi (ephemeral). Email band bo'lsa null. */
export function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: D.Role;
}): D.DemoUser | null {
  if (findUserByEmail(data.email)) return null;
  const user: D.DemoUser = {
    id: nextId("u"),
    name: data.name,
    email: data.email.toLowerCase(),
    password: data.password,
    role: data.role,
    avatar: null,
    bio: null,
    category: null,
  };
  s().extraUsers.push(user);
  return user;
}

export function toPublicUser(id: string): PublicUser | null {
  const u = rawUser(id);
  if (!u) return null;
  const override = s().category.get(id);
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatar: u.avatar,
    bio: override?.bio ?? u.bio,
    category: override?.category ?? u.category,
  };
}

export function setOnboarding(userId: string, category: string, bio: string | null) {
  s().category.set(userId, { category, bio });
}

// --- Yordamchilar ---
function allLessons(): D.DemoLesson[] {
  return [...D.LESSONS, ...s().lessonsExtra];
}
function lessonsOf(courseId: string): D.DemoLesson[] {
  return allLessons()
    .filter((l) => l.courseId === courseId)
    .sort((a, b) => a.order - b.order);
}
export function getLesson(lessonId: string): D.DemoLesson | undefined {
  return allLessons().find((l) => l.id === lessonId);
}
function courseById(id: string): D.DemoCourse | undefined {
  return s().courses.find((c) => c.id === id);
}
export function isPurchased(userId: string, courseId: string): boolean {
  return s().purchases.some((p) => p.buyerId === userId && p.courseId === courseId);
}

// --- Reels ---
export async function getFeedReels(userId?: string): Promise<FeedReel[]> {
  const st = s();
  return [...st.reels]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map((r) => {
      const seller = rawUser(r.sellerId)!;
      const course = courseById(r.courseId)!;
      return {
        id: r.id,
        videoUrl: r.videoUrl,
        caption: r.caption,
        likesCount: r.likesCount,
        viewsCount: r.viewsCount,
        commentsCount: st.comments.filter((c) => c.reelId === r.id).length,
        likedByMe: !!userId && st.likes.has(`${userId}:${r.id}`),
        savedByMe: !!userId && st.saves.has(`${userId}:${r.id}`),
        purchased: !!userId && isPurchased(userId, r.courseId),
        seller: { id: seller.id, name: seller.name, avatar: seller.avatar, category: seller.category },
        course: { id: course.id, title: course.title, price: course.price },
      };
    });
}

export async function getReelComments(reelId: string): Promise<FeedComment[]> {
  return s()
    .comments.filter((c) => c.reelId === reelId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map((c) => {
      const u = rawUser(c.userId)!;
      return {
        id: c.id,
        text: c.text,
        createdAt: c.createdAt,
        user: { id: u.id, name: u.name, avatar: u.avatar },
      };
    });
}

export function addComment(userId: string, reelId: string, text: string): FeedComment {
  const c = { id: nextId("cm"), reelId, userId, text, createdAt: nowISO() };
  s().comments.push(c);
  const u = rawUser(userId)!;
  return { id: c.id, text: c.text, createdAt: c.createdAt, user: { id: u.id, name: u.name, avatar: u.avatar } };
}

export function toggleLike(userId: string, reelId: string): { liked: boolean; likesCount: number } {
  const st = s();
  const key = `${userId}:${reelId}`;
  const reel = st.reels.find((r) => r.id === reelId)!;
  let liked: boolean;
  if (st.likes.has(key)) {
    st.likes.delete(key);
    reel.likesCount = Math.max(0, reel.likesCount - 1);
    liked = false;
  } else {
    st.likes.add(key);
    reel.likesCount += 1;
    liked = true;
  }
  return { liked, likesCount: reel.likesCount };
}

export function toggleSave(userId: string, reelId: string): { saved: boolean } {
  const st = s();
  const key = `${userId}:${reelId}`;
  if (st.saves.has(key)) {
    st.saves.delete(key);
    return { saved: false };
  }
  st.saves.add(key);
  return { saved: true };
}

export function incrementReelView(reelId: string) {
  const reel = s().reels.find((r) => r.id === reelId);
  if (reel) reel.viewsCount += 1;
}

export function getSavedReels(userId: string) {
  const st = s();
  return st.reels
    .filter((r) => st.saves.has(`${userId}:${r.id}`))
    .map((r) => ({
      id: r.id,
      videoUrl: r.videoUrl,
      caption: r.caption,
      likesCount: r.likesCount,
      viewsCount: r.viewsCount,
      courseId: r.courseId,
    }));
}

export function createReel(
  sellerId: string,
  data: { courseId: string; caption?: string; videoUrl?: string }
): { id: string } | null {
  const course = courseById(data.courseId);
  if (!course || course.sellerId !== sellerId) return null;
  const reel: D.DemoReel = {
    id: nextId("r"),
    sellerId,
    courseId: data.courseId,
    videoUrl: data.videoUrl || D.DEFAULT_VIDEO,
    caption: data.caption || null,
    hashtags: [],
    likesCount: 0,
    viewsCount: 0,
    createdAt: nowISO(),
  };
  s().reels.push(reel);
  return { id: reel.id };
}

// --- Progress ---
export interface CourseProgress {
  percent: number;
  completedCount: number;
  totalCount: number;
  completedLessonIds: string[];
}

export function getCourseProgress(userId: string, courseId: string): CourseProgress {
  const total = lessonsOf(courseId).length;
  const completed = [...s().progress.values()].filter(
    (p) => p.userId === userId && p.courseId === courseId && p.isCompleted
  );
  const completedCount = completed.length;
  return {
    percent: total === 0 ? 0 : Math.round((completedCount / total) * 100),
    completedCount,
    totalCount: total,
    completedLessonIds: completed.map((p) => p.lessonId),
  };
}

export function getProgressForCourses(userId: string, courseIds: string[]): Map<string, number> {
  const result = new Map<string, number>();
  for (const id of courseIds) result.set(id, getCourseProgress(userId, id).percent);
  return result;
}

export interface MarkProgressResult {
  courseProgress: CourseProgress;
  certificateId: string | null;
}

export function markLessonProgress(
  userId: string,
  lessonId: string,
  courseId: string,
  data: { watchedSeconds?: number; isCompleted?: boolean }
): MarkProgressResult {
  const st = s();
  const key = `${userId}:${lessonId}`;
  const existing = st.progress.get(key);
  const completed = data.isCompleted ?? existing?.isCompleted ?? false;
  st.progress.set(key, {
    userId,
    lessonId,
    courseId,
    watchedSeconds: Math.max(existing?.watchedSeconds ?? 0, data.watchedSeconds ?? 0),
    isCompleted: completed,
    completedAt: completed ? existing?.completedAt ?? nowISO() : null,
  });

  touchStreak(userId);

  const courseProgress = getCourseProgress(userId, courseId);
  let certificateId: string | null = null;
  if (courseProgress.percent === 100) certificateId = issueCertificateIfComplete(userId, courseId);
  return { courseProgress, certificateId };
}

// --- Sertifikat ---
export interface CertificateView {
  id: string;
  certificateNumber: string;
  issuedAt: string;
  userName: string;
  courseTitle: string;
  sellerName: string;
}
export interface CertificateListItem {
  id: string;
  certificateNumber: string;
  courseTitle: string;
  issuedAt: string;
}

export function issueCertificateIfComplete(userId: string, courseId: string): string | null {
  const st = s();
  const existing = st.certificates.find((c) => c.userId === userId && c.courseId === courseId);
  if (existing) return existing.id;
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const cert = {
    id: nextId("cert"),
    userId,
    courseId,
    certificateNumber: `AVL-${new Date().getFullYear()}-${rand}`,
    issuedAt: nowISO(),
  };
  st.certificates.push(cert);
  return cert.id;
}

export function getCertificate(id: string, userId: string): CertificateView | null {
  const cert = s().certificates.find((c) => c.id === id);
  if (!cert || cert.userId !== userId) return null;
  const user = rawUser(cert.userId)!;
  const course = courseById(cert.courseId)!;
  const seller = rawUser(course.sellerId)!;
  return {
    id: cert.id,
    certificateNumber: cert.certificateNumber,
    issuedAt: cert.issuedAt,
    userName: user.name,
    courseTitle: course.title,
    sellerName: seller.name,
  };
}

export function getUserCertificates(userId: string): CertificateListItem[] {
  return s()
    .certificates.filter((c) => c.userId === userId)
    .sort((a, b) => (a.issuedAt < b.issuedAt ? 1 : -1))
    .map((c) => ({
      id: c.id,
      certificateNumber: c.certificateNumber,
      courseTitle: courseById(c.courseId)?.title ?? "",
      issuedAt: c.issuedAt,
    }));
}

// --- Streak ---
function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function dayDiff(a: Date, b: Date): number {
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86_400_000);
}

export function touchStreak(userId: string) {
  const st = s();
  const now = new Date();
  const cur = st.streaks.get(userId);
  if (!cur || !cur.lastActiveDate) {
    st.streaks.set(userId, {
      currentStreak: 1,
      longestStreak: Math.max(1, cur?.longestStreak ?? 0),
      lastActiveDate: now.toISOString(),
    });
    return;
  }
  const diff = dayDiff(now, new Date(cur.lastActiveDate));
  if (diff === 0) return;
  const current = diff === 1 ? cur.currentStreak + 1 : 1;
  st.streaks.set(userId, {
    currentStreak: current,
    longestStreak: Math.max(cur.longestStreak, current),
    lastActiveDate: now.toISOString(),
  });
}

export function getStreak(userId: string): { current: number; longest: number } {
  const cur = s().streaks.get(userId);
  if (!cur || !cur.lastActiveDate) return { current: 0, longest: cur?.longestStreak ?? 0 };
  const diff = dayDiff(new Date(), new Date(cur.lastActiveDate));
  return { current: diff <= 1 ? cur.currentStreak : 0, longest: cur.longestStreak };
}

// --- Kviz ---
export interface PublicQuiz {
  id: string;
  question: string;
  options: string[];
}

export function getLessonQuizzes(lessonId: string): PublicQuiz[] {
  return s()
    .quizzes.filter((q) => q.lessonId === lessonId)
    .map((q) => ({ id: q.id, question: q.question, options: q.options }));
}

export function recordQuizAttempt(
  userId: string,
  quizId: string,
  selectedIndex: number
): { isCorrect: boolean; correctOptionIndex: number } | null {
  const quiz = s().quizzes.find((q) => q.id === quizId);
  if (!quiz) return null;
  const isCorrect = selectedIndex === quiz.correctOptionIndex;
  s().attempts.push({ userId, quizId, selectedIndex, isCorrect });
  return { isCorrect, correctOptionIndex: quiz.correctOptionIndex };
}

export function addQuiz(
  sellerId: string,
  lessonId: string,
  data: { question: string; options: string[]; correctOptionIndex: number }
): { id: string } | null {
  const lesson = getLesson(lessonId);
  if (!lesson) return null;
  const course = courseById(lesson.courseId);
  if (!course || course.sellerId !== sellerId) return null;
  const quiz: D.DemoQuiz = {
    id: nextId("q"),
    lessonId,
    question: data.question,
    options: data.options,
    correctOptionIndex: data.correctOptionIndex,
  };
  s().quizzes.push(quiz);
  return { id: quiz.id };
}

// --- Kurslar ---
export interface CourseLesson {
  id: string;
  title: string;
  order: number;
  videoUrl: string | null;
  content: string | null;
  isFreePreview: boolean;
  completed: boolean;
  hasQuiz: boolean;
}

export interface CourseDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  coverImage: string | null;
  hashtags: string[];
  viewsCount: number;
  salesCount: number;
  purchased: boolean;
  wishlisted: boolean;
  percent: number;
  certificateId: string | null;
  seller: { id: string; name: string; avatar: string | null; category: string | null; bio: string | null };
  lessons: CourseLesson[];
}

export async function getCourseDetail(courseId: string, userId?: string): Promise<CourseDetail | null> {
  const course = courseById(courseId);
  if (!course) return null;
  const seller = rawUser(course.sellerId)!;
  const st = s();

  let purchased = false;
  let wishlisted = false;
  let percent = 0;
  let certificateId: string | null = null;
  let completedIds = new Set<string>();

  if (userId) {
    purchased = isPurchased(userId, courseId);
    wishlisted = st.wishlist.has(`${userId}:${courseId}`);
    const prog = getCourseProgress(userId, courseId);
    percent = prog.percent;
    completedIds = new Set(prog.completedLessonIds);
    certificateId = st.certificates.find((c) => c.userId === userId && c.courseId === courseId)?.id ?? null;
  }

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    price: course.price,
    category: course.category,
    coverImage: course.coverImage,
    hashtags: course.hashtags,
    viewsCount: course.viewsCount,
    salesCount: course.salesCount,
    purchased,
    wishlisted,
    percent,
    certificateId,
    seller: { id: seller.id, name: seller.name, avatar: seller.avatar, category: seller.category, bio: seller.bio },
    lessons: lessonsOf(courseId).map((l) => ({
      id: l.id,
      title: l.title,
      order: l.order,
      videoUrl: l.videoUrl,
      content: l.content,
      isFreePreview: l.isFreePreview,
      completed: completedIds.has(l.id),
      hasQuiz: st.quizzes.some((q) => q.lessonId === l.id),
    })),
  };
}

export interface LibraryCourse {
  id: string;
  title: string;
  coverImage: string | null;
  category: string;
  lessonsCount: number;
  sellerName: string;
  percent: number;
}

export async function getPurchasedCourses(userId: string): Promise<LibraryCourse[]> {
  const st = s();
  return st.purchases
    .filter((p) => p.buyerId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map((p) => {
      const course = courseById(p.courseId)!;
      const seller = rawUser(course.sellerId)!;
      return {
        id: course.id,
        title: course.title,
        coverImage: course.coverImage,
        category: course.category,
        lessonsCount: lessonsOf(course.id).length,
        sellerName: seller.name,
        percent: getCourseProgress(userId, course.id).percent,
      };
    });
}

export interface WishlistCourse {
  id: string;
  title: string;
  coverImage: string | null;
  category: string;
  price: number;
  sellerName: string;
}

export async function getWishlist(userId: string): Promise<WishlistCourse[]> {
  const st = s();
  return st.courses
    .filter((c) => st.wishlist.has(`${userId}:${c.id}`))
    .map((c) => ({
      id: c.id,
      title: c.title,
      coverImage: c.coverImage,
      category: c.category,
      price: c.price,
      sellerName: rawUser(c.sellerId)!.name,
    }));
}

export function toggleWishlist(userId: string, courseId: string): { wishlisted: boolean } {
  const st = s();
  const key = `${userId}:${courseId}`;
  if (st.wishlist.has(key)) {
    st.wishlist.delete(key);
    return { wishlisted: false };
  }
  st.wishlist.add(key);
  return { wishlisted: true };
}

export function purchaseCourse(userId: string, courseId: string): { ok?: boolean; alreadyOwned?: boolean; notFound?: boolean } {
  const course = courseById(courseId);
  if (!course) return { notFound: true };
  if (isPurchased(userId, courseId)) return { alreadyOwned: true };
  s().purchases.push({ buyerId: userId, courseId, amountPaid: course.price, createdAt: nowISO() });
  course.salesCount += 1;
  return { ok: true };
}

export function createCourse(
  sellerId: string,
  data: { title: string; description: string; price: number; category: string; coverImage?: string }
): { id: string } {
  const course: D.DemoCourse = {
    id: nextId("c"),
    sellerId,
    title: data.title,
    description: data.description,
    price: data.price,
    category: data.category,
    coverImage: data.coverImage || null,
    hashtags: [],
    viewsCount: 0,
    salesCount: 0,
  };
  s().courses.push(course);
  return { id: course.id };
}

export function addLesson(
  sellerId: string,
  courseId: string,
  data: { title: string; content?: string; videoUrl?: string }
): { ok: boolean } | null {
  const course = courseById(courseId);
  if (!course || course.sellerId !== sellerId) return null;
  const order = lessonsOf(courseId).length + 1;
  s().lessonsExtra.push({
    id: nextId("l"),
    courseId,
    title: data.title,
    content: data.content || null,
    videoUrl: data.videoUrl || D.DEFAULT_VIDEO,
    order,
    isFreePreview: false,
  });
  return { ok: true };
}

// --- Seller statistikalari ---
export interface SellerCourseStat {
  id: string;
  title: string;
  price: number;
  coverImage: string | null;
  viewsCount: number;
  salesCount: number;
  revenue: number;
}
export interface SellerStats {
  totalRevenue: number;
  totalSales: number;
  totalViews: number;
  totalCourses: number;
  totalReels: number;
  reelViews: number;
  reelLikes: number;
  topCourse: { title: string; revenue: number } | null;
  courses: SellerCourseStat[];
}

export function getSellerStats(sellerId: string): SellerStats {
  const st = s();
  const courses = st.courses.filter((c) => c.sellerId === sellerId);
  const courseIds = new Set(courses.map((c) => c.id));
  const purchases = st.purchases.filter((p) => courseIds.has(p.courseId));
  const reels = st.reels.filter((r) => r.sellerId === sellerId);

  const revByCourse = new Map<string, number>();
  for (const p of purchases) revByCourse.set(p.courseId, (revByCourse.get(p.courseId) ?? 0) + p.amountPaid);

  const courseStats: SellerCourseStat[] = courses.map((c) => ({
    id: c.id,
    title: c.title,
    price: c.price,
    coverImage: c.coverImage,
    viewsCount: c.viewsCount,
    salesCount: c.salesCount,
    revenue: revByCourse.get(c.id) ?? 0,
  }));

  const top = [...courseStats].sort((a, b) => b.revenue - a.revenue)[0] ?? null;

  return {
    totalRevenue: purchases.reduce((sum, p) => sum + p.amountPaid, 0),
    totalSales: purchases.length,
    totalViews: courses.reduce((sum, c) => sum + c.viewsCount, 0),
    totalCourses: courses.length,
    totalReels: reels.length,
    reelViews: reels.reduce((sum, r) => sum + r.viewsCount, 0),
    reelLikes: reels.reduce((sum, r) => sum + r.likesCount, 0),
    topCourse: top ? { title: top.title, revenue: top.revenue } : null,
    courses: courseStats,
  };
}

export interface SellerReel {
  id: string;
  videoUrl: string;
  caption: string | null;
  likesCount: number;
  viewsCount: number;
  courseId: string;
}

export function getSellerReels(sellerId: string): SellerReel[] {
  return s()
    .reels.filter((r) => r.sellerId === sellerId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map((r) => ({
      id: r.id,
      videoUrl: r.videoUrl,
      caption: r.caption,
      likesCount: r.likesCount,
      viewsCount: r.viewsCount,
      courseId: r.courseId,
    }));
}

export interface SellerCourseFull {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  coverImage: string | null;
  viewsCount: number;
  salesCount: number;
  lessons: { id: string; title: string; order: number; quizCount: number }[];
  reels: { id: string; caption: string | null; viewsCount: number; likesCount: number }[];
}

export function getSellerCourse(courseId: string, sellerId: string): SellerCourseFull | null {
  const course = courseById(courseId);
  if (!course || course.sellerId !== sellerId) return null;
  const st = s();
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    price: course.price,
    category: course.category,
    coverImage: course.coverImage,
    viewsCount: course.viewsCount,
    salesCount: course.salesCount,
    lessons: lessonsOf(courseId).map((l) => ({
      id: l.id,
      title: l.title,
      order: l.order,
      quizCount: st.quizzes.filter((q) => q.lessonId === l.id).length,
    })),
    reels: st.reels
      .filter((r) => r.courseId === courseId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .map((r) => ({ id: r.id, caption: r.caption, viewsCount: r.viewsCount, likesCount: r.likesCount })),
  };
}
