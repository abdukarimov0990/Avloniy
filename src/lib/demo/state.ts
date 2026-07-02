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
  dmMessages: D.DemoDm[];
  transactions: D.DemoTransaction[];
  notifications: D.DemoNotification[];
  profileOverrides: { userId: string; username?: string; privateMessagePrice?: number }[];
  channelReactions: D.DemoChannelReaction[];
  channelMemberStatus: D.DemoMemberStatus[];
  financeItems: D.DemoFinanceItem[];
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
    dmMessages: D.DM_MESSAGES.map((m) => ({ ...m })),
    transactions: D.TRANSACTIONS.map((t) => ({ ...t })),
    notifications: D.NOTIFICATIONS.map((n) => ({ ...n })),
    profileOverrides: [],
    channelReactions: D.CHANNEL_REACTIONS.map((r) => ({ ...r })),
    channelMemberStatus: D.CHANNEL_MEMBER_STATUS.map((m) => ({ ...m })),
    financeItems: D.FINANCE_ITEMS.map((f) => ({ ...f })),
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
  const po = st.profileOverrides.find((p) => p.userId === id);
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatar: u.avatar,
    bio: ov?.bio ?? u.bio,
    category: ov?.category ?? u.category,
    username: po?.username ?? u.username,
    privateMessagePrice: po?.privateMessagePrice ?? u.privateMessagePrice,
  };
}

