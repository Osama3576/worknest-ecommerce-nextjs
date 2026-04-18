"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCartCookieItems, setCartCookie, setCouponCookie } from "@/lib/cart";

export async function addToCartAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const variantId = String(formData.get("variantId") ?? "");
  const quantity = Math.max(Number(formData.get("quantity") ?? 1), 1);

  const variant = await prisma.productVariant.findFirst({
    where: { id: variantId, productId },
  });

  if (!variant) {
    redirect("/cart");
  }

  const items = await getCartCookieItems();
  const existing = items.find((item) => item.variantId === variantId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ productId, variantId, quantity });
  }

  await setCartCookie(items);
  revalidatePath("/cart");
  redirect("/cart");
}

export async function updateCartItemAction(formData: FormData) {
  const variantId = String(formData.get("variantId") ?? "");
  const quantity = Math.max(Number(formData.get("quantity") ?? 1), 1);

  const items = await getCartCookieItems();
  const nextItems = items.map((item) =>
    item.variantId === variantId ? { ...item, quantity } : item,
  );

  await setCartCookie(nextItems);
  revalidatePath("/cart");
}

export async function removeCartItemAction(formData: FormData) {
  const variantId = String(formData.get("variantId") ?? "");
  const items = await getCartCookieItems();
  await setCartCookie(items.filter((item) => item.variantId !== variantId));
  revalidatePath("/cart");
}

export async function applyCouponAction(formData: FormData) {
  const code = String(formData.get("code") ?? "").toUpperCase().trim();
  await setCouponCookie(code);
  revalidatePath("/cart");
  revalidatePath("/checkout");
}
