import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  href,
  actionLabel,
}: {
  title: string;
  description: string;
  href?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-border/80 bg-panel/60 p-8 text-center">
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">{description}</p>
      {href && actionLabel ? (
        <Link href={href} className={cn(buttonVariants(), "mt-6")}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
