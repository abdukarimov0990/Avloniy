import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createCourse } from "@/lib/demo/store";
import { courseSchema } from "@/lib/validations";

/** Yangi kurs yaratish (faqat sotuvchi) */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "SELLER") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = courseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ma'lumotlar noto'g'ri" },
      { status: 400 }
    );
  }

  const course = createCourse(session.userId, parsed.data);
  return NextResponse.json({ course }, { status: 201 });
}
