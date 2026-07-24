import { BookOpen, MoreVertical } from "lucide-react";
import { FC, MouseEvent } from "react";
import { getBookSeriesString } from "@/lib/book";
import { ReadingListBook } from "../server/queries/getReadingListWithBooks";

interface BookMetadataProps {
	book: ReadingListBook;
	onBookOptions: (book: ReadingListBook) => void;
}
export const BookMetadata: FC<BookMetadataProps> = ({
	book,
	onBookOptions,
}) => {
	const bookSeries = getBookSeriesString(
		book.seriesName,
		book.seriesPosition,
		book.seriesCount,
	);

	function onBookOptionsClick(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		onBookOptions(book);
	}

	return (
		<div
			id="book_metadata_card"
			className="flex-1 py-3 px-3 flex flex-col justify-between min-w-0"
		>
			<BookMetadataHeader
				title={book.title}
				onBookOptionsClick={onBookOptionsClick}
			/>
			<BookMetadataSubheader author={book.author} pages={book.pages} />
			<BookMetadataTags genres={book.genres} moods={book.moods} />

			<div id="book_metadata_footer" className="mt-3">
				<p className="justify-self-start text-[10.5px] font-semibold leading-tight line-clamp-2 text-paper-dim">
					{bookSeries}
				</p>
			</div>
		</div>
	);
};

const BookMetadataHeader = ({
	title,
	onBookOptionsClick,
}: {
	title: string;
	onBookOptionsClick(
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
	): void;
}) => {
	return (
		<div
			id="book_metadata_header"
			className="flex justify-between items-center"
		>
			<div className="flex flex-1 justify-between items-center">
				<p className="font-lora text-sm font-semibold leading-tight line-clamp-2 text-paper">
					{title}
				</p>
			</div>
			<button
				className="flex items-start min-w-11 justify-end active:opacity-60 text-stone-light"
				onClick={onBookOptionsClick}
				aria-label="Book options"
			>
				<MoreVertical size={16} />
			</button>
		</div>
	);
};

const BookMetadataSubheader = ({
	author,
	pages,
}: {
	author: string;
	pages: number | null;
}) => {
	return (
		<div className="grid grid-cols-3 items-center">
			<p className="col-span-2 font-nunito text-xs mt-0.5 truncate text-paper-dim">
				{author}
			</p>
			{pages && (
				<span className="flex items-center gap-1 ml-0.5 font-nunito text-[10.5px] font-semibold leading-tight line-clamp-2 text-paper-dim">
					<BookOpen size={11} /> {pages}
				</span>
			)}
		</div>
	);
};

const BookMetadataTags = ({
	genres,
	moods,
}: {
	genres: string[];
	moods: string[];
}) => {
	return (
		<div
			id="book_metadata_tags"
			className="flex items-center gap-1.5 mt-2 flex-wrap"
		>
			<span className="font-nunito text-xs px-2 py-0.5 rounded-full bg-stone text-paper-dim">
				{genres[0]}
			</span>
			{moods.slice(0, 5).map((mood, idx) => (
				<span
					key={idx}
					className="font-nunito text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-dim text-amber-bright"
				>
					{mood}
				</span>
			))}
		</div>
	);
};
