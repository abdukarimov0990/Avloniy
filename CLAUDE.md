@AGENTS.md

# Avloniy

Online kurslar sotish platformasi. Kurslar Instagram Reels uslubidagi qisqa vertikal
videolar orqali reklama qilinadi. Ikki rol: **Buyer** (xaridor) va **Seller** (sotuvchi).
**Mobile-first** (~430px shell). Interfeys o'zbekcha, kod inglizcha.

## ⚠️ DEMO REJIMI (bazasiz, to'liq client-side + localStorage)
Loyiha **bazasiz client-side demo**. Server qatlami YO'Q (API route, Prisma, cookie auth,
proxy — hammasi olib tashlangan). Butun ma'lumot oqimi brauzerда:
- `src/lib/demo/data.ts` — statik seed (foydalanuvchilar, kurslar, darslar, reels, kvizlar).
- `src/lib/demo/state.ts` — SOF holat tuzilmasi + selektorlar (read).
- `src/lib/demo/use-demo.ts` — **Zustand + persist(localStorage)** store + barcha amallar (write).
  Kalit: `avloniy-demo`. Like/sotib olish/progress/yangi kurs — hammasi localStorage'да saqlanadi.
- `src/components/demo-provider.tsx` — root layout'да; localStorage'дан `rehydrate` qiladi va
  shu paytgача splash ko'rsatadi (SSR↔client hydration mismatch'ни oldini oladi).
- `src/lib/demo/hooks.ts` — `useGuard(role?)` client route himoyasi (redirect).

