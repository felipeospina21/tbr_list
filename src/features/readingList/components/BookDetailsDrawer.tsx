import { isDragging, motion } from "framer-motion";
import { FC, ReactNode } from "react";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/drawer";
import {
	getBookSeriesString,
	getPublisherString,
	getRatingString,
} from "@/lib/book";
import { cn } from "@/lib/utils";
import { ReadingListBook } from "../server/queries/getReadingListWithBooks";
import { Star } from "lucide-react";

interface BookDetailsDrawerProps {
	children: ReactNode;
	trigger: ReactNode;
	book: ReadingListBook;
}

export const BookDetailsDrawer: FC<BookDetailsDrawerProps> = ({
	children,
	trigger,
	book,
}) => {
	const isSeries = book.seriesPosition && book.seriesCount;
	const footer = isSeries
		? getBookSeriesString(
				book.seriesName,
				book.seriesPosition,
				book.seriesCount,
			)
		: "";

	return (
		<Drawer>
			<motion.div
				layout
				initial={{ opacity: 0, y: 6 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -6 }}
				className={cn(
					"flex items-stretch rounded-xl border overflow-hidden transition-shadow relative",
					isDragging.y ? "bg-surface-high " : "bg-surface-raised",
					isDragging.y ? "border-amber" : "border-stone",
					isDragging.y
						? `shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_0_1px_var(--color-amber)]`
						: "shadow-[0_1px_4px_rgba(0,0,0,0.25)]",
				)}
			>
				{children}

				<DrawerTrigger asChild>{trigger}</DrawerTrigger>

				<DrawerContent className="bg-surface-high text-paper border-transparent">
					<DrawerHeader>
						<DrawerTitle className="flex gap-5">{book.title}</DrawerTitle>
						<DrawerDescription className="text-left text-paper-dim">
							{getPublisherString(book.publisher, book.publisherYear)}
						</DrawerDescription>
						{book.rating && (
							<span className="flex gap-1 items-center">
								<Star size={11} className="fill-amber stroke-amber" />
								<p className="text-[12px] font-mono">
									{getRatingString(book.rating, book.ratingCount)}
								</p>
							</span>
						)}
					</DrawerHeader>
					<div className="no-scrollbar overflow-y-auto px-4">
						{book.description}
					</div>

					<DrawerFooter className="text-center text-amber-bright">
						{footer}
					</DrawerFooter>
				</DrawerContent>
			</motion.div>
		</Drawer>
	);
};
