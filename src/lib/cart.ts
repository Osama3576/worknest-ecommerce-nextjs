import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site";

export type CartCookieItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

export const CART_COOKIE_KEY = "worknest-cart";
export const COUPON_COOKIE_KEY = "worknest-coupon";

export async function getCartCookieItems() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CART_COOKIE_KEY)?.value;

  if (!raw) {
    return [] as CartCookieItem[];
  }

  try {
    const parsed = JSON.parse(raw) as CartCookieItem[];
    return parsed.filter((item) => item.productId && item.variantId && item.quantity > 0);
  } catch {
    return [] as CartCookieItem[];
  }
}

export async function getActiveCouponCode() {
  const cookieStore = await cookies();
  return cookieStore.get(COUPON_COOKIE_KEY)?.value?.toUpperCase() ?? "";
}

export async function setCartCookie(items: CartCookieItem[]) {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE_KEY, JSON.stringify(items), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function setCouponCookie(code: string) {
  const cookieStore = await cookies();
  if (!code) {
    cookieStore.delete(COUPON_COOKIE_KEY);
    return;
  }

  cookieStore.set(COUPON_COOKIE_KEY, code.toUpperCase(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function clearCartCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE_KEY);
  cookieStore.delete(COUPON_COOKIE_KEY);
}

export async function getCartSnapshot() {
  const cartItems = await getCartCookieItems();
  const couponCode = await getActiveCouponCode();

  if (cartItems.length === 0) {
    return {
      items: [],
      subtotal: 0,
      discountAmount: 0,
      shippingAmount: 0,
      total: 0,
      freeShippingRemaining: siteConfig.shippingThreshold,
      coupon: null,
    };
  }

  const variantIds = cartItems.map((item) => item.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: {
      product: {
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
        },
      },
    },
  });

  const items = cartItems
    .map((item) => {
      const variant = variants.find((entry) => entry.id === item.variantId);
      if (!variant) return null;

      const unitPrice = variant.price ?? variant.product.price;
      return {
        id: `${item.productId}:${item.variantId}`,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice,
        totalPrice: unitPrice * item.quantity,
        variantLabel: `${variant.name}: ${variant.value}`,
        product: variant.product,
        image: variant.product.images[0]?.url ?? "/og-image.svg",
      };
    })
    .filter(Boolean);

  const subtotal = items.reduce((sum, item) => sum + item!.totalPrice, 0);
  const coupon = couponCode
    ? await prisma.coupon.findFirst({
        where: {
          code: couponCode,
          active: true,
          OR: [{ minSubtotal: null }, { minSubtotal: { lte: subtotal } }],
        },
      })
    : null;

  let discountAmount = 0;
  if (coupon) {
    discountAmount = coupon.type === "PERCENT" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
  }

  const shippingAmount = subtotal >= siteConfig.shippingThreshold || subtotal === 0 ? 0 : 1200;
  const total = Math.max(subtotal - discountAmount, 0) + shippingAmount;

  return {
    items: items as NonNullable<typeof items[number]>[],
    subtotal,
    discountAmount,
    shippingAmount,
    total,
    freeShippingRemaining: Math.max(siteConfig.shippingThreshold - subtotal, 0),
    coupon,
  };
}
