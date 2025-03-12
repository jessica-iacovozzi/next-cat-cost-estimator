"use client";

import * as React from "react";
import { Tooltip } from "radix-ui";

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

	return (
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>
					<span className="inline-flex items-center justify-center">
						{children}
					</span>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content
						className="select-none w-96 rounded border bg-secondary-foreground px-[15px] py-2.5 text-[15px] leading-none text-secondary"
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
