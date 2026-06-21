/**
 * Avloniy demo — client tomon holati (localStorage'да saqlanadi).
 * Bu modul SOF (pure): holat tuzilmasi, boshlang'ich qiymat va selektorlar.
 * Hech qanday React/Zustand yo'q — shuning uchun test va qayta ishlatish oson.
 */
import * as D from "@/lib/demo/data";
import type { FeedReel, FeedComment, PublicUser, Role } from "@/types";

// localStorage'да saqlanadigan holat (hammasi serializable — Set emas, array).
export interface DemoState {
  currentUserId: string | null;
  users: D.DemoUser[];
  courses: D.DemoCourse[];
  lessons: D.DemoLesson[];
  quizzes: D.DemoQuiz[];
  reels: D.DemoReel[];
  comments: D.DemoComment[];
  purchases: D.DemoPurchase[];
  likes: string[]; // `${userId}:${reelId}`
  saves: string[];
  wishlist: string[]; // `${userId}:${courseId}`
  progress: {
    userId: string;
    lessonId: string;
    courseId: string;
    watchedSeconds: number;
    isCompleted: boolean;
    completedAt: string | null;
  }[];
  certificates: { id: string; userId: string; courseId: string; certificateNumber: string; issuedAt: string }[];
  streaks: { userId: string; currentStreak: number; longestStreak: number; lastActiveDate: string | null }[];
  attempts: { userId: string; quizId: string; selectedIndex: number; isCorrect: boolean }[];
  onboarding: { userId: string; category: string; bio: string | null }[];
  channelPosts: D.DemoChannelPost[];
  channelLikes: string[]; // `${userId}:${postId}`
  channelComments: { id: string; postId: string; userId: string; text: string; createdAt: string }[];
  seq: number;
}

export function initialState(): DemoState {
  return {
    currentUserId: null,
    users: D.USERS.map((u) => ({ ...u })),
    courses: D.COURSES.map((c) => ({ ...c })),
    lessons: D.LESSONS.map((l) => ({ ...l })),
    quizzes: D.QUIZZES.map((q) => ({ ...q })),
    reels: D.REELS.map((r) => ({ ...r })),
    comments: D.COMMENTS.map((c) => ({ ...c })),
    purchases: D.PURCHASES.map((p) => ({ ...p })),
    likes: [],
    saves: D.INITIAL_SAVED.map((s) => `${s.userId}:${s.reelId}`),
    wishlist: D.INITIAL_WISHLIST.map((w) => `${w.userId}:${w.courseId}`),
    progress: [],
    certificates: [],
    streaks: [],
    attempts: [],
    onboarding: [],
    channelPosts: D.CHANNEL_POSTS.map((p) => ({ ...p })),
    channelLikes: D.INITIAL_CHANNEL_LIKES.map((l) => `${l.userId}:${l.postId}`),
    channelComments: [],
    seq: 1,
  };
}

// --- Yordamchilar ---
export function userById(st: DemoState, id: string): D.DemoUser | undefined {
  return st.users.find((u) => u.id === id);
}
export function findUserByEmail(st: DemoState, email: string): D.DemoUser | undefined {
  return st.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
export function courseById(st: DemoState, id: string): D.DemoCourse | undefined {
  return st.courses.find((c) => c.id === id);
}
export function lessonById(st: DemoState, id: string): D.DemoLesson | undefined {
  return st.lessons.find((l) => l.id === id);
}
export function lessonsOf(st: DemoState, courseId: string): D.DemoLesson[] {
  return st.lessons.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order);
}
export function isPurchased(st: DemoState, userId: string, courseId: string): boolean {
  return st.purchases.some((p) => p.buyerId === userId && p.courseId === courseId);
}

export function publicUser(st: DemoState, id: string): PublicUser | null {
  const u = userById(st, id);
  if (!u) return null;
  const ov = st.onboarding.find((o) => o.userId === id);
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatar: u.avatar,
    bio: ov?.bio ?? u.bio,
    category: ov?.category ?? u.category,
  };
}

export function currentUser(st: DemoState): PublicUser | null {
  return st.currentUserId ? publicUser(st, st.currentUserId) : null;
}

