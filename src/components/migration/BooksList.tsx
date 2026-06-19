import { ReadingListBook } from "@/features/readingList/server/queries/getReadingListWithBooks";
import { Reorder } from "framer-motion";
import { FC, ReactNode } from "react";

interface BooksListProps {
	books: ReadingListBook[];
	children: ReactNode;
}

export const BooksList: FC<BooksListProps> = ({ books, children }) => {
	// const handleReorder = (newOrder: SchemaBook[]) => {
	// 	const otherBooks = books.filter((b) => b.shelf !== activeShelf);
	// 	setBooks([...otherBooks, ...newOrder]);
	// };

	return (
		<div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
			<Reorder.Group
				axis="y"
				values={books}
				onReorder={() => {
					console.log("reorder");
				}}
				className="flex flex-col gap-2.5"
				style={{ listStyle: "none", padding: 0, margin: 0 }}
			>
				{children}
			</Reorder.Group>
		</div>
	);
};
