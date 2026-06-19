import {
	Check,
	GripVertical,
	LibraryBig,
	MoreVertical,
	Trash2,
	X,
} from "lucide-react";
import { type FC, type ReactNode, useState } from "react";
import iconStyles from "@/components/Icon.module.css";
import { Button } from "@/components/ui/Button";
import { READING_LIST_MOODS } from "../constants/readingListMoods";
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
	onUpdateMoods: (bookId: string, moods: string[]) => void;
}

export const ReadingListCardActions: FC<ReadingListCardActionsProps> = ({
	activeListSlug,
	onRemove,
	onTransfer,
	book,
	dragHandle,
	onUpdateMoods,
}) => {
	const [isMoveOpen, setIsMoveOpen] = useState(false);
	const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const destinationLists = READING_LIST_DEFINITIONS.filter(
		(list) => list.slug !== activeListSlug,
	);
	const selectedMoods = new Set(book.moods);

	function toggleMood(mood: string) {
		const nextMoods = selectedMoods.has(mood)
			? book.moods.filter((bookMood) => bookMood !== mood)
			: [...book.moods, mood];

		onUpdateMoods(book.id, nextMoods);
	}

	return (
		<div className={styles.root}>
			<div className={styles.secondaryRow}>
				{dragHandle}
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className={styles.optionsButton}
					aria-expanded={isSheetOpen}
					onClick={() => {
						setIsSheetOpen(true);
						setIsConfirmingRemove(false);
					}}
				>
					<MoreVertical className={iconStyles.size4} aria-hidden="true" />
					Options
				</Button>
			</div>

			{isSheetOpen ? (
				<div className={styles.sheetLayer}>
					<button
						type="button"
						className={styles.backdrop}
						aria-label="Close book options"
						onClick={() => setIsSheetOpen(false)}
					/>
					<div
						className={styles.sheet}
						role="dialog"
						aria-label={`${book.title} options`}
					>
						<div className={styles.sheetHandle} />
						<div className={styles.sheetHeader}>
							<div>
								<p className={styles.sheetEyebrow}>Book options</p>
								<h3 className={styles.sheetTitle}>{book.title}</h3>
								<p className={styles.sheetAuthor}>{book.author}</p>
							</div>
							{dragHandle ? (
								<div className={styles.dragHint}>
									<GripVertical
										className={iconStyles.size4}
										aria-hidden="true"
									/>
								</div>
							) : null}
						</div>

						<div className={styles.sheetSection}>
							<button
								type="button"
								className={styles.sheetAction}
								onClick={() => {
									setIsMoveOpen((current) => !current);
									setIsConfirmingRemove(false);
								}}
							>
								<LibraryBig className={iconStyles.size4} aria-hidden="true" />
								Move to another list
							</button>
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
												setIsSheetOpen(false);
											}}
										>
											{list.name}
										</Button>
									))}
								</div>
							) : null}
						</div>

						<div className={styles.sheetSection}>
							<p className={styles.sectionLabel}>Mood tags</p>
							<div className={styles.moodGrid}>
								{READING_LIST_MOODS.map((mood) => {
									const isSelected = selectedMoods.has(mood);

									return (
										<button
											key={mood}
											type="button"
											className={
												isSelected
													? `${styles.moodButton} ${styles.moodButtonSelected}`
													: styles.moodButton
											}
											aria-pressed={isSelected}
											onClick={() => toggleMood(mood)}
										>
											{mood}
										</button>
									);
								})}
							</div>
						</div>

						<div className={styles.sheetSection}>
							{isConfirmingRemove ? (
								<div className={styles.confirmRow}>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className={styles.confirmButton}
										aria-label={`Confirm removing ${book.title}`}
										onClick={() => onRemove(book.id)}
									>
										<Check className={iconStyles.size4} aria-hidden="true" />
										Remove
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
										Cancel
									</Button>
								</div>
							) : (
								<button
									type="button"
									className={`${styles.sheetAction} ${styles.removeAction}`}
									aria-label={`Remove ${book.title}`}
									onClick={() => {
										setIsConfirmingRemove(true);
										setIsMoveOpen(false);
									}}
								>
									<Trash2 className={iconStyles.size4} aria-hidden="true" />
									Remove from this list
								</button>
							)}
						</div>

						<Button
							type="button"
							variant="ghost"
							size="sm"
							className={styles.doneButton}
							onClick={() => setIsSheetOpen(false)}
						>
							Done
						</Button>
					</div>
				</div>
			) : null}
		</div>
	);
};
