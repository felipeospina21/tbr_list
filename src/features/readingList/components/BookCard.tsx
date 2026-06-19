"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { SchemaBook } from "../types/readingList";
import styles from "./BookCard.module.css";
import { BookCardHeader } from "./BookCardHeader";
import { BookCardImage } from "./BookCardImage";

type BookCardProps = {
	book: SchemaBook;
	action: ReactNode;
	index: number;
	provider?: string;
};

export function BookCard({ book, index, provider, action }: BookCardProps) {
	return (
		<div className={cn(styles.item, index === 0 ? styles.top : styles.regular)}>
			<div className={styles.grid}>
				<BookCardImage index={index} book={book} />

				<div className={styles.content}>
					<BookCardHeader index={index} book={book} provider={provider} />
					<p className={styles.description}>{book.description}</p>

					<div className={styles.action}>{action}</div>
				</div>
			</div>
		</div>
	);
}
