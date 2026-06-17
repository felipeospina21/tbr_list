import { CurrentlyReadingStats } from "./CurrentlyReadingStats";
import { GenreBreakdownStats } from "./GenreBreakdownStats";
import { LibraryBreakdownStats } from "./LibraryBreakdownStats";
import { StatsCards } from "./StatsCards";
import { Book } from "./types";

export const StatsSection = ({ books }: { books: Book[] }) => {
	const total = books.length;
	const reading = books.filter((b) => b.shelf === "reading").length;
	const tbr = books.filter((b) => b.shelf === "tbr").length;
	const dnf = books.filter((b) => b.shelf === "dnf").length;
	const totalPages = books.reduce((acc, b) => acc + (b.pagesRead ?? 0), 0);

	return (
		<div className="flex-1 overflow-y-auto px-4 pt-5 pb-4 flex flex-col gap-4">
			{/* Stat grid — 2-up, minimal */}
			<StatsCards
				reading={reading}
				tbr={tbr}
				total={total}
				totalPages={totalPages}
			/>

			{/* Currently reading */}
			<CurrentlyReadingStats books={books} />

			{/* Genre breakdown */}
			<GenreBreakdownStats books={books} total={total} />

			{/* Library breakdown */}
			<LibraryBreakdownStats reading={reading} tbr={tbr} dnf={dnf} />
		</div>
	);
};
