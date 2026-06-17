import { Reorder, useDragControls } from "framer-motion";
import { BookCard } from "./BookCard";
import { Book } from "./types";

export const DraggableBookItem = ({
	book,
	onOptions,
}: {
	book: Book;
	onOptions: (b: Book) => void;
}) => {
	const controls = useDragControls();
	return (
		<Reorder.Item
			key={book.id}
			value={book}
			dragListener={false}
			dragControls={controls}
			style={{ listStyle: "none" }}
		>
			<BookCard book={book} onOptions={onOptions} dragControls={controls} />
		</Reorder.Item>
	);
};
