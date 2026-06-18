import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getLesson, isPurchased, getLessonQuizzes, addQuiz } from "@/lib/demo/store";

/** Dars kvizlari (buyer uchun, to'g'ri javobsiz). Kirish: sotib olingan yoki preview. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Avval kiring" }, { status: 401 });
  }
  const { id: lessonId } = await params;

  const lesson = getLesson(lessonId);
  if (!lesson) {
    return NextResponse.json({ error: "Dars topilmadi" }, { status: 404 });
  }
  if (!isPurchased(session.userId, lesson.courseId) && !lesson.isFreePreview) {
    return NextResponse.json({ error: "Kurs sotib olinmagan" }, { status: 403 });
  }

  return NextResponse.json({ quizzes: getLessonQuizzes(lessonId) });
}

const createSchema = z.object({
  question: z.string().trim().min(3, "Savol kamida 3 ta harf"),
  options: z.array(z.string().trim().min(1)).min(2, "Kamida 2 ta variant").max(6),
  correctOptionIndex: z.number().int().min(0),
});

/** Kviz qo'shish (faqat kurs egasi sotuvchi) */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "SELLER") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }
  const { id: lessonId } = await params;

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Noto'g'ri ma'lumot" },
      { status: 400 }
    );
  }
  if (parsed.data.correctOptionIndex >= parsed.data.options.length) {
    return NextResponse.json({ error: "To'g'ri javob indeksi noto'g'ri" }, { status: 400 });
  }

  const quiz = addQuiz(session.userId, lessonId, parsed.data);
  if (!quiz) {
    return NextResponse.json({ error: "Dars topilmadi" }, { status: 404 });
  }
  return NextResponse.json({ quiz }, { status: 201 });
}
