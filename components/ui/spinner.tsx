import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: number;
  text?: string;
}

export function Spinner({ className, size = 24, text }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2 
        className={cn("animate-spin text-primary", className)} 
        size={size} 
      />
      {text && <p className="text-muted-foreground text-sm">{text}</p>}
    </div>
  );
}
