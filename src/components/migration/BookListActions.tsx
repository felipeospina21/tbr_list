import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Trash2 } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";
import { T } from "./constants";
import { ReadingListBook } from "@/features/readingList/server/queries/getReadingListWithBooks";

interface BookListActionsProps {
	books: ReadingListBook[] | undefined;
	optionsBook: ReadingListBook | null;
	setOptionsBook: Dispatch<SetStateAction<ReadingListBook | null>>;
}

export const BookListActions: FC<BookListActionsProps> = ({
	books,
	optionsBook,
	setOptionsBook,
}) => {
	// const moveBook = (book: Book, shelf: ShelfKey) => {
	// 	setBooks(books.map((b) => (b.id === book.id ? { ...b, shelf } : b)));
	// 	setOptionsBook(null);
	// };
	//
	// const removeBook = (book: Book) => {
	// 	setBooks(books.filter((b) => b.id !== book.id));
	// 	setOptionsBook(null);
	// };
	//
	const navDockHeight = "-72px";
	return (
		<AnimatePresence>
			{optionsBook && (
				<>
					<motion.div
						className="fixed inset-0 z-40"
						style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setOptionsBook(null)}
					/>
					<motion.div
						className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl px-4 pt-4"
						style={{
							backgroundColor: T.surfaceHigh,
							borderTop: `1px solid ${T.stone}`,
							paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
						}}
						initial={{ y: "100%" }}
						animate={{ y: navDockHeight }}
						exit={{ y: "100%" }}
						transition={{ type: "spring", stiffness: 400, damping: 40 }}
					>
						<div
							className="w-8 h-0.5 rounded-full mx-auto mb-4"
							style={{ backgroundColor: T.stone }}
						/>
						<p
							className="font-lora text-base font-semibold mb-0.5"
							style={{ color: T.paper }}
						>
							{optionsBook.title}
						</p>
						<p
							className="font-nunito text-sm mb-5"
							style={{ color: T.paperDim }}
						>
							{optionsBook.author}
						</p>
						<div className="flex flex-col gap-2">
							<button
								className="flex items-center gap-3 w-full py-3.5 px-3 rounded-xl text-sm font-nunito font-semibold active:scale-[0.98] transition-transform"
								style={{
									backgroundColor: T.surfaceRaised,
									color: T.paper,
									borderColor: T.stone,
									border: `1px solid ${T.stone}`,
								}}
								onClick={() => {}}
							>
								<ArrowRight size={15} style={{ color: T.amber }} />
								Move to
							</button>
							<button
								className="flex items-center gap-3 w-full py-3.5 px-3 rounded-xl text-sm font-nunito font-semibold mt-1 active:scale-[0.98] transition-transform"
								style={{
									backgroundColor: T.emberBg,
									color: "#c97060",
									border: `1px solid rgba(139,58,42,0.35)`,
								}}
								onClick={() => {}}
							>
								<Trash2 size={15} />
								Remove from library
							</button>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};
