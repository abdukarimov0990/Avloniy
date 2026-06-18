import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { findUserByEmail, toPublicUser } from "@/lib/demo/store";
import { loginSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Ma'lumotlar noto'g'ri";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { email, password, role } = parsed.data;
  const user = findUserByEmail(email);

  // Xavfsizlik uchun "user yo'q" va "parol xato" bir xil javob beradi
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Email yoki parol noto'g'ri" }, { status: 401 });
  }

  if (user.role !== role) {
    const correct = user.role === "BUYER" ? "Xaridor" : "Sotuvchi";
    return NextResponse.json(
      { error: `Bu akkaunt "${correct}" sifatida ro'yxatdan o'tgan` },
      { status: 403 }
    );
  }

  await createSession({ userId: user.id, role: user.role });
  return NextResponse.json({ user: toPublicUser(user.id) });
}
