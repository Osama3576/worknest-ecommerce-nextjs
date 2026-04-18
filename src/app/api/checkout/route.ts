import { NextResponse } from "next/server";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { getViewer } from "@/lib/auth";
import { clearCartCookies, getCartSnapshot } from "@/lib/cart";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validators";

function createOrderNumber() {
  return `WN-${Date.now().toString().slice(-8)}`;
}

async function maybePersistAddress(userId: string, data: {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}) {
  const existing = await prisma.address.findFirst({
    where: {
      userId,
      line1: data.line1,
      postalCode: data.postalCode,
      city: data.city,
    },
  });

  if (!existing) {
    const count = await prisma.address.count({ where: { userId } });
    await prisma.address.create({
      data: {
        userId,
        label: count === 0 ? "Default" : `Address ${count + 1}`,
        fullName: data.fullName,
        line1: data.line1,
        line2: data.line2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone,
        isDefault: count === 0,
      },
    });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Please complete the shipping form correctly." }, { status: 400 });
  }

  const cart = await getCartSnapshot();
  if (cart.items.length === 0) {
    return NextResponse.json({ message: "Your cart is empty." }, { status: 400 });
  }

  const viewer = await getViewer();
  const data = parsed.data;
  const orderPayload = {
    orderNumber: createOrderNumber(),
    subtotal: cart.subtotal,
    discountAmount: cart.discountAmount,
    shippingAmount: cart.shippingAmount,
    total: cart.total,
    email: data.email,
    fullName: data.fullName,
    phone: data.phone,
    addressLine1: data.line1,
    addressLine2: data.line2,
    city: data.city,
    state: data.state,
    postalCode: data.postalCode,
    country: data.country,
    note: data.note,
    userId: viewer?.id,
  };

  if (viewer) {
    await maybePersistAddress(viewer.id, data);
  }

  if (!env.stripeEnabled) {
    const order = await prisma.order.create({
      data: {
        ...orderPayload,
        status: OrderStatus.PROCESSING,
        paymentStatus: PaymentStatus.PAID,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            variantLabel: item.variantLabel,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
    });

    await clearCartCookies();
    return NextResponse.json({ url: `${env.appUrl}/order-success?order=${order.orderNumber}&demo=1` });
  }

  const order = await prisma.order.create({
    data: {
      ...orderPayload,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          variantLabel: item.variantLabel,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
      },
    },
  });

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ message: "Stripe is not configured." }, { status: 500 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: data.email,
    line_items: cart.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: item.unitPrice,
        product_data: {
          name: item.product.name,
          description: item.variantLabel,
          images: item.image.startsWith("http") ? [item.image] : [],
        },
      },
    })),
    metadata: {
      orderId: order.id,
      orderNumber: order.orderNumber,
    },
    success_url: `${env.appUrl}/order-success?order=${order.orderNumber}`,
    cancel_url: `${env.appUrl}/checkout`,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeCheckoutSessionId: session.id },
  });

  await clearCartCookies();
  return NextResponse.json({ url: session.url });
}
