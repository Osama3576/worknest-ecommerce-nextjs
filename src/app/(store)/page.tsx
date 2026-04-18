import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, Zap } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeader } from "@/components/shared/section-header";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { Badge } from "@/components/ui/badge";
import { getFeaturedCollections, getFeaturedProducts, getHomeReviews, getRecommendedProducts } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "WorkNest | Premium desk setup accessories",
  description: "Modern desk setup accessories, ergonomic tools, and productivity details built for focused work.",
});

export default async function HomePage() {
  const [collections, featuredProducts, recommendedProducts, reviews] = await Promise.all([
    getFeaturedCollections(),
    getFeaturedProducts(),
    getRecommendedProducts(),
    getHomeReviews(),
  ]);

  const spotlightProduct = featuredProducts[0];

  return (
    <div className="space-y-8">
      <section className="surface-panel overflow-hidden bg-hero-grid p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
          <div className="max-w-2xl space-y-6">
            <Badge className="bg-accent/12 text-accent">Desk setup / productivity accessories</Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                The premium accessories layer for focused work.
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted sm:text-lg">
                WorkNest turns the visual language of the provided design into a real commerce experience for setup builders, remote teams, and creators who care about both performance and aesthetics.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/collections" className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground">
                Explore store
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/collections?sort=featured" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition hover:bg-panel/80">
                Best sellers
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Fast fulfillment", icon: Truck },
                { label: "Secure checkout", icon: ShieldCheck },
                { label: "Premium materials", icon: CheckCircle2 },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-[24px] border border-border/70 bg-panel/60 p-4">
                    <Icon className="h-5 w-5 text-accent" />
                    <p className="mt-3 text-sm font-medium text-foreground">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] border border-border/70 bg-panel p-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-black/20">
                <Image
                  src={spotlightProduct?.images[0]?.url ?? "/og-image.svg"}
                  alt={spotlightProduct?.name ?? "Featured product"}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="mt-4 text-sm uppercase tracking-[0.2em] text-muted">Featured drop</p>
              <p className="mt-2 text-xl font-semibold text-foreground">{spotlightProduct?.name ?? "Spotlight product"}</p>
            </div>
            <div className="space-y-4">
              <div className="rounded-[28px] border border-border/70 bg-panel/60 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Weekly update</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">18 curated products</p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Built with the same compact, premium dashboard rhythm shown in the design references.
                </p>
              </div>
              <div className="rounded-[28px] border border-accent/20 bg-accent/10 p-5">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-accent" />
                  <p className="text-sm font-medium text-foreground">Free shipping above $150</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-foreground/75">
                  Save on setup bundles and use demo coupon <span className="font-semibold text-accent">FOCUS10</span> in cart.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-panel p-6 sm:p-8">
        <SectionHeader
          eyebrow="Featured collections"
          title="Browse setup systems, not random products."
          description="Missing pages from the inspiration were extended using the same card-heavy spacing, soft corners, and premium information hierarchy."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/collections?collection=${collection.slug}`} className="group overflow-hidden rounded-[28px] border border-border/70 bg-panel p-5 transition hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-black/20">
                <Image src={collection.image ?? "/og-image.svg"} alt={collection.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="mt-5">
                <p className="text-lg font-semibold text-foreground">{collection.name}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{collection.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          eyebrow="Best sellers"
          title="High-intent products with a clean, premium card system."
          description="The storefront leans into the provided dashboard marketplace style with muted surfaces, pill controls, and isolated product visuals."
        />
        <ProductGrid products={featuredProducts} />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-panel p-6 sm:p-8">
          <SectionHeader
            eyebrow="Why WorkNest"
            title="Built to feel like a real product business."
            description="This portfolio project demonstrates modern product UX, custom commerce logic, and believable brand polish."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Clutter-reducing accessories for focused work",
              "Variants, reviews, discounts, and user flows",
              "Custom admin tools for product and order control",
              "SEO-conscious page structure and metadata",
            ].map((item) => (
              <div key={item} className="rounded-[24px] border border-border/70 bg-panel/60 p-5">
                <p className="text-sm font-medium text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-panel p-6 sm:p-8">
          <SectionHeader eyebrow="Reviews" title="Setup builders are staying for the finish quality." />
          <div className="mt-8 space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-[24px] border border-border/70 bg-panel/60 p-5">
                <p className="text-sm font-semibold text-foreground">{review.authorName}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-accent">{review.product.name}</p>
                <p className="mt-3 text-sm leading-6 text-muted">“{review.body}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          eyebrow="Recommended"
          title="Cross-sell logic for a stronger storefront story."
          description="Recommended products are seeded to make the home page and detail pages feel like a real commerce product instead of a static gallery."
        />
        <ProductGrid products={recommendedProducts} />
      </section>

      <section className="surface-panel p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Badge className="bg-accent/12 text-accent">Newsletter</Badge>
            <h2 className="mt-4 text-3xl font-semibold text-foreground">Stay close to new drops, setup bundles, and productivity launches.</h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-muted">
              The newsletter section is fully wired to a local API route so the demo still captures data without external tooling.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
