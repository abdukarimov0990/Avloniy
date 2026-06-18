@AGENTS.md

# Avloniy

Online kurslar sotish platformasi. Kurslar Instagram Reels uslubidagi qisqa vertikal
videolar orqali reklama qilinadi. Ikki rol: **Buyer** (xaridor) va **Seller** (sotuvchi).
**Mobile-first** (~430px shell). Interfeys o'zbekcha, kod inglizcha.

## Stack
- Next.js 16 (App Router, Turbopack) + TypeScript
- Tailwind CSS v4 (tokenlar `src/app/globals.css` `@theme` ichida)
- Prisma 6 + PostgreSQL (Neon)
- Auth: o'z JWT (`jose`) + httpOnly cookie, `bcryptjs`, rolega asoslangan `src/proxy.ts`
- Zustand (klient state), zod (validatsiya), lucide-react (ikonkalar), recharts (grafiklar)

## Dizayn tizimi
Ranglar `globals.css`da: `background`/`surface` (light black), `accent` (orange `#FF6B35`),
`foreground`/`muted`/`subtle`, `border`. Doimo dark mavzu. UI primitivlar: `src/components/ui/`.

## Muhim konvensiyalar
- `src/lib/jwt.ts` — Edge-safe (faqat jose). `src/proxy.ts` faqat shuni import qiladi.
- `src/lib/auth.ts` — Node-only (`server-only`): bcrypt, cookie, DB. Sahifa/route'lar shu yerdan.
- Narx butun so'mda saqlanadi (tiyin emas). `formatPrice` — `src/lib/utils.ts`.
- npm root-cache muammosi tufayli mahalliy cache: `.npmrc` `cache=./.npm-cache`.

## Baza
Hozir **lokal PostgreSQL 16** (Homebrew, `brew services` orqali ishlaydi) ishlatiladi.
`.env` → `DATABASE_URL="postgresql://abdukarimov@localhost:5432/avloniy?schema=public"`.
Sxema `prisma db push` bilan yuklangan. Prodda Neon'ga o'tish uchun `.env` dagi izohli qatorga qarang.

## Sozlash (yangi muhitda)
1. `brew services start postgresql@16 && createdb avloniy` (yoki `.env` ni Neon'ga yo'naltiring).
2. `npx prisma db push` — sxemani yuklaydi.
3. `npm run dev` — http://localhost:3000

## Buyruqlar
- `npm run dev` / `npm run build` / `npm run lint`
- `npx prisma studio` — bazani ko'rish
- `npx prisma db push` — sxema o'zgarishini yuklash

## Reels / kurslar
- Standart reel video: `public/videos/default.mp4` (konstanta `src/lib/constants.ts`).
- Seed: `npm run db:seed` (3 sotuvchi, 4 kurs, 16 dars, 4 reel). Demo login yuqorida.
- Server lib: `src/lib/reels.ts` (feed, izohlar), `src/lib/courses.ts` (kurs detali, library).
- API: `/api/reels`, `/api/reels/[id]/(like|comments|view)`, `/api/courses/[id]/purchase` (mock to'lov).
- Narx butun so'mda. `purchased`/`likedByMe` — userId bo'yicha hisoblanadi.

## Holat
- **1-bosqich** ✅ skelet + dizayn + ikki rolli auth + proxy + landing.
- **2-bosqich** ✅ seed (demo ma'lumotlar).
- **3-bosqich (Buyer)** ✅ Reels lentasi (swipe, autoplay video, like/comment/share),
  kurs sahifasi, mock to'lov, "Mening kurslarim" (library), profil, pastki navigatsiya.
- **4-bosqich (Seller)** ✅ onboarding (`/onboarding`, kategoriya null bo'lsa majburiy),
  dashboard (`/dashboard`, recharts daromad grafigi + stat kartalar), studio profil
  (`/studio`, Instagram-grid), kurs yaratish (`/studio/new`), kurs boshqaruvi
  (`/studio/[id]` — dars/reel qo'shish). Seller lib: `src/lib/seller.ts`.
- **Kengaytirish BOSQICH 1 (Buyer tajribasi)** ✅ progress tracking (`lib/progress.ts`,
  video tugaganda+qo'lda, ✓ va progress bar), sertifikat (`lib/certificates.ts`, 100%da avtomatik,
  `/certificates/[id]` print-sahifa), kviz (`lib/quiz.ts`, seller `QuizForm` + buyer `QuizBlock`),
  streak (`lib/streak.ts`, profilда 🔥), saqlangan reels (`/saved`), wishlist (`/wishlist`).
- **Keyingi: kengaytirish BOSQICH 2** — seller biznes (promo-kod, bundle, free-preview/drip, referral).
  BOSQICH 3 (obuna/coaching/tip), 4 (follow/bildirishnoma/chat), 5 (qidiruv/algoritm/review).

## Kengaytirish schema (qo'shildi, additive)
20+ yangi model BOSQICH 1–5 uchun (LessonProgress, Certificate, Quiz, QuizAttempt, Streak,
SavedReel, Wishlist, PromoCode, Bundle, BundleCourse, Referral, Subscription, CoachingProduct,
CoachingBooking, Tip, Follow, Notification, CommunityMessage, Review). Lesson: `isFreePreview`,
`unlockAfterDays`. Course/Reel: `hashtags String[]`. Hammasi `db push` bilan yuklangan.
BOSQICH 2–5 modellari bor, lekin UI/logika hali qurilmagan.

## Seller eslatmalar
- `(seller)/layout.tsx` kategoriya null bo'lsa `/onboarding`ga yo'naltiradi (loop bo'lmasligi
  uchun `/onboarding` (seller) guruhidan tashqarida).
- Yangi reel/dars videosi standart videodan (`DEFAULT_REEL_VIDEO`). Real yuklash keyin.
- API egalik tekshiruvi: kurs/dars/reel faqat egasiga (`sellerId === session.userId`).
