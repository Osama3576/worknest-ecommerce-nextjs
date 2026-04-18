'use server';

import { revalidatePath } from 'next/cache';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { prisma } from '@/lib/db';
import { requireViewer } from '@/lib/auth';
import { parseNumber, slugify } from '@/lib/utils';
import type { ProductFormActionState } from '@/lib/action-states';

export async function createProductAction(
  _prevState: ProductFormActionState,
  formData: FormData,
): Promise<ProductFormActionState> {
  try {
    await requireViewer({ admin: true });

    const name = String(formData.get('name') ?? '').trim();
    const slug = slugify(String(formData.get('slug') ?? name));
    const categoryId = String(formData.get('categoryId') ?? '');
    const collectionId = String(formData.get('collectionId') ?? '');
    const imageUrl = String(
      formData.get('imageUrl') ?? '/og-image.svg',
    );
    const variantName = String(
      formData.get('variantName') ?? 'Finish',
    );
    const variantValues = String(
      formData.get('variantValues') ?? 'Standard',
    )
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);
    const price = parseNumber(formData.get('price'));
    const compareAtPrice = parseNumber(
      formData.get('compareAtPrice'),
      0,
    );
    const stock = parseNumber(formData.get('stock'), 0);
    const sku = String(
      formData.get('sku') ?? `WN-${slug.toUpperCase()}`,
    );

    await prisma.product.create({
      data: {
        name,
        slug,
        tagline: String(formData.get('tagline') ?? ''),
        description: String(formData.get('description') ?? ''),
        details: String(formData.get('details') ?? ''),
        price,
        compareAtPrice: compareAtPrice || null,
        featured: formData.get('featured') === 'on',
        recommended: formData.get('recommended') === 'on',
        isNew: formData.get('isNew') === 'on',
        stock,
        sku,
        categoryId,
        collectionId: collectionId || null,
        images: {
          create: [{ url: imageUrl, alt: name, sortOrder: 0 }],
        },
        variants: {
          create: variantValues.map((value, index) => ({
            name: variantName,
            value,
            stock: Math.max(
              Math.floor(stock / Math.max(variantValues.length, 1)),
              1,
            ),
            sku: `${sku}-${index + 1}`,
          })),
        },
      },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/products');
    revalidatePath('/collections');

    return {
      status: 'success',
      message: 'Product saved successfully.',
      redirectTo: '/admin/products',
    };
  } catch (error) {
    console.error('createProductAction error:', error);

    return {
      status: 'error',
      message: 'Unable to save product. Please try again.',
    };
  }
}

export async function updateProductAction(
  productId: string,
  _prevState: ProductFormActionState,
  formData: FormData,
): Promise<ProductFormActionState> {
  try {
    await requireViewer({ admin: true });

    const imageUrl = String(
      formData.get('imageUrl') ?? '/og-image.svg',
    );

    await prisma.product.update({
      where: { id: productId },
      data: {
        name: String(formData.get('name') ?? '').trim(),
        slug: slugify(
          String(formData.get('slug') ?? formData.get('name') ?? ''),
        ),
        tagline: String(formData.get('tagline') ?? ''),
        description: String(formData.get('description') ?? ''),
        details: String(formData.get('details') ?? ''),
        price: parseNumber(formData.get('price')),
        compareAtPrice:
          parseNumber(formData.get('compareAtPrice'), 0) || null,
        stock: parseNumber(formData.get('stock'), 0),
        featured: formData.get('featured') === 'on',
        recommended: formData.get('recommended') === 'on',
        isNew: formData.get('isNew') === 'on',
        sku: String(formData.get('sku') ?? ''),
        categoryId: String(formData.get('categoryId') ?? ''),
        collectionId:
          String(formData.get('collectionId') ?? '') || null,
      },
    });

    const existingImage = await prisma.productImage.findFirst({
      where: { productId },
      orderBy: { sortOrder: 'asc' },
    });

    if (existingImage) {
      await prisma.productImage.update({
        where: { id: existingImage.id },
        data: { url: imageUrl },
      });
    }

    revalidatePath('/admin');
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${productId}/edit`);
    revalidatePath('/collections');

    return {
      status: 'success',
      message: 'Product updated successfully.',
      redirectTo: '/admin/products',
    };
  } catch (error) {
    console.error('updateProductAction error:', error);

    return {
      status: 'error',
      message: 'Unable to update product. Please try again.',
    };
  }
}

export async function deleteProductAction(formData: FormData) {
  await requireViewer({ admin: true });
  const productId = String(formData.get('productId') ?? '');

  await prisma.product.delete({ where: { id: productId } });
  revalidatePath('/admin/products');
  revalidatePath('/collections');
}

export async function createCategoryAction(formData: FormData) {
  await requireViewer({ admin: true });

  const name = String(formData.get('name') ?? '').trim();
  await prisma.category.create({
    data: {
      name,
      slug: slugify(String(formData.get('slug') ?? name)),
      description: String(formData.get('description') ?? ''),
      image: String(
        formData.get('image') ?? '/collections/accessories.svg',
      ),
    },
  });

  revalidatePath('/admin/categories');
  revalidatePath('/collections');
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireViewer({ admin: true });

  const orderId = String(formData.get('orderId') ?? '');
  const status = String(
    formData.get('status') ?? 'PENDING',
  ) as OrderStatus;
  const paymentStatus = String(
    formData.get('paymentStatus') ?? 'PENDING',
  ) as PaymentStatus;

  await prisma.order.update({
    where: { id: orderId },
    data: { status, paymentStatus },
  });

  revalidatePath('/admin/orders');
  revalidatePath('/admin');
}
