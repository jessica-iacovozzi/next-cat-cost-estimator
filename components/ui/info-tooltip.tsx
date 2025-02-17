"use client";

import * as React from "react";
import { Tooltip } from "radix-ui";

const InfoTooltip = ({ content, children }: { content: string; children: React.ReactNode }) => {
	return (
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content
						className="select-none rounded bg-secondary-foreground px-[15px] py-2.5 text-[15px] leading-none text-secondary shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] data-[state=instant-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=instant-open]:data-[side=left]:animate-slideRightAndFade data-[state=instant-open]:data-[side=right]:animate-slideLeftAndFade data-[state=instant-open]:data-[side=top]:animate-slideDownAndFade"
						sideOffset={5}
						side="right"
					>
						{content}
						<Tooltip.Arrow className="fill-white" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
};

export default InfoTooltip;

