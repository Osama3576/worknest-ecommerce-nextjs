import { deleteAddressAction, saveAddressAction } from "@/actions/account-actions";
import { requireViewer } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { Input } from "@/components/ui/input";

export const metadata = buildMetadata({
  title: "Saved addresses | WorkNest",
  description: "Manage saved shipping addresses for future purchases.",
  path: "/account/addresses",
});

export default async function AddressesPage() {
  const viewer = await requireViewer();
  const addresses = await prisma.address.findMany({ where: { userId: viewer.id }, orderBy: { isDefault: "desc" } });

  return (
    <div className="space-y-6">
      <section className="surface-panel p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-muted">Saved addresses</p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">Keep checkout fast with saved destinations</h1>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="surface-panel p-6">
          <h2 className="text-xl font-semibold text-foreground">Add new address</h2>
          <form action={saveAddressAction} className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Label"><Input name="label" placeholder="Studio" required /></Field>
              <Field label="Full name"><Input name="fullName" defaultValue={viewer.name} required /></Field>
              <Field label="Phone"><Input name="phone" placeholder="+1 415 555 0145" /></Field>
              <Field label="Country"><Input name="country" placeholder="United States" required /></Field>
              <Field label="Line 1"><Input name="line1" placeholder="458 Market Street" required /></Field>
              <Field label="Line 2"><Input name="line2" placeholder="Suite 12B" /></Field>
              <Field label="City"><Input name="city" placeholder="San Francisco" required /></Field>
              <Field label="State"><Input name="state" placeholder="CA" required /></Field>
              <Field label="Postal code"><Input name="postalCode" placeholder="94105" required /></Field>
            </div>
            <label className="flex items-center gap-3 rounded-2xl border border-border/70 bg-panel/60 px-4 py-3 text-sm text-foreground/85">
              <input type="checkbox" name="setDefault" className="h-4 w-4 accent-[#ffbe3b]" />
              Set as default address
            </label>
            <button className="inline-flex rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground">Save address</button>
          </form>
        </div>

        <div className="surface-panel p-6">
          <h2 className="text-xl font-semibold text-foreground">Saved destinations</h2>
          <div className="mt-6 space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="rounded-[24px] border border-border/70 bg-panel/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{address.label}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">{address.fullName}</p>
                  </div>
                  {address.isDefault ? <span className="text-xs uppercase tracking-[0.2em] text-accent">Default</span> : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">
                  {address.line1}
                  {address.line2 ? <><br />{address.line2}</> : null}
                  <br />
                  {address.city}, {address.state} {address.postalCode}
                  <br />
                  {address.country}
                </p>
                <form action={deleteAddressAction} className="mt-4">
                  <input type="hidden" name="addressId" value={address.id} />
                  <button className="text-sm text-danger">Delete address</button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
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
