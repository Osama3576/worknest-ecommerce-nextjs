'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  initialProductFormActionState,
  type ProductFormActionState,
} from '@/lib/action-states';

export function ProductForm({
  action,
  categories,
  collections,
  product,
}: {
  action: (
    prevState: ProductFormActionState,
    formData: FormData,
  ) => ProductFormActionState | Promise<ProductFormActionState>;
  categories: { id: string; name: string }[];
  collections: { id: string; name: string }[];
  product?: {
    name: string;
    slug: string;
    tagline: string;
    description: string;
    details: string;
    price: number;
    compareAtPrice: number | null;
    stock: number;
    sku: string;
    categoryId: string;
    collectionId: string | null;
    featured: boolean;
    recommended: boolean;
    isNew: boolean;
    images: { url: string }[];
  };
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    action,
    initialProductFormActionState,
  );

  useEffect(() => {
    if (state.status === 'success') {
      toast.success(state.message ?? 'Product saved successfully.');

      const timeout = window.setTimeout(() => {
        router.push(state.redirectTo ?? '/admin/products');
        router.refresh();
      }, 800);

      return () => window.clearTimeout(timeout);
    }

    if (state.status === 'error' && state.message) {
      toast.error(state.message);
    }
  }, [router, state]);

  return (
    <form
      action={formAction}
      className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"
    >
      <div className="space-y-6 rounded-[32px] border border-border/70 bg-card/90 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Product name">
            <Input
              name="name"
              defaultValue={product?.name}
              required
            />
          </Field>
          <Field label="Slug">
            <Input
              name="slug"
              defaultValue={product?.slug}
              required
            />
          </Field>
        </div>

        <Field label="Tagline">
          <Input
            name="tagline"
            defaultValue={product?.tagline}
            required
          />
        </Field>

        <Field label="Description">
          <Textarea
            name="description"
            defaultValue={product?.description}
            required
          />
        </Field>

        <Field label="Highlights (one per line)">
          <Textarea
            name="details"
            defaultValue={product?.details}
            required
          />
        </Field>
      </div>

      <div className="space-y-6">
        <div className="rounded-[32px] border border-border/70 bg-card/90 p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <Field label="Price (cents)">
              <Input
                name="price"
                type="number"
                min="0"
                defaultValue={product?.price}
                required
              />
            </Field>

            <Field label="Compare at price (cents)">
              <Input
                name="compareAtPrice"
                type="number"
                min="0"
                defaultValue={product?.compareAtPrice ?? undefined}
              />
            </Field>

            <Field label="Stock">
              <Input
                name="stock"
                type="number"
                min="0"
                defaultValue={product?.stock}
                required
              />
            </Field>

            <Field label="SKU">
              <Input
                name="sku"
                defaultValue={product?.sku}
                required
              />
            </Field>

            <Field label="Category">
              <Select
                name="categoryId"
                defaultValue={product?.categoryId}
                required
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Collection">
              <Select
                name="collectionId"
                defaultValue={product?.collectionId ?? ''}
              >
                <option value="">No collection</option>
                {collections.map(collection => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Primary image URL">
              <Input
                name="imageUrl"
                defaultValue={
                  product?.images[0]?.url ??
                  '/products/orbit-desk-mat.svg'
                }
                required
              />
            </Field>

            {!product ? (
              <>
                <Field label="Variant name">
                  <Input name="variantName" defaultValue="Color" />
                </Field>

                <Field label="Variant values (comma separated)">
                  <Input
                    name="variantValues"
                    defaultValue="Midnight, Stone"
                  />
                </Field>
              </>
            ) : null}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Toggle
              name="featured"
              label="Featured"
              defaultChecked={product?.featured}
            />
            <Toggle
              name="recommended"
              label="Recommended"
              defaultChecked={product?.recommended}
            />
            <Toggle
              name="isNew"
              label="Mark as new"
              defaultChecked={product?.isNew}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" type="reset" disabled={pending}>
            Reset
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : 'Save product'}
          </Button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2 text-sm text-foreground">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-border/70 bg-panel/60 px-4 py-3 text-sm text-foreground/85">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-[#ffbe3b]"
      />
      <span>{label}</span>
    </label>
  );
}
