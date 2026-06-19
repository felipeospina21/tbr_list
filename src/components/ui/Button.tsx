import * as React from "react";

import { cn } from "@/lib/utils";
import styles from "./Button.module.css";

type ButtonVariant = "default" | "secondary" | "outline" | "ghost";
type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
	default: styles.default,
	secondary: styles.secondary,
	outline: styles.outline,
	ghost: styles.ghost,
};

const sizeClasses: Record<ButtonSize, string> = {
	default: styles.sizeDefault,
	sm: styles.sizeSm,
	lg: styles.sizeLg,
	icon: styles.sizeIcon,
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
					styles.button,
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
