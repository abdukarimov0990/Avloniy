import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { registerUser, toPublicUser } from "@/lib/demo/store";
import { registerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Ma'lumotlar noto'g'ri";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const user = registerUser(parsed.data);
  if (!user) {
    return NextResponse.json(
      { error: "Bu email allaqachon ro'yxatdan o'tgan" },
      { status: 409 }
    );
  }

  await createSession({ userId: user.id, role: user.role });
  return NextResponse.json({ user: toPublicUser(user.id) }, { status: 201 });
}
