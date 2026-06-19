import { Reorder, useDragControls } from "framer-motion";
import { BookCard } from "./BookCard";
import { SchemaBook } from "@/features/readingList/types/readingList";
import { ReadingListBook } from "@/features/readingList/server/queries/getReadingListWithBooks";
import { FC } from "react";

interface DraggableBookItemProps {
	book: ReadingListBook;
}
export const DraggableBookItem: FC<DraggableBookItemProps> = ({ book }) => {
	const controls = useDragControls();
	return (
		<Reorder.Item
			key={book.id}
			value={book}
			dragListener={false}
			dragControls={controls}
			style={{ listStyle: "none" }}
		>
			<BookCard book={book} dragControls={controls} />
		</Reorder.Item>
	);
};
