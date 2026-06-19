import { BookOpenText } from "lucide-react";
import { FC } from "react";
import iconStyles from "@/components/Icon.module.css";
import { Badge } from "@/components/ui/Badge";
import { SchemaBook } from "../types/readingList";
import { formatSeriesMetadata } from "../utils/formatSeriesMetadata";
import styles from "./BookCardHeader.module.css";

interface BookCardHeaderProps {
	index: number;
	provider?: string;
	book: SchemaBook;
}

export const BookCardHeader: FC<BookCardHeaderProps> = ({
	index,
	book,
	provider,
}) => {
	const indexBadgeContent = provider ? provider : `#${index + 1}`;
	const seriesMetadata = formatSeriesMetadata(book);

	return (
		<>
			<div className={styles.metaGroup}>
				<Badge className={styles.indexBadge}>{indexBadgeContent}</Badge>
				<div className={styles.badgeGroup}>
					{seriesMetadata ? (
						<Badge className={styles.seriesBadge}>{seriesMetadata}</Badge>
					) : null}
					<Badge className={styles.pagesBadge}>
						<BookOpenText className={iconStyles.size3} />
						<p className={styles.badgeContent}>
							{typeof book.pages === "number" ? `${book.pages}` : "n/a"}
						</p>
					</Badge>
				</div>
			</div>
			<h3 className={styles.title}>{book.title}</h3>
			<p className={styles.author}>{book.author}</p>
			{book.moods.length > 0 ? (
				<div className={styles.moodGroup}>
					{book.moods.slice(0, 3).map((mood) => (
						<Badge key={mood} className={styles.moodBadge}>
							{mood}
						</Badge>
					))}
				</div>
			) : null}
		</>
	);
};
