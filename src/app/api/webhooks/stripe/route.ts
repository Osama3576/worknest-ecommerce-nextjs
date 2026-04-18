import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  if (!env.stripeEnabled || !env.stripeWebhookSecret) {
    return NextResponse.json({ received: true });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ message: "Stripe is not configured." }, { status: 500 });
  }

  const payload = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ message: "Missing stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, env.stripeWebhookSecret);
  } catch (error) {
    return NextResponse.json({ message: "Invalid webhook signature.", error }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.PROCESSING,
          paymentStatus: PaymentStatus.PAID,
          stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
        },
      });
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await prisma.order.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: {
        paymentStatus: PaymentStatus.FAILED,
        status: OrderStatus.CANCELLED,
      },
    });
  }

  return NextResponse.json({ received: true });
}
