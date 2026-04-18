import Link from "next/link";
import { MapPinHouse, Package, User, Heart } from "lucide-react";

const links = [
  { href: "/account", label: "Overview", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPinHouse },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
];

export function AccountNav() {
  return (
    <nav className="rounded-[28px] border border-border/70 bg-card/90 p-4">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-foreground/80 transition hover:bg-panel/70 hover:text-foreground"
            >
              <Icon className="h-4 w-4 text-muted" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
