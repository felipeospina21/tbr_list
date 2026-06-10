"use client";

import { Sparkles } from "lucide-react";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card, CardContent } from "@/components/Card";
import iconStyles from "@/components/Icon.module.css";
import { debugComponentAttrs } from "@/lib/debug";
import { READING_LIST_DEFINITIONS } from "../types/readingList";
import styles from "./ReadingListHero.module.css";
import { ReadingListSwitcher } from "./ReadingListSwitcher";

type ReadingListHeroProps = {
	booksCount: number | undefined;
	pages: number | undefined;
	accountLabel: string;
	activeListSlug: "to_be_read" | "finished" | "did_not_finish";
	onSignOut: () => void;
	onSelectList: (slug: "to_be_read" | "finished" | "did_not_finish") => void;
};

export function ReadingListHero({
	booksCount,
	pages,
	accountLabel,
	activeListSlug,
	onSignOut,
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

			<div className={styles.accountRow}>
				<div>
					<p className={styles.accountLabel}>Signed in as</p>
					<p className={styles.accountValue}>{accountLabel}</p>
				</div>

				<Button variant="secondary" size="sm" onClick={onSignOut}>
					Sign out
				</Button>
			</div>

			<ReadingListSwitcher
				activeListSlug={activeListSlug}
				onSelectList={onSelectList}
			/>

			{/* TODO: extract this block */}
			<div className={styles.statGrid}>
				{[
					{ label: "Books", value: booksCount ?? 0 },
					{ label: "Pages", value: pages ?? 0 },
				].map((stat) => (
					<Card
						key={stat.label}
						className={styles.statCard}
						{...debugComponentAttrs("ReadingListStatCard")}
					>
						<CardContent className={styles.statContent}>
							<p className={styles.statLabel}>{stat.label}</p>
							<p className={styles.statValue}>{stat.value}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
