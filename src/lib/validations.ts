import { z } from "zod";

export const roleSchema = z.enum(["BUYER", "SELLER"]);

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Ism kamida 2 ta harf bo'lsin"),
  email: z.string().trim().toLowerCase().email("Email noto'g'ri"),
  password: z.string().min(6, "Parol kamida 6 ta belgi bo'lsin"),
  role: roleSchema,
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email noto'g'ri"),
  password: z.string().min(1, "Parolni kiriting"),
  role: roleSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// --- Seller (sotuvchi) ---

export const onboardingSchema = z.object({
  category: z.string().trim().min(2, "Yo'nalishni tanlang"),
  bio: z.string().trim().max(300).optional().or(z.literal("")),
});

export const courseSchema = z.object({
  title: z.string().trim().min(3, "Kurs nomi kamida 3 ta harf"),
  description: z.string().trim().min(10, "Tavsif kamida 10 ta belgi"),
  price: z.coerce.number().int().min(0, "Narx manfiy bo'lmasin").max(100_000_000),
  category: z.string().trim().min(2, "Kategoriyani tanlang"),
  coverImage: z.string().trim().url("Rasm havolasi noto'g'ri").optional().or(z.literal("")),
});

export const lessonSchema = z.object({
  title: z.string().trim().min(2, "Dars nomi kamida 2 ta harf"),
  content: z.string().trim().max(2000).optional().or(z.literal("")),
  videoUrl: z.string().trim().optional().or(z.literal("")),
});

export const reelSchema = z.object({
  courseId: z.string().trim().min(1, "Kurs tanlanmagan"),
  caption: z.string().trim().max(300).optional().or(z.literal("")),
  videoUrl: z.string().trim().optional().or(z.literal("")),
});

export type CourseInput = z.infer<typeof courseSchema>;
export type LessonInput = z.infer<typeof lessonSchema>;
export type ReelInput = z.infer<typeof reelSchema>;
