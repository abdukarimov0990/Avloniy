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
  },
  // Statistika uchun "ghost" xaridorlar (login qilinmaydi)
  { id: "u-g1", name: "Nodira", email: "g1@demo.uz", password: "x", role: "BUYER", avatar: null, bio: null, category: null },
  { id: "u-g2", name: "Jasur", email: "g2@demo.uz", password: "x", role: "BUYER", avatar: null, bio: null, category: null },
  { id: "u-g3", name: "Madina", email: "g3@demo.uz", password: "x", role: "BUYER", avatar: null, bio: null, category: null },
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
