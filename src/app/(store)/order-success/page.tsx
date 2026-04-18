import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { prisma } from "@/lib/db";

export const metadata = buildMetadata({
  title: "Order success | WorkNest",
  description: "Your order has been placed successfully.",
  path: "/order-success",
});

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const orderId = typeof params.order === "string" ? params.order : "";
  const order = orderId
    ? await prisma.order.findFirst({ where: { OR: [{ id: orderId }, { orderNumber: orderId }] } })
    : null;

  return (
    <div className="surface-panel mx-auto max-w-3xl p-8 text-center sm:p-12">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/12 text-accent">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <p className="mt-6 text-xs uppercase tracking-[0.3em] text-muted">Order confirmed</p>
      <h1 className="mt-3 text-4xl font-semibold text-foreground">Thanks for shopping with WorkNest</h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted">
        {order
          ? `Your order ${order.orderNumber} has been received. You can track it from your account area and review order details anytime.`
          : "Your checkout completed successfully. You can track future orders from your account area."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/account/orders" className="inline-flex rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground">
          View order history
        </Link>
        <Link href="/collections" className="inline-flex rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground/80 transition hover:bg-panel/80">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
