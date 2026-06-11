"use client";

import { debugComponentAttrs } from "@/lib/debug";
import styles from "./ReadingListHero.module.css";
import { ReadingListStats } from "./ReadingListStats";
import { ReadingListSwitcher } from "./ReadingListSwitcher";

type ReadingListHeroProps = {
	booksCount: number | undefined;
	pages: number | undefined;
	activeListSlug: "to_be_read" | "finished" | "did_not_finish";
	onSelectList: (slug: "to_be_read" | "finished" | "did_not_finish") => void;
};

export function ReadingListHero({
	booksCount,
	pages,
	activeListSlug,
	onSelectList,
}: ReadingListHeroProps) {
	return (
		<div className={styles.root} {...debugComponentAttrs("ReadingListHero")}>
			<ReadingListSwitcher
				activeListSlug={activeListSlug}
				onSelectList={onSelectList}
			/>

			<ReadingListStats booksCount={booksCount} pages={pages} />
		</div>
	);
}