export function effectiveUsername(st: DemoState, id: string): string {
  return st.profileOverrides.find((p) => p.userId === id)?.username ?? userById(st, id)?.username ?? "";
}
export function userByUsername(st: DemoState, username: string): D.DemoUser | undefined {
  const clean = username.replace(/^@/, "").toLowerCase();
  return st.users.find((u) => effectiveUsername(st, u.id).toLowerCase() === clean);
}
export function isUsernameTaken(st: DemoState, username: string, exceptUserId?: string): boolean {
  const u = userByUsername(st, username);
  return !!u && u.id !== exceptUserId;
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

export function memberStatusOf(st: DemoState, sellerId: string, userId: string): D.MemberStatus | null {
  return st.channelMemberStatus.find((m) => m.sellerId === sellerId && m.userId === userId)?.status ?? null;
}
export function isBanned(st: DemoState, sellerId: string, userId: string): boolean {
  return memberStatusOf(st, sellerId, userId) === "banned";
}

export interface ChannelMemberRow {
  userId: string;
  name: string;
  avatar: string | null;
  username: string;
  status: D.MemberStatus | "active";
}
/** Kanal a'zolari ro'yxati (egasi uchun — moderatsiya) */
export function selectChannelMembers(st: DemoState, sellerId: string): ChannelMemberRow[] {
  const ids = new Set<string>();
  for (const p of st.purchases) {
    if (courseById(st, p.courseId)?.sellerId === sellerId) ids.add(p.buyerId);
  }
  return [...ids].map((uid) => {
    const u = userById(st, uid)!;
    return {
      userId: uid,
      name: u.name,
      avatar: u.avatar,
      username: u.username,
      status: memberStatusOf(st, sellerId, uid) ?? "active",
    };
  });
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

export interface PostReactionView {
  emoji: string;
  count: number;
  mine: boolean;
}
export interface ChannelPostView {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string | null;
  type: "text" | "image" | "video";
  text: string;
  videoUrl: string | null;
  imageUrl: string | null;
  pinned: boolean;
  edited: boolean;
  deleted: boolean;
  createdAt: string;
  reactions: PostReactionView[];
  commentsCount: number;
  canManage: boolean; // joriy foydalanuvchi kanal egasimi
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

function postReactions(st: DemoState, postId: string, userId?: string): PostReactionView[] {
  const rs = st.channelReactions.filter((r) => r.postId === postId);
  const byEmoji = new Map<string, { count: number; mine: boolean }>();
  for (const r of rs) {
    const cur = byEmoji.get(r.emoji) ?? { count: 0, mine: false };
    cur.count += 1;
    if (userId && r.userId === userId) cur.mine = true;
    byEmoji.set(r.emoji, cur);
  }
  return [...byEmoji.entries()].map(([emoji, v]) => ({ emoji, count: v.count, mine: v.mine }));
}

function postView(st: DemoState, p: D.DemoChannelPost, userId?: string): ChannelPostView {
  const seller = userById(st, p.sellerId)!;
  const deleted = !!p.deletedAt;
  return {
    id: p.id,
    sellerId: p.sellerId,
    sellerName: seller.name,
    sellerAvatar: seller.avatar,
    type: p.type,
    text: deleted ? "" : p.text,
    videoUrl: deleted ? null : p.videoUrl,
    imageUrl: deleted ? null : p.imageUrl ?? null,
    pinned: p.pinned && !deleted,
    edited: !!p.editedAt && !deleted,
    deleted,
    createdAt: p.createdAt,
    reactions: deleted ? [] : postReactions(st, p.id, userId),
    commentsCount: st.channelComments.filter((c) => c.postId === p.id).length,
    canManage: !!userId && userId === p.sellerId,
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
  banned: boolean;
  posts: ChannelPostView[];
  courses: { id: string; title: string; price: number; coverImage: string | null }[];
}

/** Bitta kanal sahifasi (a'zo bo'lsa postlar, bo'lmasa qulflangan) */
export function selectChannel(st: DemoState, sellerId: string, userId?: string): ChannelDetail | null {
  const seller = userById(st, sellerId);
  if (!seller || seller.role !== "SELLER") return null;
  const summary = channelSummary(st, seller, userId);
  const posts = st.channelPosts
    .filter((p) => p.sellerId === sellerId && !p.deletedAt)
    .map((p) => postView(st, p, userId))
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return a.createdAt < b.createdAt ? 1 : -1;
    });
  const courses = st.courses
    .filter((c) => c.sellerId === sellerId)
    .map((c) => ({ id: c.id, title: c.title, price: c.price, coverImage: c.coverImage }));
  return { ...summary, banned: !!userId && isBanned(st, sellerId, userId), posts, courses };
}

/** "Mening kanallarim" birlashgan lentasi — a'zo kanallar postlari (eng yangisi tepada) */
export function selectMyChannelFeed(st: DemoState, userId: string): ChannelPostView[] {
  return st.channelPosts
    .filter((p) => !p.deletedAt && isChannelMember(st, userId, p.sellerId) && !isBanned(st, p.sellerId, userId))
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
    .filter((p) => p.sellerId === sellerId && !p.deletedAt)
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

// --- Shaxsiy xabarlar (DM) ---

function sellerOf(st: DemoState, a: string, b: string): string {
  if (userById(st, a)?.role === "SELLER") return a;
  if (userById(st, b)?.role === "SELLER") return b;
  return b;
}
/** Chat kaliti — har doim `${buyerId}__${sellerId}` */
export function dmThreadKey(st: DemoState, a: string, b: string): string {
  const seller = sellerOf(st, a, b);
  const buyer = seller === a ? b : a;
  return `${buyer}__${seller}`;
}

export interface DmMessageView {
  id: string;
  mine: boolean;
  text: string;
  imageUrl: string | null;
  isPaid: boolean;
  paidAmount: number;
  read: boolean;
  edited: boolean;
  deleted: boolean;
  createdAt: string;
  replyTo: { senderName: string; text: string } | null;
}
export interface DmThreadView {
  key: string;
  buyerId: string;
  sellerId: string;
  partner: PublicUser | null;
  meIsSeller: boolean;
  messagePrice: number; // xaridor uchun bitta xabar narxi
  messagingEnabled: boolean;
  messages: DmMessageView[];
}

export function selectDmThread(st: DemoState, userId: string, partnerId: string): DmThreadView {
  const key = dmThreadKey(st, userId, partnerId);
  const [buyerId, sellerId] = key.split("__");
  const seller = publicUser(st, sellerId);
  const meIsSeller = userId === sellerId;
  return {
    key,
    buyerId,
    sellerId,
    partner: publicUser(st, partnerId),
    meIsSeller,
    messagePrice: seller?.privateMessagePrice ?? 0,
    messagingEnabled: meIsSeller || (seller?.privateMessagePrice ?? 0) > 0,
    messages: st.dmMessages
      .filter((m) => m.threadKey === key)
      .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
      .map((m) => {
        const deleted = !!m.deletedAt;
        const replied = m.replyToId ? st.dmMessages.find((x) => x.id === m.replyToId) : undefined;
        return {
          id: m.id,
          mine: m.senderId === userId,
          text: deleted ? "" : m.text,
          imageUrl: deleted ? null : m.imageUrl ?? null,
          isPaid: m.isPaid,
          paidAmount: m.paidAmount,
          read: m.read,
          edited: !!m.editedAt && !deleted,
          deleted,
          createdAt: m.createdAt,
          replyTo: replied
            ? { senderName: userById(st, replied.senderId)?.name ?? "", text: replied.deletedAt ? "o'chirilgan xabar" : replied.text.slice(0, 60) }
            : null,
        };
      }),
  };
}

export interface DmThreadSummary {
  key: string;
  partnerId: string;
  partner: PublicUser | null;
  lastText: string;
  lastAt: string;
  unread: number;
  meIsSeller: boolean;
}

export function selectMyDmThreads(st: DemoState, userId: string): DmThreadSummary[] {
  const keys = new Set(
    st.dmMessages.filter((m) => m.threadKey.split("__").includes(userId)).map((m) => m.threadKey)
  );
  return [...keys]
    .map((key) => {
      const [buyerId, sellerId] = key.split("__");
      const partnerId = userId === buyerId ? sellerId : buyerId;
      const msgs = st.dmMessages.filter((m) => m.threadKey === key).sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
      const last = msgs[msgs.length - 1];
      return {
        key,
        partnerId,
        partner: publicUser(st, partnerId),
        lastText: last ? (last.deletedAt ? "🗑 o'chirilgan xabar" : last.imageUrl && !last.text ? "🖼 Rasm" : last.text) : "",
        lastAt: last?.createdAt ?? "",
        unread: msgs.filter((m) => m.senderId !== userId && !m.read).length,
        meIsSeller: userId === sellerId,
      };
    })
    .sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1));
}

// --- Hamyon (Wallet) va tranzaksiyalar ---

export interface TxView {
  id: string;
  type: D.TxType;
  amount: number;
  createdAt: string;
  counterpartyName: string;
}
export interface WalletView {
  total: number;
  channel: number;
  message: number;
  tip: number;
  transactions: TxView[];
}

export function selectSellerWallet(st: DemoState, sellerId: string): WalletView {
  const txs = st.transactions.filter((t) => t.sellerId === sellerId);
  const sumType = (types: D.TxType[]) =>
    txs.filter((t) => types.includes(t.type)).reduce((s, t) => s + t.amount, 0);
  return {
    total: txs.reduce((s, t) => s + t.amount, 0),
    channel: sumType(["channel_join", "course"]),
    message: sumType(["private_message"]),
    tip: sumType(["tip"]),
    transactions: txs
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        createdAt: t.createdAt,
        counterpartyName: userById(st, t.userId)?.name ?? "Foydalanuvchi",
      })),
  };
}

