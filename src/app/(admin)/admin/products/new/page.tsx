import { createProductAction } from "@/actions/admin-actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/db";

export default async function NewProductPage() {
  const [categories, collections] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.collection.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <AdminShell
      title="Add product"
      description="Create a new premium catalog entry with pricing, category placement, and storefront visibility controls."
    >
      <ProductForm action={createProductAction} categories={categories} collections={collections} />
    </AdminShell>
  );
}
