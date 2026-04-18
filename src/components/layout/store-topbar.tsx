import Link from "next/link";
import { Bell, Search, ShoppingBag, UserRound } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { getViewer } from "@/lib/auth";
import { getCartSnapshot } from "@/lib/cart";

export async function StoreTopbar({ search }: { search?: string }) {
  const [viewer, cart] = await Promise.all([getViewer(), getCartSnapshot()]);

  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-border/70 bg-card/90 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
      <form action="/collections" className="flex flex-1 items-center gap-3 rounded-full border border-border bg-panel/75 px-4 py-3">
        <Search className="h-4 w-4 text-muted" />
        <input
          name="q"
          defaultValue={search}
          placeholder="Search desk mats, lighting, chargers..."
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
        />
      </form>

      <div className="flex items-center gap-3 self-end md:self-auto">
        <ThemeToggle />
        <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-panel/80 text-foreground/80 transition hover:bg-panel hover:text-foreground">
          <Bell className="h-4 w-4" />
        </button>
        <Link
          href="/cart"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-panel/80 px-4 text-sm font-medium text-foreground transition hover:bg-panel"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>{cart.items.length}</span>
        </Link>
        <Link
          href={viewer ? "/account" : "/sign-in"}
          className="inline-flex items-center gap-3 rounded-full bg-accent px-4 py-3 text-sm font-medium text-accent-foreground"
        >
          <UserRound className="h-4 w-4" />
          <span>{viewer ? viewer.name.split(" ")[0] : "Sign in"}</span>
        </Link>
      </div>
    </div>
  );
}
