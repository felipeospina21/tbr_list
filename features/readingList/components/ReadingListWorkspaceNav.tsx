"use client";

import { BarChart2, BookOpen, Search, Smile } from "lucide-react";
import type { FC } from "react";
import iconStyles from "@/components/Icon.module.css";
import { cn } from "@/lib/utils";
import styles from "./ReadingListWorkspaceNav.module.css";

export type ReadingListSection = "library" | "search" | "mood" | "stats";

interface ReadingListWorkspaceNavProps {
	activeSection: ReadingListSection;
	onSelectSection: (section: ReadingListSection) => void;
}

const NAV_ITEMS = [
	{ id: "library", label: "Library", icon: BookOpen },
	{ id: "search", label: "Search", icon: Search },
	{ id: "mood", label: "Mood", icon: Smile },
	{ id: "stats", label: "Stats", icon: BarChart2 },
] as const;

export const ReadingListWorkspaceNav: FC<ReadingListWorkspaceNavProps> = ({
	activeSection,
	onSelectSection,
}) => {
	return (
		<nav className={styles.nav} aria-label="Reading workspace">
			{NAV_ITEMS.map((item) => {
				const Icon = item.icon;
				const isActive = activeSection === item.id;

				return (
					<button
						key={item.id}
						type="button"
						className={cn(styles.item, isActive && styles.itemActive)}
						aria-current={isActive ? "page" : undefined}
						onClick={() => onSelectSection(item.id)}
					>
						<span className={styles.iconWrap}>
							<Icon className={iconStyles.size4} aria-hidden="true" />
						</span>
						<span>{item.label}</span>
					</button>
				);
			})}
		</nav>
	);
};
