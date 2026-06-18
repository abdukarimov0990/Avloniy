import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { toggleLike } from "@/lib/demo/store";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Avval kiring" }, { status: 401 });
  }
  const { id: reelId } = await params;
  return NextResponse.json(toggleLike(session.userId, reelId));
}
