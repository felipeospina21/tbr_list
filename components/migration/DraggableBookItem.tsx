import { useDragControls, Reorder } from "framer-motion";
import { Book } from "./types";
import { BookCard } from "./BookCard";

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
