import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminProducts } from "@/lib/queries";

export default async function AdminInventoryPage() {
  const products = await getAdminProducts();

  return (
    <AdminShell
      title="Inventory overview"
      description="Low-stock monitoring, variant counts, and availability signals for the seeded catalog."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="rounded-[28px] border border-border/70 bg-card/90 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">{product.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">{product.category.name}</p>
              </div>
              <span className={`text-xs uppercase tracking-[0.2em] ${product.stock <= 12 ? 'text-danger' : 'text-accent'}`}>
                {product.stock <= 12 ? 'Low stock' : 'Healthy'}
              </span>
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-panel/80">
              <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min((product.stock / 60) * 100, 100)}%` }} />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-muted">
              <span>{product.variants.length} variants</span>
              <span className="text-foreground">{product.stock} units</span>
            </div>
          </div>
        ))}
      </section>
    </AdminShell>
  );
}
