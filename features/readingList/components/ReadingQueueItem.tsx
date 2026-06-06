"use client";

import { ArrowDown, ArrowUp, BookOpenText } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import iconStyles from "@/components/Icon.module.css";
import { debugComponentAttrs } from "@/lib/debug";
import { cn } from "@/lib/utils";

import type { Book } from "../types/readingList";
import styles from "./ReadingQueueItem.module.css";

type ReadingQueueItemProps = {
	book: Book;
	index: number;
	total: number;
	onMove: (bookId: string, direction: -1 | 1) => void;
};

export function ReadingQueueItem({
	book,
	index,
	total,
	onMove,
}: ReadingQueueItemProps) {
	return (
		<div
			className={cn(styles.item, index === 0 ? styles.top : styles.regular)}
			{...debugComponentAttrs("ReadingQueueItem")}
		>
			<div className={styles.grid}>
				<div className={styles.coverWrap}>
					<Image
						src={book.cover}
						alt={`${book.title} cover`}
						fill
						className={styles.coverImage}
						sizes="(max-width: 768px) 100vw, 168px"
						unoptimized
						priority={index === 0}
					/>
				</div>

				<div className={styles.content}>
					<div className={styles.header}>
						<div className={styles.metaGroup}>
							<Badge className={styles.indexBadge}>#{index + 1}</Badge>
							<Badge className={styles.pagesBadge}>
								<BookOpenText className={iconStyles.size3} />
								<p className={styles.badgeContent}>
									{typeof book.pages === "number" ? `${book.pages}` : "n/a"}
								</p>
							</Badge>
						</div>
						<h3 className={styles.title}>{book.title}</h3>
						<p className={styles.author}>{book.author}</p>
					</div>

					<p className={styles.description}>{book.description}</p>

					<div className={styles.actions}>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onMove(book.id, -1)}
							disabled={index === 0}
							className={styles.actionButton}
						>
							<ArrowUp className={iconStyles.size4} />
						</Button>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onMove(book.id, 1)}
							disabled={index === total - 1}
							className={styles.actionButton}
						>
							<ArrowDown className={iconStyles.size4} />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
