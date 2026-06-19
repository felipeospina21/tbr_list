"use client";

import type { FC } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
	READING_LIST_DEFINITIONS,
	type ReadingListSlug,
	type ReadingListSummary,
} from "../types/readingList";
import styles from "./ReadingListSwitcher.module.css";

interface ReadingListSwitcherProps {
	activeListSlug: ReadingListSlug;
	booksCountByList?: Partial<Record<ReadingListSlug, number>>;
	onSelectList: (slug: ReadingListSlug) => void;
}

export const ReadingListSwitcher: FC<ReadingListSwitcherProps> = ({
	activeListSlug,
	booksCountByList,
	onSelectList,
}) => {
	const lists: ReadingListSummary[] = READING_LIST_DEFINITIONS.map(
		(definition) => ({
			slug: definition.slug,
			name: definition.name,
			isDefault: definition.isDefault,
			booksCount: booksCountByList?.[definition.slug] ?? 0,
		}),
	);

	return (
		<Tabs
			className={styles.root}
			value={activeListSlug}
			onValueChange={(value) => {
				const selectedList = lists.find((list) => list.slug === value);

				if (selectedList) {
					onSelectList(selectedList.slug);
				}
			}}
		>
			<TabsList className={styles.list} aria-label="Reading list selector">
				{lists.map((list) => (
					<TabsTrigger
						key={list.slug}
						className={styles.trigger}
						value={list.slug}
					>
						<span className={styles.label}>{list.name}</span>
						<span className={styles.count}>{list.booksCount}</span>
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
};
