import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

export function isAdminEmail(email: string) {
  return env.adminEmails.includes(email.toLowerCase());
}

async function upsertViewer({
  email,
  name,
  clerkId,
  imageUrl,
}: {
  email: string;
  name: string;
  clerkId?: string | null;
  imageUrl?: string | null;
}) {
  const normalizedEmail = email.toLowerCase();
  const role = isAdminEmail(normalizedEmail) ? UserRole.ADMIN : UserRole.CUSTOMER;

  return prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {
      name,
      clerkId: clerkId ?? undefined,
      imageUrl: imageUrl ?? undefined,
      role,
    },
    create: {
      email: normalizedEmail,
      name,
      clerkId: clerkId ?? undefined,
      imageUrl: imageUrl ?? undefined,
      role,
    },
  });
}

async function syncClerkViewer(userId: string) {
  const existingViewer = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  const clerkUser = await currentUser().catch(() => null);
  const email = clerkUser?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? existingViewer?.email ?? `${userId}@clerk.local`;
  const name = clerkUser?.fullName ?? clerkUser?.firstName ?? existingViewer?.name ?? "WorkNest Customer";
  const imageUrl = clerkUser?.imageUrl ?? existingViewer?.imageUrl ?? null;
  const role = isAdminEmail(email) ? UserRole.ADMIN : UserRole.CUSTOMER;

  if (existingViewer) {
    return prisma.user.update({
      where: { id: existingViewer.id },
      data: {
        email,
        name,
        clerkId: userId,
        imageUrl,
        role,
      },
    });
  }

  const emailMatch = email.endsWith("@clerk.local")
    ? null
    : await prisma.user.findUnique({
        where: { email },
      });

  if (emailMatch) {
    return prisma.user.update({
      where: { id: emailMatch.id },
      data: {
        email,
        name,
        clerkId: userId,
        imageUrl,
        role,
      },
    });
  }

  return upsertViewer({
    email,
    name,
    clerkId: userId,
    imageUrl,
  });
}

export async function getViewer() {
  if (!env.clerkEnabled) {
    return null;
  }

  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    return syncClerkViewer(userId);
  } catch {
    return null;
  }
}

export async function requireViewer(options?: { admin?: boolean }) {
  const { userId } = await auth();

  if (!userId) {
    redirect(env.clerkSignInUrl);
  }

  const viewer = await syncClerkViewer(userId);

  if (options?.admin && viewer.role !== "ADMIN") {
    redirect("/");
  }

  return viewer;
}
