import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[120px] w-full rounded-[24px] border border-border bg-panel/70 px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none transition focus:border-accent/50 focus:bg-panel/90",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
