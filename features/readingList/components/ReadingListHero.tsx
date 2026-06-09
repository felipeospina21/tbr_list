"use client";

import { Sparkles } from "lucide-react";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card, CardContent } from "@/components/Card";
import iconStyles from "@/components/Icon.module.css";
import { debugComponentAttrs } from "@/lib/debug";
import styles from "./ReadingListHero.module.css";

type ReadingListHeroProps = {
	booksCount: number;
	pages: number;
	accountLabel: string;
	onSignOut: () => void;
};

export function ReadingListHero({
	booksCount,
	pages,
	accountLabel,
	onSignOut,
}: ReadingListHeroProps) {
	return (
		<div className={styles.root} {...debugComponentAttrs("ReadingListHero")}>
			<div className={styles.eyebrow}>
				<Sparkles className={iconStyles.size4} />
				<Badge className={styles.badge} variant="secondary">
					Reading List
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

			<div className={styles.statGrid}>
				{[
					{ label: "Books", value: booksCount.toString() },
					{ label: "Pages", value: pages.toString() },
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
