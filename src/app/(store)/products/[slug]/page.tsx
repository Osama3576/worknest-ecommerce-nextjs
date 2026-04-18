import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Sparkles, Truck } from "lucide-react";
import { addToCartAction } from "@/actions/cart-actions";
import { toggleWishlistAction } from "@/actions/account-actions";
import { ProductGrid } from "@/components/product/product-grid";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { ReviewsList } from "@/components/product/reviews-list";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";
import { getProductBySlug, getRelatedProducts, getRecommendedProducts } from "@/lib/queries";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return buildMetadata({
      title: "Product not found | WorkNest",
      description: "The requested product could not be found.",
    });
  }

  return buildMetadata({
    title: `${product.name} | WorkNest`,
    description: product.description,
    path: `/products/${product.slug}`,
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [relatedProducts, recentProductPool] = await Promise.all([
    getRelatedProducts(product.id, product.categoryId),
    getRecommendedProducts(12),
  ]);

  return (
    <div className="space-y-8">
      <section className="surface-panel p-6 sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-[30px] bg-panel">
              <Image src={product.images[0]?.url ?? "/og-image.svg"} alt={product.name} fill className="object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {product.images.map((image) => (
                <div key={image.id} className="relative aspect-square overflow-hidden rounded-[22px] border border-border/70 bg-panel">
                  <Image src={image.url} alt={image.alt} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-accent/12 text-accent">{product.category.name}</Badge>
                {product.collection ? <Badge>{product.collection.name}</Badge> : null}
                {product.stock <= 12 ? <Badge className="bg-danger/10 text-danger">Low stock</Badge> : null}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-muted">{product.tagline}</p>
                <h1 className="mt-3 text-4xl font-semibold text-foreground">{product.name}</h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">{product.description}</p>
              </div>
              <div className="flex items-end gap-4">
                <p className="text-3xl font-semibold text-foreground">{formatCurrency(product.price)}</p>
                {product.compareAtPrice ? (
                  <p className="pb-1 text-sm text-muted line-through">{formatCurrency(product.compareAtPrice)}</p>
                ) : null}
              </div>
            </div>

            <form action={addToCartAction} className="space-y-5 rounded-[28px] border border-border/70 bg-panel/60 p-5">
              <input type="hidden" name="productId" value={product.id} />
              <label className="block space-y-2 text-sm text-foreground">
                <span className="font-medium">Variant</span>
                <select
                  name="variantId"
                  defaultValue={product.variants[0]?.id}
                  className="h-11 w-full rounded-2xl border border-border bg-panel/65 px-4 text-sm text-foreground outline-none"
                >
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.name}: {variant.value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-2 text-sm text-foreground">
                <span className="font-medium">Quantity</span>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  defaultValue="1"
                  className="h-11 w-28 rounded-2xl border border-border bg-panel/65 px-4 text-sm text-foreground outline-none"
                />
              </label>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground">
                  Add to cart
                </button>
                <input type="hidden" name="productId" value={product.id} />
                <button formAction={toggleWishlistAction} className="inline-flex h-12 items-center justify-center rounded-full border border-border px-6 text-sm font-medium text-foreground/80 transition hover:bg-panel/80">
                  Add to wishlist
                </button>
              </div>
            </form>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { title: "Secure payments", icon: ShieldCheck },
                { title: "Ships in 24 hours", icon: Truck },
                { title: "Designed for focus", icon: Sparkles },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-[24px] border border-border/70 bg-panel/60 p-4">
                    <Icon className="h-5 w-5 text-accent" />
                    <p className="mt-3 text-sm font-medium text-foreground">{item.title}</p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-[28px] border border-border/70 bg-panel/60 p-5">
              <p className="text-sm font-medium text-foreground">Product highlights</p>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                {product.details.split("\n").map((detail) => (
                  <li key={detail} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted">Reviews</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">{product.reviewCount} reviews from real setup builders</h2>
          </div>
          <p className="text-sm text-muted">Average rating {product.ratingAverage.toFixed(1)} / 5</p>
        </div>
        <ReviewsList reviews={product.reviews} />
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Related products</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">Continue building the setup</h2>
        </div>
        <ProductGrid products={relatedProducts} />
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Recently viewed</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">Pick up where you left off</h2>
        </div>
        <RecentlyViewed
          currentSlug={product.slug}
          products={recentProductPool.map((item) => ({
            id: item.id,
            slug: item.slug,
            name: item.name,
            price: item.price,
            image: item.images[0]?.url ?? "/og-image.svg",
          }))}
        />
      </section>

      <section className="surface-panel p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold text-foreground">Need a full setup bundle instead?</p>
            <p className="mt-2 text-sm text-muted">Explore curated collections for cable control, hybrid desk setups, and lighting-focused kits.</p>
          </div>
          <Link href="/collections" className="inline-flex rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground">
            Explore collections
          </Link>
        </div>
      </section>
    </div>
  );
}
