import { notFound } from "next/navigation";
import { updateProductAction } from "@/actions/admin-actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/db";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories, collections] = await Promise.all([
    prisma.product.findUnique({ include: { images: true }, where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.collection.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <AdminShell
      title={`Edit ${product.name}`}
      description="Update the core merchandising fields without leaving the dashboard."
    >
      <ProductForm
        action={updateProductAction.bind(null, product.id)}
        categories={categories}
        collections={collections}
        product={product}
      />
    </AdminShell>
  );
}
