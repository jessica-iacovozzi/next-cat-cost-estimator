"use client";

import { useState, useId } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export interface TooltipItem {
  text: string;
  link?: string;
}

const InfoTooltip = ({ 
  content, 
  children 
}: { 
  content: TooltipItem[] | TooltipItem; 
  children: React.ReactNode;
}) => {
  // Ensure content is always an array for consistent rendering
  const tooltipItems = Array.isArray(content) ? content : [content];
  const [open, setOpen] = useState(false);
  
  // Generate a unique ID for the tooltip
  const tooltipId = useId();

  return (
    <TooltipPrimitive.Provider delayDuration={300}>
      <TooltipPrimitive.Root
        open={open}
        onOpenChange={setOpen}
      >
        <TooltipPrimitive.Trigger asChild>
          <span 
            className="inline-flex items-center justify-center cursor-help"
            tabIndex={0}
            aria-describedby={`${tooltipId}-content`}
            aria-expanded={open}
            aria-haspopup="dialog"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setOpen(!open);
              }
              if (e.key === 'Escape') {
                setOpen(false);
              }
            }}
          >
            {children}
          </span>
        </TooltipPrimitive.Trigger>
        
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            id={tooltipId}
            side="top"
            align="center"
            sideOffset={5}
            className="select-none w-96 rounded border bg-secondary-foreground px-[15px] py-2.5 text-[15px] leading-none text-secondary z-50 shadow-md"
            onEscapeKeyDown={() => setOpen(false)}
            onPointerDownOutside={() => setOpen(false)}
            forceMount
          >
            <div className="space-y-3" id={`${tooltipId}-content`}>
              {tooltipItems.map((item, index) => (
                <div key={index} className={index > 0 ? "pt-2 border-t border-gray-700" : ""}>
                  <p id={`${tooltipId}-item-${index}`}>{item.text}</p>
                  {item.link && (
                    <div className="mt-1">
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-400 underline text-sm"
                      id={`${tooltipId}-link-${index}`}
                      aria-label={`Learn more (opens in a new tab)`}
                    >
                      Learn more
                    </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <TooltipPrimitive.Arrow className="fill-white" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export default InfoTooltip;
