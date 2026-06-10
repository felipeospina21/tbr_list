import { BookOpenText } from "lucide-react";
import { FC } from "react";
import { Badge } from "@/components/Badge";
import iconStyles from "@/components/Icon.module.css";
import { Book } from "../types/readingList";
import styles from "./BookCardHeader.module.css";

interface BookCardHeaderProps {
	index: number;
	provider?: string;
	book: Book;
}

export const BookCardHeader: FC<BookCardHeaderProps> = ({
	index,
	book,
	provider,
}) => {
	const indexBadgeContent = provider ? provider : `#${index + 1}`;

	return (
		<div className={styles.header}>
			<div className={styles.metaGroup}>
				<Badge className={styles.indexBadge}>{indexBadgeContent}</Badge>
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
