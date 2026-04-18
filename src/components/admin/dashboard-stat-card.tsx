import { formatCurrency } from "@/lib/utils";

export function DashboardStatCard({
  label,
  value,
  type = "text",
  hint,
}: {
  label: string;
  value: number | string;
  type?: "currency" | "number" | "text";
  hint?: string;
}) {
  const formattedValue =
    type === "currency"
      ? formatCurrency(Number(value))
      : type === "number"
        ? new Intl.NumberFormat("en-US").format(Number(value))
        : value;

  return (
    <div className="rounded-[28px] border border-border/70 bg-card/90 p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-foreground">{formattedValue}</p>
      {hint ? <p className="mt-3 text-xs uppercase tracking-[0.18em] text-accent">{hint}</p> : null}
    </div>
  );
}
