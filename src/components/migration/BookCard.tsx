import { motion, useDragControls } from "framer-motion";
import { GripVertical, MoreVertical, Star } from "lucide-react";
import { T } from "./constants";
import { Book } from "./types";

export const BookCard = ({
	book,
	onOptions,
	isDragging,
	dragControls,
}: {
	book: Book;
	onOptions: (b: Book) => void;
	isDragging?: boolean;
	dragControls?: ReturnType<typeof useDragControls>;
}) => {
	const progress =
		book.pages > 0 && book.pagesRead
			? Math.round((book.pagesRead / book.pages) * 100)
			: 0;

	return (
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
			{dragControls && (
				<div
					className="flex items-center px-2 cursor-grab active:cursor-grabbing touch-none"
					style={{ color: T.stoneLight }}
					onPointerDown={(e) => dragControls.start(e)}
				>
					<GripVertical size={16} />
				</div>
			)}

			{/* Cover */}
			<div
				className="relative flex-shrink-0"
				style={{ width: 68, minHeight: 104 }}
			>
				<img
					src={book.img_url}
					alt={book.title}
					className="w-full h-full object-cover"
					style={{ minHeight: 104 }}
				/>
				{/* Subtle left edge amber glow for "reading" */}
				{book.shelf === "reading" && (
					<div
						className="absolute left-0 top-0 bottom-0 w-0.5"
						style={{ backgroundColor: T.amber }}
					/>
				)}
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
							{book.genre}
						</span>
						{book.shelf === "reading" && (
							<span
								className="font-nunito text-xs px-2 py-0.5 rounded-full font-semibold"
								style={{ backgroundColor: T.amberDim, color: T.amberBright }}
							>
								Reading
							</span>
						)}
						{book.shelf === "dnf" && (
							<span
								className="font-nunito text-xs px-2 py-0.5 rounded-full"
								style={{ backgroundColor: T.emberBg, color: "#c97060" }}
							>
								DNF
							</span>
						)}
					</div>
				</div>

				{/* Progress bar for reading */}
				{book.shelf === "reading" && book.pagesRead !== undefined && (
					<div className="mt-2">
						<div className="flex justify-between items-center mb-1">
							<span
								className="font-nunito text-xs"
								style={{ color: T.paperDim }}
							>
								{book.pagesRead}/{book.pages} pages
							</span>
							<span
								className="font-nunito text-xs font-semibold"
								style={{ color: T.amberBright }}
							>
								{progress}%
							</span>
						</div>
						<div
							className="w-full rounded-full overflow-hidden"
							style={{ height: 3, backgroundColor: T.stone }}
						>
							<motion.div
								className="h-full rounded-full"
								style={{ backgroundColor: T.amber }}
								initial={{ width: 0 }}
								animate={{ width: `${progress}%` }}
								transition={{ duration: 0.7, ease: "easeOut" }}
							/>
						</div>
					</div>
				)}

				{/* Rating for DNF */}
				{book.shelf === "dnf" && book.rating && (
					<div className="flex items-center gap-0.5 mt-2">
						{[1, 2, 3, 4, 5].map((s) => (
							<Star
								key={s}
								size={11}
								fill={s <= book.rating! ? T.amber : "transparent"}
								stroke={s <= book.rating! ? T.amber : T.stoneLight}
							/>
						))}
					</div>
				)}
			</div>

			{/* Options */}
			<button
				className="flex items-start pt-3 pr-2 pl-1 min-w-[44px] justify-center active:opacity-60"
				onClick={() => onOptions(book)}
				style={{ color: T.stoneLight }}
				aria-label="Book options"
			>
				<MoreVertical size={16} />
			</button>
		</motion.div>
	);
};
