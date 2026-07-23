import type { FC } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import styles from "./ErrorSurface.module.css";

interface ErrorSurfaceProps {
	actionLabel?: string;
	className?: string;
	message?: string;
	onAction?: () => void;
	title?: string;
}

export const ErrorSurface: FC<ErrorSurfaceProps> = ({
	actionLabel = "Try again",
	className,
	message = "Something went wrong while loading this page.",
	onAction,
	title = "Unable to load",
}) => {
	return (
		<div className={cn(styles.surface, className)} role="alert">
			<div className={styles.content}>
				<p className={styles.eyebrow}>Error</p>
				<h1 className={styles.title}>{title}</h1>
				<p className={styles.message}>{message}</p>

				{onAction ? (
					<Button className={styles.action} onClick={onAction}>
						{actionLabel}
					</Button>
				) : null}
			</div>
		</div>
	);
};
