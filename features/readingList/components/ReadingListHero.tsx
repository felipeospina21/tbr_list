"use client";

import { Sparkles } from "lucide-react";
import iconStyles from "@/components/Icon.module.css";
import { Badge } from "@/components/ui/Badge";
import { debugComponentAttrs } from "@/lib/debug";
import { READING_LIST_DEFINITIONS } from "../types/readingList";
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
	const activeList = READING_LIST_DEFINITIONS.find(
		(list) => list.slug === activeListSlug,
	);

	return (
		<div className={styles.root} {...debugComponentAttrs("ReadingListHero")}>
			<div className={styles.eyebrow}>
				<Sparkles className={iconStyles.size4} />
				<Badge className={styles.badge} variant="secondary">
					{activeList?.name ?? "To Be Read"}
				</Badge>
			</div>

			<ReadingListSwitcher
				activeListSlug={activeListSlug}
				onSelectList={onSelectList}
			/>

			<ReadingListStats booksCount={booksCount} pages={pages} />
		</div>
	);
}
