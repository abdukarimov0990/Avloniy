import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getFeedReels, createReel } from "@/lib/demo/store";
import { reelSchema } from "@/lib/validations";

export async function GET() {
  const session = await getSession();
  const reels = await getFeedReels(session?.userId);
  return NextResponse.json({ reels });
}

/** Kursni reklama qiluvchi reel yaratish (faqat kurs egasi) */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "SELLER") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = reelSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ma'lumotlar noto'g'ri" },
      { status: 400 }
    );
  }

  const reel = createReel(session.userId, parsed.data);
  if (!reel) {
    return NextResponse.json({ error: "Kurs topilmadi" }, { status: 404 });
  }
  return NextResponse.json({ reel }, { status: 201 });
}
