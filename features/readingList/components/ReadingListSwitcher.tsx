"use client";

import { debugComponentAttrs } from "@/lib/debug";
import type { ReadingListSlug, ReadingListSummary } from "../types/readingList";
import styles from "./ReadingListSwitcher.module.css";

type ReadingListSwitcherProps = {
	lists: ReadingListSummary[];
	activeListSlug: ReadingListSlug;
	onSelectList: (slug: ReadingListSlug) => void;
};

export function ReadingListSwitcher({
	lists,
	activeListSlug,
	onSelectList,
}: ReadingListSwitcherProps) {
	return (
		<nav
			className={styles.root}
			aria-label="Reading list selector"
			{...debugComponentAttrs("ReadingListSwitcher")}
		>
			{lists.map((list) => {
				const isActive = list.slug === activeListSlug;

				return (
					<button
						key={list.slug}
						type="button"
						className={`${styles.button} ${isActive ? styles.buttonActive : ""}`}
						aria-pressed={isActive}
						onClick={() => onSelectList(list.slug)}
					>
						<span className={styles.label}>{list.name}</span>
						<span className={styles.count}>{list.booksCount}</span>
					</button>
				);
			})}
		</nav>
	);
}
