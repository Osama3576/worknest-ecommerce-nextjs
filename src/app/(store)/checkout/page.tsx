import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { EmptyState } from "@/components/shared/empty-state";
import { requireViewer } from "@/lib/auth";
import { getCartSnapshot } from "@/lib/cart";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Checkout | WorkNest",
  description: "Enter shipping details and continue to payment.",
  path: "/checkout",
});

export default async function CheckoutPage() {
  const viewer = await requireViewer();
  const [cart, defaultAddress] = await Promise.all([
    getCartSnapshot(),
    prisma.address.findFirst({ where: { userId: viewer.id }, orderBy: { isDefault: "desc" } }),
  ]);

  if (cart.items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add at least one product before heading to checkout."
        href="/collections"
        actionLabel="Browse store"
      />
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="surface-panel p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-muted">Secure checkout</p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">Shipping details and payment</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          This flow supports real Stripe Checkout when keys are configured and falls back to a local demo order when running in portfolio mode.
        </p>
        <div className="mt-8">
          <CheckoutForm
            defaultValues={{
              fullName: defaultAddress?.fullName ?? viewer.name,
              email: viewer.email,
              phone: defaultAddress?.phone ?? undefined,
              line1: defaultAddress?.line1 ?? undefined,
              line2: defaultAddress?.line2 ?? undefined,
              city: defaultAddress?.city ?? undefined,
              state: defaultAddress?.state ?? undefined,
              postalCode: defaultAddress?.postalCode ?? undefined,
              country: defaultAddress?.country ?? undefined,
            }}
          />
        </div>
      </div>

      <div className="surface-panel p-6">
        <h2 className="text-xl font-semibold text-foreground">Order summary</h2>
        <div className="mt-6 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 rounded-[22px] border border-border/70 bg-panel/60 px-4 py-3 text-sm">
              <div>
                <p className="font-medium text-foreground">{item.product.name}</p>
                <p className="text-muted">{item.variantLabel} × {item.quantity}</p>
              </div>
              <p className="text-foreground">{formatCurrency(item.totalPrice)}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-3 text-sm text-muted">
          <div className="flex justify-between"><span>Subtotal</span><span className="text-foreground">{formatCurrency(cart.subtotal)}</span></div>
          <div className="flex justify-between"><span>Discount</span><span className="text-foreground">-{formatCurrency(cart.discountAmount)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span className="text-foreground">{cart.shippingAmount === 0 ? "Free" : formatCurrency(cart.shippingAmount)}</span></div>
          <div className="border-t border-border/70 pt-3 text-base font-semibold text-foreground">
            <div className="flex justify-between"><span>Total</span><span>{formatCurrency(cart.total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
