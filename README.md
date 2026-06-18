# Avloniy

Online kurslar sotish platformasi — kurslar Instagram Reels uslubidagi qisqa videolar orqali
reklama qilinadi. **Mobile-first** (telefon ekraniga moslangan).

> Bu **demo** versiya — bazasiz ishlaydi. Barcha ma'lumotlar brauzeringizning **localStorage**'ida
> saqlanadi, shuning uchun hech qanday baza yoki muhit sozlamasi kerak emas. Vercel'ga
> to'g'ridan-to'g'ri deploy qilinadi. Like / sotib olish / progress / yangi kurs — barchasi
> saqlanadi va sahifani yangilaganда ham yo'qolmaydi. (Tozalash: brauzer localStorage'ini o'chiring.)

## Texnologiyalar
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Zustand, Zod, lucide-react, recharts

## Lokal ishga tushirish
```bash
npm install
npm run dev
# http://localhost:3000
```

## Demo akkauntlar (parol: `parol123`)
| Rol | Email |
|-----|-------|
| Xaridor | `ali@misol.uz` |
| Sotuvchi | `aziz@misol.uz`, `dilnoza@misol.uz`, `sardor@misol.uz` |

Yangi akkaunt ham yaratishingiz mumkin (ro'yxatdan o'tish — vaqtinchalik saqlanadi).

## Vercel'ga deploy
Hech qanday muhit o'zgaruvchisi (env) **kerak emas**.
1. Loyihani GitHub'ga yuklang (yoki `vercel` CLI ishlating).
2. Vercel'да "New Project" → repozitoriyani tanlang → **Deploy**.
3. Tamom — Vercel Next.js'ni avtomatik aniqlaydi va quradi.

CLI orqali:
```bash
npm i -g vercel
vercel        # preview
vercel --prod # production
```

## Imkoniyatlar
- **Xaridor:** Reels lentasi (swipe, autoplay), like / izoh / ulashish / saqlash, kurs sahifasi,
  mock to'lov, "Mening kurslarim", dars progressi, kviz, sertifikat (PDF), streak 🔥, wishlist.
- **Sotuvchi:** onboarding, kurs/dars/reel yaratish, kvizlar, Instagram-uslubidagi profil,
  statistik dashboard (recharts grafiklar).

## Arxitektura
To'liq client-side: ma'lumot `src/lib/demo/` (statik seed + Zustand/localStorage store).
Server qatlami yo'q. Bir nechta foydalanuvchi o'rtasida real, doimiy saqlash kerak bo'lsa,
store amallarini (`src/lib/demo/use-demo.ts`) backend API'ga ulash mumkin.
`prisma/schema.prisma` to'liq ma'lumotlar modeli sifatida reference uchun saqlangan.
