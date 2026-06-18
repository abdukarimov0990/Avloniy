# Avloniy

Online kurslar sotish platformasi — kurslar Instagram Reels uslubidagi qisqa videolar orqali
reklama qilinadi. **Mobile-first** (telefon ekraniga moslangan).

> Bu **demo** versiya — bazasiz ishlaydi. Barcha ma'lumotlar kodга o'rnatilgan (in-memory),
> shuning uchun hech qanday sozlash yoki ma'lumotlar bazasi kerak emas. Vercel'ga to'g'ridan-to'g'ri
> deploy qilinadi. Like / sotib olish / progress vizual ishlaydi, lekin server qayta yuklanганда
> dastlabki holatга qaytadi.

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

## Eslatma
Bu demo. Doimiy ma'lumotlar saqlash uchun `src/lib/demo/store.ts` ni real bazaга (masalan
Postgres + Prisma) ulash mumkin — funksiya imzolari o'zgarmaydi. `prisma/schema.prisma` to'liq
ma'lumotlar modeli sifatida saqlanган (kelajakда foydalanish uchun).
