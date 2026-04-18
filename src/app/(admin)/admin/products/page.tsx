import Link from "next/link";
import Image from "next/image";
import { deleteProductAction } from "@/actions/admin-actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminProducts } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <AdminShell
      title="Product management"
      description="Add, edit, delete, and review the product catalog with inventory and merchandising signals."
    >
      <section className="rounded-[32px] border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Catalog</h2>
            <p className="mt-2 text-sm text-muted">Manage pricing, stock, and visibility across the storefront.</p>
          </div>
          <Link href="/admin/products/new" className="inline-flex rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground">
            Add product
          </Link>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-muted">
            <thead>
              <tr className="border-b border-border/70 text-xs uppercase tracking-[0.22em]">
                <th className="pb-3">Product</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3">Price</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border/60 align-middle last:border-none">
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-panel">
                        <Image src={product.images[0]?.url ?? "/og-image.svg"} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">{product.category.name}</td>
                  <td className="py-4">
                    <span className={product.stock <= 12 ? "text-danger" : "text-foreground"}>{product.stock}</span>
                  </td>
                  <td className="py-4 text-foreground">{formatCurrency(product.price)}</td>
                  <td className="py-4">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/products/${product.id}/edit`} className="rounded-full border border-border px-4 py-2 text-xs text-foreground/80 transition hover:bg-panel/80">
                        Edit
                      </Link>
                      <form action={deleteProductAction}>
                        <input type="hidden" name="productId" value={product.id} />
                        <button className="rounded-full border border-danger/30 px-4 py-2 text-xs text-danger">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
