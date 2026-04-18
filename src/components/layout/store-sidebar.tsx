import Link from "next/link";
import { MonitorSmartphone, LayoutGrid, Heart, ShoppingCart, UserCircle2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function StoreSidebar({
  categories,
  className,
}: {
  categories: { id: string; name: string; slug: string }[];
  className?: string;
}) {
  return (
    <aside className={cn("hidden w-72 flex-col border-r border-border/60 bg-sidebar px-5 py-6 lg:flex", className)}>
      <Link href="/" className="flex items-center gap-3 px-3">
        <span className="rounded-2xl bg-accent p-2 text-accent-foreground shadow-lg shadow-accent/25">
          <MonitorSmartphone className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-muted">WorkNest</p>
          <p className="text-sm text-foreground/85">Minimal desk commerce</p>
        </div>
      </Link>

      <nav className="mt-10 space-y-2 text-sm">
        <SidebarLink href="/" label="Home" />
        <SidebarLink href="/collections" label="Collections" icon={<LayoutGrid className="h-4 w-4" />} />
        <SidebarLink href="/wishlist" label="Wishlist" icon={<Heart className="h-4 w-4" />} />
        <SidebarLink href="/cart" label="Cart" icon={<ShoppingCart className="h-4 w-4" />} />
        <SidebarLink href="/account" label="Account" icon={<UserCircle2 className="h-4 w-4" />} />
      </nav>

      <div className="mt-10">
        <p className="px-3 text-xs font-medium uppercase tracking-[0.3em] text-muted">Shop by category</p>
        <div className="mt-3 space-y-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/collections?category=${category.slug}`}
              className="flex items-center rounded-2xl px-3 py-2.5 text-sm text-foreground/72 transition hover:bg-panel/75 hover:text-foreground"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto rounded-[28px] border border-border/70 bg-panel/60 p-5">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-accent/12 p-2 text-accent">
            <Shield className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">Admin access</p>
            <p className="text-xs text-muted">Manage products, customers, and orders.</p>
          </div>
        </div>
        <Link
          href="/admin"
          className="mt-4 inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-panel/80"
        >
          Open dashboard
        </Link>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-foreground/78 transition hover:bg-panel/75 hover:text-foreground"
    >
      <span className="text-muted">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