Sahifa/komponentlar **client** (`"use client"`); holatni `useDemo()` (to'liq holat) orqali o'qib,
selektorlar bilan hisoblaydi, amallar uchun store action'larini chaqiradi.
`prisma/schema.prisma` faqat reference (ishlatilmaydi).

## Stack
- Next.js 16 (App Router) + TypeScript — sahifalar statik shell, client'да hidratlanadi
- Tailwind CSS v4 (tokenlar `src/app/globals.css` `@theme` ichida)
- **Ma'lumot:** Zustand + localStorage (`src/lib/demo/`) — baza yo'q, server yo'q, env yo'q
- zod ishlatilmaydi (validatsiya inline); lucide-react (ikonkalar), recharts (grafiklar)

## Dizayn tizimi
Faqat **2 rang**: light black (fon/yuzalar) + **Mahogany `#BA3D03`** (yagona aksent).
Tokenlar `globals.css` `@theme`da: `background`/`surface`/`surface-2`, `accent`/`accent-bright`/`accent-soft`,
`foreground`/`muted`/`subtle`, `border`. `success`=accent, `danger`=mahogany oilasi (boshqa rang yo'q).
Doimo dark mavzu. UI primitivlar: `src/components/ui/`.

## Kashf qilish (Discover) + Marketplace
Buyer nav'da **Kashf** tab (`/discover`): 🔥 Top kurslar (eng ko'p sotilgan + trend kategoriya),
Kategoriyalar (mashhurlik bo'yicha → `/discover/[category]` alohida sahifa), Top kreatorlar
(sotuv bo'yicha → kanal), **Barcha kurslar — marketplace grid** (`MarketCard`: kurs reel videosi
hover'да o'ynaydi, video yo'qsa muqova rasm; grid `grid-cols-2 lg:grid-cols-3`).
Selektorlar `state.ts`: `selectTopCourses`, `selectCategoriesRanked`, `selectCoursesByCategory`,
`selectTopCreators`, `selectAllCourses` (`DiscoverCourse.previewVideo` — kursning reel videosi).

## Responsive (mobil + desktop)
Mobil — hozirgidek (430px shell + pastki tab nav). **Desktop (lg≥1024px):** `components/layout/sidebar.tsx`
chap yon panel (rolga qarab nav), pastki nav `lg:hidden`. Buyer/seller layout: `lg:flex lg:max-w-[1180px]`
(sidebar + keng kontent). Brauzing gridlar `lg:grid-cols-2/3`. Reels feed desktop'да `lg:max-w-[460px]` (tor).
Standalone sahifalar (kurs/chat/inbox...) markazlashgan ustun bo'lib qoladi.

## UX
- Pastki nav 5 bo'lim (buyer: Lenta/Kanallar/Xabarlar/Kurslarim/Profil; seller: Statistika/Kanal/Xabarlar/Yaratish/Profil),
  Xabarlar'da o'qilmagan DM badge. Kontekstli ortga: `components/layout/back-button.tsx` (`router.back()` + fallback).
- Global toast: `src/lib/toast.ts` (`useToast().show`) + `components/ui/toaster.tsx` (DemoProvider'да). Save/wishlist/sotib olish/post/sozlama/onboarding/moderatsiya'да ishlatiladi.
- Qaytarib bo'lmaydigan harakatlar (chiqish, post/xabar o'chirish) — tasdiq oynasi bilan.
- Onboarding: qadam ko'rsatkichi + "Keyinroq to'ldirish" (`category="Boshqa"`). Touch target ≥44px.

## Muhim konvensiyalar
- Yangi selektor/amal qo'shsangiz: read → `state.ts`, write → `use-demo.ts` action.
- `useDemo()`ни SELEKTORSIZ chaqiring (to'liq holat) — selektor yangi obyekt qaytarsa Zustand v5 loop beradi.
- localStorage faqat array/obyekt saqlaydi (Set EMAS) — shuning uchun `likes/saves/wishlist` array.
- Narx butun so'mda. `formatPrice` — `src/lib/utils.ts`.
- npm root-cache muammosi tufayli mahalliy cache: `.npmrc` `cache=./.npm-cache`.

## Ishga tushirish / deploy
- Lokal: `npm install && npm run dev` → http://localhost:3000 (env kerak emas).
- Vercel: repo'ni import qiling → Deploy. Hech qanday env o'zgaruvchisi kerak emas.
- Demo login: `ali@misol.uz` (xaridor), `aziz@misol.uz` (sotuvchi), parol `parol123`.

## Buyruqlar
- `npm run dev` / `npm run build` / `npm run start` / `npm run lint`

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

## Kanal / Messenger (MVP) ✅
Har bir sotuvchi = bitta **shaxsiy kanal**. Kursini sotib olgan avtomatik **a'zo** bo'ladi.
- Ma'lumot: `data.ts` `CHANNEL_POSTS` (seed), `state.ts` `channelPosts/channelLikes/channelComments`
  + selektorlar (`selectChannels`, `selectChannel`, `selectMyChannelFeed`, `selectSellerChannel`,
  `isChannelMember`, `channelMemberCount`). Amallar: `createChannelPost/toggleChannelPostLike/addChannelComment`.
- Buyer: `/channels` (discovery — qidiruv + kategoriya + "mening kanallarim" lentasi),
  `/channels/[id]` (a'zo → postlar; a'zo emas → qulflangan + kurslar). Pastki navga "Kanallar" qo'shildi.
- Seller: `/channel` (a'zolar/postlar statistikasi + `PostComposer` (matn/video post) + postlar). Navga "Kanal".
- Komponentlar: `components/channel/` (`channel-post-card`, `channel-feed`, `channel-comments-sheet`, `channel-composer-bar`).
- Kross-havola: kurs sahifasida sotuvchi → "Kanalni ochish".

### Telegram uslubidagi UI (kanal ko'rinishi)
Kanal sahifalari **Telegram messenger uslubida**: `h-full flex flex-col` — sticky **header** (avatar +
nom + a'zolar soni + DM/menyu), o'rtada **chat scroll** (`.tg-chat` — nozik mahogany "wallpaper",
`globals.css`), pastda **composer** (faqat seller). Postlar **chat bubble** (`channel-post-card`):
chapga tekislangan (`rounded-2xl rounded-bl-md`), media tepada, matn+vaqt (soat:daqiqa), reaksiya pill'lari,
"Izoh qoldirish" panel; egasi uchun ⋮ (pin/tahrir/o'chirish). Seller: `ChannelComposerBar` — pastki
kirish paneli (📎 rasm/video + matn + yuborish, Enter=yuborish). Buyer a'zo: chat + tavsif kartasi;
a'zo emas: qulflangan + kurslar. Demo xaridor `ali` `c-web` kursini sotib olgan (u-aziz kanaliga a'zo).

## Telegram-daraja kengaytma (client-only)
- **Postlar:** matn/rasm/video (`PostComposer`), emoji reaksiya (`REACTION_EMOJIS`, `reactToPost`),
  egasi uchun pin/tahrir/o'chirish (soft `deletedAt`), `channelReactions` selektorlari.
- **DM (chat):** `/chat/[id]` — reply/tahrir/o'chirish, kun ajratgich, ✓/✓✓ (read), rasm, pullik
  (xaridor to'laydi, sotuvchi javobi bepul). Amallar: `sendDm(opts)`, `editDm`, `deleteDm`, `markThreadRead`.
- **Moderatsiya:** `/channel/members` — egasi a'zoni mute/ban qiladi (`channelMemberStatus`,
  `setMemberStatus`); bloklangan a'zo kanalni ko'ra olmaydi.
- **Eslatma:** haqiqiy WebSocket/ko'p-qurilma sinxron YO'Q (serversiz). "Real-time" = reaktiv
  Zustand store + localStorage (shu brauzerda darhol, saqlanadi). `markThreadRead` faqat
  o'qilmagan bor bo'lsa yangilaydi (cheksiz render'ni oldini olish).

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
