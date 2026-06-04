import * as React from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
	default: "bg-stone-950 text-white",
	secondary: "bg-stone-100 text-stone-700",
	outline: "border border-stone-200 text-stone-700",
};

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
	({ className, variant = "default", ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium",
				variantClasses[variant],
				className,
			)}
			{...props}
		/>
	),
);

Badge.displayName = "Badge";

export { Badge };
