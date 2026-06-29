/**
 * Avloniy DEMO ma'lumotlari (bazasiz).
 * Butun ilova shu statik ma'lumotlardan o'qiydi — Vercelда hech qanday baza kerak emas.
 * O'zgartirishlar (like, sotib olish, progress) xotirада (in-memory) saqlanadi va
 * server qayta ishga tushganда dastlabki holatga qaytadi (demo uchun ideal).
 */

export type Role = "BUYER" | "SELLER";

export const DEFAULT_VIDEO = "/videos/default.mp4";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar: string | null;
  bio: string | null;
  category: string | null;
  username: string; // @handle (unique)
  privateMessagePrice: number; // sotuvchi: bitta shaxsiy xabar narxi (so'm). 0 = o'chiq
}

export interface DemoCourse {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  coverImage: string | null;
  hashtags: string[];
  viewsCount: number;
  salesCount: number;
}

export interface DemoLesson {
  id: string;
  courseId: string;
  title: string;
  videoUrl: string | null;
  content: string | null;
  order: number;
  isFreePreview: boolean;
}

export interface DemoQuiz {
  id: string;
  lessonId: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface DemoReel {
  id: string;
  sellerId: string;
  courseId: string;
  videoUrl: string;
  caption: string | null;
  hashtags: string[];
  likesCount: number;
  viewsCount: number;
  createdAt: string;
}

export interface DemoComment {
  id: string;
  reelId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface DemoPurchase {
  buyerId: string;
  courseId: string;
  amountPaid: number;
  createdAt: string;
}

// --- Foydalanuvchilar ---
export const USERS: DemoUser[] = [
  {
    id: "u-ali",
    name: "Ali Valiyev",
    email: "ali@misol.uz",
    password: "parol123",
    role: "BUYER",
    avatar: "https://i.pravatar.cc/150?img=12",
    bio: null,
    category: null,
    username: "ali",
    privateMessagePrice: 0,
  },
  {
    id: "u-aziz",
    name: "Aziz Rahimov",
    email: "aziz@misol.uz",
    password: "parol123",
    role: "SELLER",
    avatar: "https://i.pravatar.cc/150?img=33",
    bio: "Full-stack dasturchi. 5 yillik tajriba. Sodda tilda o'rgataman.",
    category: "Dasturlash",
    username: "aziz_dev",
    privateMessagePrice: 15000,
  },
  {
    id: "u-dilnoza",
    name: "Dilnoza Karimova",
    email: "dilnoza@misol.uz",
    password: "parol123",
    role: "SELLER",
    avatar: "https://i.pravatar.cc/150?img=45",
    bio: "UI/UX dizayner. Figma bo'yicha mutaxassis.",
    category: "Dizayn",
    username: "dilnoza_design",
    privateMessagePrice: 20000,
  },
  {
    id: "u-sardor",
    name: "Sardor Yusupov",
    email: "sardor@misol.uz",
    password: "parol123",
    role: "SELLER",
    avatar: "https://i.pravatar.cc/150?img=8",
    bio: "SMM va digital marketing bo'yicha amaliyotchi.",
    category: "Marketing",
    username: "sardor_smm",
    privateMessagePrice: 10000,
  },
  // Statistika uchun "ghost" xaridorlar (login qilinmaydi)
  { id: "u-g1", name: "Nodira", email: "g1@demo.uz", password: "x", role: "BUYER", avatar: null, bio: null, category: null, username: "nodira", privateMessagePrice: 0 },
  { id: "u-g2", name: "Jasur", email: "g2@demo.uz", password: "x", role: "BUYER", avatar: null, bio: null, category: null, username: "jasur", privateMessagePrice: 0 },
  { id: "u-g3", name: "Madina", email: "g3@demo.uz", password: "x", role: "BUYER", avatar: null, bio: null, category: null, username: "madina", privateMessagePrice: 0 },
];

// --- Kurslar ---
export const COURSES: DemoCourse[] = [
  {
    id: "c-web",
    sellerId: "u-aziz",
    title: "Noldan Web Dasturlash",
    description:
      "HTML, CSS va JavaScript'ni noldan o'rganing. Har bir dars amaliyot bilan. Kurs oxirida o'z saytingizni yarata olasiz.",
    price: 199000,
    category: "Dasturlash",
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600",
    hashtags: ["webdev", "dasturlash", "frontend"],
    viewsCount: 399,
    salesCount: 3,
  },
  {
    id: "c-react",
    sellerId: "u-aziz",
    title: "React va Next.js Pro",
    description:
      "Zamonaviy frontend: React, hooks, Next.js App Router va real loyihalar. Ish topishga tayyor bo'ling.",
    price: 299000,
    category: "Dasturlash",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600",
    hashtags: ["react", "nextjs", "dasturlash"],
    viewsCount: 512,
    salesCount: 2,
  },
  {
    id: "c-figma",
    sellerId: "u-dilnoza",
    title: "Figma'da UI/UX Dizayn",
    description:
      "Mobil va web ilovalar uchun chiroyli interfeys yarating. Figma'ni noldan professional darajagacha.",
    price: 149000,
    category: "Dizayn",
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600",
    hashtags: ["dizayn", "figma", "uiux"],
    viewsCount: 348,
    salesCount: 2,
  },
  {
    id: "c-insta",
    sellerId: "u-sardor",
    title: "Instagram Marketing 2026",
    description:
      "Instagram orqali mahsulot soting. Reels, targetlangan reklama va kontent strategiyasi.",
    price: 99000,
    category: "Marketing",
    coverImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600",
    hashtags: ["marketing", "instagram", "smm"],
    viewsCount: 299,
    salesCount: 2,
  },
];

const LESSON_TITLES: Record<string, string[]> = {
  "c-web": ["Kirish: web qanday ishlaydi", "HTML asoslari", "CSS bilan dizayn", "JavaScript bilan jonlantirish"],
  "c-react": ["React asoslari", "Hooks", "Next.js routing", "Loyiha: blog"],
  "c-figma": ["Figma interfeysi", "Ranglar va shriftlar", "Komponentlar", "Prototip"],
  "c-insta": ["Profil sozlash", "Kontent reja", "Reels sirlari", "Reklama"],
};

export const LESSONS: DemoLesson[] = COURSES.flatMap((c) =>
  LESSON_TITLES[c.id].map((title, i) => ({
    id: `l-${c.id}-${i + 1}`,
    courseId: c.id,
    title,
    videoUrl: DEFAULT_VIDEO,
    content: "Dars materiali tez orada qo'shiladi.",
    order: i + 1,
    isFreePreview: i === 0,
  }))
);

export const QUIZZES: DemoQuiz[] = COURSES.map((c) => ({
  id: `q-${c.id}`,
  lessonId: `l-${c.id}-1`,
  question: `"${c.title}" kursida nima asosiy o'rgatiladi?`,
  options: ["Amaliy ko'nikma", "Faqat nazariya", "Hech narsa", "Bilmadim"],
  correctOptionIndex: 0,
}));

const REEL_CAPTIONS: Record<string, string> = {
  "c-web": "Noldan web dasturchi bo'l 🚀 Birinchi saytingni bugun yoz!",
  "c-react": "React'ni chuqur o'rgan va ish top 💼",
  "c-figma": "Dizaynni noldan o'rgan 🎨 Birinchi ilovangni loyihalashtir!",
  "c-insta": "Instagram'da soting 📈 Birinchi mijozingni jalb qil!",
};

export const REELS: DemoReel[] = COURSES.map((c, i) => ({
  id: `r-${c.id}`,
  sellerId: c.sellerId,
  courseId: c.id,
  videoUrl: DEFAULT_VIDEO,
  caption: REEL_CAPTIONS[c.id],
  hashtags: c.hashtags,
  likesCount: 50 + i * 17,
  viewsCount: 500 + i * 120,
  // createdAt — barqaror tartib uchun (oxirgisi tepada chiqadi)
  createdAt: `2026-06-1${i}T10:00:00.000Z`,
}));

export const COMMENTS: DemoComment[] = [
  { id: "cm-1", reelId: "r-web", userId: "u-ali", text: "Juda zo'r kurs ekan! 🔥", createdAt: "2026-06-15T09:00:00.000Z" },
  { id: "cm-2", reelId: "r-figma", userId: "u-ali", text: "Bu menga kerak edi, rahmat!", createdAt: "2026-06-15T09:05:00.000Z" },
];

// Statistika uchun dastlabki sotuvlar (seller dashboard'lari bo'sh ko'rinmasligi uchun)
export const PURCHASES: DemoPurchase[] = [
  { buyerId: "u-g1", courseId: "c-web", amountPaid: 199000, createdAt: "2026-06-10T10:00:00.000Z" },
  { buyerId: "u-g2", courseId: "c-web", amountPaid: 199000, createdAt: "2026-06-11T10:00:00.000Z" },
  { buyerId: "u-g3", courseId: "c-web", amountPaid: 199000, createdAt: "2026-06-12T10:00:00.000Z" },
  { buyerId: "u-g1", courseId: "c-react", amountPaid: 299000, createdAt: "2026-06-11T11:00:00.000Z" },
  { buyerId: "u-g2", courseId: "c-react", amountPaid: 299000, createdAt: "2026-06-12T11:00:00.000Z" },
  { buyerId: "u-g1", courseId: "c-figma", amountPaid: 149000, createdAt: "2026-06-11T12:00:00.000Z" },
  { buyerId: "u-g3", courseId: "c-figma", amountPaid: 149000, createdAt: "2026-06-12T12:00:00.000Z" },
  { buyerId: "u-g2", courseId: "c-insta", amountPaid: 99000, createdAt: "2026-06-11T13:00:00.000Z" },
  { buyerId: "u-g3", courseId: "c-insta", amountPaid: 99000, createdAt: "2026-06-12T13:00:00.000Z" },
];

// Demo xaridor (ali) uchun dastlabki saqlangan reel va istaklar
export const INITIAL_SAVED: { userId: string; reelId: string }[] = [
  { userId: "u-ali", reelId: "r-react" },
];
export const INITIAL_WISHLIST: { userId: string; courseId: string }[] = [
  { userId: "u-ali", courseId: "c-react" },
];

// --- Kanal (Messenger) postlari ---
// Har bir sotuvchi = bitta shaxsiy kanal. Kursini sotib olgan a'zo bo'ladi.
export interface DemoChannelPost {
  id: string;
  sellerId: string;
  type: "text" | "image" | "video";
  text: string;
  videoUrl: string | null;
  imageUrl?: string | null;
  editedAt?: string | null;
  deletedAt?: string | null;
  pinned: boolean;
  likesCount: number;
  createdAt: string;
}

export const CHANNEL_POSTS: DemoChannelPost[] = [
  // Aziz — Dasturlash kanali
  {
    id: "cp-aziz-1",
    sellerId: "u-aziz",
    type: "text",
    text: "Kanalga xush kelibsiz! 🎉 Bu yerda qo'shimcha materiallar, yangiliklar va savol-javoblar bo'ladi. Savollaringizni bemalol yozing!",
    videoUrl: null,
    pinned: true,
    likesCount: 42,
    createdAt: "2026-06-16T08:00:00.000Z",
  },
  {
    id: "cp-aziz-2",
    sellerId: "u-aziz",
    type: "video",
    text: "Bonus dars: VS Code'ni dasturchi uchun sozlash 🛠️ (faqat kanal a'zolari uchun)",
    videoUrl: DEFAULT_VIDEO,
    pinned: false,
    likesCount: 28,
    createdAt: "2026-06-18T10:30:00.000Z",
  },
  {
    id: "cp-aziz-3",
    sellerId: "u-aziz",
    type: "text",
    text: "Ertaga soat 20:00 da jonli efirda React savollariga javob beraman. Savollaringizni izohga yozib qoldiring! 💬",
    videoUrl: null,
    pinned: false,
    likesCount: 17,
    createdAt: "2026-06-20T15:00:00.000Z",
  },
  // Dilnoza — Dizayn kanali
  {
    id: "cp-dilnoza-1",
    sellerId: "u-dilnoza",
    type: "text",
    text: "Salom, dizaynerlar! 🎨 Har hafta yangi Figma maslahatlari va bepul shablonlar shu yerda.",
    videoUrl: null,
    pinned: true,
    likesCount: 35,
    createdAt: "2026-06-16T09:00:00.000Z",
  },
  {
    id: "cp-dilnoza-2",
    sellerId: "u-dilnoza",
    type: "video",
    text: "Tezkor maslahat: 8pt grid tizimi bilan ishlash 📐",
    videoUrl: DEFAULT_VIDEO,
    pinned: false,
    likesCount: 21,
    createdAt: "2026-06-19T12:00:00.000Z",
  },
  // Sardor — Marketing kanali
  {
    id: "cp-sardor-1",
    sellerId: "u-sardor",
    type: "text",
    text: "Marketing kanaliga xush kelibsiz! 📈 Real case'lar va strategiyalar bilan o'rtoqlashaman.",
    videoUrl: null,
    pinned: true,
    likesCount: 19,
    createdAt: "2026-06-17T11:00:00.000Z",
  },
  {
    id: "cp-sardor-2",
    sellerId: "u-sardor",
    type: "text",
    text: "Yangi case study: 0 dan 10 000 followergacha 30 kunda. To'liq strategiya keyingi postda! 🚀",
    videoUrl: null,
    pinned: false,
    likesCount: 24,
    createdAt: "2026-06-20T16:00:00.000Z",
  },
];

// Demo: ali (u-ali) bir nechta postlarni yoqtirgan
export const INITIAL_CHANNEL_LIKES: { userId: string; postId: string }[] = [];

// --- Shaxsiy xabarlar (DM) ---
// threadKey = `${buyerId}__${sellerId}` — chat har doim xaridor↔sotuvchi orasida.
export interface DemoDm {
  id: string;
  threadKey: string;
  senderId: string;
  text: string;
  imageUrl?: string | null;
  replyToId?: string | null;
  isPaid: boolean;
  paidAmount: number;
  read: boolean;
  editedAt?: string | null;
  deletedAt?: string | null;
  createdAt: string;
}

// Kanal post reaksiyalari (emoji) va a'zo holatlari (mute/ban)
export interface DemoChannelReaction {
  postId: string;
  userId: string;
  emoji: string;
}
export const CHANNEL_REACTIONS: DemoChannelReaction[] = [
  { postId: "cp-aziz-1", userId: "u-g1", emoji: "🔥" },
  { postId: "cp-aziz-1", userId: "u-g2", emoji: "👍" },
  { postId: "cp-aziz-2", userId: "u-g1", emoji: "❤️" },
  { postId: "cp-dilnoza-1", userId: "u-g3", emoji: "👏" },
];

export type MemberStatus = "muted" | "banned";
export interface DemoMemberStatus {
  sellerId: string;
  userId: string;
  status: MemberStatus;
}
export const CHANNEL_MEMBER_STATUS: DemoMemberStatus[] = [];

export const REACTION_EMOJIS = ["👍", "❤️", "🔥", "👏", "😮", "😂"] as const;

export const DM_MESSAGES: DemoDm[] = [
  { id: "dm-1", threadKey: "u-ali__u-aziz", senderId: "u-ali", text: "Salom! React kursingiz haqida savolim bor edi.", isPaid: true, paidAmount: 15000, read: true, createdAt: "2026-06-19T10:00:00.000Z" },
  { id: "dm-2", threadKey: "u-ali__u-aziz", senderId: "u-aziz", text: "Salom Ali! Albatta, savolingizni bemalol yozing 😊", isPaid: false, paidAmount: 0, read: true, createdAt: "2026-06-19T10:05:00.000Z" },
  { id: "dm-3", threadKey: "u-g1__u-aziz", senderId: "u-g1", text: "Kurs uchun rahmat! Qo'shimcha material bormi?", isPaid: true, paidAmount: 15000, read: false, createdAt: "2026-06-20T14:00:00.000Z" },
];

// --- Tranzaksiyalar (pul oqimi) ---
export type TxType = "channel_join" | "private_message" | "tip" | "course";
export interface DemoTransaction {
  id: string;
  userId: string; // to'lovchi (xaridor)
  sellerId: string; // qabul qiluvchi (sotuvchi)
  type: TxType;
  amount: number;
  relatedId: string | null;
  createdAt: string;
}

// Ghost xaridorlarning kanalga qo'shilishi (kurs sotib olishi) tranzaksiyalari + DM to'lovlari
export const TRANSACTIONS: DemoTransaction[] = [
  ...PURCHASES.map((p, i) => ({
    id: `tx-p-${i + 1}`,
    userId: p.buyerId,
    sellerId: COURSES.find((c) => c.id === p.courseId)!.sellerId,
    type: "channel_join" as TxType,
    amount: p.amountPaid,
    relatedId: p.courseId,
    createdAt: p.createdAt,
  })),
  { id: "tx-dm-1", userId: "u-ali", sellerId: "u-aziz", type: "private_message", amount: 15000, relatedId: "dm-1", createdAt: "2026-06-19T10:00:00.000Z" },
  { id: "tx-dm-3", userId: "u-g1", sellerId: "u-aziz", type: "private_message", amount: 15000, relatedId: "dm-3", createdAt: "2026-06-20T14:00:00.000Z" },
];

// --- Bildirishnomalar ---
export type NotifType = "new_member" | "new_message" | "payment";
export interface DemoNotification {
  id: string;
  userId: string; // kimga
  type: NotifType;
  title: string;
  body: string;
  read: boolean;
  relatedId: string | null;
  createdAt: string;
}

export const NOTIFICATIONS: DemoNotification[] = [
  { id: "nt-1", userId: "u-aziz", type: "new_message", title: "Yangi shaxsiy xabar", body: "Nodira sizga xabar yubordi (15 000 so'm)", read: false, relatedId: "u-g1__u-aziz", createdAt: "2026-06-20T14:00:00.000Z" },
];
