import { BookOpenText } from "lucide-react";
import styles from "./BookCardHeader.module.css";
import iconStyles from "@/components/Icon.module.css";
import { FC } from "react";
import { Book } from "../types/readingList";
import { Badge } from "@/components/Badge";

interface BookCardHeaderProps {
	index: number;
	book: Book;
}

export const BookCardHeader: FC<BookCardHeaderProps> = ({ index, book }) => {
	return (
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
	);
};
