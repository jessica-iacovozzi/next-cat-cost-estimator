import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  describedBy?: string;
  labelledBy?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, describedBy, labelledBy, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none placeholder:text-muted ng-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        aria-describedby={describedBy}
        aria-labelledby={labelledBy}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
