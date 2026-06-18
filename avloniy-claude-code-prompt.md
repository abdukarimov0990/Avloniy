# Avloniy — Claude Code uchun to'liq loyiha prompti

> Quyidagi matnni to'liq nusxalab Claude Code'ga bering. Ingliz tilidagi texnik atamalar atayin saqlangan — kod va kutubxonalar shu nomlar bilan ishlaydi.

---

## 1. Loyiha haqida umumiy ma'lumot

**Loyiha nomi:** Avloniy

**Maqsad:** Online kurslar sotish platformasi. Kurslar Instagram'ga o'xshash qisqa *reels* (vertikal video) formatida reklama qilinadi. Foydalanuvchi reelslarni ko'rib, yoqtirib, izoh qoldirib, video oxirida chiqadigan tugma orqali kursni sotib oladi.

**Eng muhim tamoyil:** Mobile-first. Butun ilova mobil telefon ekranida (taxminan 390px kenglik) ideal ko'rinishi va his etilishi kerak — xuddi Instagram ilovasi kabi. Desktop'da ham buziqmasdan ko'rinsin, lekin asosiy dizayn mobil uchun.

**Tilni:** Interfeys o'zbek tilida bo'lsin (matnlar, tugmalar, xabarlar). Kodda o'zgaruvchi/funksiya nomlari ingliz tilida.

---

## 2. Foydalanuvchi rollari (ikki xil login)

Ro'yxatdan o'tish va kirishda foydalanuvchi ikki rol orasidan tanlaydi:

