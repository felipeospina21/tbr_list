import { isDragging, motion, Reorder, useDragControls } from "framer-motion";
import { GripVertical, MoreVertical } from "lucide-react";
import Image from "next/image";
import { FC } from "react";
import { ReadingListBook } from "@/features/readingList/server/queries/getReadingListWithBooks";
import { cn } from "@/lib/utils";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/drawer";
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

	// const progress =
	// 	book.pages > 0 && book.pagesRead
	// 		? Math.round((book.pagesRead / book.pages) * 100)
	// 		: 0;

	return (
		<Reorder.Item
			key={book.id}
			value={book}
			dragListener={false}
			dragControls={controls}
			onDragEnd={handleDragEnd}
			className="list-none"
		>
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
					{/* Drag handle */}
					{controls && (
						<div
							className="flex items-center px-2 cursor-grab active:cursor-grabbing touch-none text-stone-light"
							onPointerDown={(e) => {
								controls.start(e);
							}}
						>
							<GripVertical size={16} />
						</div>
					)}

					<DrawerTrigger asChild>
						<div className="flex w-full">
							<div className="relative shrink-0 w-[68] min-h-[104]">
								<Image
									src={book.cover}
									alt={book.title}
									className="w-full h-full object-cover"
									width={100}
									height={150}
								/>
							</div>
							<BookMetadata book={book} />
						</div>
					</DrawerTrigger>
					<DrawerContent className="bg-surface-high text-paper border-transparent">
						<DrawerHeader>
							<DrawerTitle>{book.title}</DrawerTitle>
							<DrawerDescription className="text-left">
								{book.description}
							</DrawerDescription>
							{book.seriesPosition && book.seriesCount && (
								<DrawerFooter>{`${book.seriesName} (${book.seriesPosition} / ${book.seriesCount})`}</DrawerFooter>
							)}
						</DrawerHeader>
					</DrawerContent>

					{/* Options */}
					<button
						className="flex items-start pt-3 pr-2 pl-1 min-w-11 justify-center active:opacity-60 text-stone-light"
						onClick={() => onBookOptions(book)}
						aria-label="Book options"
					>
						<MoreVertical size={16} />
					</button>
				</motion.div>
			</Drawer>
		</Reorder.Item>
	);
};
