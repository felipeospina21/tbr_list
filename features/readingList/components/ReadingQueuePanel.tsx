"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { debugComponentAttrs } from "@/lib/debug";

import type { Book } from "../types/readingList";
import { BookCard } from "./BookCard";
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
				<div>
					<p className={styles.eyebrow}>Current session</p>
					<CardTitle className={styles.title}>Ready to read next</CardTitle>
				</div>
			</CardHeader>

			<CardContent className={styles.content}>
				{books.length === 0 ? (
					<div className={styles.emptyState}>
						No books yet. Use the search panel below to add your first title.
					</div>
				) : (
					books.map((book, index) => (
						<BookCard
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
