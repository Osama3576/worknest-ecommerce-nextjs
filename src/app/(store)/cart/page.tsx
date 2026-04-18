import Link from "next/link";
import Image from "next/image";
import { applyCouponAction, removeCartItemAction, updateCartItemAction } from "@/actions/cart-actions";
import { FreeShippingBar } from "@/components/cart/free-shipping-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { buildMetadata } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";
import { getCartSnapshot } from "@/lib/cart";

export const metadata = buildMetadata({
  title: "Cart | WorkNest",
  description: "Review cart items, apply discounts, and continue to checkout.",
  path: "/cart",
});

export default async function CartPage() {
  const cart = await getCartSnapshot();

  if (cart.items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Start with a desk mat, monitor riser, or charging accessory and build your setup stack from there."
        href="/collections"
        actionLabel="Browse products"
      />
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        <FreeShippingBar subtotal={cart.subtotal} />
        <div className="surface-panel p-6 sm:p-8">
          <div className="space-y-5">
            {cart.items.map((item) => (
              <div key={item.id} className="grid gap-4 rounded-[26px] border border-border/70 bg-panel/60 p-4 md:grid-cols-[112px_1fr_auto] md:items-center">
                <div className="relative aspect-square overflow-hidden rounded-[20px] bg-panel">
                  <Image src={item.image} alt={item.product.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-muted">{item.product.category.name}</p>
                  <Link href={`/products/${item.product.slug}`} className="mt-2 block text-lg font-semibold text-foreground">
                    {item.product.name}
                  </Link>
                  <p className="mt-2 text-sm text-muted">{item.variantLabel}</p>
                  <p className="mt-3 text-sm font-medium text-foreground">{formatCurrency(item.unitPrice)}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <form action={updateCartItemAction} className="flex items-center gap-3">
                    <input type="hidden" name="variantId" value={item.variantId} />
                    <input
                      type="number"
                      min="1"
                      name="quantity"
                      defaultValue={item.quantity}
                      className="h-10 w-20 rounded-full border border-border bg-panel/65 px-3 text-sm text-foreground outline-none"
                    />
                    <button className="rounded-full border border-border px-4 py-2 text-sm text-foreground/80 transition hover:bg-panel/80">
                      Update
                    </button>
                  </form>
                  <form action={removeCartItemAction}>
                    <input type="hidden" name="variantId" value={item.variantId} />
                    <button className="text-sm text-danger">Remove</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="surface-panel p-6">
          <h2 className="text-xl font-semibold text-foreground">Discounts & summary</h2>
          <form action={applyCouponAction} className="mt-5 flex gap-3">
            <Input name="code" placeholder="Coupon code" defaultValue={cart.coupon?.code ?? ""} />
            <button className="rounded-full bg-accent px-5 text-sm font-medium text-accent-foreground">Apply</button>
          </form>
          <div className="mt-6 space-y-3 text-sm text-muted">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="text-foreground">{formatCurrency(cart.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span className="text-foreground">-{formatCurrency(cart.discountAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span className="text-foreground">{cart.shippingAmount === 0 ? "Free" : formatCurrency(cart.shippingAmount)}</span>
            </div>
            <div className="border-t border-border/70 pt-3 text-base font-semibold text-foreground">
              <div className="flex items-center justify-between">
                <span>Total</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
            </div>
          </div>
          <Link href="/checkout" className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
            Continue to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
