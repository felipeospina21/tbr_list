import { ReadingListBook } from "@/features/readingList/server/queries/getReadingListWithBooks";
import { AnimatePresence, Reorder } from "framer-motion";
import { FC, ReactNode } from "react";
import { DraggableBookItem } from "./DraggableBookItem";
import { useFetchReadingList } from "@/features/readingList/api/useFetchReadingList";
import { ReadingListType } from "@/features/readingList/types/readingList";
import { Loader } from "../layout/Loader";

interface BooksListProps {
	currentList: ReadingListType;
	onBookOptions: (book: ReadingListBook) => void;
}

export const BooksList: FC<BooksListProps> = ({
	currentList,
	onBookOptions,
}) => {
	const listBooksQuery = useFetchReadingList(currentList);
	const books = listBooksQuery.data?.items.books;
	// const handleReorder = (newOrder: SchemaBook[]) => {
	// 	const otherBooks = books.filter((b) => b.shelf !== activeShelf);
	// 	setBooks([...otherBooks, ...newOrder]);
	// };

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
				values={books as ReadingListBook[]}
				onReorder={() => {
					console.log("reorder");
				}}
				className="flex flex-col gap-2.5"
				style={{ listStyle: "none", padding: 0, margin: 0 }}
			>
				<AnimatePresence>
					{books?.map((book) => (
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
