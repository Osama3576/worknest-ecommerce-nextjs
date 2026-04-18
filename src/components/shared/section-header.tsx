import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="space-y-3">
        {eyebrow ? <Badge className="bg-accent/12 text-accent">{eyebrow}</Badge> : null}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{title}</h2>
          {description ? <p className="max-w-2xl text-sm leading-6 text-muted">{description}</p> : null}
        </div>
      </div>
      {action}
    </div>
  );
}
