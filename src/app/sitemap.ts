import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({ select: { slug: true, updatedAt: true } });
  const categories = await prisma.category.findMany({ select: { slug: true, updatedAt: true } });

  const base = env.appUrl;
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/collections",
    "/wishlist",
    "/account",
    "/sign-in",
    "/sign-up",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...products.map((product) => ({
      url: `${base}/products/${product.slug}`,
      lastModified: product.updatedAt,
    })),
    ...categories.map((category) => ({
      url: `${base}/collections?category=${category.slug}`,
      lastModified: category.updatedAt,
    })),
  ];
}
