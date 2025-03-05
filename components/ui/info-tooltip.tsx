"use client";

import * as React from "react";
import { Tooltip } from "radix-ui";

interface TooltipItem {
  text: string;
  link?: string;
}

const InfoTooltip = ({ 
  content, 
  children 
}: { 
  content: TooltipItem[] | TooltipItem; 
  children: React.ReactNode 
}) => {
  // Ensure content is always an array for consistent rendering
  const tooltipItems = Array.isArray(content) ? content : [content];

	return (
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content
						className="select-none w-96 rounded bg-secondary-foreground px-[15px] py-2.5 text-[15px] leading-none text-secondary shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] data-[state=instant-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=instant-open]:data-[side=left]:animate-slideRightAndFade data-[state=instant-open]:data-[side=right]:animate-slideLeftAndFade data-[state=instant-open]:data-[side=top]:animate-slideDownAndFade"
						sideOffset={5}
						side="right"
					>
						<div className="space-y-3">
              {tooltipItems.map((item, index) => (
                <div key={index} className={index > 0 ? "pt-2 border-t border-gray-700" : ""}>
                  <p>{item.text}</p>
                  {item.link && (
                    <div className="mt-1">
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-400 underline text-sm"
                      >
                        Learn more
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
						<Tooltip.Arrow className="fill-white" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
};

export default InfoTooltip;
