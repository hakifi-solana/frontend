import { cn } from "@/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipArrow } from "./ui";
import React from "react";
type TProps = {
	titleClassName?: string;
	contentClassName?: string;
	title: string | React.JSX.Element;
	content: string | React.JSX.Element;
	showArrow?: boolean;
	placement?: 'bottom' | 'left' | 'right' | 'top';
	isOpen?: boolean;
};

const TooltipCustom = ({ isOpen, titleClassName, contentClassName, title, content, showArrow = true, placement }: TProps) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={100} open={isOpen}>
				<TooltipTrigger className={cn("cursor-pointer !text-typo-secondary text-body-14", titleClassName)} asChild>{title}</TooltipTrigger>
				<TooltipContent className={cn("relative text-typo-primary", contentClassName)} sideOffset={5} side={placement}>
					{content}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default TooltipCustom;
