"use client";
import { type FC, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Header } from "../migration/Header";
import { NavDock } from "../migration/NavDock";
import styles from "./PageSurface.module.css";
import { SectionBackdrop } from "./SectionBackdrop";
import { usePathname } from "next/navigation";

interface PageSurfaceProps {
	children: ReactNode;
	after?: ReactNode;
	className?: string;
	shellClassName?: string;
	surfaceClassName?: string;
	withBackdrop?: boolean;
}

export type NavItems = "library" | "search" | "mood" | "stats";

export const PageSurface: FC<PageSurfaceProps> = ({
	children,
	after,
	className,
	shellClassName,
	surfaceClassName,
	withBackdrop = true,
}) => {
	const path = usePathname();
	const activeNav = getActiveNav(path);

	return (
		<main className={cn(styles.main, className)}>
			<section className={cn(styles.surface, surfaceClassName)}>
				<Header activeNav={activeNav} />
				{withBackdrop ? <SectionBackdrop /> : null}

				<div className={cn(styles.shell, shellClassName)}>{children}</div>
			</section>

			{after}
			<NavDock activeNav={activeNav} />
		</main>
	);
};

function getActiveNav(path: string): NavItems {
	const activeNav = path.split("/").pop();
	const tabs = ["search", "mood", "stats"];

	if (!activeNav || (activeNav && !tabs.includes(activeNav))) {
		return "library";
	}

	return activeNav as NavItems;
}
