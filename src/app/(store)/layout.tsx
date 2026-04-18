import { StoreSidebar } from "@/components/layout/store-sidebar";
import { StoreTopbar } from "@/components/layout/store-topbar";
import { getStoreCategories } from "@/lib/queries";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const categories = await getStoreCategories();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[1600px]">
        <StoreSidebar categories={categories} />
        <div className="min-h-screen flex-1 p-4 sm:p-6 lg:p-8">
          <StoreTopbar />
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
