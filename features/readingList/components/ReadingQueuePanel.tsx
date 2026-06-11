"use client";

import { Loader } from "@/components/layout/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { debugComponentAttrs } from "@/lib/debug";
import { useChangeBookPosition } from "../mutations/useChangeBookPosition";
import type { Book } from "../types/readingList";
import { BookCard } from "./BookCard";
import { ReadingListCardActions } from "./ReadingListCardActions";
import styles from "./ReadingQueuePanel.module.css";

type ReadingQueuePanelProps = {
	books: Book[] | undefined;
	activeListSlug: "to_be_read" | "finished" | "did_not_finish";
	isLoading?: boolean;
};

export function ReadingQueuePanel({
	activeListSlug,
	books,
	isLoading = false,
}: ReadingQueuePanelProps) {
	const moveBookMutation = useChangeBookPosition(activeListSlug);

	function changeBookCardPosition(bookId: string, direction: 1 | -1) {
		moveBookMutation.mutate({ bookId, direction });
	}

	const noBooks = !books || !books.length;
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
				{isLoading ? (
					<Loader className={styles.loader} />
				) : noBooks ? (
					<div className={styles.emptyState}>
						No books yet. Use the search panel below to add your first title.
					</div>
				) : (
					books?.map((book, index) => (
						<BookCard
							key={book.id}
							book={book}
							index={index}
							action={
								<ReadingListCardActions
									index={index}
									total={books.length}
									book={book}
									onMove={changeBookCardPosition}
								/>
							}
						/>
					))
				)}
			</CardContent>
		</Card>
	);
}
