import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getReelComments, addComment } from "@/lib/demo/store";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: reelId } = await params;
  const comments = await getReelComments(reelId);
  return NextResponse.json({ comments });
}

const commentSchema = z.object({
  text: z.string().trim().min(1, "Izoh bo'sh bo'lmasin").max(500),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Avval kiring" }, { status: 401 });
  }
  const { id: reelId } = await params;

  const body = await req.json().catch(() => null);
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Noto'g'ri izoh" },
      { status: 400 }
    );
  }

  const comment = addComment(session.userId, reelId, parsed.data.text);
  return NextResponse.json({ comment }, { status: 201 });
}