// --- Moliya: xarajatlar va qarzlar ---
export interface FinanceItemView {
  id: string;
  title: string;
  amount: number;
  dueDate: string | null;
}
export interface SellerFinance {
  totalExpenses: number;
  totalDebts: number;
  expenses: FinanceItemView[];
  debts: FinanceItemView[];
}
export function selectSellerFinance(st: DemoState, sellerId: string): SellerFinance {
  const items = st.financeItems.filter((f) => f.sellerId === sellerId);
  const toView = (f: D.DemoFinanceItem): FinanceItemView => ({
    id: f.id,
    title: f.title,
    amount: f.amount,
    dueDate: f.dueDate,
  });
  const expenses = items
    .filter((f) => f.kind === "expense")
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map(toView);
  // Qarzlar — to'lov muddati yaqinligi bo'yicha (eng yaqin birinchi)
  const debts = items
    .filter((f) => f.kind === "debt")
    .sort((a, b) => (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999"))
    .map(toView);
  return {
    totalExpenses: expenses.reduce((s, i) => s + i.amount, 0),
    totalDebts: debts.reduce((s, i) => s + i.amount, 0),
    expenses,
    debts,
  };
}

export interface SpendingView {
  total: number;
  transactions: TxView[];
}
export function selectBuyerSpending(st: DemoState, userId: string): SpendingView {
  const txs = st.transactions.filter((t) => t.userId === userId);
  return {
    total: txs.reduce((s, t) => s + t.amount, 0),
    transactions: txs
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        createdAt: t.createdAt,
        counterpartyName: userById(st, t.sellerId)?.name ?? "Sotuvchi",
      })),
  };
}

