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

	const handleDragEnd = () => {
		const movedItemIndex = localBooks.findIndex(
			(book, index) => book.id !== serverBooks[index]?.id,
		);
		if (movedItemIndex === -1) return;

		const movedBook = localBooks[movedItemIndex];

		const itemAbove = localBooks[movedItemIndex - 1];
		const itemBelow = localBooks[movedItemIndex + 1];

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
				onPointerUp={handleDragEnd}
				className="flex flex-col gap-2.5"
				style={{ listStyle: "none", padding: 0, margin: 0 }}
			>
				<AnimatePresence>
					{localBooks?.map((book) => (
						<DraggableBookItem
							key={book.id}
							book={book}
							onBookOptions={onBookOptions}
						/>
					))}
				</AnimatePresence>
			</Reorder.Group>
		</div>
	);
};