// --- Reels ---
export function selectFeedReels(st: DemoState, userId?: string): FeedReel[] {
  return [...st.reels]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map((r) => {
      const seller = userById(st, r.sellerId)!;
      const course = courseById(st, r.courseId)!;
      return {
        id: r.id,
        videoUrl: r.videoUrl,
        caption: r.caption,
        likesCount: r.likesCount,
        viewsCount: r.viewsCount,
        commentsCount: st.comments.filter((c) => c.reelId === r.id).length,
        likedByMe: !!userId && st.likes.includes(`${userId}:${r.id}`),
        savedByMe: !!userId && st.saves.includes(`${userId}:${r.id}`),
        purchased: !!userId && isPurchased(st, userId, r.courseId),
        seller: { id: seller.id, name: seller.name, avatar: seller.avatar, category: seller.category },
        course: { id: course.id, title: course.title, price: course.price },
      };
    });
}

export function selectReelComments(st: DemoState, reelId: string): FeedComment[] {
  return st.comments
    .filter((c) => c.reelId === reelId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map((c) => {
      const u = userById(st, c.userId)!;
      return { id: c.id, text: c.text, createdAt: c.createdAt, user: { id: u.id, name: u.name, avatar: u.avatar } };
    });
}

export interface SavedReelItem {
  id: string;
  videoUrl: string;
  caption: string | null;
  likesCount: number;
  viewsCount: number;
  courseId: string;
}
export function selectSavedReels(st: DemoState, userId: string): SavedReelItem[] {
  return st.reels
    .filter((r) => st.saves.includes(`${userId}:${r.id}`))
    .map((r) => ({ id: r.id, videoUrl: r.videoUrl, caption: r.caption, likesCount: r.likesCount, viewsCount: r.viewsCount, courseId: r.courseId }));
}

// --- Progress ---
export interface CourseProgress {
  percent: number;
  completedCount: number;
  totalCount: number;
  completedLessonIds: string[];
}
export function courseProgress(st: DemoState, userId: string, courseId: string): CourseProgress {
  const total = lessonsOf(st, courseId).length;
  const completed = st.progress.filter((p) => p.userId === userId && p.courseId === courseId && p.isCompleted);
  return {
    percent: total === 0 ? 0 : Math.round((completed.length / total) * 100),
    completedCount: completed.length,
    totalCount: total,
    completedLessonIds: completed.map((p) => p.lessonId),
  };
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

export function selectCourseDetail(st: DemoState, courseId: string, userId?: string): CourseDetail | null {
  const course = courseById(st, courseId);
  if (!course) return null;
  const seller = userById(st, course.sellerId)!;

  let purchased = false;
  let wishlisted = false;
  let percent = 0;
  let certificateId: string | null = null;
  let completed = new Set<string>();

  if (userId) {
    purchased = isPurchased(st, userId, courseId);
    wishlisted = st.wishlist.includes(`${userId}:${courseId}`);
    const prog = courseProgress(st, userId, courseId);
    percent = prog.percent;
    completed = new Set(prog.completedLessonIds);
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
    lessons: lessonsOf(st, courseId).map((l) => ({
      id: l.id,
      title: l.title,
      order: l.order,
      videoUrl: l.videoUrl,
      content: l.content,
      isFreePreview: l.isFreePreview,
      completed: completed.has(l.id),
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
export function selectPurchasedCourses(st: DemoState, userId: string): LibraryCourse[] {
  return st.purchases
    .filter((p) => p.buyerId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map((p) => {
      const course = courseById(st, p.courseId)!;
      return {
        id: course.id,
        title: course.title,
        coverImage: course.coverImage,
        category: course.category,
        lessonsCount: lessonsOf(st, course.id).length,
        sellerName: userById(st, course.sellerId)!.name,
        percent: courseProgress(st, userId, course.id).percent,
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
export function selectWishlist(st: DemoState, userId: string): WishlistCourse[] {
  return st.courses
    .filter((c) => st.wishlist.includes(`${userId}:${c.id}`))
    .map((c) => ({
      id: c.id,
      title: c.title,
      coverImage: c.coverImage,
      category: c.category,
      price: c.price,
      sellerName: userById(st, c.sellerId)!.name,
    }));
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
export function selectCertificate(st: DemoState, id: string, userId: string): CertificateView | null {
  const cert = st.certificates.find((c) => c.id === id);
  if (!cert || cert.userId !== userId) return null;
  const user = userById(st, cert.userId)!;
  const course = courseById(st, cert.courseId)!;
  const seller = userById(st, course.sellerId)!;
  return {
    id: cert.id,
    certificateNumber: cert.certificateNumber,
    issuedAt: cert.issuedAt,
    userName: user.name,
    courseTitle: course.title,
    sellerName: seller.name,
  };
}
export function selectUserCertificates(st: DemoState, userId: string): CertificateListItem[] {
  return st.certificates
    .filter((c) => c.userId === userId)
    .sort((a, b) => (a.issuedAt < b.issuedAt ? 1 : -1))
    .map((c) => ({ id: c.id, certificateNumber: c.certificateNumber, courseTitle: courseById(st, c.courseId)?.title ?? "", issuedAt: c.issuedAt }));
}

// --- Streak ---
export function selectStreak(st: DemoState, userId: string): { current: number; longest: number } {
  const cur = st.streaks.find((s) => s.userId === userId);
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
export function selectLessonQuizzes(st: DemoState, lessonId: string): PublicQuiz[] {
  return st.quizzes.filter((q) => q.lessonId === lessonId).map((q) => ({ id: q.id, question: q.question, options: q.options }));
}

// --- Seller statistikasi ---
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
export function selectSellerStats(st: DemoState, sellerId: string): SellerStats {
  const courses = st.courses.filter((c) => c.sellerId === sellerId);
  const ids = new Set(courses.map((c) => c.id));
  const purchases = st.purchases.filter((p) => ids.has(p.courseId));
  const reels = st.reels.filter((r) => r.sellerId === sellerId);

  const rev = new Map<string, number>();
  for (const p of purchases) rev.set(p.courseId, (rev.get(p.courseId) ?? 0) + p.amountPaid);

  const courseStats: SellerCourseStat[] = courses.map((c) => ({
    id: c.id,
    title: c.title,
    price: c.price,
    coverImage: c.coverImage,
    viewsCount: c.viewsCount,
    salesCount: c.salesCount,
    revenue: rev.get(c.id) ?? 0,
  }));
  const top = [...courseStats].sort((a, b) => b.revenue - a.revenue)[0] ?? null;

  return {
    totalRevenue: purchases.reduce((s, p) => s + p.amountPaid, 0),
    totalSales: purchases.length,
    totalViews: courses.reduce((s, c) => s + c.viewsCount, 0),
    totalCourses: courses.length,
    totalReels: reels.length,
    reelViews: reels.reduce((s, r) => s + r.viewsCount, 0),
    reelLikes: reels.reduce((s, r) => s + r.likesCount, 0),
    topCourse: top ? { title: top.title, revenue: top.revenue } : null,
    courses: courseStats,
  };
}

export interface SellerReelItem {
  id: string;
  videoUrl: string;
  caption: string | null;
  likesCount: number;
  viewsCount: number;
  courseId: string;
}
export function selectSellerReels(st: DemoState, sellerId: string): SellerReelItem[] {
  return st.reels
    .filter((r) => r.sellerId === sellerId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map((r) => ({ id: r.id, videoUrl: r.videoUrl, caption: r.caption, likesCount: r.likesCount, viewsCount: r.viewsCount, courseId: r.courseId }));
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
export function selectSellerCourse(st: DemoState, courseId: string, sellerId: string): SellerCourseFull | null {
  const course = courseById(st, courseId);
  if (!course || course.sellerId !== sellerId) return null;
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    price: course.price,
    category: course.category,
    coverImage: course.coverImage,
    viewsCount: course.viewsCount,
    salesCount: course.salesCount,
    lessons: lessonsOf(st, courseId).map((l) => ({
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

// --- Kanal (Messenger) ---

/** Foydalanuvchi sotuvchining kanaliga a'zomi (uning biror kursini sotib olgan bo'lsa) */
export function isChannelMember(st: DemoState, userId: string, sellerId: string): boolean {
  return st.purchases.some(
    (p) => p.buyerId === userId && courseById(st, p.courseId)?.sellerId === sellerId
  );
}

/** Kanal a'zolari soni (sotuvchidan kurs olgan noyob xaridorlar) */
export function channelMemberCount(st: DemoState, sellerId: string): number {
  const set = new Set<string>();
  for (const p of st.purchases) {
    if (courseById(st, p.courseId)?.sellerId === sellerId) set.add(p.buyerId);
  }
  return set.size;
}

export interface ChannelSummary {
  id: string; // sellerId
  name: string;
  avatar: string | null;
  category: string | null;
  bio: string | null;
  coursesCount: number;
  membersCount: number;
  postsCount: number;
  isMember: boolean;
}

export interface ChannelPostView {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string | null;
  type: "text" | "video";
  text: string;
  videoUrl: string | null;
  pinned: boolean;
  createdAt: string;
  likesCount: number;
  likedByMe: boolean;
  commentsCount: number;
}

function channelSummary(st: DemoState, seller: D.DemoUser, userId?: string): ChannelSummary {
  const pub = publicUser(st, seller.id)!;
  return {
    id: seller.id,
    name: seller.name,
    avatar: seller.avatar,
    category: pub.category,
    bio: pub.bio,
    coursesCount: st.courses.filter((c) => c.sellerId === seller.id).length,
    membersCount: channelMemberCount(st, seller.id),
    postsCount: st.channelPosts.filter((p) => p.sellerId === seller.id).length,
    isMember: !!userId && isChannelMember(st, userId, seller.id),
  };
}

function postView(st: DemoState, p: D.DemoChannelPost, userId?: string): ChannelPostView {
  const seller = userById(st, p.sellerId)!;
  return {
    id: p.id,
    sellerId: p.sellerId,
    sellerName: seller.name,
    sellerAvatar: seller.avatar,
    type: p.type,
    text: p.text,
    videoUrl: p.videoUrl,
    pinned: p.pinned,
    createdAt: p.createdAt,
    likesCount: p.likesCount,
    likedByMe: !!userId && st.channelLikes.includes(`${userId}:${p.id}`),
    commentsCount: st.channelComments.filter((c) => c.postId === p.id).length,
  };
}

/** Barcha kanallar (discovery) — qidiruv/kategoriya bo'yicha filtr */
export function selectChannels(
  st: DemoState,
  userId?: string,
  opts?: { query?: string; category?: string }
): ChannelSummary[] {
  const q = (opts?.query ?? "").trim().toLowerCase();
  const cat = opts?.category ?? "";
  return st.users
    .filter((u) => u.role === "SELLER")
    .map((u) => channelSummary(st, u, userId))
    .filter((c) => (cat ? c.category === cat : true))
    .filter((c) => (q ? c.name.toLowerCase().includes(q) || (c.category ?? "").toLowerCase().includes(q) : true))
    .sort((a, b) => b.membersCount - a.membersCount);
}

/** Foydalanuvchi a'zo bo'lgan kanallar */
export function selectMyChannels(st: DemoState, userId: string): ChannelSummary[] {
  return selectChannels(st, userId).filter((c) => c.isMember);
}

export interface ChannelDetail extends ChannelSummary {
  posts: ChannelPostView[];
  courses: { id: string; title: string; price: number; coverImage: string | null }[];
}

/** Bitta kanal sahifasi (a'zo bo'lsa postlar, bo'lmasa qulflangan) */
export function selectChannel(st: DemoState, sellerId: string, userId?: string): ChannelDetail | null {
  const seller = userById(st, sellerId);
  if (!seller || seller.role !== "SELLER") return null;
  const summary = channelSummary(st, seller, userId);
  const posts = st.channelPosts
    .filter((p) => p.sellerId === sellerId)
    .map((p) => postView(st, p, userId))
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return a.createdAt < b.createdAt ? 1 : -1;
    });
  const courses = st.courses
    .filter((c) => c.sellerId === sellerId)
    .map((c) => ({ id: c.id, title: c.title, price: c.price, coverImage: c.coverImage }));
  return { ...summary, posts, courses };
}

/** "Mening kanallarim" birlashgan lentasi — a'zo kanallar postlari (eng yangisi tepada) */
export function selectMyChannelFeed(st: DemoState, userId: string): ChannelPostView[] {
  return st.channelPosts
    .filter((p) => isChannelMember(st, userId, p.sellerId))
    .map((p) => postView(st, p, userId))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

/** Kanal posti izohlari */
export function selectChannelPostComments(st: DemoState, postId: string): FeedComment[] {
  return st.channelComments
    .filter((c) => c.postId === postId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map((c) => {
      const u = userById(st, c.userId)!;
      return { id: c.id, text: c.text, createdAt: c.createdAt, user: { id: u.id, name: u.name, avatar: u.avatar } };
    });
}

export interface SellerChannelView {
  membersCount: number;
  postsCount: number;
  posts: ChannelPostView[];
}

/** Sotuvchining o'z kanali (boshqaruv) */
export function selectSellerChannel(st: DemoState, sellerId: string): SellerChannelView {
  const posts = st.channelPosts
    .filter((p) => p.sellerId === sellerId)
    .map((p) => postView(st, p, sellerId))
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return a.createdAt < b.createdAt ? 1 : -1;
    });
  return {
    membersCount: channelMemberCount(st, sellerId),
    postsCount: posts.length,
    posts,
  };
}

// --- Sana yordamchilari (streak uchun) ---
export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
export function dayDiff(a: Date, b: Date): number {
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86_400_000);
}

export type { Role };
