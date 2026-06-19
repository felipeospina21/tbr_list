"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMemo } from "react";
import { Loader } from "@/components/layout/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useChangeBookPosition } from "../mutations/useChangeBookPosition";
import { useRemoveBookFromReadingList } from "../mutations/useRemoveBookFromReadingList";
import { useTransferBookBetweenReadingLists } from "../mutations/useTransferBookBetweenReadingLists";
import { useUpdateBookMoods } from "../mutations/useUpdateBookMoods";
import {
	type SchemaBook,
	READING_LIST_DEFINITIONS,
} from "../types/readingList";
import styles from "./ReadingQueuePanel.module.css";
import { SortableBookCard } from "./SortableBookCard";

type ReadingQueuePanelProps = {
	books: SchemaBook[] | undefined;
	activeListSlug: "to_be_read" | "finished" | "did_not_finish";
	isLoading?: boolean;
};

export function ReadingQueuePanel({
	activeListSlug,
	books,
	isLoading = false,
}: ReadingQueuePanelProps) {
	const moveBookMutation = useChangeBookPosition(activeListSlug);
	const removeBookMutation = useRemoveBookFromReadingList(activeListSlug);
	const transferBookMutation =
		useTransferBookBetweenReadingLists(activeListSlug);
	const updateBookMoodsMutation = useUpdateBookMoods(activeListSlug);
	const sortableBookIds = useMemo(
		() => books?.map((book) => book.id) ?? [],
		[books],
	);
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 6,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	function removeBook(bookId: string) {
		removeBookMutation.mutate({ bookId });
	}

	function transferBook(
		book: SchemaBook,
		targetListSlug: "to_be_read" | "finished" | "did_not_finish",
	) {
		transferBookMutation.mutate({ book, targetListSlug });
	}

	function updateBookMoods(bookId: string, moods: string[]) {
		updateBookMoodsMutation.mutate({ bookId, moods });
	}

	function reorderBook(event: DragEndEvent) {
		const { active, over } = event;

		if (!over || active.id === over.id) {
			return;
		}

		const bookId = String(active.id);
		const targetIndex = sortableBookIds.findIndex(
			(id) => id === String(over.id),
		);

		if (targetIndex < 0) {
			return;
		}

		moveBookMutation.mutate({ bookId, targetIndex });
	}

	const noBooks = !books || !books.length;

	const activeList = READING_LIST_DEFINITIONS.find(
		(list) => list.slug === activeListSlug,
	);

	return (
		<Card className={styles.panel}>
			<CardHeader className={styles.header}>
				<CardTitle className={styles.title}>
					{activeList?.name ?? "To Be Read"}
				</CardTitle>
			</CardHeader>

			<CardContent className={styles.content}>
				{isLoading ? (
					<Loader className={styles.loader} />
				) : noBooks ? (
					<div className={styles.emptyState}>
						No books yet. Use the search panel below to add your first title.
					</div>
				) : books ? (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={reorderBook}
					>
						<SortableContext
							items={sortableBookIds}
							strategy={verticalListSortingStrategy}
						>
							<div className={styles.list}>
								{books.map((book, index) => (
									<SortableBookCard
										key={book.id}
										activeListSlug={activeListSlug}
										book={book}
										index={index}
										onRemove={removeBook}
										onTransfer={transferBook}
										onUpdateMoods={updateBookMoods}
									/>
								))}
							</div>
						</SortableContext>
					</DndContext>
				) : null}
			</CardContent>
		</Card>
	);
}
