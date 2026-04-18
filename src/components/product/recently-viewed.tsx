"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/lib/utils";

const STORAGE_KEY = "worknest-recently-viewed";

export function RecentlyViewed({
  currentSlug,
  products,
}: {
  currentSlug: string;
  products: Array<{
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
  }>;
}) {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    const existing = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
    const next = [currentSlug, ...existing.filter((slug) => slug !== currentSlug)].slice(0, 6);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setRecentSlugs(next.filter((slug) => slug !== currentSlug));
  }, [currentSlug]);

  const items = useMemo(() => {
    return recentSlugs
      .map((slug) => products.find((product) => product.slug === slug))
      .filter(Boolean) as typeof products;
  }, [products, recentSlugs]);

  if (items.length === 0) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((product) => (
        <Link key={product.id} href={`/products/${product.slug}`} className="rounded-[24px] border border-border/70 bg-panel/60 p-4 transition hover:bg-panel/70">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[20px] bg-panel">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-sm font-medium text-foreground">{product.name}</p>
            <p className="text-sm text-muted">{formatCurrency(product.price)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
