import { cn } from "@/utils";

type TProps = {
	variant: "primary" | "error" | "warning" | "disabled" | "success";
	text: string;
};
const variantStyle = {
	warning: {
		className: "bg-warning-label",
	},
	success: {
		className: "bg-positive-label",
	},
	error: {
		className: "bg-negative-label",
	},
	primary: {
		className: "bg-typo-accent",
	},
	disabled: {
		className: "bg-neutral-label !text-typo-tertiary",
	},
};

const Tag = ({ variant, text }: TProps) => {
	const style = variantStyle[variant];
	return (
		<div
			className={cn(
				"font-semibold lg:text-sm text-xs text-body-14 rounded-sm w-fit px-2 py-1 text-center text-typo-primary",
				style?.className
			)}
		>
			{text}
		</div>
	);
};

export default Tag;
