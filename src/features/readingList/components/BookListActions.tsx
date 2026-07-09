import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Trash2 } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";
import { useRemoveBookFromReadingList } from "@/features/readingList/api/useRemoveBookFromReadingList";
import { ReadingListBook } from "@/features/readingList/server/queries/getReadingListWithBooks";
import { ReadingListType } from "@/features/readingList/types";

interface BookListActionsProps {
	optionsBook: ReadingListBook | null;
	setOptionsBook: Dispatch<SetStateAction<ReadingListBook | null>>;
	currentList: ReadingListType;
}

export const BookListActions: FC<BookListActionsProps> = ({
	optionsBook,
	setOptionsBook,
	currentList,
}) => {
	const removeBookMutation = useRemoveBookFromReadingList(currentList);
	const navDockHeight = "-72px";

	const handleRemoveBook = async () => {
		if (!optionsBook || removeBookMutation.isPending) {
			return;
		}

		try {
			await removeBookMutation.mutateAsync({ bookId: optionsBook.id });
			setOptionsBook(null);
		} catch {
			// Keep the sheet open so the user can retry or dismiss manually.
		}
	};

	return (
		<AnimatePresence>
			{optionsBook && (
				<>
					<motion.div
						className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.6)]"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setOptionsBook(null)}
					/>
					<motion.div
						className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl px-4 pt-4 bg-surface-high border-t-[1px_solid_var(--color-stone)] pb-[calc(16px+env(safe-area-inset-bottom,0))]"
						initial={{ y: "100%" }}
						animate={{ y: navDockHeight }}
						exit={{ y: "100%" }}
						transition={{ type: "spring", stiffness: 400, damping: 40 }}
					>
						<div className="w-8 h-0.5 rounded-full mx-auto mb-4 bg-stone" />
						<p className="font-lora text-base font-semibold mb-0.5 text-paper">
							{optionsBook.title}
						</p>
						<p className="font-nunito text-sm mb-5 text-paper-dim">
							{optionsBook.author}
						</p>
						<div className="flex flex-col gap-2">
							<button
								className="flex items-center gap-3 w-full py-3.5 px-3 rounded-xl text-sm font-nunito font-semibold active:scale-[0.98] transition-transform bg-surface-raised text-paper border-[1px_solid_var(--color-stone)]"
								onClick={() => {}}
								type="button"
							>
								<ArrowRight size={15} className="text-amber" />
								Move to
							</button>
							<button
								className="flex items-center gap-3 w-full py-3.5 px-3 rounded-xl text-sm font-nunito font-semibold mt-1 active:scale-[0.98] transition-transform bg-ember-bg border-[1px_solid_rgba(139,58,42,0.35)] text-[#c97060] disabled:opacity-60 disabled:cursor-not-allowed"
								onClick={() => {
									void handleRemoveBook();
								}}
								disabled={removeBookMutation.isPending}
								type="button"
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
