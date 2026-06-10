import type { FC, ReactNode } from "react";

import { debugComponentAttrs } from "@/lib/debug";
import { cn } from "@/lib/utils";
import styles from "./PageSurface.module.css";
import { SectionBackdrop } from "./SectionBackdrop";

interface PageSurfaceProps {
	children: ReactNode;
	after?: ReactNode;
	className?: string;
	decorations?: ReactNode;
	debugName?: string;
	shellClassName?: string;
	surfaceClassName?: string;
	surfaceDebugName?: string;
	withBackdrop?: boolean;
}

export const PageSurface: FC<PageSurfaceProps> = ({
	children,
	after,
	className,
	decorations,
	debugName,
	shellClassName,
	surfaceClassName,
	surfaceDebugName,
	withBackdrop = true,
}) => {
	return (
		<main
			className={cn(styles.main, className)}
			{...debugComponentAttrs(debugName ?? "PageSurface")}
		>
			<section
				className={cn(styles.surface, surfaceClassName)}
				{...debugComponentAttrs(surfaceDebugName ?? "PageSurfaceSection")}
			>
				{withBackdrop ? <SectionBackdrop /> : null}
				{decorations}

				<div className={cn(styles.shell, shellClassName)}>{children}</div>
			</section>

			{after}
		</main>
	);
};
