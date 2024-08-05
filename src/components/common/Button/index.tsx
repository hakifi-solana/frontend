"use client";

import { cn } from "@/utils";
import { ForwardedRef, ReactNode, forwardRef } from "react";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	prevIcon?: ReactNode;
	nextIcon?: ReactNode;
	size: "sm" | "md" | "lg";
	variant?: "primary" | "secondary" | "ghost" | "outline" | "default";
	outline?: boolean;
	point?: boolean;
	customHeight?: boolean;
}

const Button = forwardRef(
	(
		{
			children,
			className,
			prevIcon,
			nextIcon,
			type = "button",
			size,
			variant = "default",
			outline = false,
			disabled,
			point = true,
			customHeight = false,
			...rest
		}: IButtonProps,
		ref: ForwardedRef<HTMLButtonElement>
	) => {
		return (
			<button
				className={cn(
					"relative flex items-center whitespace-nowrap outline-none disabled:cursor-not-allowed rounded group",
					{
						"px-4": variant !== "default",
						// typo size
						"!text-body-12 py": size === "sm",
						"!text-body-14 py-1": size === "md",
						"!text-body-16 py-2": size === "lg",
						//default
						"text-typo-secondary p-0": variant === "default",
						// primary
						"bg-support-white text-typo-tertiary duration-300 transition-all hover:bg-typo-accent ease-in-out":
							variant === "primary" && !disabled,
						"bg-background-quaternary text-typo-disable":
							variant === "primary" && disabled,
						// outline
						"border border-divider-secondary text-typo-primary bg-transparent hover:border-typo-accent hover:text-typo-accent transition-all duration-300 ease-in-out":
							variant === "outline" && !disabled,
						"border border-divider-secondary text-typo-disable bg-transparent":
							variant === "outline" && disabled,
						// ghost
						"text-typo-accent bg-transparent hover:bg-background-secondary transition-all duration-300 ease-in-out":
							variant === "ghost" && !disabled,
						"text-typo-disable": variant === "ghost" && disabled,

						"pr-2": !!nextIcon,
						"pl-2": !!prevIcon,
					},
					className
				)}
				type={type}
				disabled={disabled}
				ref={ref}
				{...rest}
			>
				{prevIcon}
				{children}
				{nextIcon}

				{/* top left */}
				{point && (
					<span
						className={cn("absolute", {
							// position
							"h-[3px] w-[3px] top-[3px] left-[3px]":
								size === "sm" || size === "md",
							"size-1 top-1 left-1": size === "lg",

							// bg color
							"bg-support-black": variant === "primary",
							"bg-typo-secondary group-enabled:group-hover:bg-typo-accent":
								variant === "outline",
						})}
					></span>
				)}
				{point ? (
					<span
						className={cn("absolute", {
							// position
							"size-[3px] top-[3px] right-[3px]":
								size === "sm" || size === "md",
							"size-1 top-1 right-1": size === "lg",

							// bg color
							"bg-support-black": variant === "primary",
							"bg-typo-secondary group-enabled:group-hover:bg-typo-accent":
								variant === "outline",
						})}
					></span>
				) : null}
				{/* bottom left */}
				{point && (
					<span
						className={cn("absolute", {
							"size-[3px] bottom-[3px] left-[3px]":
								size === "sm" || size === "md",
							"size-1 bottom-1 left-1": size === "lg",

							// bg color
							"bg-support-black": variant === "primary",
							"bg-typo-secondary group-enabled:group-hover:bg-typo-accent":
								variant === "outline",
						})}
					></span>
				)}
				{/* bottom right */}
				{point && (
					<span
						className={cn("absolute", {
							"size-[3px] bottom-[3px] right-[3px]":
								size === "sm" || size === "md",
							"size-1 bottom-1 right-1": size === "lg",

							// bg color
							"bg-support-black": variant === "primary",
							"bg-typo-secondary group-enabled:group-hover:bg-typo-accent":
								variant === "outline",
						})}
					></span>
				)}
			</button>
		);
	}
);

export default Button;
