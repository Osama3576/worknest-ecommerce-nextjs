import { requireViewer } from "@/lib/auth";
import { AccountNav } from "@/components/account/account-nav";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireViewer();

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <AccountNav />
      <div>{children}</div>
    </div>
  );
}
