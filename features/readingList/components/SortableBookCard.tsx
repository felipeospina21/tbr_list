"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { CSSProperties, FC } from "react";

import iconStyles from "@/components/Icon.module.css";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Book, ReadingListSlug } from "../types/readingList";
import { BookCard } from "./BookCard";
import { ReadingListCardActions } from "./ReadingListCardActions";
import styles from "./SortableBookCard.module.css";

interface SortableBookCardProps {
	activeListSlug: ReadingListSlug;
	book: Book;
	index: number;
	onRemove: (bookId: string) => void;
	onTransfer: (book: Book, targetListSlug: ReadingListSlug) => void;
	onUpdateMoods: (bookId: string, moods: string[]) => void;
}

export const SortableBookCard: FC<SortableBookCardProps> = ({
	activeListSlug,
	book,
	index,
	onRemove,
	onTransfer,
	onUpdateMoods,
}) => {
	const {
		attributes,
		isDragging,
		listeners,
		setActivatorNodeRef,
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id: book.id });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	} satisfies CSSProperties;
	const dragHandle = (
		<Button
			ref={setActivatorNodeRef}
			type="button"
			variant="ghost"
			size="sm"
			className={styles.dragHandle}
			aria-label={`Drag ${book.title}`}
			{...attributes}
			{...listeners}
		>
			<GripVertical className={iconStyles.size4} aria-hidden="true" />
		</Button>
	);

	return (
		<div
			ref={setNodeRef}
			className={cn(styles.item, isDragging && styles.dragging)}
			style={style}
		>
			<BookCard
				book={book}
				index={index}
				action={
					<ReadingListCardActions
						activeListSlug={activeListSlug}
						book={book}
						dragHandle={dragHandle}
						onRemove={onRemove}
						onTransfer={onTransfer}
						onUpdateMoods={onUpdateMoods}
					/>
				}
			/>
		</div>
	);
};
