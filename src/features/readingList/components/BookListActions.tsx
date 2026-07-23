import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowRight,
	BookCheck,
	BookMarked,
	BookOpen,
	Trash2,
	X,
} from "lucide-react";
import {
	Dispatch,
	FC,
	ReactNode,
	SetStateAction,
	useEffect,
	useState,
} from "react";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/components/drawer";
import { useRemoveBookFromReadingList } from "@/features/readingList/api/useRemoveBookFromReadingList";
import { useTransferBookBetweenReadingLists } from "@/features/readingList/api/useTransferBookBetweenReadingLists";
import { ReadingListBook } from "@/features/readingList/server/queries/getReadingListWithBooks";
import { ReadingListType } from "@/features/readingList/types";
import { Spinner } from "@/components/ui/Spinner";

interface BookListActionsProps {
	optionsBook: ReadingListBook | null;
	setOptionsBook: Dispatch<SetStateAction<ReadingListBook | null>>;
	currentList: ReadingListType;
}

const TRANSFER_TARGETS: Array<{
	type: ReadingListType;
	label: string;
	icon: ReactNode;
}> = [
	{ type: "to_be_read", label: "To Be Read", icon: <BookMarked size={14} /> },
	{ type: "reading", label: "Reading", icon: <BookOpen size={14} /> },
	{ type: "finished", label: "Finished", icon: <BookCheck size={14} /> },
	{ type: "did_not_finish", label: "Did Not Finish", icon: <X size={14} /> },
];

export const BookListActions: FC<BookListActionsProps> = ({
	optionsBook,
	setOptionsBook,
	currentList,
}) => {
	const removeBookMutation = useRemoveBookFromReadingList(currentList);
	const transferBookMutation = useTransferBookBetweenReadingLists(currentList);
	const [isMoveMenuOpen, setIsMoveMenuOpen] = useState(false);

	useEffect(() => {
		if (optionsBook?.id) setIsMoveMenuOpen(false);
	}, [optionsBook?.id]);

	const availableTargets = TRANSFER_TARGETS.filter(
		(t) => t.type !== currentList,
	);

	const handleRemoveBook = async () => {
		if (!optionsBook || removeBookMutation.isPending) return;
		try {
			await removeBookMutation.mutateAsync({ bookId: optionsBook.id });
			setOptionsBook(null);
		} catch {}
	};

	const handleTransferBook = async (targetListType: ReadingListType) => {
		if (!optionsBook || transferBookMutation.isPending) return;
		try {
			await transferBookMutation.mutateAsync({
				book: optionsBook,
				targetListType,
			});
			setOptionsBook(null);
		} catch {}
	};

	return (
		<Drawer
			open={!!optionsBook}
			onOpenChange={(open) => !open && setOptionsBook(null)}
		>
			<DrawerContent className="bg-surface-high border-t-[1px_solid_var(--color-stone)] pb-[env(safe-area-inset-bottom,16px)]">
				<div className="mx-auto w-full px-4 pt-4">
					<DrawerHeader className="px-0">
						<DrawerTitle className="font-lora text-base font-semibold text-paper">
							{optionsBook?.title}
						</DrawerTitle>
						<DrawerDescription className="font-nunito text-sm text-paper-dim">
							{optionsBook?.author}
						</DrawerDescription>
					</DrawerHeader>

					<div className="flex flex-col gap-2 pb-4">
						<button
							className="flex items-center gap-3 w-full py-3.5 px-3 rounded-xl text-sm font-nunito font-semibold bg-surface-raised text-paper border-[1px_solid_var(--color-stone)]"
							onClick={() => setIsMoveMenuOpen((prev) => !prev)}
							type="button"
						>
							<ArrowRight size={15} className="text-amber" />
							Move to
						</button>

						<AnimatePresence initial={false}>
							{isMoveMenuOpen && (
								<motion.div
									className="flex flex-col gap-2 overflow-hidden"
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.2 }}
								>
									{availableTargets.map((target) => (
										<button
											key={target.type}
											className="flex items-center gap-3 w-full py-3 px-3 rounded-xl text-sm font-nunito font-semibold bg-surface-raised text-paper border-[1px_solid_var(--color-stone)] disabled:opacity-60"
											onClick={() => void handleTransferBook(target.type)}
											disabled={transferBookMutation.isPending}
											type="button"
										>
											{target.icon}
											{target.label}
										</button>
									))}
								</motion.div>
							)}
						</AnimatePresence>

						<button
							className="flex items-center gap-3 w-full py-3.5 px-3 rounded-xl text-sm font-nunito font-semibold bg-ember-bg border-[1px_solid_rgba(139,58,42,0.35)] text-[#c97060] disabled:opacity-60"
							onClick={() => void handleRemoveBook()}
							disabled={removeBookMutation.isPending}
							type="button"
						>
							{removeBookMutation.isPending ? (
								<Spinner />
							) : (
								<Trash2 size={15} />
							)}
							Remove from library
						</button>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
};
