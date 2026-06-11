"use client";

import type { FC } from "react";

import { Card, CardContent } from "@/components/ui/Card";
import { debugComponentAttrs } from "@/lib/debug";
import styles from "./ReadingListStats.module.css";

interface ReadingListStatsProps {
	booksCount: number | undefined;
	pages: number | undefined;
}

export const ReadingListStats: FC<ReadingListStatsProps> = ({
	booksCount,
	pages,
}) => {
	const stats = [
		{ label: "Books", value: booksCount ?? 0 },
		{ label: "Pages", value: pages ?? 0 },
		// TODO: remove mocked data
		{ label: "Mocked Time", value: "85h" },
	];

	return (
		<div className={styles.grid}>
			{stats.map((stat) => (
				<Card
					key={stat.label}
					className={styles.card}
					{...debugComponentAttrs("ReadingListStatCard")}
				>
					<CardContent className={styles.content}>
						<p className={styles.label}>{stat.label}</p>
						<p className={styles.value}>{stat.value}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
};
