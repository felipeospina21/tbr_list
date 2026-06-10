"use client";

import { BookPlus, LibraryBig } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import iconStyles from "@/components/Icon.module.css";
import { debugComponentAttrs } from "@/lib/debug";
import { cn } from "@/lib/utils";

import type { Book } from "../types/readingList";
import type { SearchBook } from "../types/search";
import styles from "./BookCard.module.css";
import { BookCardActions } from "./BookCardActions";
import { BookCardHeader } from "./BookCardHeader";
import { BookCardImage } from "./BookCardImage";
import searchStyles from "./SearchBookResultCard.module.css";

type BookCardProps = {
	book: Book;
	index: number;
	total: number;
	action: any;
};

export function BookCard({ book, index, total, action }: BookCardProps) {
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
						onMove={action}
					/>
				</div>
			</div>
		</div>
	);
}

type SearchBookCardProps = {
	book: SearchBook;
	isAdded: boolean;
	onAddBook: (book: Book) => void;
};

export function SearchBookCard({
	book,
	isAdded,
	onAddBook,
}: SearchBookCardProps) {
	return (
		<div
			className={searchStyles.card}
			{...debugComponentAttrs("SearchBookResultCard")}
		>
			<div className={searchStyles.grid}>
				<div className={searchStyles.coverWrap}>
					<Image
						src={book.cover}
						alt={`${book.title} front cover`}
						fill
						className={searchStyles.coverImage}
						sizes="(max-width: 768px) 100vw, 120px"
						unoptimized
					/>
				</div>
				<div className={searchStyles.content}>
					<div className={searchStyles.header}>
						<Badge className={searchStyles.providerBadge}>
							<LibraryBig className={iconStyles.size3} />
							{book.provider}
						</Badge>
						<Badge className={searchStyles.pagesBadge}>
							{typeof book.pages === "number"
								? `${book.pages} pages`
								: "Pages n/a"}
						</Badge>
					</div>

					<div>
						<h3 className={searchStyles.title}>{book.title}</h3>
						<p className={searchStyles.author}>{book.author}</p>
					</div>

					<p className={searchStyles.description}>{book.description}</p>

					<div className={searchStyles.actionWrap}>
						<Button
							type="button"
							variant={isAdded ? "secondary" : "default"}
							onClick={() => onAddBook(book)}
							disabled={isAdded}
							className={cn(
								searchStyles.actionButton,
								isAdded ? searchStyles.added : searchStyles.notAdded,
							)}
						>
							<BookPlus className={iconStyles.size4} />
							{isAdded ? "Added to list" : "Add to list"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
