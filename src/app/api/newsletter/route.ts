import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { newsletterSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email.toLowerCase() },
    update: {},
    create: { email: parsed.data.email.toLowerCase() },
  });

  return NextResponse.json({ message: "You are on the list. Expect new setup drops and bundle updates soon." });
}