1. **Buyer (xaridor)** — kurslarni ko'radi va sotib oladi
2. **Seller (sotuvchi/o'qituvchi)** — kurslar yaratadi va sotadi

Bir akkaunt faqat bitta rolga ega. Login sahifasida rol tanlash aniq va sodda bo'lsin (masalan ikkita katta tugma: "Xaridor sifatida" / "Sotuvchi sifatida").

---

## 3. BUYER rolining imkoniyatlari

### 3.1 Reels lentasi (asosiy ekran)
- Instagram Reels uslubida vertikal, to'liq ekranli videolar lentasi.
- Yuqoriga/pastga **swipe** (yoki scroll) qilib keyingi videoga o'tish.
- Har bir video avtomatik o'ynaydi, scroll qilinganda to'xtaydi.
- Har bir reel ustida quyidagilar bo'lsin:
  - **Like** tugmasi (yurakcha) + like soni
  - **Comment** tugmasi → izohlar paneli ochiladi (yozish, ko'rish)
  - **Share** tugmasi (havola nusxalash)
  - Sotuvchining nomi va avatari
  - Kurs nomi va qisqa tavsifi
- **Video oxirida yoki ustida "Kursni sotib olish" tugmasi chiqsin** — narxi bilan birga (masalan: "Sotib olish — 199 000 so'm").

### 3.2 Kurs sahifasi
- "Sotib olish" bosilganda kurs to'liq sahifasi ochiladi: tavsif, darslar ro'yxati, narx, sotuvchi, sharhlar.
- To'lov tugmasi (hozircha **mock/soxta to'lov** — haqiqiy to'lov shlyuzi keyin ulanadi, lekin "Sotib olindi" holatini saqlasin).

### 3.3 "Mening kurslarim"
- Sotib olingan barcha kurslar shu bo'limda chiqsin.
- Har bir kursni bosib, darslarni (videolar/materiallar) ko'rish mumkin.

### 3.4 Profil
- Avatar, ism, sotib olingan kurslar soni, sozlamalar.

---

## 4. SELLER rolining imkoniyatlari

### 4.1 Onboarding (birinchi kirishda)
Sotuvchi birinchi marta kirganda quyidagilar so'ralsin:
- **Soha/yo'nalish** tanlash (masalan: Dasturlash, Dizayn, Marketing, Biznes, Til o'rganish va h.k.)
- U asosan nima haqida yozadi/o'rgatadi — qisqa bio/ixtisos.

### 4.2 Kurs yaratish
- Yangi pulli kurs yaratish: nom, tavsif, narx, kategoriya, muqova rasm.
- Kurs ichiga darslar qo'shish (video + matn/material).
- Kursni reklama qilish uchun **reels (qisqa video)** joylash — bu reels buyerlarning lentasida chiqadi va kursga bog'langan bo'ladi.

### 4.3 Professional Dashboard
Sotuvchining boshqaruv paneli quyidagi statistikalarni ko'rsatsin:
- Har bir kursni **nechta odam ko'rgan** (views)
- **Nechta odam sotib olgan** (sales count)
- **Qancha foyda olgan** (total revenue / profit)
- Har bir kursning narxi
- Reellarning ko'rish/like/comment statistikasi
- Umumiy ko'rsatkichlar (jami daromad, jami sotuvlar, eng mashhur kurs)
- Grafiklar bilan vizual ko'rinish (masalan oddiy bar/line chart).

### 4.4 Infratuzilma
Sotuvchi profili va lentasi xuddi Instagram'dagidek bo'lsin — postlar (reels) gridda, statistikalar, follower kabi tuzilma.

---

## 5. Dizayn talablari

- **Sodda, ko'zni og'ritmaydigan, lekin zamonaviy va chiroyli.**
- **Asosiy ranglar:**
  - **Light black** (asosiy fon/matn uchun — masalan `#1A1A1A` yoki `#212121`)
  - **Orange** (urg'u/aksent rang, tugmalar, faol holatlar — masalan `#FF7A00` yoki `#FF6B35`)
  - Neytral kulrang va oq tonlar bilan to'ldirilsin.
- Toza tipografika, yetarli bo'sh joy (whitespace), yumaloq burchaklar.
- Tugmalar aniq, animatsiyalar yengil va silliq (Instagram'dagi kabi).
- Iconlar uchun **lucide-react** ishlatilsin.
- Dark fon ustida orange aksent — issiq va premium tuyg'u bersin.

---

## 6. Texnik stack (tavsiya)

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **UI komponentlar:** shadcn/ui + lucide-react ikonkalari
- **State:** React hooks / Zustand (oddiy global state uchun)
- **Backend:** Next.js API routes (yoki alohida xohlasangizm Node/Express)
- **Database:** PostgreSQL + Prisma ORM (boshlash uchun SQLite ham bo'ladi)
- **Auth:** rolega asoslangan (buyer/seller) — NextAuth yoki oddiy JWT
- **Video:** boshlash uchun lokal/mock video URL'lar yoki bepul saqlash xizmati; arxitektura keyin real video xizmatiga (masalan Mux/Cloudinary) ulanadigan qilib tuzilsin
- **Charts:** recharts (dashboard grafiklari uchun)

> Agar bu stack mos kelmasa, eng ratsional muqobilini taklif qiling, lekin oldin men bilan kelishing.

---

## 7. Ma'lumotlar modeli (Database schema)

Quyidagi asosiy jadvallar/modellar bo'lsin:

- **User**: id, name, email, passwordHash, role (`buyer` | `seller`), avatar, bio, category (seller uchun), createdAt
- **Course**: id, sellerId, title, description, price, category, coverImage, viewsCount, salesCount, createdAt
- **Lesson**: id, courseId, title, videoUrl, content, order
- **Reel**: id, sellerId, courseId, videoUrl, caption, likesCount, viewsCount, createdAt
- **Like**: id, userId, reelId
- **Comment**: id, userId, reelId, text, createdAt
- **Purchase**: id, buyerId, courseId, amountPaid, createdAt

Statistikalar (dashboard) shu jadvallardan hisoblansin.

---

## 8. Ekranlar / sahifalar ro'yxati

**Umumiy:**
- Splash/landing → Login/Register (rol tanlash bilan)

**Buyer:**
- Reels lentasi (asosiy)
- Kurs detali sahifasi
- To'lov (mock)
- Mening kurslarim
- Kurs ichi (darslar)
- Profil

**Seller:**
- Onboarding (soha tanlash)
- Dashboard (statistikalar + grafiklar)
- Kurs yaratish / tahrirlash
- Reels yaratish / yuklash
- Sotuvchi profili (Instagram uslubidagi grid)

---

## 9. Ishlash bosqichlari (Claude Code uchun ko'rsatma)

Iltimos, quyidagi tartibda ishla:

1. Loyiha skeletini va stackni o'rnat, dizayn tizimini (ranglar, tipografika, asosiy komponentlar) sozla.
2. Auth + ikki rolli login/register'ni qil.
3. Database schema va seed (test) ma'lumotlarni yarat.
4. Buyer tomonini qur: Reels lentasi → like/comment/share → kurs sahifasi → mock to'lov → "Mening kurslarim".
5. Seller tomonini qur: onboarding → kurs yaratish → reels yuklash → dashboard statistikalar.
6. Sayqallash: animatsiyalar, responsive tekshiruv, mobil ko'rinish.

**Muhim qoidalar:**
- Har bir katta bosqichdan keyin nima qilganingni qisqa tushuntir va davom etishdan oldin to'xta, men ko'rib chiqaman.
- Mock ma'lumot bilan boshlanadigan, lekin keyin real backend/to'lov/video xizmatiga osongina ulanadigan toza arxitektura tuz.
- Kodni modulli, o'qishga oson, izohlangan qilib yoz.
- Agar biror talab noaniq bo'lsa, taxmin qilib ketma — mendan so'ra.

---

## 10. Birinchi qadam

Avval menga **loyiha tuzilmasi (folder structure), tanlangan stack va birinchi bosqich rejasini** ko'rsat. Men tasdiqlaganimdan keyin koding boshla.
