import { motion } from "framer-motion";
import { FC } from "react";
import { Book } from "@/lib/book";
import { T } from "@/tokens";

interface CurrentlyReadingStatsProps {
	books: Book[];
}

export const CurrentlyReadingStats: FC<CurrentlyReadingStatsProps> = ({
	books,
}) => {
	const currentBook = books.find(
		(b) => b.shelf === "reading" && (b.pagesRead ?? 0) > 0,
	);

	const currentProgress =
		currentBook && currentBook.pages > 0
			? Math.round(((currentBook.pagesRead ?? 0) / currentBook.pages) * 100)
			: 0;
	return (
		<>
			{currentBook && (
				<div
					className="rounded-2xl p-4"
					style={{
						backgroundColor: T.surfaceRaised,
						border: `1px solid ${T.stone}`,
					}}
				>
					<p
						className="font-nunito text-xs uppercase tracking-widest font-semibold mb-3"
						style={{ color: T.amber }}
					>
						Currently Reading
					</p>
					<div className="flex gap-3">
						<div
							className="flex-shrink-0 rounded-lg overflow-hidden"
							style={{ width: 50, height: 76 }}
						>
							<img
								src={currentBook.img_url}
								alt={currentBook.title}
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="flex-1 min-w-0">
							<p
								className="font-lora text-sm font-semibold leading-tight line-clamp-2"
								style={{ color: T.paper }}
							>
								{currentBook.title}
							</p>
							<p
								className="font-nunito text-xs mt-0.5"
								style={{ color: T.paperDim }}
							>
								{currentBook.author}
							</p>
							<div className="mt-2">
								<div className="flex justify-between items-center mb-1">
									<span
										className="font-nunito text-xs"
										style={{ color: T.paperDim }}
									>
										{currentBook.pagesRead}/{currentBook.pages} pages
									</span>
									<span
										className="font-nunito text-xs font-bold"
										style={{ color: T.amberBright }}
									>
										{currentProgress}%
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
										animate={{ width: `${currentProgress}%` }}
										transition={{ duration: 0.8, ease: "easeOut" }}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
