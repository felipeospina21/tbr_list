"use client";

import { debugComponentAttrs } from "@/lib/debug";
import { cn } from "@/lib/utils";

import type { Book } from "../types/readingList";
import styles from "./BookCard.module.css";
import { BookCardHeader } from "./BookCardHeader";
import { BookCardActions } from "./BookCardActions";
import { BookCardImage } from "./BookCardImage";

type BookCardProps = {
	book: Book;
	index: number;
	total: number;
	onMove: (bookId: string, direction: -1 | 1) => void;
};

export function BookCard({ book, index, total, onMove }: BookCardProps) {
	return (
		<div
			className={cn(styles.item, index === 0 ? styles.top : styles.regular)}
			{...debugComponentAttrs("ReadingQueueItem")}
		>
			<div className={styles.grid}>
				<BookCardImage index={index} book={book} />

				<div className={styles.content}>
					<BookCardHeader index={index} book={book} />
					<p className={styles.description}>{book.description}</p>
					<BookCardActions
						index={index}
						total={total}
						book={book}
						onMove={onMove}
					/>
				</div>
			</div>
		</div>
	);
}
