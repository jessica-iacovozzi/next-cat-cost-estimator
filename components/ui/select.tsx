import { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  children: React.ReactNode;
  describedBy?: string;
  labelledBy?: string;
}

export function Select({ className, children, describedBy, labelledBy, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "border p-2 rounded w-full focus:ring focus:ring-blue-300",
        className
      )}
      aria-describedby={describedBy}
      aria-labelledby={labelledBy}
      {...props}
    >
      {children}
    </select>
  );
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>;
}
