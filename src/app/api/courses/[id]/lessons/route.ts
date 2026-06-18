import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { addLesson } from "@/lib/demo/store";
import { lessonSchema } from "@/lib/validations";

/** Kursga dars qo'shish (faqat kurs egasi) */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "SELLER") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }
  const { id: courseId } = await params;

  const body = await req.json().catch(() => null);
  const parsed = lessonSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ma'lumotlar noto'g'ri" },
      { status: 400 }
    );
  }

  const result = addLesson(session.userId, courseId, parsed.data);
  if (!result) {
    return NextResponse.json({ error: "Kurs topilmadi" }, { status: 404 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
