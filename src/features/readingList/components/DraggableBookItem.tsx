import { Reorder, useDragControls } from "framer-motion";
import { FC } from "react";
import { ReadingListBook } from "@/features/readingList/server/queries/getReadingListWithBooks";
import { BookDetailsDrawer } from "./BookDetailsDrawer";
import { BookHandle } from "./BookHandle";
import { BookImage } from "./BookImage";
import { BookMetadata } from "./BookMetadata";

interface DraggableBookItemProps {
	book: ReadingListBook;
	onBookOptions: (book: ReadingListBook) => void;
	handleDragEnd: () => void;
}
export const DraggableBookItem: FC<DraggableBookItemProps> = ({
	book,
	onBookOptions,
	handleDragEnd,
}) => {
	const controls = useDragControls();

	return (
		<Reorder.Item
			key={book.id}
			value={book}
			dragListener={false}
			dragControls={controls}
			onDragEnd={handleDragEnd}
			className="list-none"
		>
			<BookDetailsDrawer
				trigger={
					<div className="flex w-full">
						<BookImage url={book.cover} title={book.title} />
						<BookMetadata book={book} onBookOptions={onBookOptions} />
					</div>
				}
				book={book}
			>
				{controls && <BookHandle controls={controls} />}
			</BookDetailsDrawer>
		</Reorder.Item>
	);
};
