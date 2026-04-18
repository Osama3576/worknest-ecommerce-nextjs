import { formatCurrency } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const progress = Math.min((subtotal / siteConfig.shippingThreshold) * 100, 100);
  const remaining = Math.max(siteConfig.shippingThreshold - subtotal, 0);

  return (
    <div className="rounded-[24px] border border-border/70 bg-panel/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">
          {remaining === 0 ? "Free shipping unlocked" : `${formatCurrency(remaining)} away from free shipping`}
        </p>
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Threshold {formatCurrency(siteConfig.shippingThreshold)}</p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-panel/80">
        <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
