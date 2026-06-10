"use client";

import { debugComponentAttrs } from "@/lib/debug";
import {
	READING_LIST_DEFINITIONS,
	type ReadingListSlug,
	type ReadingListSummary,
} from "../types/readingList";
import styles from "./ReadingListSwitcher.module.css";

type ReadingListSwitcherProps = {
	activeListSlug: ReadingListSlug;
	onSelectList: (slug: ReadingListSlug) => void;
};

export function ReadingListSwitcher({
	activeListSlug,
	onSelectList,
}: ReadingListSwitcherProps) {
	const lists: ReadingListSummary[] = READING_LIST_DEFINITIONS.map(
		(definition) => ({
			slug: definition.slug,
			name: definition.name,
			isDefault: definition.isDefault,
			booksCount: 0,
		}),
	);

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
						onClick={() => {
							onSelectList(list.slug);
						}}
					>
						<span className={styles.label}>{list.name}</span>
						<span className={styles.count}>{list.booksCount}</span>
					</button>
				);
			})}
		</nav>
	);
}
