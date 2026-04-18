import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { buildMetadata } from "@/lib/seo";
import { getStoreCategories, searchProducts } from "@/lib/queries";

export const metadata = buildMetadata({
  title: "Collections | WorkNest",
  description: "Search, filter, and sort premium desk setup accessories.",
  path: "/collections",
});

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : "";
  const collection = typeof params.collection === "string" ? params.collection : "";
  const sort = typeof params.sort === "string" ? params.sort : "featured";
  const min = typeof params.min === "string" ? Number(params.min) : undefined;
  const max = typeof params.max === "string" ? Number(params.max) : undefined;
  const page = typeof params.page === "string" ? Number(params.page) : 1;

  const [categories, results] = await Promise.all([
    getStoreCategories(),
    searchProducts({ query: q, category, collection, sort, min, max, page }),
  ]);

  const createPageUrl = (nextPage: number) => {
    const search = new URLSearchParams();
    if (q) search.set("q", q);
    if (category) search.set("category", category);
    if (collection) search.set("collection", collection);
    if (sort) search.set("sort", sort);
    if (typeof min === "number" && !Number.isNaN(min)) search.set("min", String(min));
    if (typeof max === "number" && !Number.isNaN(max)) search.set("max", String(max));
    search.set("page", String(nextPage));
    return `/collections?${search.toString()}`;
  };

  return (
    <div className="space-y-6">
      <section className="surface-panel p-6 sm:p-8">
        <SectionHeader
          eyebrow="Storefront"
          title="Best-selling setup essentials in a premium product grid."
          description="Search, category filters, price filters, sorting, stock indicators, and polished empty states are included to make the browsing flow feel complete."
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="surface-panel h-fit p-5">
          <form className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Search</p>
              <Input name="q" defaultValue={q} placeholder="Search by product name" />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Category</p>
              <Select name="category" defaultValue={category}>
                <option value="">All categories</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Sort</p>
              <Select name="sort" defaultValue={sort}>
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to high</option>
                <option value="price-desc">Price: High to low</option>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">Min price (cents)</p>
                <Input type="number" name="min" defaultValue={min} placeholder="0" />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">Max price (cents)</p>
                <Input type="number" name="max" defaultValue={max} placeholder="15000" />
              </div>
            </div>
            <button className="inline-flex h-11 w-full items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
              Apply filters
            </button>
          </form>
        </aside>

        <div className="space-y-6">
          <div className="surface-panel p-5">
            <div className="flex flex-wrap gap-3">
              <Link href="/collections" className={`rounded-full px-4 py-2 text-sm ${!category ? "bg-accent text-accent-foreground" : "border border-border bg-panel/65 text-foreground/80"}`}>
                All
              </Link>
              {categories.map((item) => (
                <Link
                  key={item.id}
                  href={`/collections?category=${item.slug}`}
                  className={`rounded-full px-4 py-2 text-sm ${category === item.slug ? "bg-accent text-accent-foreground" : "border border-border bg-panel/65 text-foreground/80"}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {results.items.length > 0 ? (
            <ProductGrid products={results.items} />
          ) : (
            <EmptyState
              title="No products match those filters"
              description="Try removing a filter or searching for a wider term like desk mat, stand, or charger."
              href="/collections"
              actionLabel="Reset filters"
            />
          )}

          {results.totalPages > 1 ? (
            <div className="flex items-center justify-between rounded-[24px] border border-border/70 bg-card/90 p-4">
              <Link
                href={createPageUrl(Math.max(results.page - 1, 1))}
                className={`inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm ${results.page === 1 ? "pointer-events-none opacity-40" : ""}`}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Link>
              <p className="text-sm text-muted">
                Page {results.page} of {results.totalPages}
              </p>
              <Link
                href={createPageUrl(Math.min(results.page + 1, results.totalPages))}
                className={`inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm ${results.page === results.totalPages ? "pointer-events-none opacity-40" : ""}`}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
