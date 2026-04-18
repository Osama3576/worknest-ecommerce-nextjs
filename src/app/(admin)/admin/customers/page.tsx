import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminCustomers } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <AdminShell
      title="Customer list"
      description="Track who is ordering, saving addresses, and building wishlists."
    >
      <section className="rounded-[32px] border border-border/70 bg-card/90 p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-muted">
            <thead>
              <tr className="border-b border-border/70 text-xs uppercase tracking-[0.22em]">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Orders</th>
                <th className="pb-3">Wishlist</th>
                <th className="pb-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-border/60 last:border-none">
                  <td className="py-4">
                    <p className="font-medium text-foreground">{customer.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">{customer.email}</p>
                  </td>
                  <td className="py-4">{customer.role}</td>
                  <td className="py-4">{customer._count.orders}</td>
                  <td className="py-4">{customer._count.wishlistItems}</td>
                  <td className="py-4">{formatDate(customer.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
