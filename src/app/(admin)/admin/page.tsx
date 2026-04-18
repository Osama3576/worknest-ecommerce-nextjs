import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { DashboardStatCard } from "@/components/admin/dashboard-stat-card";
import { getDashboardMetrics } from "@/lib/queries";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();

  return (
    <AdminShell
      title="Sales overview"
      description="A realistic dashboard view with revenue, order health, inventory signals, and recent customer activity."
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard label="Revenue" value={metrics.revenue} type="currency" hint="All-time demo revenue" />
        <DashboardStatCard label="Paid orders" value={metrics.paidOrders} type="number" hint="Successful payments" />
        <DashboardStatCard label="Products" value={metrics.totalProducts} type="number" hint="Across all categories" />
        <DashboardStatCard label="Customers" value={metrics.totalCustomers} type="number" hint="Seeded and synced users" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] border border-border/70 bg-card/90 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-accent">Manage orders</Link>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-muted">
              <thead>
                <tr className="border-b border-border/70 text-xs uppercase tracking-[0.22em]">
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {metrics.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/60 last:border-none">
                    <td className="py-4 text-foreground">{order.orderNumber}</td>
                    <td className="py-4">{formatDate(order.createdAt)}</td>
                    <td className="py-4 text-accent">{order.status}</td>
                    <td className="py-4 text-right text-foreground">{formatCurrency(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[32px] border border-border/70 bg-card/90 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Low stock watch</h2>
            <Link href="/admin/inventory" className="text-sm text-accent">View inventory</Link>
          </div>
          <div className="mt-6 space-y-4">
            {metrics.lowStockProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="rounded-[24px] border border-border/70 bg-panel/60 p-4">
                <p className="text-sm font-medium text-foreground">{product.name}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">SKU {product.sku}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-muted">Remaining stock</span>
                  <span className="text-sm font-medium text-accent">{product.stock}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
