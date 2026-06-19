import Image from "next/image";
import { isDragging, motion, Reorder, useDragControls } from "framer-motion";
import { ReadingListBook } from "@/features/readingList/server/queries/getReadingListWithBooks";
import { FC } from "react";
import { GripVertical, MoreVertical } from "lucide-react";
import { T } from "./constants";

interface DraggableBookItemProps {
	book: ReadingListBook;
	onBookOptions: (book: ReadingListBook) => void;
}
export const DraggableBookItem: FC<DraggableBookItemProps> = ({
	book,
	onBookOptions,
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
			style={{ listStyle: "none" }}
		>
			<motion.div
				layout
				initial={{ opacity: 0, y: 6 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -6 }}
				style={{
					backgroundColor: isDragging ? T.surfaceHigh : T.surfaceRaised,
					borderColor: isDragging ? T.amber : T.stone,
					boxShadow: isDragging
						? `0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px ${T.amber}`
						: "0 1px 4px rgba(0,0,0,0.25)",
				}}
				className="flex items-stretch rounded-xl border overflow-hidden transition-shadow relative"
			>
				{/* Drag handle */}
				{controls && (
					<div
						className="flex items-center px-2 cursor-grab active:cursor-grabbing touch-none"
						style={{ color: T.stoneLight }}
						onPointerDown={(e) => {
							console.log(e);
							controls.start(e);
						}}
					>
						<GripVertical size={16} />
					</div>
				)}

				{/* Cover */}
				<div
					className="relative flex-shrink-0"
					style={{ width: 68, minHeight: 104 }}
				>
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
						<p
							className="font-lora text-sm font-semibold leading-tight line-clamp-2"
							style={{ color: T.paper }}
						>
							{book.title}
						</p>
						<p
							className="font-nunito text-xs mt-0.5 truncate"
							style={{ color: T.paperDim }}
						>
							{book.author}
						</p>
						<div className="flex items-center gap-1.5 mt-2 flex-wrap">
							<span
								className="font-nunito text-xs px-2 py-0.5 rounded-full"
								style={{ backgroundColor: T.stone, color: T.paperDim }}
							>
								{book.genres}
							</span>
							<span
								className="font-nunito text-xs px-2 py-0.5 rounded-full font-semibold"
								style={{ backgroundColor: T.amberDim, color: T.amberBright }}
							>
								{book.moods}
							</span>
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
					className="flex items-start pt-3 pr-2 pl-1 min-w-[44px] justify-center active:opacity-60"
					onClick={() => onBookOptions(book)}
					style={{ color: T.stoneLight }}
					aria-label="Book options"
				>
					<MoreVertical size={16} />
				</button>
			</motion.div>
		</Reorder.Item>
	);
};
