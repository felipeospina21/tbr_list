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
import styles from "./SearchBookResultCard.module.css";

type SearchBookResultCardProps = {
	book: SearchBook;
	isAdded: boolean;
	onAddBook: (book: Book) => void;
};

export function SearchBookResultCard({
	book,
	isAdded,
	onAddBook,
}: SearchBookResultCardProps) {
	return (
		<div
			className={styles.card}
			{...debugComponentAttrs("SearchBookResultCard")}
		>
			<div className={styles.grid}>
				<div className={styles.coverWrap}>
					<Image
						src={book.cover}
						alt={`${book.title} front cover`}
						fill
						className={styles.coverImage}
						sizes="(max-width: 768px) 100vw, 120px"
						unoptimized
					/>
				</div>
				<div className={styles.content}>
					<div className={styles.header}>
						<Badge className={styles.providerBadge}>
							<LibraryBig className={iconStyles.size3} />
							{book.provider}
						</Badge>
						<Badge className={styles.pagesBadge}>
							{typeof book.pages === "number"
								? `${book.pages} pages`
								: "Pages n/a"}
						</Badge>
					</div>

					<div>
						<h3 className={styles.title}>{book.title}</h3>
						<p className={styles.author}>{book.author}</p>
					</div>

					<p className={styles.description}>{book.description}</p>

					<div className={styles.actionWrap}>
						<Button
							type="button"
							variant={isAdded ? "secondary" : "default"}
							onClick={() => onAddBook(book)}
							disabled={isAdded}
							className={cn(
								styles.actionButton,
								isAdded ? styles.added : styles.notAdded,
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