// --- Bildirishnomalar ---
export function selectNotifications(st: DemoState, userId: string): D.DemoNotification[] {
  return st.notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
export function unreadNotifCount(st: DemoState, userId: string): number {
  return st.notifications.filter((n) => n.userId === userId && !n.read).length;
}

// --- Kashf qilish (Discover) ---

export interface DiscoverCourse {
  id: string;
  title: string;
  coverImage: string | null;
  previewVideo: string | null; // kursning reel videosi (bo'lsa)
  price: number;
  category: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string | null;
  salesCount: number;
}

function toDiscover(st: DemoState, c: D.DemoCourse): DiscoverCourse {
  const seller = userById(st, c.sellerId);
  return {
    id: c.id,
    title: c.title,
    coverImage: c.coverImage,
    previewVideo: st.reels.find((r) => r.courseId === c.id)?.videoUrl ?? null,
    price: c.price,
    category: c.category,
    sellerId: c.sellerId,
    sellerName: seller?.name ?? "",
    sellerAvatar: seller?.avatar ?? null,
    salesCount: c.salesCount,
  };
}

/** Barcha kurslar (eng yangisi yoki sotuv bo'yicha) */
export function selectAllCourses(st: DemoState): DiscoverCourse[] {
  return st.courses.map((c) => toDiscover(st, c)).sort((a, b) => b.salesCount - a.salesCount);
}

/** Top kurslar — eng ko'p sotilganlari */
export function selectTopCourses(st: DemoState, limit = 6): DiscoverCourse[] {
  return [...st.courses]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, limit)
    .map((c) => toDiscover(st, c));
}

export interface CategoryRank {
  category: string;
  courseCount: number;
  totalSales: number;
}
/** Kategoriyalar — mashhurligi (jami sotuvi) bo'yicha */
export function selectCategoriesRanked(st: DemoState): CategoryRank[] {
  const map = new Map<string, { courseCount: number; totalSales: number }>();
  for (const c of st.courses) {
    const cur = map.get(c.category) ?? { courseCount: 0, totalSales: 0 };
    cur.courseCount += 1;
    cur.totalSales += c.salesCount;
    map.set(c.category, cur);
  }
  return [...map.entries()]
    .map(([category, v]) => ({ category, ...v }))
    .sort((a, b) => b.totalSales - a.totalSales);
}

/** Bitta kategoriyadagi kurslar (sotuv bo'yicha) */
export function selectCoursesByCategory(st: DemoState, category: string): DiscoverCourse[] {
  return st.courses
    .filter((c) => c.category === category)
    .map((c) => toDiscover(st, c))
    .sort((a, b) => b.salesCount - a.salesCount);
}

export interface TopCreator {
  id: string;
  name: string;
  avatar: string | null;
  username: string;
  category: string | null;
  courseCount: number;
  totalSales: number;
}
/** Top kreatorlar — jami sotuvi bo'yicha sotuvchilar */
export function selectTopCreators(st: DemoState, limit = 6): TopCreator[] {
  return st.users
    .filter((u) => u.role === "SELLER")
    .map((u) => {
      const courses = st.courses.filter((c) => c.sellerId === u.id);
      const pub = publicUser(st, u.id)!;
      return {
        id: u.id,
        name: u.name,
        avatar: u.avatar,
        username: pub.username,
        category: pub.category,
        courseCount: courses.length,
        totalSales: courses.reduce((s, c) => s + c.salesCount, 0),
      };
    })
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, limit);
}

// --- Sana yordamchilari (streak uchun) ---
export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
export function dayDiff(a: Date, b: Date): number {
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86_400_000);
}

export type { Role };
