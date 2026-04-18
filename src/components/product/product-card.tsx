import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { addToCartAction } from "@/actions/cart-actions";
import { toggleWishlistAction } from "@/actions/account-actions";

interface ProductCardProps {
  product: Product & {
    category: { name: string; slug: string };
    images: { url: string; alt: string }[];
    variants: { id: string; value: string; name: string }[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const firstVariant = product.variants[0];

  return (
    <article className="group overflow-hidden rounded-[28px] border border-border/70 bg-card/95 shadow-glow transition hover:-translate-y-1 hover:border-border">
      <Link href={`/products/${product.slug}`} className="block rounded-[28px] bg-gradient-to-b from-foreground/10 to-transparent p-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-panel">
          <Image
            src={product.images[0]?.url ?? "/og-image.svg"}
            alt={product.images[0]?.alt ?? product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="space-y-4 px-5 pb-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {product.featured ? <Badge className="bg-accent/12 text-accent">Featured</Badge> : null}
            {product.stock <= 12 ? <Badge className="bg-danger/10 text-danger">Low stock</Badge> : null}
          </div>
          <form action={toggleWishlistAction}>
            <input type="hidden" name="productId" value={product.id} />
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-panel/65 text-foreground/80 transition hover:bg-panel">
              <Heart className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">{product.category.name}</p>
          <Link href={`/products/${product.slug}`} className="mt-2 block text-lg font-semibold text-foreground transition hover:text-accent">
            {product.name}
          </Link>
          <p className="mt-2 text-sm leading-6 text-muted">{product.tagline}</p>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-foreground">{formatCurrency(product.price)}</p>
            {product.compareAtPrice ? (
              <p className="text-xs text-muted line-through">{formatCurrency(product.compareAtPrice)}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span>{product.ratingAverage.toFixed(1)}</span>
            <span>({product.reviewCount})</span>
          </div>
        </div>

        <form action={addToCartAction} className="flex items-center gap-3">
          <input type="hidden" name="productId" value={product.id} />
          <input type="hidden" name="variantId" value={firstVariant?.id} />
          <input type="hidden" name="quantity" value="1" />
          <button className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-accent text-sm font-medium text-accent-foreground transition hover:brightness-105">
            <ShoppingCart className="h-4 w-4" />
            Add to cart
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex h-11 items-center justify-center rounded-full border border-border px-4 text-sm text-foreground/80 transition hover:bg-panel/80"
          >
            View
          </Link>
        </form>
      </div>
    </article>
  );
}
