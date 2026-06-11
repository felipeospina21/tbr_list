import { Check, LibraryBig, Trash2, X } from "lucide-react";
import { type FC, type ReactNode, useState } from "react";
import iconStyles from "@/components/Icon.module.css";
import { Button } from "@/components/ui/Button";
import {
	type Book,
	READING_LIST_DEFINITIONS,
	type ReadingListSlug,
} from "../types/readingList";
import styles from "./ReadingListCardActions.module.css";

interface ReadingListCardActionsProps {
	activeListSlug: ReadingListSlug;
	book: Book;
	dragHandle: ReactNode;
	onRemove: (bookId: string) => void;
	onTransfer: (book: Book, targetListSlug: ReadingListSlug) => void;
}

export const ReadingListCardActions: FC<ReadingListCardActionsProps> = ({
	activeListSlug,
	onRemove,
	onTransfer,
	book,
	dragHandle,
}) => {
	const [isMoveOpen, setIsMoveOpen] = useState(false);
	const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);
	const destinationLists = READING_LIST_DEFINITIONS.filter(
		(list) => list.slug !== activeListSlug,
	);

	return (
		<div className={styles.root}>
			<div className={styles.secondaryRow}>
				{dragHandle}
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className={styles.moveButton}
					aria-expanded={isMoveOpen}
					onClick={() => {
						setIsMoveOpen((current) => !current);
						setIsConfirmingRemove(false);
					}}
				>
					<LibraryBig className={iconStyles.size4} aria-hidden="true" />
					Move
				</Button>

				{isConfirmingRemove ? (
					<div className={styles.confirmGroup}>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className={styles.confirmButton}
							aria-label={`Confirm removing ${book.title}`}
							onClick={() => onRemove(book.id)}
						>
							<Check className={iconStyles.size4} aria-hidden="true" />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className={styles.cancelButton}
							aria-label="Cancel remove"
							onClick={() => setIsConfirmingRemove(false)}
						>
							<X className={iconStyles.size4} aria-hidden="true" />
						</Button>
					</div>
				) : (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className={styles.removeButton}
						aria-label={`Remove ${book.title}`}
						onClick={() => {
							setIsConfirmingRemove(true);
							setIsMoveOpen(false);
						}}
					>
						<Trash2 className={iconStyles.size4} aria-hidden="true" />
					</Button>
				)}
			</div>

			{isMoveOpen ? (
				<div className={styles.destinationRow}>
					{destinationLists.map((list) => (
						<Button
							key={list.slug}
							type="button"
							variant="ghost"
							size="sm"
							className={styles.destinationButton}
							onClick={() => {
								onTransfer(book, list.slug);
								setIsMoveOpen(false);
							}}
						>
							{list.name}
						</Button>
					))}
				</div>
			) : null}
		</div>
	);
};
