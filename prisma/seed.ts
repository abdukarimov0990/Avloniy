/**
 * Demo ma'lumotlar. Ishga tushirish: `npm run db:seed`.
 * Diqqat: avval mavjud ma'lumotlarni tozalaydi (faqat dev uchun).
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const DEFAULT_VIDEO = "/videos/default.mp4";
const PASSWORD = "parol123";

async function main() {
  console.log("🧹 Eski ma'lumotlar tozalanmoqda...");
  // Bog'liqlik tartibida o'chiramiz
  await db.like.deleteMany();
  await db.comment.deleteMany();
  await db.purchase.deleteMany();
  await db.reel.deleteMany();
  await db.lesson.deleteMany();
  await db.course.deleteMany();
  await db.user.deleteMany();

  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  console.log("👤 Foydalanuvchilar yaratilmoqda...");

  // Demo xaridor
  const buyer = await db.user.create({
    data: {
      name: "Ali Valiyev",
      email: "ali@misol.uz",
      passwordHash,
      role: "BUYER",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
  });

  // Sotuvchilar
  const aziz = await db.user.create({
    data: {
      name: "Aziz Rahimov",
      email: "aziz@misol.uz",
      passwordHash,
      role: "SELLER",
      category: "Dasturlash",
      bio: "Full-stack dasturchi. 5 yillik tajriba. Sodda tilda o'rgataman.",
      avatar: "https://i.pravatar.cc/150?img=33",
    },
  });

  const dilnoza = await db.user.create({
    data: {
      name: "Dilnoza Karimova",
      email: "dilnoza@misol.uz",
      passwordHash,
      role: "SELLER",
      category: "Dizayn",
      bio: "UI/UX dizayner. Figma bo'yicha mutaxassis.",
      avatar: "https://i.pravatar.cc/150?img=45",
    },
  });

  const sardor = await db.user.create({
    data: {
      name: "Sardor Yusupov",
      email: "sardor@misol.uz",
      passwordHash,
      role: "SELLER",
      category: "Marketing",
      bio: "SMM va digital marketing bo'yicha amaliyotchi.",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
  });

  console.log("📚 Kurslar, darslar va reelslar yaratilmoqda...");

  const coursesData = [
    {
      seller: aziz,
      title: "Noldan Web Dasturlash",
      description:
        "HTML, CSS va JavaScript'ni noldan o'rganing. Har bir dars amaliyot bilan. Kurs oxirida o'z saytingizni yarata olasiz.",
      price: 199000,
      category: "Dasturlash",
      cover: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600",
      caption: "Noldan web dasturchi bo'l 🚀 Birinchi saytingni bugun yoz!",
      hashtags: ["webdev", "dasturlash", "frontend"],
      lessons: [
        "Kirish: web qanday ishlaydi",
        "HTML asoslari",
        "CSS bilan dizayn",
        "JavaScript bilan jonlantirish",
      ],
    },
    {
      seller: aziz,
      title: "React va Next.js Pro",
      description:
        "Zamonaviy frontend: React, hooks, Next.js App Router va real loyihalar. Ish topishga tayyor bo'ling.",
      price: 299000,
      category: "Dasturlash",
      cover: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600",
      caption: "React'ni chuqur o'rgan va ish top 💼",
      hashtags: ["react", "nextjs", "dasturlash"],
      lessons: ["React asoslari", "Hooks", "Next.js routing", "Loyiha: blog"],
    },
    {
      seller: dilnoza,
      title: "Figma'da UI/UX Dizayn",
      description:
        "Mobil va web ilovalar uchun chiroyli interfeys yarating. Figma'ni noldan professional darajagacha.",
      price: 149000,
      category: "Dizayn",
      cover: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600",
      caption: "Dizaynni noldan o'rgan 🎨 Birinchi ilovangni loyihalashtir!",
      hashtags: ["dizayn", "figma", "uiux"],
      lessons: ["Figma interfeysi", "Ranglar va shriftlar", "Komponentlar", "Prototip"],
    },
    {
      seller: sardor,
      title: "Instagram Marketing 2026",
      description:
        "Instagram orqali mahsulot soting. Reels, targetlangan reklama va kontent strategiyasi.",
      price: 99000,
      category: "Marketing",
      cover: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600",
      caption: "Instagram'da soting 📈 Birinchi mijozingni jalb qil!",
      hashtags: ["marketing", "instagram", "smm"],
      lessons: ["Profil sozlash", "Kontent reja", "Reels sirlari", "Reklama"],
    },
  ];

  const reels: { id: string }[] = [];

  for (const c of coursesData) {
    const course = await db.course.create({
      data: {
        sellerId: c.seller.id,
        title: c.title,
        description: c.description,
        price: c.price,
        category: c.category,
        coverImage: c.cover,
        hashtags: c.hashtags,
        viewsCount: Math.floor(200 + c.price / 1000),
        salesCount: Math.floor(c.price / 20000),
        lessons: {
          create: c.lessons.map((title, i) => ({
            title,
            order: i + 1,
            content: "Dars materiali tez orada qo'shiladi.",
            videoUrl: DEFAULT_VIDEO,
            isFreePreview: i === 0, // birinchi dars — bepul preview
          })),
        },
      },
      include: { lessons: { orderBy: { order: "asc" } } },
    });

    // Birinchi darsга namuna kviz
    await db.quiz.create({
      data: {
        lessonId: course.lessons[0].id,
        question: `"${c.title}" kursida nima asosiy o'rgatiladi?`,
        options: ["Amaliy ko'nikma", "Faqat nazariya", "Hech narsa", "Bilmadim"],
        correctOptionIndex: 0,
      },
    });

    const reel = await db.reel.create({
      data: {
        sellerId: c.seller.id,
        courseId: course.id,
        videoUrl: DEFAULT_VIDEO,
        caption: c.caption,
        likesCount: Math.floor(50 + c.price / 5000),
        viewsCount: Math.floor(500 + c.price / 500),
      },
    });
    reels.push(reel);
  }

  console.log("💬 Like va izohlar qo'shilmoqda...");

  // Demo xaridor birinchi reel'ni like qiladi
  await db.like.create({ data: { userId: buyer.id, reelId: reels[0].id } });

  await db.comment.createMany({
    data: [
      { userId: buyer.id, reelId: reels[0].id, text: "Juda zo'r kurs ekan! 🔥" },
      { userId: buyer.id, reelId: reels[2].id, text: "Bu menga kerak edi, rahmat!" },
    ],
  });

  console.log("🔖 Demo saqlangan reel va istaklar...");
  // Demo xaridor 2-reelni saqlaydi
  await db.savedReel.create({ data: { userId: buyer.id, reelId: reels[1].id } });
  // Va React kursini istaklar ro'yxatiga qo'shadi (2-kurs)
  const reactCourse = await db.course.findFirst({
    where: { title: "React va Next.js Pro" },
  });
  if (reactCourse) {
    await db.wishlist.create({
      data: { userId: buyer.id, courseId: reactCourse.id },
    });
  }

  console.log("✅ Seed tugadi.");
  console.log(`   Login: ali@misol.uz / ${PASSWORD} (Xaridor)`);
  console.log(`   Login: aziz@misol.uz / ${PASSWORD} (Sotuvchi)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
