import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-2xl border border-border bg-panel/70 px-4 text-sm text-foreground placeholder:text-muted outline-none transition focus:border-accent/50 focus:bg-panel/90",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
