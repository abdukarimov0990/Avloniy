import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getLesson, isPurchased, markLessonProgress } from "@/lib/demo/store";

const schema = z.object({
  watchedSeconds: z.number().int().min(0).optional(),
  isCompleted: z.boolean().optional(),
});

export async function POST(
  req: Request,
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

  // Kirish huquqi: kurs sotib olingan yoki dars bepul preview
  if (!isPurchased(session.userId, lesson.courseId) && !lesson.isFreePreview) {
    return NextResponse.json({ error: "Kurs sotib olinmagan" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Noto'g'ri ma'lumot" }, { status: 400 });
  }

  const result = markLessonProgress(
    session.userId,
    lessonId,
    lesson.courseId,
    parsed.data
  );
  return NextResponse.json(result);
}
