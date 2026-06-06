"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/Card";
import { debugComponentAttrs } from "@/lib/debug";

import type { Book } from "../types/readingList";
import { ReadingQueueItem } from "./ReadingQueueItem";
import styles from "./ReadingQueuePanel.module.css";

type ReadingQueuePanelProps = {
	books: Book[];
	onMoveBook: (bookId: string, direction: -1 | 1) => void;
};

export function ReadingQueuePanel({
	books,
	onMoveBook,
}: ReadingQueuePanelProps) {
	return (
		<Card
			className={styles.panel}
			{...debugComponentAttrs("ReadingQueuePanel")}
		>
			<CardHeader className={styles.header}>
				<div className={styles.headerRow}>
					<div>
						<p className={styles.eyebrow}>Current session</p>
						<CardTitle className={styles.title}>Ready to read next</CardTitle>
					</div>
					<div className={styles.status}>Now</div>
				</div>
				<CardDescription className={styles.description}>
					{books.length > 0
						? "The top of the list is the next decision. Move anything up or down without losing the rest."
						: "Start by searching for a book. This workspace stays empty until you add something to the queue."}
				</CardDescription>
			</CardHeader>

			<CardContent className={styles.content}>
				{books.length === 0 ? (
					<div className={styles.emptyState}>
						No books yet. Use the search panel below to add your first title.
					</div>
				) : (
					books.map((book, index) => (
						<ReadingQueueItem
							key={book.id}
							book={book}
							index={index}
							total={books.length}
							onMove={onMoveBook}
						/>
					))
				)}
			</CardContent>
		</Card>
	);
}
