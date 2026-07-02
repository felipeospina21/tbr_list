import { isDragging, motion, Reorder, useDragControls } from "framer-motion";
import { GripVertical, MoreVertical } from "lucide-react";
import Image from "next/image";
import { FC } from "react";
import { ReadingListBook } from "@/features/readingList/server/queries/getReadingListWithBooks";
import { cn } from "@/lib/utils";

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
						? `shadow-[0_16px_40px_rgba(0,0,0,0.5),_0_0_0_1px_var(--color-amber)]`
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

				{/* Cover */}
				<div className="relative flex-shrink-0 w-[68] min-h-[104]">
					<Image
						src={book.cover}
						alt={book.title}
						className="w-full h-full object-cover"
						width={100}
						height={150}
					/>
				</div>

				{/* Metadata */}
				<div className="flex-1 py-3 px-3 flex flex-col justify-between min-w-0">
					<div>
						<p className="font-lora text-sm font-semibold leading-tight line-clamp-2 text-paper">
							{book.title}
						</p>
						<p className="font-nunito text-xs mt-0.5 truncate text-paper-dim">
							{book.author}
						</p>
						<div className="flex items-center gap-1.5 mt-2 flex-wrap">
							<span className="font-nunito text-xs px-2 py-0.5 rounded-full bg-stone text-paper-dim">
								{book.genres[0]}
							</span>
							{book.moods.slice(0, 5).map((mood, idx) => (
								<span
									key={idx}
									className="font-nunito text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-dim text-amber-bright"
								>
									{mood}
								</span>
							))}
						</div>
					</div>

					{/* Progress bar for reading */}
					{/* <div className="mt-2"> */}
					{/* 	<div className="flex justify-between items-center mb-1"> */}
					{/* 		<span className="font-nunito text-xs" style={{ color: T.paperDim }}> */}
					{/* 			{book.pagesRead}/{book.pages} pages */}
					{/* 		</span> */}
					{/* 		<span */}
					{/* 			className="font-nunito text-xs font-semibold" */}
					{/* 			style={{ color: T.amberBright }} */}
					{/* 		> */}
					{/* 			{progress}% */}
					{/* 		</span> */}
					{/* 	</div> */}
					{/* 	<div */}
					{/* 		className="w-full rounded-full overflow-hidden" */}
					{/* 		style={{ height: 3, backgroundColor: T.stone }} */}
					{/* 	> */}
					{/* 		<motion.div */}
					{/* 			className="h-full rounded-full" */}
					{/* 			style={{ backgroundColor: T.amber }} */}
					{/* 			initial={{ width: 0 }} */}
					{/* 			animate={{ width: `${progress}%` }} */}
					{/* 			transition={{ duration: 0.7, ease: "easeOut" }} */}
					{/* 		/> */}
					{/* 	</div> */}
					{/* </div> */}

					{/* ratings */}
					{/* <div className="flex items-center gap-0.5 mt-2"> */}
					{/* 	{[1, 2, 3, 4, 5].map((s) => ( */}
					{/* 		<Star */}
					{/* 			key={s} */}
					{/* 			size={11} */}
					{/* 			fill={s <= book.rating! ? T.amber : "transparent"} */}
					{/* 			stroke={s <= book.rating! ? T.amber : T.stoneLight} */}
					{/* 		/> */}
					{/* 	))} */}
					{/* </div> */}
				</div>

				{/* Options */}
				<button
					className="flex items-start pt-3 pr-2 pl-1 min-w-[44px] justify-center active:opacity-60 text-stone-light"
					onClick={() => onBookOptions(book)}
					aria-label="Book options"
				>
					<MoreVertical size={16} />
				</button>
			</motion.div>
		</Reorder.Item>
	);
};
