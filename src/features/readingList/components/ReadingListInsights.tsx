"use client";

import type { FC } from "react";
import type { Book, ReadingListSlug } from "../types/readingList";
import { READING_LIST_DEFINITIONS, totalPages } from "../types/readingList";
import styles from "./ReadingListInsights.module.css";

interface ReadingListInsightsProps {
	booksByList: Record<ReadingListSlug, Book[]>;
}

export const ReadingListInsights: FC<ReadingListInsightsProps> = ({
	booksByList,
}) => {
	const allBooks = READING_LIST_DEFINITIONS.flatMap(
		(list) => booksByList[list.slug],
	);
	const pages = totalPages(allBooks);
	const ratedBooks = allBooks.filter(
		(book) => typeof book.averageRating === "number",
	);
	const averageRating =
		ratedBooks.length > 0
			? (
					ratedBooks.reduce((sum, book) => sum + (book.averageRating ?? 0), 0) /
					ratedBooks.length
				).toFixed(1)
			: "n/a";
	const topSubjects = getTopSubjects(allBooks);

	return (
		<section className={styles.panel}>
			<div className={styles.header}>
				<p className={styles.eyebrow}>Library pulse</p>
				<h2 className={styles.title}>A quieter read on the queue.</h2>
			</div>

			<div className={styles.grid}>
				<div className={styles.statCard}>
					<p className={styles.label}>Total Books</p>
					<p className={styles.value}>{allBooks.length}</p>
				</div>
				<div className={styles.statCard}>
					<p className={styles.label}>Pages</p>
					<p className={styles.value}>{pages.toLocaleString()}</p>
				</div>
				<div className={styles.statCard}>
					<p className={styles.label}>Rated Avg.</p>
					<p className={styles.value}>{averageRating}</p>
				</div>
				<div className={styles.statCard}>
					<p className={styles.label}>Tagged</p>
					<p className={styles.value}>
						{allBooks.filter((book) => book.moods.length > 0).length}
					</p>
				</div>
			</div>

			<div className={styles.breakdown}>
				<p className={styles.sectionTitle}>Lists</p>
				{READING_LIST_DEFINITIONS.map((list) => {
					const count = booksByList[list.slug].length;
					const ratio = allBooks.length > 0 ? count / allBooks.length : 0;

					return (
						<div key={list.slug} className={styles.breakdownRow}>
							<div className={styles.breakdownMeta}>
								<span>{list.name}</span>
								<span>{count}</span>
							</div>
							<div className={styles.track}>
								<div
									className={styles.fill}
									style={{
										width: `${Math.max(ratio * 100, count > 0 ? 6 : 0)}%`,
									}}
								/>
							</div>
						</div>
					);
				})}
			</div>

			<div className={styles.breakdown}>
				<p className={styles.sectionTitle}>Top Subjects</p>
				{topSubjects.length > 0 ? (
					topSubjects.map(([subject, count]) => (
						<div key={subject} className={styles.subjectRow}>
							<span>{subject}</span>
							<span>{count}</span>
						</div>
					))
				) : (
					<p className={styles.empty}>No subjects available yet.</p>
				)}
			</div>
		</section>
	);
};

function getTopSubjects(books: readonly Book[]) {
	const subjectCounts = new Map<string, number>();

	for (const book of books) {
		for (const subject of book.subjects.slice(0, 4)) {
			subjectCounts.set(subject, (subjectCounts.get(subject) ?? 0) + 1);
		}
	}

	return [...subjectCounts.entries()]
		.sort((left, right) => right[1] - left[1])
		.slice(0, 5);
}
