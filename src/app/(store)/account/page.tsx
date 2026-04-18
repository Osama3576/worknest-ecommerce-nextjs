import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireViewer } from "@/lib/auth";
import { getOrdersForUser, getWishlistForUser } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Account | WorkNest",
  description: "Account overview with orders, addresses, and wishlist insights.",
  path: "/account",
});

export default async function AccountOverviewPage() {
  const viewer = await requireViewer();
  const [orders, wishlist, addresses] = await Promise.all([
    getOrdersForUser(viewer.id),
    getWishlistForUser(viewer.id),
    prisma.address.findMany({ where: { userId: viewer.id }, orderBy: { isDefault: "desc" } }),
  ]);

  const spent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-6">
      <section className="surface-panel p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-muted">Account overview</p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">Welcome back, {viewer.name.split(" ")[0]}</h1>
        <p className="mt-3 text-sm leading-6 text-muted">Protected account data, saved addresses, order history, and wishlist items are all backed by Prisma and SQLite.</p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {[
          { label: "Total spent", value: formatCurrency(spent) },
          { label: "Orders", value: String(orders.length) },
          { label: "Wishlist items", value: String(wishlist.length) },
        ].map((item) => (
          <div key={item.label} className="surface-panel p-5">
            <p className="text-sm text-muted">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Recent orders</h2>
            <Link href="/account/orders" className="text-sm text-accent">View all</Link>
          </div>
          <div className="mt-6 space-y-4">
            {orders.slice(0, 3).map((order) => (
              <Link key={order.id} href={`/account/orders/${order.id}`} className="block rounded-[24px] border border-border/70 bg-panel/60 p-4 transition hover:bg-panel/70">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{order.orderNumber}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{formatCurrency(order.total)}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-accent">{order.status}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="surface-panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Saved addresses</h2>
            <Link href="/account/addresses" className="text-sm text-accent">Manage</Link>
          </div>
          <div className="mt-6 space-y-4">
            {addresses.slice(0, 2).map((address) => (
              <div key={address.id} className="rounded-[24px] border border-border/70 bg-panel/60 p-4 text-sm text-muted">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{address.label}</p>
                  {address.isDefault ? <span className="text-xs uppercase tracking-[0.2em] text-accent">Default</span> : null}
                </div>
                <p className="mt-3 leading-6">
                  {address.fullName}<br />
                  {address.line1}
                  {address.line2 ? <><br />{address.line2}</> : null}
                  <br />
                  {address.city}, {address.state} {address.postalCode}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
