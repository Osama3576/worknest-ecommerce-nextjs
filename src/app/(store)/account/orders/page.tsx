import Link from "next/link";
import { requireViewer } from "@/lib/auth";
import { getOrdersForUser } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Order history | WorkNest",
  description: "View order history, payment state, and fulfillment status.",
  path: "/account/orders",
});

export default async function OrdersPage() {
  const viewer = await requireViewer();
  const orders = await getOrdersForUser(viewer.id);

  return (
    <div className="space-y-6">
      <section className="surface-panel p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-muted">Order history</p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">Track every purchase and fulfillment stage</h1>
      </section>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order.id} href={`/account/orders/${order.id}`} className="surface-panel block p-6 transition hover:bg-panel/70">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">{order.orderNumber}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Status</p>
                  <p className="mt-1 text-accent">{order.status}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Payment</p>
                  <p className="mt-1 text-foreground">{order.paymentStatus}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Total</p>
                  <p className="mt-1 text-foreground">{formatCurrency(order.total)}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
