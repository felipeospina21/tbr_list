import { FC } from "react";
import { ReadingListBook } from "../server/queries/getReadingListWithBooks";
import { BookOpen } from "lucide-react";
import { getBookSeriesString, getPublisherString } from "@/lib/book";

interface BookMetadataProps {
	book: ReadingListBook;
}
export const BookMetadata: FC<BookMetadataProps> = ({ book }) => {
	const bookSeries = getBookSeriesString(
		book.seriesName,
		book.seriesPosition,
		book.seriesCount,
	);
	const publisher = getPublisherString(book.publisher, book.publisherYear);
	return (
		<div className="flex-1 py-3 px-3 flex flex-col justify-between min-w-0">
			<div>
				<div className="flex justify-between items-center">
					<p className="font-lora text-sm font-semibold leading-tight line-clamp-2 text-paper">
						{book.title}
					</p>

					{book.pages && (
						<span className="flex items-center gap-1 font-lora text-xs font-semibold leading-tight line-clamp-2 text-paper-dim">
							<BookOpen size={14} /> {book.pages}
						</span>
					)}
				</div>
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
				<div className="mt-3 grid grid-cols-2 justify-between">
					<p className="justify-self-start text-[10.5px] font-semibold leading-tight line-clamp-2 text-paper-dim">
						{bookSeries}
					</p>
					<p className="justify-self-end text-[10.5px] font-semibold leading-tight line-clamp-2 text-paper-dim">
						{publisher}
					</p>
				</div>
			</div>
		</div>
	);
};
