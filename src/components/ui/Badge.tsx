import * as React from "react";

import { cn } from "@/lib/utils";
import styles from "./Badge.module.css";

type BadgeVariant = "default" | "secondary" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
	default: styles.default,
	secondary: styles.secondary,
	outline: styles.outline,
};

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
	({ className, variant = "default", ...props }, ref) => (
		<div
			ref={ref}
			className={cn(styles.badge, variantClasses[variant], className)}
			{...props}
		/>
	),
);

Badge.displayName = "Badge";

export { Badge };
