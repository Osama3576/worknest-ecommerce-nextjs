import { requireViewer } from "@/lib/auth";
import { getWishlistForUser } from "@/lib/queries";
import { EmptyState } from "@/components/shared/empty-state";
import { ProductGrid } from "@/components/product/product-grid";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Wishlist | WorkNest",
  description: "Save products for later and compare your favorite setup upgrades.",
  path: "/wishlist",
});

export default async function WishlistPage() {
  const viewer = await requireViewer();
  const items = await getWishlistForUser(viewer.id);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Save your favorite desk accessories while you compare materials, prices, and setup bundles."
        href="/collections"
        actionLabel="Explore products"
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="surface-panel p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-muted">Wishlist</p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">Saved products for your next setup upgrade</h1>
      </section>
      <ProductGrid products={items.map((item) => item.product)} />
    </div>
  );
}
