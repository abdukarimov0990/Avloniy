import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { toggleWishlist } from "@/lib/demo/store";

/** Kursni istaklar ro'yxatiga qo'shish/olib tashlash (toggle) */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Avval kiring" }, { status: 401 });
  }
  const { id: courseId } = await params;
  return NextResponse.json(toggleWishlist(session.userId, courseId));
}
