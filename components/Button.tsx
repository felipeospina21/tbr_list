import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "outline" | "ghost";
type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
	default:
		"bg-stone-950 text-white shadow-sm hover:bg-stone-800 focus-visible:ring-stone-950",
	secondary:
		"bg-stone-100 text-stone-950 shadow-sm hover:bg-stone-200 focus-visible:ring-stone-400",
	outline:
		"border border-stone-200 bg-white text-stone-950 shadow-sm hover:bg-stone-50 focus-visible:ring-stone-400",
	ghost: "text-stone-700 hover:bg-stone-100 hover:text-stone-950",
};

const sizeClasses: Record<ButtonSize, string> = {
	default: "h-11 px-4 py-2",
	sm: "h-9 rounded-full px-3",
	lg: "h-12 px-6",
	icon: "size-11",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant = "default",
			size = "default",
			type = "button",
			...props
		},
		ref,
	) => {
		return (
			<button
				ref={ref}
				type={type}
				className={cn(
					"inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
					variantClasses[variant],
					sizeClasses[size],
					className,
				)}
				{...props}
			/>
		);
	},
);

Button.displayName = "Button";

export { Button };
