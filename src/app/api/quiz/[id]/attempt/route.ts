import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { recordQuizAttempt } from "@/lib/demo/store";

const schema = z.object({
  selectedIndex: z.number().int().min(0),
});

/** Buyer kviz javobini yuboradi */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Avval kiring" }, { status: 401 });
  }
  const { id: quizId } = await params;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Noto'g'ri javob" }, { status: 400 });
  }

  const result = recordQuizAttempt(session.userId, quizId, parsed.data.selectedIndex);
  if (!result) {
    return NextResponse.json({ error: "Kviz topilmadi" }, { status: 404 });
  }
  return NextResponse.json(result);
}
