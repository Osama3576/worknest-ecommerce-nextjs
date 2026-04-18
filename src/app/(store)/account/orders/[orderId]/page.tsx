import Image from "next/image";
import { notFound } from "next/navigation";
import { requireViewer } from "@/lib/auth";
import { getOrderById } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Order details | WorkNest",
  description: "Detailed order breakdown with fulfillment and shipping information.",
});

export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const viewer = await requireViewer();
  const { orderId } = await params;
  const order = await getOrderById(orderId, viewer.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="surface-panel p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-muted">Order detail</p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">{order.orderNumber}</h1>
        <p className="mt-3 text-sm leading-6 text-muted">Placed on {formatDate(order.createdAt)} · {order.status} · {order.paymentStatus}</p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="surface-panel p-6">
          <h2 className="text-xl font-semibold text-foreground">Items</h2>
          <div className="mt-6 space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="grid gap-4 rounded-[24px] border border-border/70 bg-panel/60 p-4 md:grid-cols-[90px_1fr_auto] md:items-center">
                <div className="relative aspect-square overflow-hidden rounded-[18px] bg-panel">
                  <Image src={item.product.images[0]?.url ?? "/og-image.svg"} alt={item.product.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.product.name}</p>
                  <p className="mt-1 text-sm text-muted">{item.variantLabel ?? "Default variant"}</p>
                  <p className="mt-1 text-sm text-muted">Quantity {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-foreground">{formatCurrency(item.totalPrice)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-panel p-6">
            <h2 className="text-xl font-semibold text-foreground">Summary</h2>
            <div className="mt-6 space-y-3 text-sm text-muted">
              <div className="flex justify-between"><span>Subtotal</span><span className="text-foreground">{formatCurrency(order.subtotal)}</span></div>
              <div className="flex justify-between"><span>Discount</span><span className="text-foreground">-{formatCurrency(order.discountAmount)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="text-foreground">{order.shippingAmount === 0 ? "Free" : formatCurrency(order.shippingAmount)}</span></div>
              <div className="border-t border-border/70 pt-3 text-base font-semibold text-foreground"><div className="flex justify-between"><span>Total</span><span>{formatCurrency(order.total)}</span></div></div>
            </div>
          </div>
          <div className="surface-panel p-6">
            <h2 className="text-xl font-semibold text-foreground">Shipping destination</h2>
            <p className="mt-4 text-sm leading-6 text-muted">
              {order.fullName}<br />
              {order.addressLine1}
              {order.addressLine2 ? <><br />{order.addressLine2}</> : null}
              <br />
              {order.city}, {order.state} {order.postalCode}
              <br />
              {order.country}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
