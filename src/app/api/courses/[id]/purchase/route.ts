import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { purchaseCourse } from "@/lib/demo/store";

/** Mock to'lov — Purchase yozuvini yaratadi va salesCount'ni oshiradi. */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Avval kiring" }, { status: 401 });
  }
  if (session.role !== "BUYER") {
    return NextResponse.json({ error: "Faqat xaridorlar sotib oladi" }, { status: 403 });
  }

  const { id: courseId } = await params;
  const result = purchaseCourse(session.userId, courseId);

  if (result.notFound) {
    return NextResponse.json({ error: "Kurs topilmadi" }, { status: 404 });
  }
  if (result.alreadyOwned) {
    return NextResponse.json({ alreadyOwned: true });
  }
  return NextResponse.json({ ok: true });
}
