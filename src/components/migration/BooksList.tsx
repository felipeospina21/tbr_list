import { AnimatePresence, Reorder } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";
import { T } from "./constants";
import { DraggableBookItem } from "./DraggableBookItem";
import {
	SchemaBook,
	ReadingListType,
} from "@/features/readingList/types/readingList";
import { ReadingListBook } from "@/features/readingList/server/queries/getReadingListWithBooks";

interface BooksListProps {
	books: ReadingListBook[] | undefined;
	currentList: ReadingListType;
}

export const BooksList: FC<BooksListProps> = ({ books, currentList }) => {
	// const handleReorder = (newOrder: SchemaBook[]) => {
	// 	const otherBooks = books.filter((b) => b.shelf !== activeShelf);
	// 	setBooks([...otherBooks, ...newOrder]);
	// };

	return (
		<div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
			{books?.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<BookOpen
						size={36}
						style={{ color: T.stoneLight }}
						className="mb-3 opacity-50"
					/>
					<p className="font-lora text-base" style={{ color: T.paperDim }}>
						Nothing here yet
					</p>
					{/* <p */}
					{/* 	className="font-nunito text-sm mt-1" */}
					{/* 	style={{ color: T.stoneLight }} */}
					{/* > */}
					{/* 	Add books to your{" "} */}
					{/* 	{activeShelf === "tbr" */}
					{/* 		? "To Be Read" */}
					{/* 		: activeShelf === "dnf" */}
					{/* 			? "Did Not Finish" */}
					{/* 			: "Reading"}{" "} */}
					{/* 	shelf */}
					{/* </p> */}
				</div>
			) : (
				<Reorder.Group
					axis="y"
					values={{}}
					onReorder={() => {}}
					className="flex flex-col gap-2.5"
					style={{ listStyle: "none", padding: 0, margin: 0 }}
				>
					<AnimatePresence>
						{books?.map((book) => (
							<DraggableBookItem key={book.id} book={book} />
						))}
					</AnimatePresence>
				</Reorder.Group>
			)}
		</div>
	);
};
