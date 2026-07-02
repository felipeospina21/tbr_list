import { ReadingListBook } from "@/features/readingList/server/queries/getReadingListWithBooks";
import { AnimatePresence, Reorder } from "framer-motion";
import { FC, useEffect, useState } from "react";
import { DraggableBookItem } from "./DraggableBookItem";
import { useFetchReadingList } from "@/features/readingList/api/useFetchReadingList";
import { ReadingListType } from "@/features/readingList/types";
import { Loader } from "../../../components/layout/Loader";
import { useUpdateBookOrderMutation } from "@/features/readingList/api/useChangeBookPosition";

interface BooksListProps {
	currentList: ReadingListType;
	onBookOptions: (book: ReadingListBook) => void;
}

export const BooksList: FC<BooksListProps> = ({
	currentList,
	onBookOptions,
}) => {
	const listBooksQuery = useFetchReadingList(currentList);
	const serverBooks = listBooksQuery.data?.items?.books ?? [];
	const serverBooksSerialized = JSON.stringify(serverBooks.map((b) => b.id));

	const [localBooks, setLocalBooks] = useState(serverBooks);

	useEffect(() => {
		setLocalBooks(serverBooks);
	}, [serverBooksSerialized]);

	const mutation = useUpdateBookOrderMutation(currentList);

	const handleDragEnd = (draggedBookId: string) => {
		const movedItemIndex = localBooks.findIndex(
			(book) => book.id === draggedBookId,
		);

		if (movedItemIndex === -1) return;

		const movedBook = localBooks[movedItemIndex];
		const itemAbove = localBooks[movedItemIndex - 1];
		const itemBelow = localBooks[movedItemIndex + 1];

		// 1. Replicate your backend's fractional math
		let optimisticPosition = 1.0;

		if (!itemAbove && itemBelow) {
			optimisticPosition = itemBelow.position / 2;
		} else if (itemAbove && !itemBelow) {
			optimisticPosition = itemAbove.position + 1.0;
		} else if (itemAbove && itemBelow) {
			optimisticPosition = (itemAbove.position + itemBelow.position) / 2;
		}

		// 2. IMMEDIATELY update the local book's position property
		// This ensures that if the user drags a second book right away,
		// it uses this new math as a neighbor, not the stale server data.
		const updatedBooks = [...localBooks];
		updatedBooks[movedItemIndex] = {
			...movedBook,
			position: optimisticPosition,
		};
		setLocalBooks(updatedBooks);

		// 3. Fire the mutation with the correct neighbors
		mutation.mutate({
			listType: currentList,
			bookId: movedBook.id,
			abovePosition: itemAbove ? itemAbove.position : null,
			belowPosition: itemBelow ? itemBelow.position : null,
		});
	};

	if (listBooksQuery.isLoading) {
		return <Loader />;
	}

	if (listBooksQuery.error) {
		return <>error</>;
	}

	return (
		<div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
			<Reorder.Group
				axis="y"
				values={localBooks}
				onReorder={setLocalBooks}
				// onPointerUp={handleDragEnd}
				className="flex flex-col gap-2.5 list-none p-0 m-0"
			>
				<AnimatePresence>
					{localBooks?.map((book) => (
						<DraggableBookItem
							key={book.id}
							book={book}
							onBookOptions={onBookOptions}
							handleDragEnd={() => handleDragEnd(book.id)}
						/>
					))}
				</AnimatePresence>
			</Reorder.Group>
		</div>
	);
};
