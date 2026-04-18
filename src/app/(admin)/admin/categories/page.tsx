import { createCategoryAction } from "@/actions/admin-actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAdminCategories } from "@/lib/queries";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <AdminShell
      title="Category management"
      description="Keep category structure organized so browsing, filtering, and SEO all stay sharp."
    >
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] border border-border/70 bg-card/90 p-6">
          <h2 className="text-xl font-semibold text-foreground">Add category</h2>
          <form action={createCategoryAction} className="mt-6 space-y-4">
            <Field label="Name"><Input name="name" placeholder="Desktop audio" required /></Field>
            <Field label="Slug"><Input name="slug" placeholder="desktop-audio" required /></Field>
            <Field label="Collection artwork"><Input name="image" placeholder="/collections/accessories.svg" required /></Field>
            <Field label="Description"><Textarea name="description" placeholder="Describe the category for admins and SEO." required /></Field>
            <button className="inline-flex rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground">Save category</button>
          </form>
        </div>

        <div className="rounded-[32px] border border-border/70 bg-card/90 p-6">
          <h2 className="text-xl font-semibold text-foreground">Existing categories</h2>
          <div className="mt-6 space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="rounded-[24px] border border-border/70 bg-panel/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{category.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">/{category.slug}</p>
                  </div>
                  <span className="text-sm text-accent">{category._count.products} products</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2 text-sm text-foreground">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}
