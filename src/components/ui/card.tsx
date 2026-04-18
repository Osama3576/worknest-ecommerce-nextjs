import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-[28px] border border-border/70 bg-card/95 shadow-glow backdrop-blur", className)}>
      {children}
    </div>
  );
}
