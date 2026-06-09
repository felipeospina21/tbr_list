import { ArrowDown, ArrowUp } from "lucide-react";
import { FC } from "react";
import { Button } from "@/components/Button";
import iconStyles from "@/components/Icon.module.css";
import { Book } from "../types/readingList";
import styles from "./BookCardActions.module.css";

interface BookCardActionsProps {
	index: number;
	book: Book;
	total: number;
	onMove: (bookId: string, direction: -1 | 1) => void;
}

export const BookCardActions: FC<BookCardActionsProps> = ({
	index,
	onMove,
	book,
	total,
}) => {
	return (
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
	);
};
