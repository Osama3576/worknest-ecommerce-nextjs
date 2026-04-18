"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireViewer } from "@/lib/auth";

export async function saveAddressAction(formData: FormData) {
  const viewer = await requireViewer();
  const setDefault = formData.get("setDefault") === "on";

  if (setDefault) {
    await prisma.address.updateMany({
      where: { userId: viewer.id },
      data: { isDefault: false },
    });
  }

  await prisma.address.create({
    data: {
      userId: viewer.id,
      label: String(formData.get("label") ?? "Address"),
      fullName: String(formData.get("fullName") ?? viewer.name),
      line1: String(formData.get("line1") ?? ""),
      line2: String(formData.get("line2") ?? ""),
      city: String(formData.get("city") ?? ""),
      state: String(formData.get("state") ?? ""),
      postalCode: String(formData.get("postalCode") ?? ""),
      country: String(formData.get("country") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      isDefault: setDefault,
    },
  });

  revalidatePath("/account/addresses");
}

export async function deleteAddressAction(formData: FormData) {
  const viewer = await requireViewer();
  const addressId = String(formData.get("addressId") ?? "");

  await prisma.address.deleteMany({
    where: {
      id: addressId,
      userId: viewer.id,
    },
  });

  revalidatePath("/account/addresses");
}

export async function toggleWishlistAction(formData: FormData) {
  const viewer = await requireViewer();
  const productId = String(formData.get("productId") ?? "");

  const existing = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId: viewer.id,
        productId,
      },
    },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
  } else {
    await prisma.wishlistItem.create({
      data: {
        userId: viewer.id,
        productId,
      },
    });
  }

  revalidatePath("/wishlist");
  revalidatePath("/account");
  revalidatePath("/collections");
}
