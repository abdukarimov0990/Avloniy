import { NextResponse } from "next/server";
import { incrementReelView } from "@/lib/demo/store";

/** Reel ko'rishlar sonini oshiradi (ko'rilganda chaqiriladi) */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: reelId } = await params;
  incrementReelView(reelId);
  return NextResponse.json({ ok: true });
}
