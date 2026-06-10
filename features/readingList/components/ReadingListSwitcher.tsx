"use client";

import { debugComponentAttrs } from "@/lib/debug";
import {
	READING_LIST_DEFINITIONS,
	type ReadingListSlug,
	type ReadingListSummary,
} from "../types/readingList";
import styles from "./ReadingListSwitcher.module.css";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

type ReadingListSwitcherProps = {
	activeListSlug: ReadingListSlug;
	onSelectList: (slug: ReadingListSlug) => void;
};

export function ReadingListSwitcher({
	activeListSlug,
	onSelectList,
}: ReadingListSwitcherProps) {
	// TODO: fetch reading lists
	const lists = READING_LIST_DEFINITIONS;

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
