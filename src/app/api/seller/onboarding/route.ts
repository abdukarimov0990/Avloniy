import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { setOnboarding, toPublicUser } from "@/lib/demo/store";
import { onboardingSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "SELLER") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ma'lumotlar noto'g'ri" },
      { status: 400 }
    );
  }

  setOnboarding(session.userId, parsed.data.category, parsed.data.bio || null);
  return NextResponse.json({ user: toPublicUser(session.userId) });
}
