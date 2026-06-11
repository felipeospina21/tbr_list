import type { FC, ReactNode } from "react";

import { cn } from "@/lib/utils";
import styles from "./PageSurface.module.css";
import { SectionBackdrop } from "./SectionBackdrop";

interface PageSurfaceProps {
	children: ReactNode;
	after?: ReactNode;
	className?: string;
	shellClassName?: string;
	surfaceClassName?: string;
	withBackdrop?: boolean;
}

export const PageSurface: FC<PageSurfaceProps> = ({
	children,
	after,
	className,
	shellClassName,
	surfaceClassName,
	withBackdrop = true,
}) => {
	return (
		<main className={cn(styles.main, className)}>
			<section className={cn(styles.surface, surfaceClassName)}>
				{withBackdrop ? <SectionBackdrop /> : null}

				<div className={cn(styles.shell, shellClassName)}>{children}</div>
			</section>

			{after}
		</main>
	);
};
