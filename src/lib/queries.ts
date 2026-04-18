import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export const productCardInclude = {
  images: { orderBy: { sortOrder: "asc" }, take: 1 },
  category: true,
  variants: { take: 2, orderBy: { value: "asc" } },
} satisfies Prisma.ProductInclude;

export async function getStoreCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getFeaturedCollections() {
  return prisma.collection.findMany({
    where: { featured: true },
    orderBy: { name: "asc" },
    take: 3,
  });
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true },
    include: productCardInclude,
    take: 6,
    orderBy: { createdAt: "desc" },
  });
}

export async function getRecommendedProducts(limit = 6) {
  return prisma.product.findMany({
    where: { recommended: true },
    include: productCardInclude,
    take: limit,
    orderBy: { reviewCount: "desc" },
  });
}

export async function getHomeReviews() {
  return prisma.review.findMany({
    where: { verifiedPurchase: true },
    include: {
      product: true,
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      collection: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { value: "asc" } },
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getRelatedProducts(productId: string, categoryId: string) {
  return prisma.product.findMany({
    where: {
      id: { not: productId },
      OR: [{ categoryId }, { recommended: true }],
    },
    include: productCardInclude,
    take: 4,
    orderBy: [{ recommended: "desc" }, { featured: "desc" }],
  });
}

export async function getWishlistForUser(userId: string) {
  return prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      product: {
        include: productCardInclude,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrdersForUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { orderBy: { sortOrder: "asc" }, take: 1 },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(orderId: string, userId?: string) {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      ...(userId ? { userId } : {}),
    },
    include: {
      items: {
        include: {
          product: {
            include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
          },
        },
      },
    },
  });
}

export async function getDashboardMetrics() {
  const [orders, products, customers] = await Promise.all([
    prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ orderBy: { stock: "asc" } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const paidOrders = orders.filter((order) => order.paymentStatus === "PAID").length;
  const lowStockProducts = products.filter((product) => product.stock <= 12);

  return {
    revenue,
    paidOrders,
    totalOrders: orders.length,
    totalProducts: products.length,
    totalCustomers: customers.length,
    lowStockProducts,
    recentOrders: orders.slice(0, 6),
  };
}

export async function getAdminProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminCategories() {
  return prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  });
}

export async function getAdminCustomers() {
  return prisma.user.findMany({
    include: {
      _count: { select: { orders: true, wishlistItems: true, addresses: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminOrders() {
  return prisma.order.findMany({
    include: {
      items: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function searchProducts(params: {
  query?: string;
  category?: string;
  collection?: string;
  sort?: string;
  min?: number;
  max?: number;
  page?: number;
  pageSize?: number;
}) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 9;
  const where: Prisma.ProductWhereInput = {
    AND: [
      params.query
        ? {
            OR: [
              { name: { contains: params.query } },
              { tagline: { contains: params.query } },
            ],
          }
        : {},
      params.category ? { category: { slug: params.category } } : {},
      params.collection ? { collection: { slug: params.collection } } : {},
      typeof params.min === "number" ? { price: { gte: params.min } } : {},
      typeof params.max === "number" ? { price: { lte: params.max } } : {},
    ],
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput[] =
    params.sort === "price-asc"
      ? [{ price: "asc" }]
      : params.sort === "price-desc"
        ? [{ price: "desc" }]
        : params.sort === "featured"
          ? [{ featured: "desc" }, { reviewCount: "desc" }]
          : [{ createdAt: "desc" }];

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productCardInclude,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(Math.ceil(total / pageSize), 1),
  };
}
