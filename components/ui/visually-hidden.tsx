import React from "react";

interface VisuallyHiddenProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * VisuallyHidden component
 * 
 * Renders content that is hidden visually but available to screen readers.
 * This is useful for providing additional context to screen reader users.
 * 
 * @param children - Content to be hidden visually but read by screen readers
 * @param className - Optional additional CSS classes
 */
export function VisuallyHidden({
  children,
  className,
  ...props
}: VisuallyHiddenProps & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`sr-only ${className || ""}`}
      {...props}
    >
      {children}
    </span>
  );
}
