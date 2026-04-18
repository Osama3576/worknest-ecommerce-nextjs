import { updateOrderStatusAction } from "@/actions/admin-actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminOrders } from "@/lib/queries";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <AdminShell
      title="Order management"
      description="Update fulfillment states, payment status, and customer delivery progress from one view."
    >
      <section className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-[32px] border border-border/70 bg-card/90 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">{order.orderNumber}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">{formatDate(order.createdAt)} · {order.email}</p>
              </div>
              <p className="text-lg font-semibold text-foreground">{formatCurrency(order.total)}</p>
            </div>
            <form action={updateOrderStatusAction} className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <input type="hidden" name="orderId" value={order.id} />
              <Field label="Order status">
                <select name="status" defaultValue={order.status} className="h-11 w-full rounded-2xl border border-border bg-panel/65 px-4 text-sm text-foreground outline-none">
                  {['PENDING','PAID','PROCESSING','SHIPPED','DELIVERED','CANCELLED'].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </Field>
              <Field label="Payment status">
                <select name="paymentStatus" defaultValue={order.paymentStatus} className="h-11 w-full rounded-2xl border border-border bg-panel/65 px-4 text-sm text-foreground outline-none">
                  {['PENDING','PAID','FAILED','REFUNDED'].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </Field>
              <button className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-accent-foreground">Save</button>
            </form>
          </div>
        ))}
      </section>
    </AdminShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2 text-sm text-foreground">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}
